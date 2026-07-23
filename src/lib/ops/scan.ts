/** Triggers an on-demand engine run via GitHub Actions workflow_dispatch —
 * the engine only runs in CI (cron), never on the web app's own host, so
 * "run now" means asking GitHub to fire the same workflow the daily cron
 * uses, just with a shorter lookback and a bigger brief catch-up limit. */

const OWNER_REPO = process.env.GITHUB_REPO || "Nithin-Varma/verique-engine";
const WORKFLOW_FILE = process.env.GITHUB_WORKFLOW_FILE || "daily.yml";
const REF = process.env.GITHUB_REF_NAME || "main";

export type ScanTriggerResult = { ok: true } | { ok: false; error: string };

export async function triggerScan(params: {
  client?: string; // slug, or omit for every active client
  days?: number;
  briefLimit?: number;
}): Promise<ScanTriggerResult> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return { ok: false, error: "GITHUB_TOKEN is not configured on the server." };
  }

  const res = await fetch(
    `https://api.github.com/repos/${OWNER_REPO}/actions/workflows/${WORKFLOW_FILE}/dispatches`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ref: REF,
        inputs: {
          days: String(params.days ?? 7),
          client: params.client ?? "",
          brief_limit: String(params.briefLimit ?? 50),
        },
      }),
    },
  );

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    return { ok: false, error: `GitHub API ${res.status}: ${body.slice(0, 300)}` };
  }
  return { ok: true };
}
