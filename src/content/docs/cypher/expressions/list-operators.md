---
title: List Functions
description: List functions are used to create and manipulate lists.
---

The following table shows the operators that can be used with lists.

<div class="scroll-table">

| Operator | Description | Example | Result |
| :----------- | ----------- |  ----------- |  ----------- |
| `+` | concatenates two lists | `RETURN [1,2,3] + [4,5] AS mylist` | `[1,2,3,4,5]` |
| `[start:stop]` | access specific elements in a list | `WITH [1,2,3,4,5] AS mylist RETURN mylist[1:3]` | `[1,2]` |
| `IN` | operator for the `list_contains` function | `1 IN [1,2,3]` | `true` |

</div>
