#!/usr/bin/env node
// Prodeology Execution Companion protocol v2 — protocol enforcer + deep-tier hooks.
// Installed by the Prodeology Session Kit. Configured by the repo owner.
// Redirects protocol misses to the sanctioned MCP tools; never answers itself.
import fs from "node:fs";

const SERVER_URL = "http://localhost:3000";
const input = JSON.parse(fs.readFileSync(0, "utf8"));

// Best-effort server round-trip. The server owns semantic classification,
// persisted gate truth, exact session binding, and live policy. Any failure
// fails open: this hook never guesses from punctuation or assistant prose.
async function hookEvent(event, payload = {}) {
  const key = process.env.PRODEOLOGY_COMPANION_KEY;
  if (!key) return null;
  try {
    const res = await fetch(SERVER_URL + "/api/companion/hook-event", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: "Bearer " + key },
      body: JSON.stringify({
        event,
        claudeSessionId: input.session_id || undefined,
        ...payload,
      }),
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

if (input.hook_event_name === "SessionStart") {
  await hookEvent("session_start");
  process.exit(0);
}

// ── PreToolUse: structured question interception ──
if (input.hook_event_name === "PreToolUse" && input.tool_name === "AskUserQuestion") {
  const result = await hookEvent("ask_user_question", {
    toolInput: input.tool_input,
  });
  if (result?.action === "deny") {
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason: result.reason,
        },
      })
    );
  } else if (result?.action === "update_input" && result.updatedInput) {
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "ask",
          updatedInput: result.updatedInput,
        },
      })
    );
  }
  process.exit(0);
}

if (input.hook_event_name !== "Stop") process.exit(0);

function transcriptTail() {
  try {
    const lines = fs.readFileSync(input.transcript_path, "utf8").trim().split("\n");
    for (let i = lines.length - 1; i >= 0; i--) {
      try {
        const e = JSON.parse(lines[i]);
        if (e.type === "assistant" && e.message?.content) {
          const t = e.message.content.filter((c) => c.type === "text").map((c) => c.text);
          if (t.length) return t.join("\n");
        }
      } catch {}
    }
  } catch {}
  return "";
}

// The Stop hook can fire before the final text is flushed — poll until two
// consecutive non-empty reads agree (Prodeology spike finding M-R4).
async function stableTail() {
  let prev = "";
  for (let i = 0; i < 20; i++) {
    const t = transcriptTail();
    if (t && t === prev) return t;
    prev = t;
    await new Promise((r) => setTimeout(r, 100));
  }
  return prev;
}

const text = (await stableTail()).trim();
const result = await hookEvent("stop_check", { transcriptTail: text });
if (result?.action === "block") {
  process.stdout.write(JSON.stringify({
    decision: "block",
    reason: result.reason,
  }));
}
process.exit(0);
