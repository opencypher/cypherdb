---
title: List functions
description: List functions are used to create and manipulate lists or arrays.
---

List functions are used to create and manipulate lists and/or arrays. Arrays are a special case of lists,
where the length is fixed. The following list functions have been implemented.

:::caution[Note]
Scroll to the right to see the example usage in the below table.
:::

<div class="scroll-table">

| Function | Description | Example | Result |
| ----------- | --------------- | ----------- | ----------- |
| `list_creation(arg1, arg2, arg3..)` | creates a LIST containing the argument values | `list_creation(1,2,3,4,5,56,2)` | `[1,2,3,4,5,56,2]` |
| `size(list)` | returns the size of the list | `size([1,2,3])` | `3` |
| `list_extract(list, index)` | extracts the i-th (1-based index) value from the list | `list_extract([1,2,3], 2)` | `2` |
| `list_element(list, index)` | alias of `list_extract` | `list_element([7,234,3], 1)` | `7` |
| `list_concat(list1, list2)` | concatenates two lists | `list_concat([7,234,3], [1,3])` | `[7,234,3,1,3]` |
| `list_cat(list1, list2)` | alias of `list_concat` | `list_cat(['7','3'], ['1'])` | `['7','3','1']` |
| `array_concat(list1, list2)` | alias of `list_concat` | `array_concat([['7','2'],['3']], [['1']])` | `[['7','2'],['3'],['1']]` |
| `array_cat(list1, list2)` | alias of `list_concat` | `array_cat([4.23,5.25], [4.1])` | `[4.23,5.25,4.1]` |
| `list_append(list, element)` | appends the element to list | `list_append([3,5,9],4)` | `[3,5,9,4]` |
| `array_append(list, element)` | alias of `list_append` | `array_append([2,1],3)` | `[2,1,3]` |
| `array_push_back(list, element)` | alias of `list_append` | `array_push_back([3,6],4)` | `[3,6,4]` |
| `list_prepend(list, element)` | prepends the element to list | `list_prepend([3,6],4)` | `[4,3,6]` |
| `array_prepend(list, element)` | alias of `list_prepend` | `array_prepend([3,6],4)` | `[4,3,6]` |
| `array_push_front(list, element)` | alias of `list_prepend` | `array_push_front([1,2],3)` | `[3,1,2]` |
| `list_position(list, element)` | returns the position of element in the list | `list_position([3,4,5], 5)` | `3` |
| `list_indexof(list, element)` | alias of `list_position` | `list_indexof([3,4,5], 5)` | `3` |
| `array_position(list, element)` | alias of `list_position` | `array_position([3,4,5], 5)` | `3` |
| `array_indexof(list, element)` | alias of `list_position` | `array_indexof([3,4,5], 5)` | `3` |
| `list_contains(list, element)` | returns true if the list contains the element | `list_contains([3,4,5], 5)` | `true` |
| `list_has(list, element)` | alias of `list_contains` | `list_has([3,4,5], 5)` | `true` |
| `array_contains(list, element)` | alias of `list_contains` | `array_contains([3,4,5], 5)` | `true` |
| `array_has(list, element)` | alias of `list_contains` | `array_has([3,4,5], 5)` | `true` |
| `list_slice(list, begin, end)` | extracts a sub-list using slice conventions and negative values are accepted. | `list_slice([3,4,5], 2, 3)` | `[4,5]` |
| `array_slice(list, begin, end)` | alias of `list_slice` | `array_slice([6,7,1], 1, 3)` | `[6,7,1]` |
| `list_reverse(list)` | reverse list elements | `list_reverse([1,2,3])` | `[3,2,1]` |
| `list_sort(list)`| sorts the elements of the list. More configurations available [here](#list_sort) | `list_sort([3,10,4])` | `[3,4,10]` |
| `list_reverse_sort(list)` | alias of `list_sort(list, 'DESC')` | `list_reverse_sort([3,10,4])` | `[10,4,3]` |
| `list_sum(list)` | sums the elements of the list. | `list_sum([1,2,3])` | `6` |
| `list_product(list)` | multiply elements of the list. | `list_product([1, 2, 3])` | `6` |
| `list_distinct(list)` | removes NULLs and duplicate values from the list. | `list_distinct([3,3,3,NULL])` | `[3]` |
| `list_unique(list)` | counts number of unique elements of the list. NULLs are ignored. | `list_unique([3,3,3,NULL])` | `1` |
| `list_any_value(list)` | returns the first non-NULL value of the list | `list_any_value(NULL, 'a', NULL)` | `'a'` |
| `list_to_string(separator, list)` | converts a list to a string separated by the given separator | `list_to_string('..', [1,2,3])` | `'1..2..3'` |
| `range(start, stop)` | returns a list of values from `start` to `stop`. Specify the step as shown [here](#range) | `range(1,3)` | `[1,2,3]` |
| `list_transform(list, lambda)` | returns a list by applying lambda function to each element of input list  | `list_transform([1,2,3], x->x+1)` | [2,3,4] |
| `list_filter(list, lambda)` | returns list containing elements whose lambda function result is true | `list_filter([1,2,3], x->x>1)` | [2,3] |
| `list_reduce(list, lambda)` | returns single value by applying the lambda function on a running result and the next list element.| `list_reduce([1,2,3], (x,y)->x+y)` | 6 |
| `list_has_all(list, sub-list)` | returns true if all elements of sub-list exist in list. | `list_has_all([5, 7, 2], [5, 2])` | true |
| `all(variable IN list WHERE predicate)` | returns true if the predicate holds for all elements in the given LIST. | `all(x in [5,6,7] where x > 3)` | true |
| `any(variable IN list WHERE predicate)` | returns true if the predicate holds for any element in the given LIST | `any(x in [1,3,5] where x > 4)` | true |
| `none(variable IN list WHERE predicate)` | returns true if the predicate doesn't hold for any element in the given LIST | `none(x in [16,22,33] where x < 10)` | true |
| `single(variable IN list WHERE predicate)` | returns true if the predicate holds for only one element in the given LIST | `single(x in [1,3,5] where x = 3)` | true |

</div>

For functions that specifically work with `ARRAY` data types, refer to the [Array functions](/cypher/expressions/array-functions) section.

## LIST_SORT
`LIST_SORT` can be configured to sort in ascending or descending order. It can also be configured to put `NULL`
values at the beginning or at the end of the list. By default, `LIST_SORT` will sort in
ascending order and put `NULL` values first. You can change the sort order with the `ASC` or `DESC` keywords as the
second argument and change `NULL` values position with `NULLS FIRST` or `NULLS LAST` as the third argument.

By default, `NULL`s are put at the beginning of the list when sorting in descending order.

```cypher
RETURN list_sort([3,10, NULL, 4], 'DESC') AS result;
```

```table
┌───────────┐
│ result    │
│ INT64[]   │
├───────────┤
│ [,10,4,3] │
└───────────┘
```

### NULLS LAST

In certain cases, having the NULLs at the end of the returned list is useful. This can be achieved by
specifying `NULLS LAST` as the third argument.

```cypher
RETURN list_sort([3,10, NULL, 4], 'DESC', 'NULLS LAST') AS result;
```

```table
┌───────────┐
│ result    │
│ INT64[]   │
├───────────┤
│ [10,4,3,] │
└───────────┘
```

## RANGE

`range(start, stop)` returns a list of values from start to stop. Both ends are inclusive.
```cypher  
RETURN range(1,3);
```
```table
┌────────────┐
│ RANGE(1,3) │
│ INT64[]    │
├────────────┤
│ [1,2,3]    │
└────────────┘
```

`range(start, stop, step)` returns a list of values from start to stop with the given step.
Both ends are inclusive.
```cypher  
RETURN range(1,10,2); 
```
```table
┌───────────────┐
│ RANGE(1,10,2) │
│ INT64[]       │
├───────────────┤
│ [1,3,5,7,9]   │
└───────────────┘
```

## COALESCE and IFNULL

`COALESCE` and `IFNULL` functions are used to return the first non-NULL value from the list of elements.
The only difference is that `COALESCE` can take more than two arguments.

```cypher
RETURN coalesce(NULL, 'a', NULL) AS result;
```

```table
┌────────┐
│ result │
│ STRING │
├────────┤
│ a      │
└────────┘
```

```cypher
RETURN ifnull(NULL, 'a') AS result;
```

```table
┌────────┐
│ result │
│ STRING │
├────────┤
│ a      │
└────────┘
```

