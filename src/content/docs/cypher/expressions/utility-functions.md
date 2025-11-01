---
title: Utility functions
description: Utility functions are used to perform miscellaneous operations and transformations.
---

This section is to provide an overview of specific functions that are difficult to categorize,
but are broadly useful.

<div class="scroll-table">

| Function | Description | Example | Result |
| ----------- | --------------- | ----------- | ----------- |
| `coalesce(arg1, arg2)` | returns the first non-NULL value from the list of elements | `coalesce(NULL, 'a', NULL)` | `'a'` |
| `ifnull(arg1, arg2)` | a two-argument version of coalesce | `ifnull(NULL, 'a')` | `'a'` |
| `nullif(arg1, arg2)`| if `arg1 = arg2` return null, otherwise return `arg1` | `nullif('hello', 'world')` | `'hello'` |
| `constant_or_null(arg1, arg2)` | if `arg2` is null return null, otherwise return `arg1` | `constant_or_null(1, NULL)`| `NULL` |
| `count_if(arg)`| if `arg` is true or non-zero number return 1, otherwise return 0 | `count_if(true)`| `1` |
| `typeof(arg)` | return name of the data type of `arg` | `typeof(true)` | `BOOL` |
| `error(arg)` | throw `arg` as a runtime exception | `error('something is wrong.')` | |



</div>