---
title: Match
description: MATCH is the clause where you define a graph pattern, i.e., a join of node or relationship records, to find in the database.
---

MATCH is the clause where you define a "graph pattern", i.e., a join of node or relationship records,
to find in the database[^1]. MATCH is often accompanied by [WHERE](/cypher/query-clauses/where) (equivalent to SQL's WHERE clause)
to define more predicates on the patterns that are matched.

You can find the example dataset for this guide [here](/cypher/query-clauses/example-database).

## Match nodes

### Match nodes with a single label
The query below matches variable `a` to nodes with label `User` and returns `a`, which 
is a shortcut in Cypher to return all properties of the node together with the label and internal ID of nodes that variable `a` matches.

```cypher
MATCH (a:User)
RETURN a;
```
```table
┌──────────────────────────────────────────────────┐
│ a                                                │
│ NODE                                             │
├──────────────────────────────────────────────────┤
│ {_ID: 0:0, _LABEL: User, name: Adam, age: 30}    │
│ {_ID: 0:1, _LABEL: User, name: Karissa, age: 40} │
│ {_ID: 0:2, _LABEL: User, name: Zhang, age: 50}   │
│ {_ID: 0:3, _LABEL: User, name: Noura, age: 25}   │
└──────────────────────────────────────────────────┘
```

### Match nodes with multiple labels
The query below matches variable `a` to nodes with label `User` or label `City`. `RETURN a` will return all properties of the node together with the label and internal ID. Properties not present in a label will be returned as `NULL` values (e.g., `population` does not exist in `User`). Properties present in multiple labels are expected to have the same data type (e.g., `name` has `STRING` data type in `User` and `City`).

```cypher
MATCH (a:User:City)
RETURN a;
```

```table
┌───────────────────────────────────────────────────────────────┐
│ a                                                             │
│ NODE                                                          │
├───────────────────────────────────────────────────────────────┤
│ {_ID: 1:0, _LABEL: City, name: Waterloo, population: 150000}  │
│ {_ID: 1:1, _LABEL: City, name: Kitchener, population: 200000} │
│ {_ID: 1:2, _LABEL: City, name: Guelph, population: 75000}     │
│ {_ID: 0:0, _LABEL: User, name: Adam, age: 30}                 │
│ {_ID: 0:1, _LABEL: User, name: Karissa, age: 40}              │
│ {_ID: 0:2, _LABEL: User, name: Zhang, age: 50}                │
│ {_ID: 0:3, _LABEL: User, name: Noura, age: 25}                │
└───────────────────────────────────────────────────────────────┘
```

### Match nodes with any label
The query below matches variable `a` to nodes with any label. In the example database, it is equivalent to `MATCH (a:User:City) RETURN a;`.

```cypher
MATCH (a)
RETURN a;
```

```table
┌───────────────────────────────────────────────────────────────┐
│ a                                                             │
│ NODE                                                          │
├───────────────────────────────────────────────────────────────┤
│ {_ID: 0:0, _LABEL: User, name: Adam, age: 30}                 │
│ {_ID: 0:1, _LABEL: User, name: Karissa, age: 40}              │
│ {_ID: 0:2, _LABEL: User, name: Zhang, age: 50}                │
│ {_ID: 0:3, _LABEL: User, name: Noura, age: 25}                │
│ {_ID: 1:0, _LABEL: City, name: Waterloo, population: 150000}  │
│ {_ID: 1:1, _LABEL: City, name: Kitchener, population: 200000} │
│ {_ID: 1:2, _LABEL: City, name: Guelph, population: 75000}     │
└───────────────────────────────────────────────────────────────┘
```

## Match relationships

### Match directed relationships with a label
Similar to binding variables to node records, you can bind variables to relationship records and return them. You can specify the direction of relationship by `<-` or `->`. The following query finds all `a` Users that follow a `b` User through an outgoing relationship from `a`, and returns name of `a`, relationship `e`, and name of `b`, where `e` will match the relationship from `a` to `b`.

```cypher
MATCH (a:User)-[e:Follows]->(b:User)
RETURN a.name, e, b.name;
```

```table
┌─────────┬───────────────────────────────────────────────────────┬─────────┐
│ a.name  │ e                                                     │ b.name  │
│ STRING  │ REL                                                   │ STRING  │
├─────────┼───────────────────────────────────────────────────────┼─────────┤
│ Adam    │ (0:0)-{_LABEL: Follows, _ID: 2:0, since: 2020}->(0:1) │ Karissa │
│ Adam    │ (0:0)-{_LABEL: Follows, _ID: 2:1, since: 2020}->(0:2) │ Zhang   │
│ Karissa │ (0:1)-{_LABEL: Follows, _ID: 2:2, since: 2021}->(0:2) │ Zhang   │
│ Zhang   │ (0:2)-{_LABEL: Follows, _ID: 2:3, since: 2022}->(0:3) │ Noura   │
└─────────┴───────────────────────────────────────────────────────┴─────────┘
```

The following query matches all the relationships through an incoming relationship from `a` (so `a` and `b` are swapped in output):
```cypher
MATCH (a:User)<-[e:Follows]-(b:User)
RETURN a.name, e, b.name;
```

```table
┌─────────┬───────────────────────────────────────────────────────┬─────────┐
│ a.name  │ e                                                     │ b.name  │
│ STRING  │ REL                                                   │ STRING  │
├─────────┼───────────────────────────────────────────────────────┼─────────┤
│ Karissa │ (0:0)-{_LABEL: Follows, _ID: 2:0, since: 2020}->(0:1) │ Adam    │
│ Zhang   │ (0:0)-{_LABEL: Follows, _ID: 2:1, since: 2020}->(0:2) │ Adam    │
│ Zhang   │ (0:1)-{_LABEL: Follows, _ID: 2:2, since: 2021}->(0:2) │ Karissa │
│ Noura   │ (0:2)-{_LABEL: Follows, _ID: 2:3, since: 2022}->(0:3) │ Zhang   │
└─────────┴───────────────────────────────────────────────────────┴─────────┘
```

### Match relationships with multi labels
Similar to matching nodes with multiple labels, you can bind variables to relationships with multiple labels. The query below finds all users `a` that follow user `b` or live in city `b`.

```cypher
MATCH (a:User)-[e:Follows|:LivesIn]->(b:User:City)
RETURN a.name, e, b.name;
```

```table
┌─────────┬───────────────────────────────────────────────────────┬───────────┐
│ a.name  │ e                                                     │ b.name    │
│ STRING  │ REL                                                   │ STRING    │
├─────────┼───────────────────────────────────────────────────────┼───────────┤
│ Adam    │ (0:0)-{_LABEL: Follows, _ID: 2:0, since: 2020}->(0:1) │ Karissa   │
│ Adam    │ (0:0)-{_LABEL: Follows, _ID: 2:1, since: 2020}->(0:2) │ Zhang     │
│ Karissa │ (0:1)-{_LABEL: Follows, _ID: 2:2, since: 2021}->(0:2) │ Zhang     │
│ Zhang   │ (0:2)-{_LABEL: Follows, _ID: 2:3, since: 2022}->(0:3) │ Noura     │
│ Adam    │ (0:0)-{_LABEL: LivesIn, _ID: 3:0}->(1:0)              │ Waterloo  │
│ Karissa │ (0:1)-{_LABEL: LivesIn, _ID: 3:1}->(1:0)              │ Waterloo  │
│ Zhang   │ (0:2)-{_LABEL: LivesIn, _ID: 3:2}->(1:1)              │ Kitchener │
│ Noura   │ (0:3)-{_LABEL: LivesIn, _ID: 3:3}->(1:2)              │ Guelph    │
└─────────┴───────────────────────────────────────────────────────┴───────────┘
```

### Match relationships with any label
Similar to matching nodes with any label, you can bind variables to relationships with any label by not specifying a label. The query below finds all relationships in the database.
```cypher
MATCH ()-[e]->()
RETURN e;
```

```table
┌───────────────────────────────────────────────────────┐
│ e                                                     │
│ REL                                                   │
├───────────────────────────────────────────────────────┤
│ (0:0)-{_LABEL: Follows, _ID: 2:0, since: 2020}->(0:1) │
│ (0:0)-{_LABEL: Follows, _ID: 2:1, since: 2020}->(0:2) │
│ (0:1)-{_LABEL: Follows, _ID: 2:2, since: 2021}->(0:2) │
│ (0:2)-{_LABEL: Follows, _ID: 2:3, since: 2022}->(0:3) │
│ (0:0)-{_LABEL: LivesIn, _ID: 3:0}->(1:0)              │
│ (0:1)-{_LABEL: LivesIn, _ID: 3:1}->(1:0)              │
│ (0:2)-{_LABEL: LivesIn, _ID: 3:2}->(1:1)              │
│ (0:3)-{_LABEL: LivesIn, _ID: 3:3}->(1:2)              │
└───────────────────────────────────────────────────────┘
```

### Match undirected relationships
You can match a relationship in both directions by not specifying a direction (i.e., using `-`). The following query finds all users who either follow or are followed by `Karissa`. 

```cypher
MATCH (a:User)-[e:Follows]-(b:User)
WHERE a.name = 'Karissa'
RETURN b.name;
```

```table
┌────────┐
│ b.name │
│ STRING │
├────────┤
│ Adam   │
│ Zhang  │
└────────┘
```

### Omit binding variables to nodes or relationships
You can also omit binding a variable to a node or relationship in your graph patterns if 
you will not use them in somewhere else in your query (e.g., WHERE or RETURN). For example, below, we query for 2-hop paths searching for "the cities of users that `a` follows".
Because we do not need to return the users that `a` follows or the properties
of the `Follows` and `LivesIn` edges that form these 2-paths, we can omit giving variable names to them.

```cypher
MATCH (a:User)-[:Follows]->(:User)-[:LivesIn]->(c:City)
WHERE a.name = "Adam"
RETURN a, c.name, c.population;
```

```table
┌───────────────────────────────────────────────┬───────────┬──────────────┐
│ a                                             │ c.name    │ c.population │
│ NODE                                          │ STRING    │ INT64        │
├───────────────────────────────────────────────┼───────────┼──────────────┤
│ {_ID: 0:0, _LABEL: User, name: Adam, age: 30} │ Waterloo  │ 150000       │
│ {_ID: 0:0, _LABEL: User, name: Adam, age: 30} │ Kitchener │ 200000       │
└───────────────────────────────────────────────┴───────────┴──────────────┘
```

### Match multiple patterns
Although paths can be matched in a single pattern, some patterns, in particular
cyclic patterns, require specifying multiple patterns/paths that form the pattern.
These multiple paths are separated by a comma. The following is a (directed) triangle query and returns the only triangle in the database between `Adam`, `Karissa`, and `Zhang`.

```cypher
MATCH (a:User)-[:Follows]->(b:User)-[:Follows]->(c:User), (a)-[:Follows]->(c)
RETURN a.name, b.name, c.name;
```

```table
┌────────┬─────────┬────────┐
│ a.name │ b.name  │ c.name │
│ STRING │ STRING  │ STRING │
├────────┼─────────┼────────┤
│ Adam   │ Karissa │ Zhang  │
└────────┴─────────┴────────┘
```

Note that in the query node variables `a` and `c` appear twice, once on each of the 2 paths
in the query. In such cases, their labels need to be specified *only the first time they appear
in the pattern*. In the above query `a` and `c`'s labels are defined on the first/left path, 
so you don't have to specify them on the right path (though you still can).

### Equality predicates on node/relationship properties
The [WHERE](/cypher/query-clauses/where) clause is the main clause to specify arbitrary predicates on the nodes and relationships in your patterns (e.g., `a.age < b.age` in where `a` and `b` bind to `User` nodes). 
As a syntactic sugar, Cypher allows *equality predicates* to be matched on
nodes and edges using the `{prop1 : value1, prop2 : value2, ...}` syntax. For example: 

```cypher
MATCH (a:User)-[e:Follows {since: 2020}]->(b:User {name: "Zhang"})
RETURN a, e.since, b.name;
```
is syntactic sugar for:

```cypher
MATCH (a:User)-[e:Follows]->(b:User)
WHERE e.since = 2020 AND b.name = "Zhang"
RETURN a, e.since, b.name;
```
and both queries output:
```table
┌───────────────────────────────────────────────┬─────────┬────────┐
│ a                                             │ e.since │ b.name │
│ NODE                                          │ INT64   │ STRING │
├───────────────────────────────────────────────┼─────────┼────────┤
│ {_ID: 0:0, _LABEL: User, name: Adam, age: 30} │ 2020    │ Zhang  │
└───────────────────────────────────────────────┴─────────┴────────┘
```

## Match recursive relationships
You can also find recursive relationships (that are of variable length) between node records.
Specifically, you can find variable-length
connections between nodes by specifying in the relationship patterns,
e.g., `-[:Label*min..max]->`, where `min` and `max` specify the minimum and the maximum number of hops[^2].
The following query finds all Users that "Adam" follows within 1 to 2 hops and returns their names as well as length of the path.
```cypher
MATCH (a:User)-[e:Follows*1..2]->(b:User) 
WHERE a.name = 'Adam'
RETURN b.name, length(e) AS length;
```

```table
┌─────────┬────────┐
│ b.name  │ length │
│ STRING  │ INT64  │
├─────────┼────────┤
│ Noura   │ 2      │
│ Zhang   │ 2      │
│ Zhang   │ 1      │
│ Karissa │ 1      │
└─────────┴────────┘
```
- Karissa is found through `Adam -> Karissa`
- Zhang is found through `Adam -> Zhang` and `Adam -> Karissa -> Zhang`
- Noura is found through `Adam -> Zhang -> Noura`

Similar to matching relationships, you can match undirected relationships or relationship with multiple labels.
The following query finds all nodes excluding "Noura" that connect to "Noura" in both directions through any relationship with 2 hops.
```cypher
MATCH (a:User)-[e*2..2]-(b) 
WHERE a.name = 'Noura' AND b.name <> 'Noura'
RETURN b.name, length(e) AS length;
```

```table
┌───────────┬────────┐
│ b.name    │ length │
│ STRING    │ INT64  │
├───────────┼────────┤
│ Kitchener │ 2      │
│ Adam      │ 2      │
│ Karissa   │ 2      │
└───────────┴────────┘
```
- Adam is found through `Noura <- Zhang -> Adam`
- Karissa is found through `Noura <- Zhang -> Karissa`
- Kitchener is found through `Noura <- Zhang -> Kitchener`

### Return recursive relationships

A recursive relationship has the logical data type `RECURSIVE_REL` and is physically represented as `STRUCT{LIST[NODE], LIST[REL]}`. Returning a recursive relationship will return all properties 
```cypher
MATCH (a:User)-[e:Follows* 4..4]-(b:User)
WHERE a.name = 'Zhang'
RETURN b.name, properties(nodes(e), 'name'), properties(rels(e), '_ID');
```

```table
┌─────────┬───────────────────────────┬─────────────────────────┐
│ b.name  │ PROPERTIES(NODES(e),name) │ PROPERTIES(RELS(e),_ID) │
│ STRING  │ STRING[]                  │ INTERNAL_ID[]           │
├─────────┼───────────────────────────┼─────────────────────────┤
│ Adam    │ [Adam,Karissa,Zhang]      │ [1:1,1:0,1:2,1:1]       │
│ Adam    │ [Karissa,Adam,Zhang]      │ [1:2,1:0,1:1,1:1]       │
│ Adam    │ [Noura,Zhang,Karissa]     │ [1:3,1:3,1:2,1:0]       │
│ Adam    │ [Karissa,Zhang,Karissa]   │ [1:2,1:2,1:2,1:0]       │
│ Adam    │ [Adam,Zhang,Karissa]      │ [1:1,1:1,1:2,1:0]       │
│ Adam    │ [Karissa,Adam,Karissa]    │ [1:2,1:0,1:0,1:0]       │
│ Karissa │ [Adam,Karissa,Zhang]      │ [1:1,1:0,1:2,1:2]       │
│ Karissa │ [Karissa,Adam,Zhang]      │ [1:2,1:0,1:1,1:2]       │
│ Karissa │ [Noura,Zhang,Adam]        │ [1:3,1:3,1:1,1:0]       │
│ Karissa │ [Karissa,Zhang,Adam]      │ [1:2,1:2,1:1,1:0]       │
│ Karissa │ [Adam,Zhang,Adam]         │ [1:1,1:1,1:1,1:0]       │
│ Karissa │ [Adam,Karissa,Adam]       │ [1:1,1:0,1:0,1:0]       │
│ Zhang   │ [Noura,Zhang,Noura]       │ [1:3,1:3,1:3,1:3]       │
│ Zhang   │ [Karissa,Zhang,Noura]     │ [1:2,1:2,1:3,1:3]       │
│ Zhang   │ [Adam,Zhang,Noura]        │ [1:1,1:1,1:3,1:3]       │
│ Zhang   │ [Noura,Zhang,Karissa]     │ [1:3,1:3,1:2,1:2]       │
│ Zhang   │ [Karissa,Zhang,Karissa]   │ [1:2,1:2,1:2,1:2]       │
│ Zhang   │ [Adam,Zhang,Karissa]      │ [1:1,1:1,1:2,1:2]       │
│ Zhang   │ [Karissa,Adam,Karissa]    │ [1:2,1:0,1:0,1:2]       │
│ Zhang   │ [Noura,Zhang,Adam]        │ [1:3,1:3,1:1,1:1]       │
│ Zhang   │ [Karissa,Zhang,Adam]      │ [1:2,1:2,1:1,1:1]       │
│ Zhang   │ [Adam,Zhang,Adam]         │ [1:1,1:1,1:1,1:1]       │
│ Zhang   │ [Adam,Karissa,Adam]       │ [1:1,1:0,1:0,1:1]       │
│ Noura   │ [Adam,Karissa,Zhang]      │ [1:1,1:0,1:2,1:3]       │
│ Noura   │ [Karissa,Adam,Zhang]      │ [1:2,1:0,1:1,1:3]       │
└─────────┴───────────────────────────┴─────────────────────────┘
```

By default, recursive relationship follows a `WALK` semantic, in which nodes and relationships can be visited repeatedly. 
Kuzu also supports `TRAIL` and `ACYCLIC` semantics, which can be specified inside the recursive pattern after `*`.

A `TRAIL` is a walk in which all relationships are distinct.

```cypher
MATCH (a:User)-[e:Follows* trail 4..4]-(b:User)
      WHERE a.name = 'Zhang'
      RETURN b.name, properties(nodes(e), 'name');
```

```table
┌────────┬───────────────────────────┐
│ b.name │ PROPERTIES(NODES(e),name) │
│ STRING │ STRING[]                  │
├────────┼───────────────────────────┤
│ Noura  │ [Adam,Karissa,Zhang]      │
│ Noura  │ [Karissa,Adam,Zhang]      │
└────────┴───────────────────────────┘
```

The example above doesn't include any recursive relationships that contain redundant internal IDs.

A `ACYCLIC` is a walk in which all nodes are distinct.
```cypher
MATCH (a:User)-[e:Follows* acyclic 4..4]-(b:User)
      WHERE a.name = 'Zhang'
      RETURN b.name, properties(nodes(e), 'name');
```

```table
┌─────────┬───────────────────────────┐
│ b.name  │ PROPERTIES(NODES(e),name) │
│ STRING  │ STRING[]                  │
├─────────┼───────────────────────────┤
│ Adam    │ [Adam,Karissa,Zhang]      │
│ Adam    │ [Karissa,Adam,Zhang]      │
│ Adam    │ [Noura,Zhang,Karissa]     │
│ Adam    │ [Adam,Zhang,Karissa]      │
│ Karissa │ [Adam,Karissa,Zhang]      │
│ Karissa │ [Karissa,Adam,Zhang]      │
│ Karissa │ [Noura,Zhang,Adam]        │
│ Karissa │ [Karissa,Zhang,Adam]      │
│ Zhang   │ [Karissa,Zhang,Noura]     │
│ Zhang   │ [Adam,Zhang,Noura]        │
│ Zhang   │ [Noura,Zhang,Karissa]     │
│ Zhang   │ [Adam,Zhang,Karissa]      │
│ Zhang   │ [Noura,Zhang,Adam]        │
│ Zhang   │ [Karissa,Zhang,Adam]      │
│ Noura   │ [Adam,Karissa,Zhang]      │
│ Noura   │ [Karissa,Adam,Zhang]      │
└─────────┴───────────────────────────┘
```

The example above doesn't include recursive patterns that contain any repeated nodes.

:::note[Note]
An `ACYCLIC` recursive relationship is different from an `acyclic` path in that the acyclic recursive relationship doesn't take the source and destination nodes into consideration, while the acyclic path takes both into consideration.
```cypher
MATCH p=(a:User)-[e:Follows* 4..4]-(b:User)
            WHERE a.name = 'Zhang' and is_acyclic(p)
            RETURN p;
```
The above query returns empty result as we apply the filter `is_acyclic(p)` to force returned path be acyclic.
:::

### Filter recursive relationships
We also support running predicates on recursive relationships to constrain the relationship being traversed.

The following query finds the names of users and the number of paths that are followed between 1-2 hops from Adam by people with age more than 45 and before 2022.
```cypher
MATCH p = (a:User)-[:Follows*1..2 (r, n | WHERE r.since < 2022 AND n.age > 45) ]->(b:User)
WHERE a.name = 'Adam' 
RETURN b.name, COUNT(*);
```

```table
┌─────────┬──────────────┐
│ b.name  │ COUNT_STAR() │
│ STRING  │ INT64        │
├─────────┼──────────────┤
│ Zhang   │ 1            │
│ Karissa │ 1            │
└─────────┴──────────────┘
```

Our filter grammar is similar to that used by [Memgraph](https://memgraph.com/docs/memgraph/reference-guide/built-in-graph-algorithms). For example, in Cypher list comprehensions. The first variable represents intermediate relationships and the second one represents intermediate nodes. Currently Kuzu only supports predicates that can be evaluated just on node (`n.age > 45`) or just on relationship (`r.since < 2022`) or conjunctive of such predicates (`n.age > 45 AND r.since < 2022`). Complex predicates that involves both node and relationship (`n.age > 45 OR r.since < 2022`) is not supported.

### Project properties of intermediate nodes/relationships
You can project a subset of properties for the intermediate nodes and relationships that bind within a recursive
relationship. You can define the projection list of intermediate nodes and relationships within two curly brackets `{}` `{}` at 
the end of the recursive relationship. The first `{}` is used for projecting relationship properties and the second `{}` for 
node properties. Currently, Kuzu only supports directly projecting properties and not of expressions using
the properties. Projecting properties of intermediate nodes and relationships can improve both performance and memory footprint.

Below is an example that projects only the `since` property of the intermediate relationship and the `name` property of the 
intermediate nodes that will bind to the variable length relationship pattern of `e`. Readers can assume
that there are other properties than `since` on the `Follow` relationship table for our purposes (in our running example, the `User` nodes already have a second property `age`, which will be removed from the output as shown below).

```cypher
MATCH (a:User)-[e:Follows*1..2 (r, n | WHERE r.since > 2020 | {r.since}, {n.name})]->(b:User) 
RETURN nodes(e), rels(e);
```
Returns:
```table
┌─────────────────────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ NODES(e)                                │ RELS(e)                                                                                                       │
│ NODE[]                                  │ REL[]                                                                                                         │
├─────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [{_ID: 0:2, _LABEL: User, name: Zhang}] │ [(0:1)-{_LABEL: Follows, _ID: 2:2, since: 2021}->(0:2),(0:2)-{_LABEL: Follows, _ID: 2:3, since: 2022}->(0:3)] │
│ []                                      │ [(0:1)-{_LABEL: Follows, _ID: 2:2, since: 2021}->(0:2)]                                                       │
│ []                                      │ [(0:2)-{_LABEL: Follows, _ID: 2:3, since: 2022}->(0:3)]                                                       │
└─────────────────────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```
As can be seen in the output, the nodes that bind to `e` contain only the `name` property and the relationships that
bind to `e` contain only the `since` property.


### Shortest path

On top of variable length relationships, kuzu also support different shortest path algorithms.

#### Single shortest path

**Syntax**

`-[:Label* SHORTEST 1..max]-`

The following query finds a shortest path between `Adam` and any city and returns city name as well as length of the path.
```cypher
MATCH (a:User)-[e* SHORTEST 1..4]->(b:City) 
WHERE a.name = 'Adam'
RETURN b.name, length(e) AS length;
```

```table
┌───────────┬────────┐
│ b.name    │ length │
│ STRING    │ INT64  │
├───────────┼────────┤
│ Guelph    │ 3      │
│ Kitchener │ 2      │
│ Waterloo  │ 1      │
└───────────┴────────┘
```

#### All shortest path

**Syntax**

`-[:Label* ALL SHORTEST 1..max]-`

The following query finds all shortest paths between `Zhang` and `Waterloo`.
```cypher
MATCH p = (a)-[* ALL SHORTEST 1..3 ]-(b) 
WHERE a.name = 'Zhang' AND b.name = 'Waterloo' 
RETURN COUNT(*) AS num_shortest_path;
```

```table
┌───────────────────┐
│ num_shortest_path │
│ INT64             │
├───────────────────┤
│ 2                 │
└───────────────────┘
```

#### Weighted shortest path

**Syntax**

`-[:Label* WSHORTEST(rel property) 1..max]-`


**Example**

We add a `score` property to `Follows` and manually assign a score to each `Follows` edge. The modified database is shown as
```cypher
MATCH (a:User)-[e:Follows]->(b:User) RETURN a.name, e.*, b.name;
```
```table
┌─────────┬─────────┬───────────┬─────────┐
│ a.name  │ e.since │ e.score   │ b.name  │
│ STRING  │ INT64   │ DOUBLE    │ STRING  │
├─────────┼─────────┼───────────┼─────────┤
│ Adam    │ 2020    │ 5.000000  │ Karissa │
│ Adam    │ 2020    │ 20.000000 │ Zhang   │
│ Karissa │ 2021    │ 6.000000  │ Zhang   │
│ Zhang   │ 2022    │ 22.000000 │ Noura   │
└─────────┴─────────┴───────────┴─────────┘
```
And then we query the weighted shortest path from `Adam` to other users through `score` property.
```cypher
MATCH p=(a:User)-[e:Follows* WSHORTEST(score)]->(b:User) 
WHERE a.name='Adam' 
RETURN properties(nodes(p), 'name'), cost(e);
```
```table
┌────────────────────────────┬───────────┐
│ PROPERTIES(NODES(p),name)  │ e_cost    │
│ STRING[]                   │ DOUBLE    │
├────────────────────────────┼───────────┤
│ [Adam,Karissa,Zhang,Noura] │ 33.000000 │
│ [Adam,Karissa,Zhang]       │ 11.000000 │
│ [Adam,Karissa]             │ 5.000000  │
└────────────────────────────┴───────────┘
```

#### All weighted shortest path

**Syntax**

`-[:Label* ALL WSHORTEST(rel property) 1..max]-`

**Example**

We insert one more `Follows` edge between `Adam` and `Zhang` with score=11. The modified database is shown as
```cypher
MATCH (a:User)-[e:Follows]->(b:User) RETURN a.name, e.*, b.name;
```
```table
┌─────────┬─────────┬───────────┬─────────┐
│ a.name  │ e.since │ e.score   │ b.name  │
│ STRING  │ INT64   │ DOUBLE    │ STRING  │
├─────────┼─────────┼───────────┼─────────┤
│ Adam    │ 2020    │ 5.000000  │ Karissa │
│ Adam    │ 2020    │ 20.000000 │ Zhang   │
│ Karissa │ 2021    │ 6.000000  │ Zhang   │
│ Zhang   │ 2022    │ 22.000000 │ Noura   │
│ Adam    │ 2024    │ 11.000000 │ Zhang   │
└─────────┴─────────┴───────────┴─────────┘
```
Then we can query all shortest paths from `Adam` to other users through `score` property.
```cypher
MATCH p=(a:User)-[e:Follows* ALL WSHORTEST(score)]->(b:User) 
WHERE a.name='Adam' 
RETURN properties(nodes(p), 'name'), cost(e);
```
```table
┌────────────────────────────┬───────────┐
│ PROPERTIES(NODES(p),name)  │ e_cost    │
│ STRING[]                   │ DOUBLE    │
├────────────────────────────┼───────────┤
│ [Adam,Karissa,Zhang,Noura] │ 33.000000 │
│ [Adam,Zhang,Noura]         │ 33.000000 │
│ [Adam,Karissa,Zhang]       │ 11.000000 │
│ [Adam,Zhang]               │ 11.000000 │
│ [Adam,Karissa]             │ 5.000000  │
└────────────────────────────┴───────────┘
```

:::note[Note]
To avoid ambiguity, Kuzu forces the lower bound of shortest path to be 1.
There are two interpretations when the lower bound is greater than 1:
- Compute shortest path and then return the path whose length is greater than the lower bound.
- Compute the path with length greater than lower bound and then return the shortest path.
:::

## Named paths
Kuzu treats paths as first-class citizens. You can assign a named variable to a path (i.e., connected graph) and use it later on.

The following query returns all paths between `Adam` and `Karissa`.
```cypher
MATCH p = (a:User)-[:Follows]->(b:User) 
WHERE a.name = 'Adam' AND b.name = 'Karissa' 
RETURN p;
```

```table
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ p                                                                                   │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ {_NODES: [{_ID: 0:0, _LABEL: User, name: Adam, age: 30},{_ID: 0:1, _LABEL: Us...    │
└─────────────────────────────────────────────────────────────────────────────────────┘
```
Named paths can also be assigned to recursive graph patterns.
```cypher
MATCH p = (a:User)-[:Follows*1..2]->(:User)-[:LivesIn]->(:City) 
WHERE a.name = 'Adam' 
RETURN p;
```

```table
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ p                                                                                   │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ {_NODES: [{_ID: 0:0, _LABEL: User, name: Adam, age: 30, },{_ID: 0:1, _LABEL: ...    │
│ {_NODES: [{_ID: 0:0, _LABEL: User, name: Adam, age: 30, },{_ID: 0:2, _LABEL: ...    │
│ {_NODES: [{_ID: 0:0, _LABEL: User, name: Adam, age: 30, },{_ID: 0:1, _LABEL: ...    │
│ {_NODES: [{_ID: 0:0, _LABEL: User, name: Adam, age: 30, },{_ID: 0:2, _LABEL: ...    │
└─────────────────────────────────────────────────────────────────────────────────────┘
```
Multiple named path can appear in a single `MATCH` clause.
```cypher
MATCH p1 = (a:User)-[:Follows]->(b:User), p2 = (b)-[:LivesIn]->(:City) 
WHERE a.name = 'Adam' 
RETURN p1, p2;
```

```table
┌────────────────────────────────────────────────────────────────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────┐
│ p1                                                                                     │ p2                                                                                  │
├────────────────────────────────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
│ {_NODES: [{_ID: 0:0, _LABEL: User, name: Adam, age: 30},{_ID: 0:1, _LABEL: Us...       │ {_NODES: [{_ID: 0:1, _LABEL: User, name: Karissa, age: 40, },{_ID: 1:0, _LABE...    │
│ {_NODES: [{_ID: 0:0, _LABEL: User, name: Adam, age: 30},{_ID: 0:2, _LABEL: Us...       │ {_NODES: [{_ID: 0:2, _LABEL: User, name: Zhang, age: 50, },{_ID: 1:1, _LABEL=...    │
└────────────────────────────────────────────────────────────────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

### Extracting nodes and relationships from a path
A named path has the logical data type [`RECURSIVE_REL`](/cypher/data-types/#recursive_rel). You can access nodes and relationships within a named path through `nodes(p)` and `rels(p)` function calls.

```cypher
MATCH p = (a:User)-[:Follows*1..2]->(:User) 
WHERE a.name = 'Adam' 
RETURN nodes(p), (rels(p)[1]).since AS since;
```

```table
┌─────────────────────────────────────────────────────────────────────────────────────┬─────────┐
│ NODES(p)                                                                            │ since   │
├─────────────────────────────────────────────────────────────────────────────────────┼─────────┤
│ [{_ID: 0:0, _LABEL: User, name: Adam, age: 30},{_ID: 0:1, _LABEL: User, name:...    │ 2020    │
│ [{_ID: 0:0, _LABEL: User, name: Adam, age: 30},{_ID: 0:1, _LABEL: User, name:...    │ 2020    │
│ [{_ID: 0:0, _LABEL: User, name: Adam, age: 30},{_ID: 0:2, _LABEL: User, name:...    │ 2020    │
│ [{_ID: 0:0, _LABEL: User, name: Adam, age: 30},{_ID: 0:2, _LABEL: User, name:...    │ 2020    │
└─────────────────────────────────────────────────────────────────────────────────────┴─────────┘
```
More recursive relationship functions can be found [here](/cypher/expressions/recursive-rel-functions).

[^1]: `MATCH` is similar to the `FROM` clause of SQL, where the list of tables that need to be joined are specified. 
[^2]: Max number of hop will be set to 30 if omitted. You can change the configuration through `SET` statement.
