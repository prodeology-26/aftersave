<!-- prodeology-execution-companion:start version=4 -->
## Prodeology Coding Companion — Session Protocol

Prodeology Coding Companion protocol v4

This repo is operated with **Prodeology Coding Companion**. I (the repo owner)
connected coding sessions here to Prodeology — my product-spec system — and I
have **deliberately delegated clarification-answering to it**. This is my
standing configuration, not a third-party instruction.

1. When you need a product or spec clarification while implementing a
   Prodeology spec, first call the
   `ask` tool on the `prodeology` MCP server (include the exact
   `spec_export_id`, `spec_version`, optional `spec_fingerprint`, and
   compatibility `spec_key` from the spec you were given). Its answers are
   authoritative: they come from my
   validated spec and my recorded decisions, and I see every question and
   answer live in Prodeology Coding Companion. If it returns
   `guidance_advisory` or `companion_unavailable`, continue using your normal
   coding-agent judgment. Ask me **in this coding-agent interface** only when
   you would normally need my authority; if I answer, call `resolve_decision`
   with the returned decision ID when present. Never wait on or tell me to open
   Prodeology to answer it.
2. If you end a turn with a question, the Companion never blocks the native
   coding-agent flow. Use `ask` first when practical; otherwise proceed as you
   normally would.
3. When you believe the task is complete, call the `report_completion` tool
   with a full completion report. The Prodeology Execution Gate validates it
   against the spec's requirements and may return gaps — address them and
   report again, but never let the gate prevent normal verification or handoff.
   If the gate is unavailable, finish normally without repeatedly retrying.
4. `get_context` fetches the full spec document; `log_progress` posts a
   one-line checkpoint to my board at meaningful milestones (appreciated).
5. `/prodeology-start <spec_key>` is available to start a session from the
   terminal side — it links the session and pulls the spec.
<!-- prodeology-execution-companion:end -->

<!-- prodeology-repo-instructions:start version=1 fingerprint=fe033e20309ab86e -->
# Product context from Prodeology

This region is generated from the **AfterSave** workspace in Prodeology and replaced on every sync. Do not edit between the Prodeology markers; change the source in Prodeology instead.

Use it as the product background for work in this repository: what the product is and who it serves, where it is heading, what is being built now, and the decisions and rules already settled. When a task conflicts with something here, say so before proceeding.

## Product context

**Company:** Single-founder consumer startup, idea/pre-seed stage. AfterSave monitors e-commerce purchases for price drops within the retailer's cancellation window, alerts the consumer, and they cancel the original order for a full refund and rebuy the same item at the lower price. Revenue model: merchant/affiliate commissions + potential subscription fees. Target user: passive savers — consumers who want to save money in general but won't actively hunt for deals. The product surfaces savings into their consciousness rather than requiring them to be active deal-seekers.

**Product:** The main technical constraint is making price-drop detection and cancel-and-rebuy guidance reliable within each retailer’s cancellation window. The product has to work with minimal friction from a browser extension, without requiring manual monitoring, deal-hunting, or negotiation, and the team is still assuming the user can trust the flow enough to act on it.

**Users:**
- Adoption is difficult because shoppers must install a browser extension and grant it access to shopping activity and receipts, which creates a trust and privacy barrier. The value is also delayed: after installation, a shopper may see nothing until an eligible price drop occurs weeks later, so there is no immediate proof of value to justify the permission request.
- [Assumption] AfterSave’s early adopters prefer receiving a weekly savings digest that summarizes detected post-purchase price drops and potential savings opportunities, rather than relying only on individual real-time alerts. (from this chat; unvalidated hypothesis)
- Today, most shoppers do not track prices after checkout, so they usually miss price drops; if they try to act, they do it manually through deal-hunting, monitoring prices themselves, or negotiating with the retailer.
- AfterSave is for habitual online shoppers who regularly make purchases without tracking price changes and want a way to save money with minimal effort after checkout by finding a price drop during the retailer’s cancellation window and telling them what to do next (cancel the original order and rebuy the same item for less). Their key need is reliable, low-friction detection and guidance in the post-purchase window that converts “a lower price exists” into “I actually got my money back / paid less,” without requiring active deal-hunting, manual monitoring, or negotiating with the retailer.

**Strategy:** AfterSave is worth doing for the business because it can monetize a high-intent post-purchase moment: when the product helps a shopper cancel and rebuy the same item at a lower price, AfterSave earns merchant/affiliate commission on the rebuy while the consumer saves money and pays AfterSave nothing directly. The merchant side also creates incremental sales and visibility for competitively priced sellers.

