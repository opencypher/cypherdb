---
title: Numeric operators
description: Numeric operators are used to perform operations on numeric data types.
---

Numeric operators are used to perform operations on numeric data types.

| Operator | Description | Example | Result |
| :-----------: | ----------- |  ----------- |  ----------- |
| + | Addition | `2 + 3.5` | `5.5` |
| - | Subtraction | `4.5 - 2` | `2.5` |
| * | Multiplication | `3.2 * 2` | `6.4` |
| / | Division | `9 / 5` | `1` |
| % | Modulo (remainder) | `9 % 5` | `4` |
| ^ | Power | `4 ^ 5` | `1024.0` |

Appropriate types are cast wherever possible. For example, in `9 / 5`, the result is `1` because both operands
are integers. In `9.0 / 5`, the result is `1.8` because one of the operands is a float.

:::danger[Note]
The following numeric operators are not supported:
`**`, `&`, `|`, `<<`, `>>`, `!`
:::
