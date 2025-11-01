---
title: Import NumPy
description: Import numerical data from NumPy .npy files into Kuzu node tables for machine learning and data science applications.
---

The `.npy` format is the standard binary file format in [NumPy](https://numpy.org/) for persisting a
single arbitrary NumPy array on disk.

The primary use case for bulk loading NumPy files is to load
large node features or vectors that are stored in `.npy` format. You can use the `COPY FROM` statement
to import a set of `*.npy` files into a node table.

:::caution[Notes]
This feature is an experimental feature and will evolve. Currently, this feature has the following constraints:
- **Import to node table only**: For now, Kuzu supports loading `.npy` files into **node tables** only.
- **NPY file mapped to column**: Each `.npy` file will be loaded as a node table column. So, in the `COPY FROM` statement, the
number of `.npy` files must be equal to the number of columns defined in the DDL.
- **Numerical types only**: A `.npy` file can only contain numerical values.
:::

## Import to node table
Consider a `Paper` table with an `id` column, a feature column that is an embedding (vector) with 768 dimensions,
a `year` column and a `label` column as ground truth. We first define the schema with the following statement:

```cypher
CREATE NODE TABLE Paper(id INT64 PRIMARY KEY, feat FLOAT[768], year INT64, label DOUBLE);
```

The raw data is stored in `.npy` format where each column is represented as a NumPy array on disk. The files are
specified below:

```
node_id.npy", "node_feat_f32.npy", "node_year.npy", "node_label.npy"
```

We can copy the files with the following statement:

```cypher
COPY Paper FROM ("node_id.npy", "node_feat_f32.npy", "node_year.npy", "node_label.npy") BY COLUMN;
```

As stated before, the number of `*.npy` files must equal the number of columns, and must also be
specified in the same order as they are defined in the DDL.

## Ignore erroneous rows

See the [Ignore erroneous rows](/import#ignore-erroneous-rows) section for more details.