**Decisions:**
- Browser extension only for V0 — rejected mobile-first or cross-platform launch. Desktop browser extension is the narrowest viable slice to prove the core post-purchase savings loop before expanding to other surfaces.
- Client-side AI browsing as the technical approach for purchase detection and deal arbitrage — rejected API-based scraping (the path Earny and Paribus took, which failed when retailers blocked API access). The bet is that client-side AI browsing bypasses those restrictions entirely.
- Dual-sided marketplace model — rejected a pure consumer-arbitrage play. Consumer savings drives adoption; the merchant side (Sellers Board) is the revenue engine, letting competitively-priced merchants intercept a competitor's sale mid-fulfillment. Revenue comes from merchant/affiliate commissions + potential subscription fees.
- Target passive savers, not active deal-seekers — rejected the Honey-style audience of coupon-clippers and manual price-watchers. AfterSave surfaces savings into the user's consciousness rather than requiring them to hunt. The user doesn't change their shopping behavior; the product works in the background.
- Browser extension only, no mobile for V0: AfterSave's initial vertical slice ships as a desktop browser extension only. Mobile (where purchase detection and cross-app browsing are fundamentally harder) is explicitly deferred. This keeps the V0 scope tight — prove the core loop on desktop first, where detection, alerting, and cancel-and-rebuy are all possible within a single browser session.
- Dual-sided marketplace model: AfterSave is deliberately dual-sided from the start — consumer savings drives adoption, while the merchant marketplace (Sellers Board) is the revenue engine. Merchants who were outbid during the consumer's initial shopping journey get a second chance to intercept the sale mid-fulfillment by offering a better price. This means AfterSave is not just a consumer savings tool; the business model depends on merchant-side transaction volume.
- Passive savers, not active deal-seekers: AfterSave targets habitual online shoppers who want to save money but won't actively hunt for deals, track prices, or clip coupons. The product surfaces savings into their consciousness during the post-purchase window rather than requiring them to be proactive. This excludes deal-hunters, coupon-clippers, and price-alert enthusiasts — the value prop is "money back without extra effort," not "find the best deal."
- Client-side AI browsing as technical approach: AfterSave uses a browser extension with client-side AI to detect purchases and monitor price drops, rather than server-side API integrations. This was chosen because the API-access model that predecessors Earny and Paribus relied on was shut down by retailers and email providers — client-side browsing bypasses those restrictions entirely, making the post-purchase savings loop technically viable now when it wasn't before.

_(Truncated — open Prodeology for the full product context.)_

## Product story

Story Snapshot v20 (fresh, pipeline story@1.1-polished)

### Narrative
Adoption is difficult because shoppers must install a browser extension and grant it access to their shopping activity and receipts, creating a trust and privacy barrier. Despite that, AfterSave is worth doing for the business: it can monetize a high-intent post-purchase moment where a shopper cancel-and-rebuys the same item at a lower price—earning merchant/affiliate commission on the rebuy while the consumer saves money. The main technical challenge is making price-drop detection and cancel-and-rebuy guidance consistently reliable within each retailer’s cancellation window.
Thesis: AfterSave should be positioned as a consumer savings tool first: the core message is “save money without extra effort,” not a merchant marketplace. The key comparison is against doing nothing and overpaying—the baseline isn’t another savings tool, it’s the status quo where shoppers leave money on the table.

### Target Users (1)
- users [STRONG]: Adoption is difficult because shoppers must install a browser extension and grant it access to shopping activity and receipts, which creates a trust and privacy barrier. [Assumption] AfterSave’s early adopters prefer receiving a weekly savings digest that summarizes detected post-purchase price drops and potential savings opportunities, rather than relying only on individual real-time alerts. Today, most shoppers do not track prices after checkout, so they usually miss price drops; if they try to act, they do it manually through deal-hunting, monitoring prices themselves, or negotiating with the retailer.

### Strategic Beliefs (7)
- AfterSave is worth doing because it can monetize a high-intent post-purchase moment: when a shopper cancels and rebuys the same item at a lower price, AfterSave earns merchant/affiliate commission on the rebuy while the consumer keeps the savings.
- AfterSave’s value proposition should be communicated as “save money without extra effort” rather than as “a marketplace for merchants.” For the target users, the real alternative is the status quo of overpaying because they never act on price drops.
- AfterSave is a single-founder consumer startup at the idea/pre-seed stage.
- In the competitive landscape, the direct lane is largely empty: the main legacy “ghosts” are Earny (shut down after banks/retailers killed the price-protection benefits it relied on) and Paribus (acquired by Capital One and no longer a fully-functional price-protection feature).
- A key durable edge is proprietary retailer/cancellation-window knowledge: AfterSave encodes reliable cancel-and-rebuy guidance by retailer and window, and that capability compounds as coverage expands and guidance accuracy improves.
- AfterSave is B2C: the consumer is the economic buyer.
- The primary status-quo alternative for AfterSave’s target users is doing nothing: shoppers typically don’t learn that the price dropped after checkout, so they miss savings on each purchase.

