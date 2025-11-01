---
title: Date operators
description: Date operators are used to work with date values.
---

Kuzu supports the following operators to work with date and interval values:

<div class="scroll-table">

| Operator | Description | Example | Result |
| :-----------: | ----------- |  ----------- |  ----------- |
| + | addition of INT64 | `DATE('2022-11-12') + 5`  | `2022-11-17` | 
| + | addition of INTERVAL | `DATE('2021-10-12') + INTERVAL('3 DAYS')` | `2021-10-15` |
| - | subtraction of INT64 | `DATE('2022-11-12') - DATE('2022-11-11')` | `1` |
| - | subtraction of INTERVAL | `DATE('2023-10-11') - INTERVAL('10 DAYS')` | `2023-10-01` |

</div>