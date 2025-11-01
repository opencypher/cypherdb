---
title: Performance Debugging
description: "Use EXPLAIN and PROFILE commands to debug query performance and view execution plans"
---

To see the query plans that Kuzu uses, you can
type `EXPLAIN` or `PROFILE` before your query. The purpose of doing
this is to debug the performance of the system on a particular
query. Both commands print the query plan so you can see the sequence of operators and execution steps.

- `EXPLAIN` only shows the plan Kuzu's query compiler/optimizer produced, with zeroes for each execution time.
- `PROFILE` runs the query plan, produces the output, and collects runtime information for each
operator in the plan, which will be shown inside the operators.

Below is a very simple example run from the CLI.

```table
kuzu> PROFILE MATCH (a:User) RETURN a.name
┌─────────┐
│ a.name  │
├─────────┤
│ Adam    │
│ Karissa │
│ Zhang   │
│ Noura   │
└─────────┘
(4 tuples)
Time: 0.32ms (compiling), 0.15ms (executing)
==============================================
=============== Profiler Summary =============
==============================================
>> plan
┌──────────────────────────────┐
│┌────────────────────────────┐│
││       Physical Plan        ││
│└────────────────────────────┘│
└──────────────────────────────┘
┌──────────────────────────────┐
│       RESULT_COLLECTOR       │
│   ------------------------   │
│          _0_a.name           │
│   ------------------------   │
│   ExecutionTime: 0.020000    │
│   ------------------------   │
│      NumOutputTuples: 0      │
└──────────────┬───────────────┘
┌──────────────┴───────────────┐
│          PROJECTION          │
│   ------------------------   │
│          _0_a.name           │
│   ------------------------   │
│   ExecutionTime: 0.000000    │
│   ------------------------   │
│      NumOutputTuples: 1      │
└──────────────┬───────────────┘
┌──────────────┴───────────────┐
│   SCAN_STRUCTURED_PROPERTY   │
│   ------------------------   │
│           _0_a.name          │
│   ------------------------   │
│   ExecutionTime: 0.003000    │
│   ------------------------   │
│      NumOutputTuples: 0      │
└──────────────┬───────────────┘
┌──────────────┴───────────────┐
│         SCAN_NODE_ID         │
│   ------------------------   │
│              a               │
│   ------------------------   │
│   ExecutionTime: 0.000000    │
│   ------------------------   │
│      NumOutputTuples: 4      │
└──────────────────────────────┘
```
