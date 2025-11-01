---
title: Array functions
description: Array functions are used specifically to transform or manipulate arrays.
---

This section provides an overview of functions that are specifically designed to work with
`ARRAY` data types. An example of such a class of functions are similarity search functions,
such as dot product or cosine similarity. The full list of functions is provided in the table below.

:::caution[Note]
Scroll to the right to see the example usage in the table below.
:::

<div class="scroll-table">

| Function | Description | Example | Result |
| ----------- | --------------- | ----------- | ----------- |
| `array_value(arg1, arg2, arg3..)` | creates an array containing the argument values | `array_value(1,2,3,4,5,56,2)` | `[1,2,3,4,5,56,2]` |
| `array_distance(array1, array2)` | calculates the Euclidean distance between two arrays | `array_distance([1.0,2.0,3.0], [4.0,5.0,6.0])` | `5.196152` |
| `array_squared_distance(array1, array2)` | calculates the squared Euclidean distance between two arrays | `array_squared_distance([1.0,2.0,3.0], [4.0,5.0,6.0])` | `27.000000` |
| `array_dot_product(array1, array2)` | calculates the dot product of two arrays | `array_dot_product([1.0,2.0,3.0], [4.0,5.0,6.0])` | `32.000000` |
| `array_inner_product(array1, array2)` | calculates the inner product of two arrays | `array_inner_product([1.0,2.0,3.0], [4.0,5.0,6.0])` | `32.000000` |
| `array_cross_product(array1, array2)` | calculates the cross product of two arrays | `array_cross_product([1,2,3], [4,5,6])` | `[-3,6,-3]` |
| `array_cosine_similarity(array1, array2)` | calculates the cosine similarity of two arrays | `array_cosine_similarity([1.0,2.0,3.0], [4.0,5.0,6.0])` | `0.974632` |

</div>
