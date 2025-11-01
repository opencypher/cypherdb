---
title: Date functions
description: Date functions are used to manipulate date values.
---

Date functions are used to manipulate date values. The following functions are supported:

<div class="scroll-table">

| Function | Description | Example | Result |
| ----------- | ----------- |  ----------- |  ----------- |
| `date_part(part, date)` | returns the subfield of the date | `date_part('year', DATE('1995-11-02'))` | `1995` `(INT64)` |
| `datepart(part, date)` | alias of date_part | `datepart('month', DATE('1933-12-12'))` | `12` `(INT64)` |
| `date_trunc(part, date)` | returns the date with specified precision | `date_trunc('month', DATE('2011-11-21'))` | `2011-11-01` `(DATE)` |
| `datetrunc(part, date)` | alias of date_trunc | `datetrunc('year', DATE('2005-12-11'))` | `2005-01-01` `(DATE)` |
| `dayname(date)` | returns the English name of the day of the date | `dayname(DATE('2022-11-07'))` | `"Monday"` `(STRING)` | 
| `greatest(date, date)` | returns the later of the two dates | `greatest(DATE('2013-12-11'), DATE('2005-11-12'))` | `2013-12-11` `(DATE)` |
| `last_day(date)` | returns the last day of the month of the date | `last_day(DATE('2022-10-11'))` | `2022-10-31` `(DATE)` |
| `least(date, date)` | returns the earlier of the two dates | `least(DATE('2013-12-11'), DATE('2005-11-12'))` | `2005-11-12` `(DATE)` |
| `make_date(INT64, INT64, INT64)` | returns the date based on the given parts | `make_date(1952,11,22)` | `1952-11-22` `(DATE)` |
| `monthname(date)` | returns the English name of the month of the date | `monthname(DATE('2022-11-07'))` | `"November"` `(STRING)` |
| `current_date()`| returns current date | `current_date()` | |

</div>