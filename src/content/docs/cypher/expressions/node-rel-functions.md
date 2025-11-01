---
title: Node & relationship functions
description: Node & relationship functions are used to get information about nodes and relationships.
---

The following functions are used to get information about nodes and relationships.

| Function | Description | Alias |
| ----------- | ----------- | ----------- |
| `ID` | returns the internal ID of node/rel | |
| `LABEL` | returns the label name of node/relationship | `LABELS` |
| `OFFSET` | returns the offset of the internal ID | |

See below for more details on each of these functions.

## ID
Returns the internal ID of node/rel.

| Input type | Output type |
| --- | --- |
| `NODE` | `ID` (Internal database ID) |
| `REL` | `ID` (Internal database ID) |

```cypher
MATCH (a:User) RETURN ID(a) AS ID LIMIT 1;
```

```table
┌─────────────┐
│ ID          │
│ INTERNAL_ID │
├─────────────┤
│ 0:0         │
└─────────────┘
```

## LABEL

Returns the label name of node/rel. The alias `LABELS` can also be used.

| Input type | Output type |
| --- | --- |
| `NODE` | `STRING` |
| `REL` | `STRING` |

```cypher
MATCH (a) RETURN LABEL(a) AS LABEL LIMIT 1;
```

```table
┌────────┐
│ LABEL  │
│ STRING │
├────────┤
│ User   │
└────────┘
```

## OFFSET

Returns the offset of the internal ID.

| Input type | Output type |
| --- | --- |
| `ID` | `INT64` |


```cypher
MATCH (a) RETURN OFFSET(ID(a)) AS OFFSET LIMIT 1;
```

```table
┌────────┐
│ OFFSET │
│ INT64  │
├────────┤
│ 0      │
└────────┘
```
