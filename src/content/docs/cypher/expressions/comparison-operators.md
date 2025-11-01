---
title: Comparison Operators
description: Comparison operators are used to compare two values.
---

The following table describes the standard comparison operators supported by Kuzu. If any of the input arguments is `NULL`, the comparison result will also be `NULL`.

<div class="scroll-table">

| Operator | Description | Example | Result |
| ----------- | ----------- | ----------- | ----------- |
| `<` | less than | `2 < 3` | `true` |
| `>` | greater than | `1 > 5` | `false` |
| `<=` | less than or equal to | `3 <= 3` | `true` |
| `>=` | greater than or equal to | `4 >= 2` | `true` |
| `=` | equal | `NULL = NULL` | `NULL` |
| `<>` | not equal | `5 <> NULL` | `NULL` |

</div>
