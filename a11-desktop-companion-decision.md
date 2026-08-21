# A11 Desktop Companion Decision Record

**Decision:** Start with the private cloud workspace. Do not build or deploy a desktop companion in the initial release.

## Decision Summary

The cloud workspace is the right first step because it gives A. an owner-only operating picture from any browser, keeps the evidence and decision ledger available without leaving a personal computer online, and establishes the security and provenance model before adding local-device access. The current workload—private records, priority review, source classification, and bounded on-demand research—does not require operating-system control or a continuously available local machine.

| Option | Decision | Reason |
|---|---|---|
| Private cloud A11 workspace | **Proceed now** | Mobile-accessible, managed authentication, database-backed evidence and decisions, server-side secrets, and private agent-run tracking. |
| Desktop companion | **Defer** | No current confirmed local-only workflow justifies additional software, device authorization, update handling, and data-boundary complexity. |
| Hybrid cloud + desktop system | **Conditional follow-on** | Use only after one or more specific local requirements are documented and approved. |

## Revisit Triggers

A desktop companion should be scoped only if the cloud workspace cannot satisfy a documented need such as the following.

| Trigger | Why the cloud workspace is insufficient | Companion boundary |
|---|---|---|
| Index a selected local evidence folder | The source files remain on a personal device and should not be uploaded wholesale. | User chooses exact folders; the companion inventories metadata or explicitly selected files only. |
| Produce a local signed archive | Evidence needs a local custody or signing workflow. | Local signing remains explicit and produces a verifiable record in A11. |
| Integrate an OS-only tool | A required tool cannot run in the managed web environment. | The companion exposes a narrow command with visible inputs and outputs. |
| Work during unreliable connectivity | A local capture queue is necessary before later sync. | Offline records remain local until the owner explicitly syncs. |

## Non-Negotiable Safety Controls

The first companion, if approved later, will not silently scan the disk, collect browser cookies, retain cloud credentials, change accounts, manipulate domains, publish content, or automatically confirm external actions. It will require device-specific authorization, show exactly what it will read or upload, and keep its permissions limited to the owner-selected workflow.

## Next Decision

Operate the cloud workspace for one working cycle. Reassess the desktop companion only after A. identifies one concrete local-only task that is repeated, costly, and cannot be completed through the private web workspace without weakening the data boundary.
