---
title: Export Parquet
description: Export query results to Apache Parquet files with compression support for efficient columnar storage.
---

The `COPY TO` clause can export query results to a Parquet file. It can be combined with a subquery
and used as shown below.

```cypher
COPY (MATCH (u:User) return u.*) TO 'user.parquet' (compression = 'snappy');
```

The `LOAD FROM` clause can be used to scan the Parquet file and to verify that the export worked:

```cypher
> LOAD FROM 'user.parquet' RETURN *;
```
```table
┌─────────┬───────┐
│ u.name  │ u.AGE │
│ STRING  │ INT64 │
├─────────┼───────┤
│ Adam    │ 30    │
│ Karissa │ 40    │
│ Zhang   │ 50    │
│ Noura   │ 25    │
└─────────┴───────┘
```

Available options are:

<div class="scroll-table">

| Option                   | Default Value           | Description                                                               |
|:------------------------:|:-----------------------:|---------------------------------------------------------------------------|
| `COMPRESSION`                 | `SNAPPY`                     | The compression format to use (uncompressed, snappy, gzip, lz4 or zstd). |
</div>

:::caution[Notes]
- Exporting [fixed list](/cypher/data-types#list-and-array) data types to Parquet is not yet supported.
- [UNION](/cypher/data-types#union) is exported as a [STRUCT](/cypher/data-types#struct), which is the internal representation of the `Union` data type.
- Currently, only Snappy compression is supported for exports.
:::
