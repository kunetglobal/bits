import express from "express";
import dotenv from "dotenv";
import { exec } from "child_process";

import { promisify } from "util";

dotenv.config();
const app = express();
const execPromise = promisify(exec);
const port = process.env.WATCHTOWER_PORT;
const secret = process.env.GITHUB_WEBHOOK_SECRET;

if (!secret) throw new Error("GITHUB_WEBHOOK_SECRET is not defined");
if (!port) throw new Error("WATCHTOWER_PORT is not defined");

app.use(express.json());

app.post("/hook", (req, res) => {
	const { body } = req;

	const githubSignature = req.headers["x-hub-signature"] as string;
	if (!githubSignature) {
		console.error("GitHub signature is not defined", req.headers);
		return res
			.status(400)
			.send("Invalid request: GitHub signature is not defined");
	}

	const githubEvent = req.headers["x-github-event"] as string;
	const isGithubPushEvent = githubEvent === "push";

	if (!isGithubPushEvent) {
		console.log("Ignoring event", githubEvent, "Reason: not a push event");
		return res.status(200).send("Webhook received successfully");
	}

	verifySignature(req, res);

	// Log the update
	console.log("New commit pushed:", body.head_commit.id);

	runWatchtowerActions(res);
});

function verifySignature(req: express.Request, res: express.Response) {
	const githubSignature = req.headers["x-hub-signature"] as string;
	if (!githubSignature) {
		console.error("GitHub signature is not defined", req.headers);
		return res
			.status(400)
			.send("Invalid request: GitHub signature is not defined");
	}

	// Verify signature
	const crypto = require("crypto");
	const hmac = crypto.createHmac("sha1", secret);
	const payload = JSON.stringify(req.body);
	const expectedSignature = `sha1=${hmac.update(payload).digest("hex")}`;
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
	}
}

async function runWatchtowerActions(res: express.Response) {
	try {
		// Pull latest code from GitHub
		const gitPull = await execPromise("cd ~/bits && git pull");
		if (gitPull.stderr) console.error(gitPull.stderr);
		if (gitPull.stdout) console.log(gitPull.stdout);

		// Execute the watchtower action script
		const actionScript = await execPromise("~/bits/services/action.sh");
		if (actionScript.stdout) console.log(actionScript.stdout);
		if (actionScript.stderr) console.error(actionScript.stderr);

		res.status(200).send("Webhook received successfully");
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal server error");
	}
}

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
