import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

app.post("/hook", (req, res) => {
	const { body } = req;

	// Check if the request is from GitHub
	const githubSignature = req.headers["x-hub-signature"] as string;
	const isGithubEvent = req.headers["x-github-event"] === "push";
	const secret = process.env.GITHUB_WEBHOOK_SECRET;

	if (!githubSignature || !isGithubEvent || !secret) {
		return res.status(400).send("Invalid request");
	}

	// Verify signature
	const crypto = require("crypto");
	const hmac = crypto.createHmac("sha1", secret);
	const payload = JSON.stringify(req.body);
	const expectedSignature = `sha1=${hmac.update(payload).digest("hex")}`;
	if (
		crypto.timingSafeEqual(
			Buffer.from(githubSignature),
			Buffer.from(expectedSignature),
		)
	) {
		console.log("GitHub signature verified");

		// Trigger action
		console.log("New commit pushed:", body.head_commit.id);

		res.status(200).send("Webhook received successfully");
	} else {
		console.log("GitHub signature verification failed");
		res.status(400).send("GitHub signature verification failed");
	}
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
