---
title: Case Expression
description: CASE is used for conditional expressions. 
---

The `CASE` expression is used to define conditional logic, similar to how `if` statements work in
programming languages. There are two variants of conditional expressions in Cypher:

1. Simple form which compares an expression against multiple expressions
2. General form with multiple conditional statements.

## Simple form
In the simple form, input is compared against each `WHEN` in order until a match is found. If no
match is found, the expression in the `ELSE` is returned. If there is no `ELSE`, `NULL` is returned.

Syntax
```cypher
CASE input
    WHEN expr THEN result
    [WHEN ...]
    [ELSE expr]
END
```

Example:
```cypher
MATCH (a:User) RETURN 
    CASE a.age 
        WHEN 50 THEN a.name 
    END AS x;
```

```table
┌───────┐
│ x     │
├───────┤
│       │
│       │
│ Zhang │
│       │
└───────┘
```

## General form
In the general form, conditional statements are evaluated in order until a `true` statement is
found. If no match is found, the expression in the `ELSE` is returned. If there is no `ELSE`, `NULL` is returned.

Syntax
```cypher
CASE
    WHEN expr THEN result
    [WHEN ...]
    [ELSE expr]
END
```

Example:
```cypher
MATCH (a:User) RETURN 
    CASE
        WHEN a.age < 50 THEN a.name 
    ELSE 'dummy'
    END AS x;
```

```table
┌─────────┐
│ x       │
├─────────┤
│ Adam    │
│ Karissa │
│ dummy   │
│ Noura   │
└─────────┘
```
