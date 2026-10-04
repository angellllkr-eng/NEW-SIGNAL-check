# Agent/Operator Architecture

## Responsibility
This repository is a self-contained expert module responsible for **Signal validation and completion for agents**.

## Boundaries
- **Domain**: core business logic and rules; isolated and independently testable.
- **Agent/operator interface**: the only external-actor contract. Inputs, outputs, commands, errors, and evidence are explicitly typed.
- **Shared**: stable types, utilities, adapters, and cross-cutting primitives only; no domain decisions.
- **Tests**: unit, integration, and E2E/contract tests where applicable.

## Operating contract
Agents/operators consume the typed contract; they do not reach into domain internals. Domain code does not depend on a specific agent or UI. Evidence-producing actions must expose an auditable result.

## Change rule
New capabilities belong to the narrowest layer that owns them. Cross-layer coupling requires an explicit contract change and corresponding tests.

## Verification
A change is complete only when the relevant contract, tests, and audit/evidence path are updated and verified.
