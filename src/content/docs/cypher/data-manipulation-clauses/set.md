---
title: Set
description: Update properties of node or relationship records to new values.
---

The `SET` clause is similar to that in SQL. It allows updating properties of node or relationship records (possibly `NULL`).

We will use the example database for demonstration, whose schema and data import commands are given [here](/cypher/data-manipulation-clauses/example-database).

## Set node properties

### Set single label node properties
The following query sets the age property of the User node with name Adam to 50 (which is 30 in the original database).

```cypher
MATCH (u:User) 
WHERE u.name = 'Adam' 
SET u.age = 50
RETURN u.*;
```
```table
┌────────┬───────┐
│ u.name │ u.age │
│ STRING │ INT64 │
├────────┼───────┤
│ Adam   │ 50    │
└────────┴───────┘
```
Similarly the following sets Adam's age property to NULL.
Query:
```cypher
MATCH (u:User) 
WHERE u.name = 'Adam' 
SET u.age = NULL
RETURN u.*;
```
```table
┌────────┬───────┐
│ u.name │ u.age │
│ STRING │ INT64 │
├────────┼───────┤
│ Adam   │       │
└────────┴───────┘
```

### Set multi label node properties
Kuzu also supports updating node properties with multi-label nodes.
```cypher
MATCH (u)
SET u.population = 0
RETURN label(u), u.name, u.population;
```
```table
┌──────────────────────────┬───────────┬──────────────┐
│ LABEL(u._ID,[User,City]) │ u.name    │ u.population │
│ STRING                   │ STRING    │ INT64        │
├──────────────────────────┼───────────┼──────────────┤
│ City                     │ Waterloo  │ 0            │
│ City                     │ Kitchener │ 0            │
│ City                     │ Guelph    │ 0            │
│ User                     │ Adam      │              │
│ User                     │ Karissa   │              │
│ User                     │ Zhang     │              │
│ User                     │ Noura     │              │
│ User                     │ Bob       │              │
│ User                     │ Alice     │              │
│ User                     │ Dimitri   │              │
└──────────────────────────┴───────────┴──────────────┘
```

Note that the node table `User` doesn't contain the `population` property, so tuples belonging to the `User` table (showing `NULL` in the output) are ignored during `SET` operations.

## Set relationship properties

### Set single label relationship properties
The following query sets the `since` property of the Follows relationship(From Adam to Karissa) to 2012 (which is 2020 in the original database).

```cypher
MATCH (u0:User)-[f:Follows]->(u1:User)
WHERE u0.name = 'Adam' AND u1.name = 'Karissa'
SET f.since = 2012
RETURN f;
```
```table
┌───────────────────────────────────────────────────────┐
│ f                                                     │
│ REL                                                   │
├───────────────────────────────────────────────────────┤
│ (0:0)-{_LABEL: Follows, _ID: 2:0, since: 2012}->(0:1) │
└───────────────────────────────────────────────────────┘
```

### Set multi label relationship properties
```cypher
MATCH (u0)-[f]->()
WHERE u0.name = 'Adam'
SET f.since = 1999
RETURN f;
```
```table
┌───────────────────────────────────────────────────────┐
│ f                                                     │
│ REL                                                   │
├───────────────────────────────────────────────────────┤
│ (0:0)-{_LABEL: Follows, _ID: 2:0, since: 1999}->(0:1) │
│ (0:0)-{_LABEL: Follows, _ID: 2:1, since: 1999}->(0:2) │
│ (0:0)-{_LABEL: Follows, _ID: 2:4, since: 1999}->(0:3) │
│ (0:0)-{_LABEL: LivesIn, _ID: 3:0}->(1:0)              │
└───────────────────────────────────────────────────────┘
```
