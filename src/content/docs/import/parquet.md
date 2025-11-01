---
title: Import Parquet
description: Bulk import data from Apache Parquet columnar files into Kuzu node and relationship tables using COPY FROM.
---

[Apache Parquet](https://Parquet.apache.org/docs/) is an open source, column-oriented persistent storage format
designed for efficient data storage and retrieval. Kuzu supports bulk data import from Parquet files
using the `COPY FROM` command. You can use `COPY FROM` to import data into an empty table or to append data to an existing table.

:::caution[Notes]
Parquet files store schema information in their metadata, so you don't need to explicitly handle columns
based on type, unlike in CSV. However, the same rules apply:

- **Copy nodes before relationships:** In order to copy a relationship table `R` from a Parquet file `RFile`,
the nodes that appear in `RFile` need to already exist in the database (either imported in bulk or
inserted through Cypher data manipulation commands).
:::

## Import to node table

Similar to CSV import, the order of columns in a Parquet file need to match the order of predefined
properties for node tables in the catalog, i.e. the order used when defining the schema of a node table.

The following example is for a file named `user.parquet`. The output is obtained by using `print(pyarrow.Table)`.
```py
pyarrow.Table
name: string
age: int64
----
name: [["Adam","Karissa","Zhang","Noura"]]
age: [[30,40,50,25]]
```

To load this Parquet file into a `User` table, run:

```cypher
COPY User FROM "user.Parquet";
```

## Import to relationship table

Similar to CSV import, the first two columns for a relationship file should the `from` and the `to` columns
that represent existing nodes' primary keys.

The following example is for a file named `follows.parquet`. The output is obtained by using `print(pyarrow.Table)`.

```py
pyarrow.Table
from: string
to: string
since: int64
----
from: [["Adam","Adam","Karissa","Zhang"]]
to: [["Karissa","Zhang","Zhang","Noura"]]
since: [[2020,2020,2021,2022]]
```

To load this Parquet file into a `Follows` table, run:

```cypher
COPY Follows FROM "follows.Parquet";
```

## Import multiple files to a single table

It is common practice to divide large Parquet files into several smaller files for cleaner data management.
Kuzu can read multiple files with the same structure, consolidating their data into a single node or relationship table.
You can specify that multiple files are loaded in the following ways:

### Glob pattern

This is similar to the Unix [glob](https://man7.org/linux/man-pages/man7/glob.7.html) pattern, where you specify
file paths that match a given pattern. The following wildcard characters are supported:

| Wildcard | Description |
| :-----------: | ----------- |
| `*` | match any number of any characters (including none) |
| `?` | match any single character |
| `[abc]` | match any one of the characters enclosed within the brackets |
| `[a-z]` | match any one of the characters within the range |

```cypher
COPY User FROM "User*.parquet"
```

### List of files

Alternatively, you can just specify a list of files to be loaded.

```cypher
COPY User FROM ["User0.parquet", "User1.parquet", "User2.parquet"]
```

## Ignore erroneous rows

See the [Ignore erroneous rows](/import#ignore-erroneous-rows) section for more details.
