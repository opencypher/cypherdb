---
title: Timestamp functions
description: Timestamp functions are used to create and extract fields from timestamps.
---

Timestamp functions are used to create and extract fields from timestamps.

<div class="scroll-table">

| Function | Description | Example | Result |
| ----------- | ----------- |  ----------- |  ----------- |
| `century(timestamp)` | returns the century of the timestamp | `century(TIMESTAMP('2013-12-11 14:22:13'))` | `21` `(INT64)` |
| `date_part(part, timestamp)` | returns the subfield of the timestamp | `date_part('second', TIMESTAMP('1995-11-02 12:05:21'))` | `21` `(INT64)` |
| `datepart(part, timestamp)` | alias of date_part | `datepart('month', TIMESTAMP('1926-11-21 13:22:19'))` | `11` `(INT64)` |
| `date_trunc(part, timestamp)` | returns the given timestamp with specified precision | `date_trunc('month', TIMESTAMP('2002-10-21 13:51:21'))` | `2002-10-01 00:00:00` `(TIMESTAMP)` |
| `datetrunc(part, timestamp)` | alias of `date_trunc` | `datetrunc('year', TIMESTAMP('2005-12-11 11:21:31'))` | `2005-01-01 00:00:00` `(TIMESTAMP)` |
| `dayname(timestamp)` | returns the calendar day of the timestamp | `dayname(TIMESTAMP('2022-11-08 11:12:20'))` | `Tuesday` `(STRING)` |
| `epoch_ms(ms)` | converts the epoch value in milliseconds to timestamp | `epoch_ms(701222402100)` | `1992-03-22 00:00:02.1` `(TIMESTAMP)` |
| `to_epoch_ms(timestamp)` | converts the timestamp to epoch value in milliseconds (inverse of `epoch_ms`) | `to_epoch_ms(TIMESTAMP('1992-03-22 00:00:02.1'))` | `701222402100` `(INT64)` |
| `greatest(timestamp, timestamp)` | returns the later of the two timestamps | `greatest(TIMESTAMP('2013-12-11 10:22:11'), TIMESTAMP('2011-05-13 13:22:11'))` | `2013-12-11 10:22:11` `(TIMESTAMP)` |
| `least(timestamp, timestamp)` | returns the earlier of the two timestamps | `least(TIMESTAMP('1966-12-21 15:22:11'), TIMESTAMP('2005-11-12'))` | `1966-12-21 15:22:11` `(TIMESTAMP)` |
| `last_day(timestamp)` | returns the last day of the month of the timestamp | `last_day(TIMESTAMP('2022-11-08 05:11:31'))` | `2022-11-30` `(DATE)` |
| `monthname(timestamp)` | returns the English name of the month of the date | `monthname(TIMESTAMP('2022-04-21 06:11:22'))` | `April` `(STRING)` |
| `to_timestamp(sec)` | converts an epoch second to a timestamp | `to_timestamp(701222723)` | `1992-03-22 00:05:23` `(TIMESTAMP)` |
| `current_timestamp()` | returns the current timestamp | `current_timestamp()` | |

</div>
