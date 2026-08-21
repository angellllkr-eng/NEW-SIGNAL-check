# Signal Accounting — Working Commercial System

> **Internal working model — validate service scope, licensing, geography, delivery capacity, and pricing before public use.** The website currently keeps this material owner-only and does not publish pricing or credentials.

## ICP and ECP focus

| Priority | Ideal customer profile | Economic customer profile | Trigger | Primary offer | Qualification signal |
|---|---|---|---|---|---|
| 1 | Owner-led services business with 5–30 staff and regular monthly activity | Founder, operator, or COO who owns operational performance and can approve a recurring engagement | Decisions are relying on late, fragmented, or manually assembled numbers | Rhythm Foundation | Acknowledges an ongoing monthly problem and a need for a dependable operating view |
| 2 | Growing company with a finance process that works unevenly across periods | Founder, GM, or finance lead with a defined operating budget and a clear cost of delay | Missed monthly close, inconsistent reporting, recurring cash uncertainty, or leadership growth | Operating Rhythm | Wants a named monthly cadence, clearer decisions, and a measurable next step |
| 3 | Established business with clean data but higher-stakes planning or change | Owner, CEO, COO, or board-facing operator able to sponsor senior support | Pricing, hiring, expansion, fundraising, multi-entity, or an important decision needs better finance context | Decision Partner | Has a time-bound business decision and enough information to define scope |

## Segment-to-message-to-follow-up matrix

| Segment | Landing-page message | Primary CTA | Owned follow-up route | Default owner and service level |
|---|---|---|---|---|
| Owner-led operations | “Make the numbers move. Start with the current picture.” | Run the Signal Check | Signal Map stored locally; consented contact form creates a first-party lead record with `need=visibility` or `monthly-rhythm` | **A.** reviews the desk and replies within two business days until a delegate is named |
| Growing finance rhythm | “Finance should feel like forward motion, not catch-up.” | Start the conversation | First-party lead record with stage, need, urgency, and optional Signal Map | **A.** qualifies for an Operating Rhythm conversation within two business days |
| Decision-led business | “Put the financial side in your corner.” | Plan your next move | First-party lead record with `need=decision-support`; scope only after a short discovery conversation | **A.** decides whether to scope a Decision Partner engagement or refer out within two business days |

## Offer ladder

| Offer | Purpose | Scope boundary | Internal working price model (USD) | Next step |
|---|---|---|---:|---|
| Signal Map | Create value before the first call; route the lead to the right conversation | Directional diagnostic only; no financial data, regulated advice, or document review | Free | Qualifying conversation or self-serve service page |
| Rhythm Foundation | Establish a clean monthly operating view and close rhythm | Defined setup, report set, operating questions, and handoff; excludes tax/legal work unless separately authorised | $1,500–$3,000 setup, then $1,500–$3,000/month | Operating Rhythm |
| Operating Rhythm | Recurring finance operations with a consistent decision cadence | Monthly reporting, agreed operating review, and scoped support; volume/complexity guardrails required | $3,000–$5,000/month | Decision Partner or retained core scope |
| Decision Partner | Senior strategic support around a live business decision | Scoping required; not a substitute for licensed tax, legal, or investment advice | $5,000–$8,000/month | Defined project, increased cadence, or specialist referral |

These ranges are intentionally conservative working brackets, not external promises. Public references show outsourced accounting varies materially by scope and complexity; published ranges include roughly $500–$5,000+ per month for outsourced accounting and $3,000–$12,000 per month for fractional-CFO work.[1][2]

## Proof and compliance gate

Before any evidence is published, collect the underlying proof, owner approval, publication permission, date, geography, and expiry/review date. Do **not** publish client names, testimonials, outcomes, certifications, affiliations, or “results” claims unless all fields are complete and authorised.

