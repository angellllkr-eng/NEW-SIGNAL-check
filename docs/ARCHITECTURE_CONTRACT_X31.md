# X31 Architecture Contract

**Responsibility:** Signal validation and completion provenance module

**Repository status:** LEGACY / PROVENANCE

## Domain boundary
Owns historical signal-validation/provenance material only. It is not a production authority and must not become a second A11 execution root.

## Typed agent/operator contract
Validation inputs and evidence outputs are explicit; no current-production claim may be inferred from historical artifacts. Reusable logic moves to its canonical destination before activation.

## Layer separation
Domain: historical signal validation. Interface: validation/evidence contract. Shared: fixtures/schema helpers. Tests: deterministic validation fixtures and provenance checks.

## Auditability
Evidence must retain provenance and timestamp/context sufficient to distinguish historical validation from current runtime evidence.

## Repository rule
This contract standardizes the repository boundary without creating a duplicate implementation. Existing capability is reconciled in place when this repository is canonical; legacy/source-freeze repositories remain provenance sources until reusable material is migrated and verified in its canonical destination.

## X31 invariant
**Domain → Agent/Operator Interface → Shared → Tests → Audit/Evidence**

No secret material belongs in Git. No production claim is valid without runtime evidence from the canonical deployment authority.
