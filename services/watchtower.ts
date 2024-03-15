import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import { exec, ExecException } from "node:child_process";
import { promisify } from "node:util";

dotenv.config();
const app = express();
const execPromise = promisify(exec);
const port: string | undefined = process.env.WATCHTOWER_PORT;
const secret: string | undefined = process.env.GITHUB_WEBHOOK_SECRET;

if (!secret) throw new Error("GITHUB_WEBHOOK_SECRET is not defined");
if (!port) throw new Error("WATCHTOWER_PORT is not defined");

app.use(express.json());

app.post("/hook", (req: Request, res: Response) => {
	// Only listen to push events
	checkEventType(req, res);

	// Make sure we're communicating with github
	verifySignature(req, res);

	// Pull new code and run the watchtower script
	runWatchtowerActions(req);
});

function checkEventType(req: Request, res: Response): void {
	const githubEvent: string = req.headers["x-github-event"] as string;
	const isGithubPushEvent: boolean = githubEvent === "push";

	if (!isGithubPushEvent) {
		console.log("Dismissing event", githubEvent, "Reason: not a push event");
		res.status(204).send("Dismissed event");
	}
}

function verifySignature(req: Request, res: Response): void {
	const githubSignature: string | undefined = req.headers["x-hub-signature"] as
		| string
		| undefined;
	if (!githubSignature) {
		console.error("GitHub signature is not defined", req.headers);
		res.status(400).send("Invalid request: GitHub signature is not defined");
		return;
	}

	// Verify signature
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

async function runWatchtowerActions(req: Request): Promise<void> {
	console.log("New commit pushed:", req.body.head_commit?.id);

	try {
		// Pull latest code from GitHub
		const gitPull = await execPromise("cd ~/bits && git pull");
		if (gitPull.stderr) console.error(gitPull.stderr);
		if (gitPull.stdout) console.log(gitPull.stdout);

		// Execute the watchtower action script
		const actionScript = await execPromise("~/bits/services/action.sh");
		if (actionScript.stdout) console.log(actionScript.stdout);
		if (actionScript.stderr) console.error(actionScript.stderr);
	} catch (error) {
		console.error(error);
	}
}

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