| Proof type | Required evidence | Public status until verified |
|---|---|---|
| Founder/operator profile | Real name, role, approved biography, headshot, and relevant background | Hidden |
| Credentials or licences | Certificate/registry link, jurisdiction, scope, and review date | Hidden |
| Case study | Signed client permission, factual baseline, methodology, outcomes, and date | Hidden |
| Partner/client logo | Written logo-use permission and approved mark | Hidden |
| Testimonial | Exact approved wording, author identity/role, consent, and date | Hidden |

## First-party CRO event plan

| Event | What it means | Decision it supports |
|---|---|---|
| `diagnostic_started` | Visitor begins qualification | Test diagnostic entry CTA and message-market fit |
| `diagnostic_completed` | Visitor reaches a Signal Map | Diagnose question friction and result handoff effectiveness |
| `signal_map_copied` / `signal_map_printed` | Visitor keeps or shares the output | Measure perceived usefulness before contact |
| `contact_form_started` | Visitor opens the owned qualification path | Compare CTA and form-intent quality |
| `lead_submitted` | Consented lead reaches the owned database | Track qualified-conversation conversion |

## CRO test matrix

| Priority test | Hypothesis | Primary event / comparison | Success threshold | Review cadence |
|---|---|---|---|---|
| Hero CTA: “Plan your next move” vs. “Run the Signal Check” | A diagnostic-first CTA will improve qualified intent for colder visitors | `primary_cta_clicked` by destination and subsequent `lead_submitted` | At least 20% more qualified handoffs without lower lead quality | After 100 CTA clicks per variant |
| Diagnostic CTA wording | A direct “See the signal” outcome will improve completion more than generic “Next” language | `diagnostic_started` → `diagnostic_completed` rate | Improvement of at least 10 percentage points | After 75 starts per variant |
| Offer framing | “Monthly operating rhythm” will clarify value better than a broad “accounting support” frame | CTA clicks and lead `need` selection | Higher proportion of `monthly-rhythm` / `decision-support` leads | Monthly |
| Form length | A short context form will balance completions and qualification better than a longer form | `contact_form_started` → `lead_submitted` rate | No more than 15% reduction in completion, while preserving stage/need data | After 50 form starts per variant |
| Result-page handoff | Showing the Signal Map label on contact will make the handoff feel more relevant | Signal Map-attached leads / diagnostic completions | At least 15% of completions enter the contact flow | Monthly |

## CRM, consent, and retention boundary

The **first-party system is the current system of record**. A consented visitor’s name, email, business stage, need, urgency, voluntary message, source, diagnostic score, and optional Signal Map summary remain in the project database and are visible only in the owner-controlled Qualification Desk. The deployed form does not request banking details, account numbers, files, tax returns, or other sensitive financial data.

Until a genuine CRM connector is approved, the no-integration fallback is: review the owner desk, reply manually through the chosen business email channel, and retain the communication outside the public website. When a CRM is approved, the target schema is `name`, `email`, `company`, `role`, `businessStage`, `need`, `urgency`, `source`, `diagnosticScore`, `diagnosticLabel`, `signalMap`, `consent`, `status`, and `createdAt`. No data should be copied to an external system without confirming its privacy terms and the visitor’s stated consent.

The current operating proposal is **manual review at 12 months** for new/unqualified leads, with deletion or documented retention extension by the owner. This is an operational default, not a substitute for a jurisdiction-specific privacy review. Before a public launch, add the final privacy notice, owner/delegate, response service level, and retention policy.

## Proof-vault workflow

The Qualification Desk includes an owner-only proof vault. It accepts a private record for a founder profile, credential, case study, client logo, or testimonial; includes evidence URL, approval status, and publication-permission confirmation; and does not automatically publish anything. Only proof that is verified, current, properly authorised, and intentionally published should appear on the public website.

## References

[1] [CDH, *Cost of Outsourcing Accounting Services: What to Expect*](https://www.cdhcpa.com/blog/cost-of-outsourcing-accounting-services/).

[2] [Pilot, *How much does a fractional CFO cost?*](https://pilot.com/blog/fractional-cfo-cost-guide).
