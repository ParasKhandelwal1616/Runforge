import { Router, Request, Response } from "express";
import { env } from "../config/env.js";
import crypto from "crypto";
import { failureQueue } from "@runforge/queue";

const router = Router();

router.post("/github", async (req: Request, res: Response) => {
  const signature = req.headers["x-hub-signature-256"];
  if (!signature) {
    return res.status(400).send("No signature provided");
  }
  const hmac = crypto.createHmac("sha256", env.WEBHOOK_SECRET);
  hmac.update(req.rawBody);
  const digest = "sha256=" + hmac.digest("hex");
  if (signature !== digest) {
    return res.status(401).send("Invalid signature");
  }

  // signature is valid — tell GitHub we received it
  res.status(200).json({ message: "Webhook received" });

  console.log(`📦 Webhook received: ${req.headers["x-github-event"]}`);
  // event workflow_run

  const eventType = req.headers["x-github-event"];
  if (eventType === "workflow_run") {
    const payload = req.body;
    if (
      payload.action !== "completed" ||
      payload.workflow_run.conclusion !== "failure"
    ) {
      // not a failure — ignore silently
      return;
    }
    // this is a real failure — log it for now
    console.log("CI failure detected:", payload.workflow_run.name);

  await failureQueue.add('analyze-failure', {
  installationId: payload.installation.id,
  repoFullName: payload.workflow_run.repository?.full_name,
  runId: payload.workflow_run.id,
  commitSHA: payload.workflow_run.head_sha,
  prNumber: payload.workflow_run.pull_requests[0]?.number || null,
  workflowName: payload.workflow_run.name,
  branch: payload.workflow_run.head_branch,
  startedAt: payload.workflow_run.created_at,
  failedAt: payload.workflow_run.updated_at,
  retryCount: payload.workflow_run.run_attempt - 1
})

    console.log(`🔥 Job added to queue for: ${payload.workflow_run.name}`);
  }
});
export default router;
