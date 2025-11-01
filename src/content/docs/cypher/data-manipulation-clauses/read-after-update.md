---
title: RETURN After Update
description: "Access and return data immediately after CREATE, MERGE, SET, or DELETE operations"
---

The `RETURN` clause following an update clause has access to the variables that are used in the immediately preceding update clause.

For `CREATE`, the data available to the immediately following `RETURN` statement is the newly inserted node/relationship.
```cypher
CREATE (u:User {name: 'Alice', age: 35}) RETURN u.*;
```
```table
┌────────┬───────┐
│ u.name │ u.age │
│ STRING │ INT64 │
├────────┼───────┤
│ Alice  │ 35    │
└────────┴───────┘
```

For `SET`, the data available to the `RETURN` statement is the updated value.
```cypher
MATCH (u:User) WHERE u.name = "Adam"
SET u.name = "Aisha" RETURN u.*;
```
```table
┌────────┬───────┐
│ u.name │ u.age │
│ STRING │ INT64 │
├────────┼───────┤
│ Aisha  │ 30    │
└────────┴───────┘
```

For `DELETE`, the data available to the `RETURN` statement is the deleted node/relationship record.
```cypher
MATCH (u:User) WHERE u.name = 'Adam' 
DETACH DELETE u RETURN u.*;
```
```table
┌────────┬───────┐
│ u.name │ u.age │
│ STRING │ INT64 │
├────────┼───────┤
│ Adam   │ 30    │
└────────┴───────┘
```
