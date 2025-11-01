---
title: Interval operators
description: Interval operators are used to work with the interval data type.
---

Interval operators are used to work with the interval data type. The following table lists the
operators that can be used with intervals.

<div class="scroll-table">

| Operator | Description | Example | Result |
| :-----------: | ----------- |  ----------- |  ----------- |
| + | addition of INTERVAL | `INTERVAL('79 DAYS 32 YEARS') + INTERVAL('20 MILLISECONDS 30 HOURS 20 DAYS')` | `32 years 99 days 30:00:00.02` (INTERVAL) | 
| + | addition of DATE | `INTERVAL('300 DAYS 2 YEARS 30 MINUTES') + DATE('2025-10-01')` | `2028-07-27` (DATE) |
| + | addition of TIMESTAMP | `INTERVAL('342 DAYS 1 YEARS 32 MINUTES 20 SECONDS') + TIMESTAMP('2013-02-21')` | `2015-01-29 00:32:20` (TIMESTAMP)|
| - | subtraction of INTERVAL | `INTERVAL('5 DAYS 2 MONTHS') - INTERVAL('1 DAYS')` | `2 months 4 days ` (INTERVAL) |
| - | subtraction of DATE | `DATE('2025-03-06') - INTERVAL('1 DAYS')` | `2025-03-05` (DATE) |
| - | subtraction of TIMESTAMP | `TIMESTAMP('1984-01-01') - INTERVAL('30 HOURS 20 SECONDS')` | `1983-12-30 17:59:40` (TIMESTAMP) |

</div>