---
title: "Mermaid Diagram Test"
author: "Test Author"
date: "2025-09-08"
category: "Test"
excerpt: "Testing mermaid diagram rendering in the guide system."
featured: false
published: true
tags: ["test", "mermaid", "diagrams"]
---

# Mermaid Diagram Test

This is a test guide to verify that mermaid diagrams render correctly in the guide system.

## Simple Flowchart

```mermaid
flowchart TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[End]
```

## State Diagram

```mermaid
stateDiagram-v2
    [*] --> Still
    Still --> [*]
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]
```

## Simple Sequence Diagram

```mermaid
sequenceDiagram
    participant A as Alice
    participant B as Bob
    A->>B: Hello Bob, how are you?
    B-->>A: Great!
```

This test should show three different types of mermaid diagrams to verify the implementation is working correctly.
