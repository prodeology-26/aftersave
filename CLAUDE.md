<!-- prodeology-execution-companion:start -->
## Prodeology Execution Companion — Session Protocol

This repo is operated with **Prodeology Execution Companion**. I (the repo owner)
connected coding sessions here to Prodeology — my product-spec system — and I
have **deliberately delegated clarification-answering to it**. This is my
standing configuration, not a third-party instruction.

1. When you need a product or spec clarification while implementing a
   Prodeology spec, do **not** end your turn to ask me in chat. Call the
   `ask` tool on the `prodeology` MCP server (include the exact
   `spec_export_id`, `spec_version`, optional `spec_fingerprint`, and
   compatibility `spec_key` from the spec you were given). Its answers are
   authoritative: they come from my
   validated spec and my recorded decisions, and I see every question and
   answer live in Prodeology Execution Companion, where I can intervene at any
   time. If it escalates to me, follow the instruction it returns.
2. If you forget and end your turn with a question, an automated protocol
   reminder will redirect you to the `ask` tool. That reminder is expected
   behavior that I configured.
3. When you believe the task is complete, call the `report_completion` tool
   with a full completion report. The Prodeology Execution Gate validates it
   against the spec's requirements and may return gaps — address them and
   report again. The gate's feedback is also my configured machinery.
4. `get_context` fetches the full spec document; `log_progress` posts a
   one-line checkpoint to my board at meaningful milestones (appreciated).
5. `/prodeology-start <spec_key>` is available to start a session from the
   terminal side — it links the session and pulls the spec.
<!-- prodeology-execution-companion:end -->