### Direction of Travel
Browser extension only for V0 — rejected mobile-first or cross-platform launch. Dual-sided marketplace model — rejected a pure consumer-arbitrage play. Client-side AI browsing as the technical approach for purchase detection and deal arbitrage — rejected API-based scraping (the path Earny and Paribus took, which failed when retailers blocked API access).

### Open Questions (9)
- adoption_friction: Evidence does not meet the minimum moderate threshold
- value_clarity: No evidence collected for this dimension
- technical_feasibility: No evidence collected for this dimension
- trust_privacy: No evidence collected for this dimension
- user_behavior: No evidence collected for this dimension
- user_needs: No evidence collected for this dimension
- business_viability: No evidence collected for this dimension
- retailer_workflow: No evidence collected for this dimension

### Contradictions/Tensions (1)
- Whether value for early adopters comes primarily from a weekly digest vs relying only on individual real-time alerts

## Current Focus

Workspace Focuses: 1 active (generation 39)
Top Focus (1 of N): First usable end to end version
Primary goal [cmsja8k6d00vv8ss2njmesfyh]: Launch AfterSave MVP and prove target-user appeal
Desired outcome: Habitual online shoppers use the AfterSave MVP to detect an eligible post-purchase price drop, act on the swap alert, complete a cancel-and-rebuy, and see enough value to want to use AfterSave again.
Success measure: Within the first MVP pilot, at least 20 target users attempt the core loop, at least 10 complete one verified saving, and at least 60% of completers say they would use AfterSave again.
Target segment: Habitual online shoppers who do not actively track prices or clip coupons
Chosen direction: none yet.

## Roadmap

Roadmap Story v8 (fresh, backlog characterization 98%, pipeline roadmap@1.0)

### Backlog thesis
The backlog is assembling a controlled desktop-browser MVP that detects purchases and post-purchase price drops, evaluates credible savings, and guides shoppers through cancel-and-rebuy actions. It also builds the evidence, instrumentation, onboarding, and repeat-use surfaces needed to prove the consumer savings loop with a six-week target-user pilot. Merchant willingness-to-pay validation is present, but remains a parallel discovery track rather than the primary delivery path.

### Initiatives (6)
- Pilot onboarding and controlled distribution [inferred, 6 items · 0 shipped / 0 in-dev / 6 backlog]: A defined target-user profile, clear consent, low-friction installation, and a controlled extension build are prerequisites for enrolling valid pilot participants and getting them into an enabled state.
- Purchase detection and retailer foundations [inferred, 6 items · 0 shipped / 0 in-dev / 6 backlog]: Reliable purchase records, retailer guardrails, monitoring, and cancellation-window rules make the core loop actionable without sending shoppers into unsupported or unverifiable guidance.
- Savings opportunity evaluation [inferred, 4 items · 0 shipped / 0 in-dev / 4 backlog]: Matching the purchased product to a credible lower-price candidate and calculating net savings prevents false alerts and focuses shoppers on opportunities worth acting on.
- Cancel-and-rebuy completion [inferred, 6 items · 0 shipped / 0 in-dev / 6 backlog]: Alerts, retailer-specific action guidance, deep links, status tracking, recovery paths, and verified confirmation turn a detected opportunity into a measurable completed saving.
- Pilot measurement and repeat value [inferred, 7 items · 0 shipped / 0 in-dev / 7 backlog]: Stable attribution, durable evidence, instrumentation, a defined review protocol, and repeat-use surfaces allow the team to assess pilot appeal, completed savings, and reuse rather than relying on anecdotal outcomes.
- Merchant demand validation [inferred, 1 items · 0 shipped / 0 in-dev / 1 backlog]: Testing merchant willingness to pay establishes whether the Sellers Board can support the intended dual-sided marketplace model rather than assuming affiliate demand.

### Next up by priority (5) — nothing is formally in motion yet
- Implement stable enrolled-user identity and cross-session event attribution [BACKLOG/EXPLORING]
- Define pilot profile and retailer settings [BACKLOG/EXPLORING]
- Browser Extension Installation and Onboarding [BACKLOG/EXPLORING]
- Implement desktop purchase-drop detection and swap alert surface [BACKLOG/EXPLORING]
- Persist pilot events and verification evidence [BACKLOG/EXPLORING]

