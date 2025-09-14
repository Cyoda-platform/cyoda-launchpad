---
title: "When Transactions Meet Workflows: Building Reliable Systems Without Glue Code"
author: "Paul Schleger"
date: "2025-08-30"
category: "Architecture"
excerpt: "Most enterprises build reliable systems by stitching together PostgreSQL, Kafka, and workflow engines. Cyoda offers a different vision: a unified platform where transactions, workflows, and queries reduce complexity while improving reliability."
featured: false
published: true
image: "/images/blogs/when_transactions_meet_workflows.png"
tags: ["transactions", "workflows", "architecture", "reliability", "integration"]
---

# When Transactions Meet Workflows: Building Reliable Systems Without Glue Code

In most enterprises, building reliable systems isn't just about writing
code, it's about stitching together a patchwork of tools. A typical
architecture for handling **transactions, workflows, and queries**
involves:

-   **PostgreSQL (or another RDBMS)** for transactional consistency
-   **Kafka** for event streaming
-   **Camunda or another workflow engine** for long-lived processes
-   **ETL pipelines** for reporting and analytics

While this stack works, it comes at a cost: glue code, fragile
integrations, and operational complexity. Every new feature means
coordinating across multiple layers of infrastructure.

Cyoda offers a different vision: a platform where **transactions,
workflows, and queries are unified into a single system**, reducing
complexity while improving reliability.

------------------------------------------------------------------------

## The Problem with Multi-System Architectures

### Glue Code Everywhere

When you stitch together Kafka, PostgreSQL, and Camunda, much of the
engineering effort goes into glue code:
- Ensuring events in Kafka align with states in the database
- Writing compensating logic when workflows fail halfway
- Rebuilding audit trails from disparate logs

This code doesn't deliver business value, it just holds the system
together.

### Operational Fragility

Each component has its own scaling model, monitoring requirements, and
failure modes. Outages in one layer ripple across the stack, requiring
manual intervention.

### Limited Auditability

With data scattered across systems, reconstructing a historical state
becomes painful. Audit logs are incomplete, inconsistent, or require
bolt-on logging solutions.

For architects tasked with designing **reliable, auditable systems**,
this complexity is unsustainable.

------------------------------------------------------------------------

## Cyoda's Unified Approach

Cyoda was designed from the ground up to unify these concerns into a
single platform:

1.  **Transactions**
    -   Extended ACID semantics with **serializable snapshot
        isolation**.
    -   Asynchronous transaction processing that remains durable and
        idempotent.
2.  **Workflows**
    -   Entities are modeled with **state machines** as first-class
        citizens.
    -   Transitions and criteria are declaratively defined, with
        processors handling business logic.
    -   Asynchronous workflows are orchestrated natively across the
        cluster.
3.  **Queries and Reporting**
    -   **Point-in-time queries** against the consistency clock enable
        reconstruction of historical states.
    -   **Distributed reporting** runs directly on transactional data,
        eliminating ETL duplication.

By embedding workflows and queries into the transactional core, Cyoda
eliminates the need for Kafka topics, workflow engines, and bolt-on
analytics layers.

------------------------------------------------------------------------

## Example: Loan Approval Workflow

### Traditional Architecture

-   PostgreSQL stores loan applications.
-   Kafka streams state changes to other services.
-   Camunda manages the workflow:
    `Submitted → Under Review → Approved → Funded`.
-   BI tools query a data lake updated via ETL pipelines.

Developers must ensure that all systems remain in sync. Failures often
require manual reconciliation.

### Cyoda Architecture

-   The **loan application** is an entity with states defined in Cyoda.
-   Each transition (e.g., `Under Review → Approved`) is validated and
    applied atomically within the platform.
-   Downstream processes (e.g., funding) are queued asynchronously
    within Cyoda's **event-context sharding** framework.
-   Reports can be generated directly from the platform, reflecting the
    **exact state at any consistency time**.

No glue code. No external workflow orchestration. No ETL. Just a single,
coherent system.

------------------------------------------------------------------------

## Benefits for Architects

1.  **Reduced Complexity** Fewer moving parts mean fewer points of
    failure.
2.  **End-to-End Consistency** Transactions, workflows, and queries
    share the same consistency guarantees.
3.  **Auditability** Every state transition is persisted as an
    immutable event, providing full data lineage.
4.  **Faster Delivery** Teams spend time building features, not
    integrations.
5.  **Resilience by Design** Event-context sharding ensures ordered
    processing without race conditions.

------------------------------------------------------------------------

## Why This Matters

Architects are increasingly asked to deliver systems that are
**reliable, compliant, and scalable**, all while reducing cost and
complexity. Traditional architectures force teams to integrate multiple
tools, each with its own trade-offs.

Cyoda demonstrates that this isn't necessary. By unifying transactions,
workflows, and queries into one system, it delivers:

-   **Simplicity** without sacrificing power
-   **Reliability** without glue code
-   **Auditability** without bolt-ons

------------------------------------------------------------------------

## Conclusion

For architects tired of fragile integrations and complex multi-system
stacks, the choice is clear. **When transactions meet workflows in
Cyoda, reliability follows.**

By embedding state machines, transactional consistency, and
point-in-time queries into a single platform, Cyoda eliminates the need
for Kafka, PostgreSQL, and external workflow engines. The result is a
system that is not only simpler to operate, but also more resilient,
auditable, and future-ready.

------------------------------------------------------------------------
