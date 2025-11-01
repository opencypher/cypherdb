---
title: Logical Operators
description: Logical operators are used to combine boolean values.
---

Kuzu supports using `AND`/`OR`/`XOR`/`NOT` logical operators to combine boolean values.

## Truth table for `AND`

| left | right | result |
| --- | --- | --- |
| `TRUE` | `TRUE` | `TRUE` |
| `TRUE` | `FALSE` | `FALSE` |
| `FALSE` | `TRUE` | `FALSE` |
| `FALSE` | `FALSE` | `FALSE` |
| `NULL` | `TRUE` | `NULL` |
| `NULL` | `FALSE` | `FALSE` |
| `TRUE` | `NULL` | `NULL` |
| `FALSE` | `NULL` | `FALSE` |
| `NULL` | `NULL` | `NULL` |

## Truth table for `OR`

| left | right | result |
| --- | --- | --- |
| `TRUE` | `TRUE` | `TRUE` |
| `TRUE` | `FALSE` | `TRUE` |
| `FALSE` | `TRUE` | `TRUE` |
| `FALSE` | `FALSE` | `FALSE` |
| `NULL` | `TRUE` | `TRUE` |
| `NULL` | `FALSE` | `NULL` |
| `TRUE` | `NULL` | `TRUE` |
| `FALSE` | `NULL` | `NULL` |
| `NULL` | `NULL` | `NULL` |

## Truth table for `XOR`

| left | right | result |
| --- | --- | --- |
| `TRUE` | `TRUE` | `FALSE` |
| `TRUE` | `FALSE` | `TRUE` |
| `FALSE` | `TRUE` | `TRUE` |
| `FALSE` | `FALSE` | `FALSE` |
| `NULL` | `TRUE` | `NULL` |
| `NULL` | `FALSE` | `NULL` |
| `TRUE` | `NULL` | `NULL` |
| `FALSE` | `NULL` | `NULL` |
| `NULL` | `NULL` | `NULL` |

## Truth table for `NOT`

| left | result |
| --- | --- |
| `TRUE` | `FALSE` |
| `FALSE` | `TRUE` |
| `NULL` | `NULL` |
