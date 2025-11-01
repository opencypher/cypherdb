---
title: Database internals
description: "Architecture overview of Kuzu's internal modules including parser, binder, planner, and storage"
---

## Database modules

The following sections describe the role of each module under the `src/` directory.

### Parser

The parser transforms an input string statement into Kuzu's internal AST, called a `Statement`. The parser validates the syntax correctness of the input statement. An input statement will first be parsed into an antlr4 AST according to the grammar file under `src/antlr4/Cypher.g4`. We then perform a bottom-up traversal over the antlr4 AST and transform it into a `Statement` through `Transformer`.

### Binder

The binder binds a `Statement` into another AST called `BoundStatement`. It also validates the semantic correctness of the input statement and binds the string representation into an internal representation (typically an integer). For example, a table name will be bound to an internal table ID.

In addition, the binder also performs a semantic rewrite of `BoundStatement`. Semantic rewrites don't change the semantics of a `BoundStatement` but will rewrite it in a way for performant evaluation. Example: `MATCH (a) WITH a RETURN a.name` will be rewritten as `MATCH (a) RETURN a.name`

### Planner

The planner takes a `BoundStatement` as input and generates a `LogicalPlan`. A logical plan is a sequence of logical operators, each of which can be mapped to a relational algebra concept, e.g. `SCAN`, `FILTER`, `PROJECTION`, `JOIN`, etc. The planner only guarantees the correctness of the logical plan and doesn't address anything with regard to performance.

### Optimizer

The optimizer contains a set of optimization rules. Each rule is a transformation from one `LogicalPlan` into another `LogicalPlan`. The transformation should guarantee the correctness of the plan.

### Processor

The processor takes a `LogicalPlan` as input and maps it to a `PhysicalPlan`. A physical plan is a sequence of physical operators, each of which is an implementation of logical operators with a specific algorithm. For example, a logical `JOIN` can be mapped to physical `INDEX_NESTED_LOOP_JOIN` or `HASH_JOIN`.

In addition, the processor contains a task scheduler which breaks down a physical plan into multiple pipelines for [morsel-driven parallelism](/developer-guide/database-internal/execution).

### Expression evaluator

The expression evaluator is a lightweight physical operator that's used to evaluate expressions. E.g., `... RETURN a.age + 1` is mapped to a physical projection with an expression evaluator for `a.age + 1`.

### Function

The function module contains all functions (scalar functions, aggregate functions & table functions) that are available in the system.

### Catalog

The catalog module contains schema-level information that is generated through DDL.

### Storage

The storage module contains data that needs to be persistent to disk. Specifically:

- **BufferManager**: manages all memory being used in the system (except for small memory allocations from the OS); caches recently read pages in memory.
- **Index**: Hash index for primary keys.
- **Column**: Vanilla column data structure.
- **List**: CSR-like data structure.
- **NodeTable**: A collection of multiple columns.
- **RelTable**: Contains a forward and a backward `DirectedRelData`, each of which is a collection of multiple columns/lists.
- **NodeGroup**: Horizontally partitioned table. Similar to RowGroup concept.
- **WAL**: Write-ahead Log.

### Transaction

The transaction module implements the transaction manager and objects.

### Common

The common module contains common logic used across different modules. Header files in common do not depend on headers in other modules.

## Statement evaluation workflow

```
StatementResult
    |            Processor
PhysicalPlan
    |            Mapper
LogicalPlan
    |            Optimizer
LogicalPlan
    |            Planner
BoundStatement
    |            Binder
Statement
    |            Parser
String Input
```
