# Agent Repository Contract — NEW-SIGNAL-check

**Status:** SOURCE-FREEZE / VALIDATION PROVENANCE
**Domain:** Historical signal validation and completion evidence.
**Boundary:** This repository is not a current production authority. New production capabilities belong in their designated canonical repositories.

## Typed agent interface
Historical validation capabilities should be represented as typed input/output contracts before reconciliation:
- signal input
- validation result
- evidence references
- completion state
- failure reason

Recommended boundary:
- `domain/`: signal validation rules.
- `agent/`: typed invocation adapter.
- `shared/`: schemas and result types.
- `tests/`: deterministic fixtures and validation tests.

Existing application structure remains frozen until capability extraction is verified.

## Auditability
Validation results must be reproducible from declared inputs and evidence. Do not represent historical output as current live status.

## Verification
Any capability promoted elsewhere requires source comparison, tests and destination evidence before this repository can be retired.
