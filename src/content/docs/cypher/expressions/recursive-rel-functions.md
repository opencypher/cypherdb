---
title: Recursive relationship functions
description: Functions that are used to manipulate paths
---

| Function | Description |
| ----------- | ----------- |
| `NODES`| returns all nodes from a path |
| `RELS` | returns all relationships from a path |
| `PROPERTIES` | return a given property from nodes or relationships |
| `IS_TRAIL` | check if a path contains repeated relationships |
| `IS_ACYCLIC` | check if a path contains repeated nodes |
| `LENGTH` | returns the number of relationships (path length) in a path |
| `COST` | returns the cost of a weighted path |

### NODES

Returns all nodes from a path.

| Input type | Output type |
| ----------- | ----------- |
| `RECURSIVE_REL` | `LIST[NODE]` |


```cypher
MATCH p = (a:User)-[:Follows*1..2]->(:User) 
WHERE a.name = 'Adam' 
RETURN nodes(p);
```

```table
┌──────────────────────────────────────────────────────────────────────────────────┐
│ NODES(p)                                                                         │
├──────────────────────────────────────────────────────────────────────────────────┤
│ [{_ID: 0:0, _LABEL: User, name: Adam, age: 30},{_ID: 0:1, _LABEL: User, name:... │
│ [{_ID: 0:0, _LABEL: User, name: Adam, age: 30},{_ID: 0:1, _LABEL: User, name:... │
│ [{_ID: 0:0, _LABEL: User, name: Adam, age: 30},{_ID: 0:2, _LABEL: User, name:... │
│ [{_ID: 0:0, _LABEL: User, name: Adam, age: 30},{_ID: 0:2, _LABEL: User, name:... │
└──────────────────────────────────────────────────────────────────────────────────┘
```
### RELS

Returns all relationships from a path.

| Input type | Output type |
| ----------- | ----------- |
| `RECURSIVE_REL` | `LIST[REL]` |

```cypher
MATCH p = (a:User)-[:Follows*1..2]->(:User) 
WHERE a.name = 'Adam' 
RETURN rels(p);
```

```table
┌──────────────────────────────────────────────────────────────────────────────────┐
│ RELS(p)                                                                          │
├──────────────────────────────────────────────────────────────────────────────────┤
│ [(0:0)-{_LABEL: Follows, _ID: 2:0, since: 2020}->(0:1)]                          │
│ [(0:0)-{_LABEL: Follows, _ID: 2:0, since: 2020}->(0:1),(0:1)-{_LABEL: Follows... │
│ [(0:0)-{_LABEL: Follows, _ID: 2:1, since: 2020}->(0:2)]                          │
│ [(0:0)-{_LABEL: Follows, _ID: 2:1, since: 2020}->(0:2),(0:2)-{_LABEL: Follows... │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### PROPERTIES

Return a given property from nodes or relationships.

| Input type | Output type |
| ----------- | ----------- |
| `LIST[NODE/REL]`, `STRING` | `LIST[ANY]` |

```cypher
MATCH p = (a:User)-[:Follows*1..2]->(:User) 
WHERE a.name = 'Adam' 
RETURN properties(nodes(p), 'name') AS name, properties(rels(p), 'since') AS since;
```

```table
┌─────────────────────┬─────────────┐
│ name                │ since       │
├─────────────────────┼─────────────┤
│ [Adam,Karissa]      │ [2020]      │
│ [Adam,Karissa,Zhang]│ [2020,2021] │
│ [Adam,Zhang]        │ [2020]      │
│ [Adam,Zhang,Noura]  │ [2020,2022] │
└─────────────────────┴─────────────┘
```

### IS_TRAIL

Check if a path contains repeated relationships.

| Input type | Output type |
| ----------- | ----------- |
| `RECURSIVE_REL` | `BOOLEAN` |

```cypher
MATCH p = (a:User)-[:Follows*2..2]-(b:User) 
WHERE a.name='Adam' 
RETURN properties(rels(p), '_id'), is_trail(p);
```
Output
```table
┌─────────────────────────┬─────────────┐
│ PROPERTIES(RELS(p),_id) │ IS_TRAIL(p) │
├─────────────────────────┼─────────────┤
│ [2:1,2:1]               │ False       │
│ [2:0,2:0]               │ False       │
│ [2:1,2:2]               │ True        │
│ [2:0,2:2]               │ True        │
│ [2:1,2:3]               │ True        │
└─────────────────────────┴─────────────┘
```

### IS_ACYCLIC

Check if a path contains repeated nodes.

| Input type | Output type |
| ----------- | ----------- |
| `RECURSIVE_REL` | `BOOLEAN` |

```cypher
MATCH p = (a:User)-[:Follows*2..2]-(b:User) 
WHERE a.name='Adam' 
RETURN properties(nodes(p), 'name'), is_acyclic(p);
```

```table
┌─────────────────────────────┬───────────────┐
│ PROPERTIES(NODES(p),name)   │ IS_ACYCLIC(p) │
├─────────────────────────────┼───────────────┤
│ [Adam,Zhang,Adam]           │ False         │
│ [Adam,Karissa,Adam]         │ False         │
│ [Adam,Zhang,Karissa]        │ True          │
│ [Adam,Karissa,Zhang]        │ True          │
│ [Adam,Zhang,Noura]          │ True          │
└─────────────────────────────┴───────────────┘
```

### LENGTH

Return the number of relationships (path length) in a path.

```cypher
MATCH p = (a:User)-[f:Follows*1..2]->(b:User) 
RETURN LENGTH(p);
```
```table
┌─────────────┐
│ LENGTH(p)   │
├─────────────┤
│ 1           │
│ 2           │
│ 1           │
│ 2           │
└─────────────┘
```

The `LENGTH` function when applied to a recursive relationship is equivalent to 
`SIZE(rels(p))`.

### COST

Return the cost of a weighted path. This function only works for `WSHORTEST` and `ALL WSHORTEST`.

| Input type | Output type |
| ----------- | ----------- |
| `RECURSIVE_REL` | `DOUBLE` |

**Example**
```table
MATCH (a:User)-[e:Follows]->(b:User) RETURN a.name, e.*, b.name;
┌─────────┬─────────┬───────────┬─────────┐
│ a.name  │ e.since │ e.score   │ b.name  │
│ STRING  │ INT64   │ DOUBLE    │ STRING  │
├─────────┼─────────┼───────────┼─────────┤
│ Adam    │ 2020    │ 5.000000  │ Karissa │
│ Adam    │ 2020    │ 20.000000 │ Zhang   │
│ Karissa │ 2021    │ 6.000000  │ Zhang   │
│ Zhang   │ 2022    │ 22.000000 │ Noura   │
└─────────┴─────────┴───────────┴─────────┘
MATCH p=(a:User)-[e:Follows* WSHORTEST(score)]->(b:User) 
WHERE a.name='Adam' RETURN properties(nodes(p), 'name'), cost(e);
┌────────────────────────────┬───────────┐
│ PROPERTIES(NODES(p),name)  │ e_cost    │
│ STRING[]                   │ DOUBLE    │
├────────────────────────────┼───────────┤
│ [Adam,Karissa,Zhang,Noura] │ 33.000000 │
│ [Adam,Karissa,Zhang]       │ 11.000000 │
│ [Adam,Karissa]             │ 5.000000  │
└────────────────────────────┴───────────┘
```
