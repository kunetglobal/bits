import type { Request, Response } from "express";
import { exec} from "node:child_process";
import { promisify } from "node:util";

const execPromise = promisify(exec);

export function checkEventType(req: Request, res: Response): void {
	const githubEvent: string = req.headers["x-github-event"] as string;
	const isGithubPushEvent: boolean = githubEvent === "push";

	if (!isGithubPushEvent) {
		console.log("Dismissing event", githubEvent, "Reason: not a push event");
		res.status(204).send("Dismissed event");
	}
}

export function verifySignature(req: Request, res: Response, secret: string): void {
	const githubSignature: string | undefined = req.headers["x-hub-signature"] as
		| string
		| undefined;
	if (!githubSignature) {
		console.error("GitHub signature is not defined", req.headers);
		res.status(400).send("Invalid request: GitHub signature is not defined");
		return;
	}

	const crypto = require("node:crypto");
	const hmac = crypto.createHmac("sha1", secret);
	const payload: string = JSON.stringify(req.body);
	const expectedSignature: string = `sha1=${hmac
		.update(payload)
		.digest("hex")}`;
	if (
		!crypto.timingSafeEqual(
			Buffer.from(githubSignature),
			Buffer.from(expectedSignature),
		)
	) {
		console.error("GitHub signature verification failed");
		res.status(400).send("GitHub signature verification failed");
	} else {
		console.log("GitHub signature verified");
		res.status(200).send("Received successfully");
	}
}

export async function runWatchtowerActions(req: Request): Promise<void> {
	console.log("New commit pushed:", req.body.head_commit?.id);

	try {
		// Pull latest code from GitHub
		const gitPull = await execPromise("cd /home/bits/bits && git pull");
		if (gitPull.stderr) console.error(gitPull.stderr);
		if (gitPull.stdout) console.log(gitPull.stdout);

		// Execute the watchtower action script
		const actionScript = await execPromise("/home/bits/bits/services/action.sh");
		if (actionScript.stdout) console.log(actionScript.stdout);
		if (actionScript.stderr) console.error(actionScript.stderr);
	} catch (error) {
		console.error(error);
	}
}
