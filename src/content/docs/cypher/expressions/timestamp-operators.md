---
title: Timestamp operators
description: Timestamp operators are used to work with timestamp values.
---

Kuzu supports the following operators for working with timestamp and interval values:

<div class="scroll-table">

| Operator | Description | Example | Result |
| :-----------: | ----------- |  ----------- |  ----------- |
| + | Addition of INTERVAL | `TIMESTAMP('2022-11-12 13:22:17') + INTERVAL('4 minutes, 3 hours, 2 days')` | `2022-11-14 17:22:21` (TIMESTAMP) | 
| - | Subtraction of TIMESTAMP | `TIMESTAMP('2022-11-22 15:12:22') - TIMESTAMP('2011-10-09 13:00:21')` | `4062 days 02:12:01` (INTERVAL)|
| - | Subtraction of INTERVAL | `TIMESTAMP('2011-10-21 14:25:13') - INTERVAL('35 days 2 years 3 hours')` | `2009-09-16 11:25:13` (TIMESTAMP) |

</div>