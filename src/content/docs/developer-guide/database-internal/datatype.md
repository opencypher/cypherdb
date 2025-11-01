---
title: Data type classes
description: "Understanding LogicalType and PhysicalType classes in Kuzu's internal architecture"
---

There are two data type classes in Kuzu, `LogicalType` and `PhysicalType`.

## LogicalType

Logical type refers to how data is conceptually organized. This type doesn't handle how data is
actually stored. Different logical types may have the same physical type during storage/query
processing, e.g. both `INT32` and `DATE` logical type will have `INT32` physical type.

During query compilation, which includes parsing, binding, and planning, the logical type should always be used.

## PhysicalType

Physical type refers to the specific data format as it is physically stored on disk and in memory.

Physical type is useful in storage and query processing. For example, columns are constructed based on
physical types. Comparison operators can only work on physical types. Using the physical type is not
mandatory -- if you need to make a distinction between logical types, then you will
need to fall back to using a logical type.
