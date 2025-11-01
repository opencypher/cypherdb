---
title: Interval functions
description: Interval functions are used to create and manipulate intervals.
---

Interval functions are used to create and manipulate intervals.

<div class="scroll-table">

| Function | Description | Example | Result |
| ----------- | ----------- |  ----------- |  ----------- |
| `date_part(part, interval)` | returns the subfield of the date | `date_part('year', INTERVAL('20 YEARS 367 DAYS'))` | `20` (INT64) |
| `to_years(integer)` | returns the year interval based on the year | `to_years(3)` | `3 years` (INTERVAL) |
| `to_months(integer)` | returns the month interval based on the month | `to_months(5)` | `5 months` (INTERVAL) |
| `to_days(integer)` | returns the day interval based on the days | `to_days(2)` | `2 days` (INTERVAL) |
| `to_hours(integer)` | returns the hour interval based on the hours | `to_hours(10)` | `10:00:00` (INTERVAL) | 
| `to_minutes(integer)` | returns the minutes interval based on the minutes | `to_minutes(30)` | `00:30:00` (INTERVAL) |
| `to_seconds(integer)` | returns the seconds interval based on the seconds | `to_seconds(22)` | `00:00:22` (INTERVAL) |
| `to_milliseconds(integer)` | returns the milliseconds interval based on the milliseconds | `to_milliseconds(27)` | `00:00:00.027` (INTERVAL) |
| `to_microseconds(integer)` | returns the microseconds interval based on the microseconds | `to_microseconds(98)` | `00:00:00.000098` (INTERVAL) |

</div>