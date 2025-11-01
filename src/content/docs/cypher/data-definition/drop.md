---
title: Drop
description: Drop DDL statement
---

## Drop a table

Dropping a table removes the table and all its data from the database.

:::caution[Note]
- To drop a node table, you need to first drop all of the relationship tables that refer to it in
  their `FROM` or `TO` clauses.
- You can drop any relationship table without affecting its underlying nodes.
:::

For example, consider the following database:

```cypher
CREATE NODE TABLE User(name STRING PRIMARY KEY, age INT64, reg_date DATE);
CREATE REL TABLE Follows(FROM User TO User, since DATE);
```

Consider that you try to directly drop the `User` node table without first dropping the associated
relationship tables.
```cypher
DROP TABLE User
```
This will raise the following exception:
```
Binder exception: Cannot delete a node table with edges. It is on the edges of rel: Follows.
```

You can first drop the `Follows` relationship table, and subsequently the `User` table as follows:

```cypher
DROP TABLE Follows
```
```table
┌─────────────────────────────────────┐
│ RelTable: Follows has been dropped. │
└─────────────────────────────────────┘
```
```cypher
DROP TABLE User
```
```table
┌───────────────────────────────────┐
│ NodeTable: User has been dropped. │
└───────────────────────────────────┘
```

## Drop if exists
If the given table does not exist in the database, Kuzu throws an exception when you try to drop it.
To avoid the exception being raised, use the `IF EXISTS` clause. This instructs Kuzu to do nothing when
the given table name does not exist in the database.

Example:
```cypher
DROP TABLE IF EXISTS UW
```
This query tells Kuzu to drop the `UW` table only if it exists.
