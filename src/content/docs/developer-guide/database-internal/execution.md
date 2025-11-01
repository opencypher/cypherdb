---
title: Execution
description: "Query execution architecture including pipeline decomposition and morsel-driven parallelism"
---

## Pipeline

We decompose `PhysicalPlan` into `Pipeline`s. A pipeline is a linear sequence of physical operators. The leaf operator of a pipeline is a source operator that scans from disk, storage or the output of other pipelines. The last operator of a pipeline is a sink operator that accumulates the intermediate results of the pipeline. Within a pipeline, data flows between operators without materialization until sink.

### Pipeline decomposition

Given a physical plan, we decompose into pipelines when we encounter a sink operator. A sink operator is an operator that must exhaust its input in order to process correctly, e.g. `HASH_JOIN_BUILD`, `AGGREGATE`, `ORDER BY`, etc. Pipelines have dependencies, meaning that one pipeline may depend on the output of another pipeline. For example, `HASH_JOIN_PROBE` pipeline must depend on a `HASH_JOIN_BUILD` pipeline.

### Morsel-driven parallelism

A pipeline can be executed with multiple threads. The granularity of multi-threading is controlled by its source operator that is responsible for dispatching source data to different threads' pipelines. E.g., to scan a CSV file in parallel, the source operator will first count the number of lines in the file and dispatch different lines to different threads.