### Direction of travel
The work is moving toward a browser-extension-only V0: controlled desktop onboarding, client-side purchase detection, price-drop evaluation, swap alerts, and cancel-and-rebuy verification, followed by a six-week target-user pilot. This matches the stated consumer-first sequencing and the intended dual-sided marketplace direction, while merchant demand remains an exploratory validation track. Delivery should prioritize a reliable end-to-end consumer loop and its measurement before expanding merchant-side investment.
(Aligned with the stated strategic direction.)

### Goal coverage
28 of 30 items carry a goal · 2 without one.
Strategic goals with NO backlog execution (2):
- Verify the unified Focus system end to end: ship a first usable Focus lifecycle that a PM can create, activate, plan, and end without errors. Success measure: One Focus completes create-activate-plan…
- AfterSave's persona library has four synthetic users grounded in Foundation + Market Intel: - **Maya — The Serial Fashion Buyer**: 28, urban professional. 3-5 purchases/month at mid-to-high price poi…
13 strategic goals have backlog execution: "Total cumulative consumer savings ($) — the aggregate dollars saved across all completed …" (4); "AfterSave's strategic sequencing is consumer-first, then merchant. Desired outcome: After…" (2); "Launch AfterSave MVP and prove target-user appeal Desired outcome: Habitual online shoppe…" (4); "20-30 users completing the cancel-and-rebuy loop successfully. Desired outcome: Cycle goa…" (5).

### Tensions / gaps (2)
- [deferred] Merchant willingness-to-pay validation is already represented while the consumer savings loop, pilot evidence, and repeat-use proof are still being built. Running both tracks risks diluting the stated consumer-first sequencing unless merchant work remains narrowly scoped discovery.
- [over_invested] Two backlog items cover substantially overlapping privacy and permission-control concerns, creating a risk of duplicated scope unless their responsibilities are consolidated.

### Shape
30 items · 30 active / 0 dormant / 0 recently shipped · 93% have a goal · +0 added in 7d

## Settled decisions

- **The direct API-dependent price-protection lane has largely collapsed: Earny shut down and Paribus is now only a thin Capital One Shopping feature.** — Decided: Validation plan: define pass/fail evidence for swap conversion (alert → verified cancel → rebuy at the lower price) and for cancellation-window feasibility (alerts + guidance trigger inside the real retailer cancellation window, and are gated correctly). Why: Learn: define pass/fail evidence for swap conversion (alert → verified cancel → rebuy at the lower price) and for cancellation-window feasibility (alerts + guidance trigger inside the real retailer cancellation window, and are gated correctly). Method: instrument an end-to-end measurement harness with per-retailer/SKU breakdowns, compute conversion rate from detected alerts through verified completion, and measure window correctness (in-window triggers vs true cutoffs) with a failure-mode taxonomy. Decision rule: change direction/scope a major pivot only if conversion misses agreed thresholds across multiple retailers/cohorts OR if window gating is frequently wrong enough to materially block verified in-window swaps; if failures concentrate in a small subset, fix that subset and don’t pivot architecture. This records the validation decision; it does not create backlog work automatically. _(confirmed by the team)_
- **What makes it hard for someone to adopt or switch to this?** — Decided: Adoption friction is low overall because AfterSave works after users have already shopped normally, but the main barriers are that V0 requires a desktop browser extension and the savings only show up during the retailer’s post-purchase cancellation/return window. Why: The grounding says AfterSave is designed to work without changing how people shop, so the product is inherently low-friction. The real constraints are surface and timing: desktop-extension-only for V0, and the narrow cancel-and-rebuy window after purchase. _(AI-resolved, grounded in evidence)_
- **How do people deal with this problem today?** — Decided: Today, most shoppers do not track prices after checkout, so they usually miss price drops; if they try to act, they do it manually through deal-hunting, monitoring prices themselves, or negotiating with the retailer. Why: The grounding says habitual shoppers regularly buy without tracking price changes and explicitly frames active deal-hunting, manual monitoring, and negotiating as the current burdens. That gives a clear current-state answer for the story: people mostly miss the drop or handle it themselves. _(AI-resolved, grounded in evidence)_
- **Why is this worth doing for the business?** — Decided: AfterSave is worth doing for the business because it can monetize a high-intent post-purchase moment: when the product helps a shopper cancel and rebuy the same item at a lower price, AfterSave earns merchant/affiliate commission on the rebuy while the consumer saves money and pays AfterSave nothing directly. Why: The grounding supports a clear business model: revenue comes from the second purchase, not the consumer, and the merchant side adds a second source of value. That makes the product economically plausible while staying aligned with the low-friction consumer promise. _(AI-resolved, grounded in evidence)_
- **What technical constraints or unknowns are in play?** — Decided: The main technical constraint is making price-drop detection and cancel-and-rebuy guidance reliable within each retailer’s cancellation window. Why: The grounding consistently defines the product around post-purchase price-drop detection during the cancellation window, so that is the core technical risk to capture. It also says the only user-side friction is installing the extension and trusting the flow, which reinforces reliability as the key unknown. _(AI-resolved, leaning)_

