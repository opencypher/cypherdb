---
title: Cypher manual
description: High-level property graph query language manual with syntax, clauses, and features for graph database queries.
---

Cypher is a high-level query language for the property graph data model.
If you're coming from a SQL background, its syntax may seem familiar. Some common analogues between
SQL and Cypher are listed below:

| Type | SQL | Cypher
| ---| --- | ---
| Query | `SELECT`/`FROM`/`WHERE` | `MATCH`/`WHERE`/`RETURN`
| Data manipulation | `INSERT`/`UPDATE`/`DELETE` | `CREATE`/`SET`/`DELETE`

The features of Cypher that are different from SQL are listed below:
- Joins between records from different node and relationship tables are specified using a graph-like syntax.
  - `MATCH (n:Person)-[:Follows]->(m:Person)`
- Special syntax, such as the Kleene star `*` to describe variable-length and recursive joins.
- Cypher does not have an explicit `GROUP BY` like SQL does -- instead, grouping is done implicitly
depending on the combination of bound variables in the `RETURN` clause.

There are a few other differences between SQL and Cypher. Yet, like other high-level database
query languages, most of its semantics can be understood as mappings to relational algebra operators
for selections, joins, projections and aggregations.

Kuzu implements openCypher's[^1] standard predicates and expressions. The following sections in this
chapter cover all Cypher statements, clauses, expressions and functions implemented in Kuzu.

## Statements vs. clauses

In Cypher, a statement is a complete query that can be executed on its own. A statement can contain one or more
clauses, and can span multiple lines. The end of a statement is marked with a semicolon `;`, and the
query parser looks for this symbol to know when a statement is complete.

A clause is a part of a statement that performs a specific operation. For example, the `MATCH` clause
is used to find patterns in the graph, the `RETURN` clause is used to specify what subset of the matched
data to return, and so on.

### Multi-line statements

You can execute multiple query statements sequentially in the CLI, rather than
executing them one by one. To run a multi-line statements, simply end each valid statement you want
to execute with a semicolon `;`. For example:

```cypher
MATCH (p1:Person)
WHERE p1.age <= 18
RETURN p1.name AS non_adult;

MATCH (p2:Person)
WHERE p2.age > 18
RETURN p2.name AS adult;
```
When you copy-paste the above blocks into the Kuzu CLI and press Enter, it will execute each block
sequentially, so you don't have to send individual queries one at a time.

---

[^1]: [openCypher](https://opencypher.org/resources/) is an open-source project that formalizes the
semantics, style and grammar for the Cypher query language in order to make it more compatible to be
used by multiple graph database vendors.
