# A11 Baseline Project and Source Inventory

**Baseline date:** 13 August 2026  
**Purpose:** Establish the private A11 source of truth before additional growth, automation, or public product claims.

## Verified Facts

| Item | Status | Evidence basis |
|---|---|---|
| Private A11 workspace | Verified | Owner-only workspace route, database schema, validation suite, and deployment checkpoint. |
| MindReply production version endpoint | Verified | Public endpoint was reachable and returned a production branch, commit, and deployment metadata. |
| Control-plane scheduled workflow signal | Verified | The sampled GitHub Actions run status showed recurring scheduled-run failures. |

## Observed, Unverified, and Blocked Records

| Record | Classification | Constraint |
|---|---|---|
| A11 Security Incident Documentation and Action Plan | Observed | The document exists, but provider and registrar evidence remains unreviewed. |
| Project A11 Security Incident Documentation | Unverified | Contains allegations requiring original source corroboration. |
| A11 Agent branch transcript | Unverified | Contains architecture and execution claims that cannot serve as independent operational evidence. |
| Vercel deployment inventory | Blocked | The connected deployment read did not complete; no health claim is made. |
| Reseller Pro canonical source | Unresolved | No authoritative repository or source artifact was identified in the initial inventory. |

## Immediate Risks and Data Gaps

The risk register is primarily about **decision quality**, not merely technical failure. The A11 account/domain report must not become a public incident assertion until original provider, registrar, and server evidence is attached. The control-plane workflow finding needs failed-step records before a root cause is stated. MindReply needs a single approved public product and deployment narrative. Reseller Pro needs a canonical source before it can be prioritized as a release or commercial initiative.

## Integration Availability

| Connection | Initial state | Safe next action |
|---|---|---|
| Google Drive | Available for reviewed document export | Add only references and classifications to A11; do not store credentials. |
| GitHub | Available for repository and workflow metadata | Obtain administrator-visible failed-step logs for root cause. |
| Vercel | Deployment read blocked | Restore authorized read access before reporting deployment health. |
| Manus API | Validated for server-side owner-started tasks | Use only through explicit private A11 run confirmation. |

## Source References

[1] [Mind-Reply control-plane workflow record](https://github.com/Mind-Reply/control-plane/actions/runs/31740697746)  
[2] [MindReply production version endpoint](https://www.mind-reply.com/api/version)  
[3] [A11 public repository](https://github.com/Mind-Reply/A11-K)