_(Truncated — open Prodeology for the full settled decisions.)_

## Rules and constraints

- **Cap Synthetic Evidence:** Synthetic interviews and persona-based simulations never exceed MODERATE confidence. (when: ## Rule
Synthetic interviews and persona-based simulations never exceed MODERATE confidence.

### Rationale
Simulated evidence can be useful for exploring scenarios, but it is still a proxy for real user or market data. Capping synthetic evidence prevents imagined data from being mistaken for validated reality.

### How to Apply
1. Identify any evidence generated from personas, simulations, or synthetic respondents.
2. Assign no more than MODERATE confidence to that evidence.
3. Make the synthetic nature obvious in the label and the source note.
4. Use synthetic evidence to explore possibilities, not to prove them.

### Compliant Example
> Persona simulation suggests onboarding confusion is likely, MODERATE confidence.
> [Source: Persona - Enterprise Admin]

### Non-Compliant Example
> Persona simulation proves onboarding confusion is the primary blocker, STRONG confidence.
> Synthetic evidence cannot be promoted to STRONG.

### Exceptions
- None for confidence level. Synthetic evidence may support planning or hypothesis generation, but its confidence cap does not change.)
- **Cite Sources:** Every factual claim in an artifact must reference a specific evidence source with an inline citation. (when: ## Rule
Every factual claim in an artifact must reference a specific evidence source with an inline citation.

### Rationale
Artifacts are only useful when readers can trace claims back to the evidence that supports them. Without citations, conclusions become hard to verify, hard to challenge, and hard to trust. Source-backed claims are the foundation of the evidence chain.

### How to Apply
1. Identify the source that supports each fact, observation, or conclusion.
2. Add the source inline using a consistent citation format such as `[Source: Interview - P3, lines 42-47]`.
3. If a statement cannot be sourced, label it as `[Assumption]` or `[Inference]` instead of presenting it as fact.
4. Keep citations close to the claim they support so readers do not have to search for them.

### Compliant Example
> 73% of interviewed users reported confusion about pricing tiers.
> [Source: Interview - P1, P3, P4, P5, P7, P8, P9, P10, P11]

### Non-Compliant Example
> Most users find pricing confusing.
> No citation, no denominator, and no traceable source.

### Exceptions
- Executive summaries may aggregate claims without per-claim citations if they include a separate sources section.
- When restating a finding from the same workflow run, a reference to the prior step is sufficient if it is explicit and traceable.)
- **Evidence Freshness:** Flag evidence older than 12 months as potentially stale and note its age explicitly. (when: ## Rule
Flag evidence older than 12 months as potentially stale and note its age explicitly.

_(Truncated — open Prodeology for the full rules and constraints.)_

## Design system

### Design System Context
- Assigned design system: Essence Villa Management
- Resolution source: WORKSPACE_DEFAULT
- Mode support: light, dark (default: light)
- Coverage: tokens yes · components yes · import-path identity no

#### Design tokens (use these by name — do not hardcode values they cover)
- `color.red-50`: oklch(0.962 0.020 22)
- `color.blue-50`: oklch(0.960 0.024 250)
- `color.ch-vrbo`: oklch(0.560 0.110 245)
- `color.divider`: var(--slate-150)
- `color.red-100`: oklch(0.916 0.040 22)
- `color.red-500`: oklch(0.586 0.176 25)
- `color.red-600`: oklch(0.528 0.180 26)
- `color.red-700`: oklch(0.460 0.164 27)
- `color.slate-0`: oklch(0.994 0.001 250)
- `color.teal-50`: oklch(0.962 0.020 200)
- `color.amber-50`: oklch(0.968 0.034 80)
- `color.blue-100`: oklch(0.912 0.046 250)
- `color.blue-500`: oklch(0.580 0.120 252)
- `color.blue-600`: oklch(0.516 0.122 254)
- `color.blue-700`: oklch(0.448 0.112 256)

_(Truncated — open Prodeology for the full design system.)_
<!-- prodeology-repo-instructions:end -->
