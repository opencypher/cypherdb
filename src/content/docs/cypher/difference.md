---
title: Differences between Kuzu and Neo4j
description: "Key differences in syntax, schema requirements, and features between Kuzu and Neo4j"
---

If you're coming over from Neo4j, you can find the differences from Neo4j's keywords and syntax
in this section. Note that as far as possible, Kuzu tries to follow openCypher's syntax and semantics.

## Schema

Unlike Neo4j, Kuzu requires a schema to be defined before any data can be inserted into the database
(we call this the "structured property graph model"). The schema provides a logical grouping of node and
relationship tables, along with their associated properties and data types that define the structure of
the graph database. See our [DDL](/cypher/data-definition/create-table) docs for more information. 

## Clauses

### CREATE and MERGE

We recommend always specifying node and relationship labels explicitly in the `CREATE` and `MERGE` clauses.
However, if not specified, Kuzu will try to infer the label by looking at the schema.

### FINISH

`FINISH` is recently introduced in GQL and adopted by Neo4j but not yet supported in Kuzu. You can use `RETURN COUNT(*)` instead which will only return one record.

### FOREACH

`FOREACH` is not supported. You can use `UNWIND` instead.

### LOAD CSV FROM

Kuzu can scan files not only in the format of CSV, so the `LOAD CSV FROM` clause is renamed to `LOAD FROM`.

#### Semantics

Neo4j adopts a trail semantic (no repeated edge) for pattern within a `MATCH` clause, whereas Kuzu adopts _walk_ semantic
(allowing repeated edge) for pattern within a `MATCH` clause.

In Kuzu, you can use `is_trail` or `is_acyclic` function to check if a path is a trail or acyclic.

#### Variable length relationships

Since Kuzu adopts a walk semantic by default, so a variable length relationship needs to have a upper bound to guarantee the query will terminate. If upper bound is not specified, Kuzu will assign a default value of 30.

Kuzu also extends Neo4j's variable length to support filter inside the variable length relationship. 

To run algorithms like (all) shortest path, simply add `SHORTEST` or `ALL SHORTEST` between the kleene star and lower bound. For example,  `MATCH (n)-[r* SHORTEST 1..10]->(m)`. It is recommended to use `SHORTEST` if paths are not needed in the use case.

More information can be found in the [MATCH](/cypher/query-clauses/match) documentation page.

### REMOVE

`REMOVE` is not supported. Use `SET n.prop = NULL` instead.

### SET

Properties must be updated in the form of `n.prop = expression`. Update all properties with map of `+=` operator is not supported. Try to update properties one by one.

### USE

`USE` graph is not supported. For Kuzu, each graph is a database. You can use different graph by opening different databases.

### WHERE

Using `WHERE` inside node or relationship pattern is not supported, e.g. `MATCH (n:Person WHERE a.name = 'Andy') RETURN n`. You need to write it as `MATCH (n:Person) WHERE n.name = 'Andy' RETURN n`.

Filter on node or relationship labels is not supported, e.g. `MATCH (n) WHERE n:Person RETURN n`. You need to write it as `MATCH (n:Person) RETURN n`, or `MATCH (n) WHERE label(n) = 'Person' RETURN n`.

### Others

Any `SHOW XXX` clauses become a function call in Kuzu. For example, `SHOW FUNCTIONS` in Neo4j is equivalent to `CALL show_functions() RETURN *` in Kuzu. For more information, see the [functions](/cypher/query-clauses/call) page.

## Subqueries

Kuzu supports `EXISTS` and `COUNT` subquery. See [Subqueries](/cypher/subquery) for more information.

`CALL <subquery>` is not supported.

## Data Types

Kuzu follows the Postgres typing system. For `LIST` type, all elements should be of the same type. For `MAP` type, all keys should be of the same type and all values should be of the same type. For more information, see [data types](/cypher/data-types).

## Functions

- `labels()` function is named `label()` instead.
- type predicate expression `n.property IS :: INTEGER` is supported as `typeOf(n.property)=INT64`
- internal id function `elementId` is supported as `id()`.
- spatial functions are not supported.

### Aggregate functions
- `percentileCont`, `percentileDisc`, `stDev` and `stDevP` are supported.

### List functions

- Most list functions have a `list_` prefix, e.g. `list_concat`, `list_reverse`, `list_reduce`, etc...
- `tail` is supported as `list_slice()`.
- `head` and `tail` are supported as `list_extract()` or `list[]`.

### Casting functions
- `toXXX` functions in Neo4j are supported in Kuzu via the `cast(input, targetType)` function

### Mathematical functions
- `isNaN` is not supported.
- `e()` is not supported.
- `haversin` is not supported.
- `pi()` is not supported.

### String functions
- `char_length` and `character_length` are supported as `size`.

### Temporal functions
- `date()` is supported as `current_date()`. `timestamp()` is supported as `current_timestamp()`.
- local datetime, real time clock, transaction time clock are not supported.

### Vector similarity functions
- cosine similarity is named as `ARRAY_COSINE_SIMILARITY()`
- euclidean distance is named as `ARRAY_DISTANCE()`

## Indexes and Constraints

Kuzu does not currently support manually creating indexes or constraints on custom properties.
Instead, Kuzu creates a primary key index (which also guarantees non-null and uniqueness) the
user-specified primary key column of a node table.

