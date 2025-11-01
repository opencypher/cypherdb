---
title: Unity Catalog extension
description: Scan Delta Lake tables registered in Unity Catalog for lakehouse data integration (experimental feature).
---

This extension adds the ability to directly scan from delta tables registered in a Unity Catalog using the `LOAD FROM` statement.

:::caution[Note]
This is an experimental extension that is a starting point towards a larger integration
of Kuzu with the lakehouse ecosystem. It may have unresolved issues. To help us address these
issues or to discuss your use case, please reach out to us on GitHub or Discord.
:::

## Usage

Please see [Install an extension](/extensions#install-an-extension) and [Load an extension](/extensions#load-an-extension) first before getting started.

#### Set up a Unity Catalog server

First, set up the open-source version of Unity Catalog:

```bash
git clone https://github.com/unitycatalog/unitycatalog.git
bin/start-uc-server
```

### Attach to a Unity Catalog

```cypher
ATTACH [CATALOG_NAME] AS [alias] (dbtype UC_CATALOG)
```

- `CATALOG_NAME`: The catalog name to attach to in the Unity Catalog
- `alias`: Database alias to use in Kuzu. If not provided, the catalog name will be used.
  When attaching multiple databases, it's recommended to use aliases.

:::note[Note]
Kuzu attaches to the `default` schema under the given catalog name. Specifying the schema to attach is not currently supported.
:::

### Unity Catalog to Kuzu type mapping

The table below shows the mapping from Unity Catalog types to Kuzu types:

| Data type in Unity Catalog         | Corresponding data type in Kuzu |
|-----------------------------|----------------------------------|
| `BOOLEAN`                     | `BOOLEAN`                           |
| `BYTE`                        | Unsupported                          |
| `SHORT`                       | `INT16`                                 |
| `INT`                    | `INT32`                                 |
| `LONG`                       | `INT64`                                 |
| `DOUBLE`                     | `DOUBLE`                                 |
| `FLOAT`                      | `FLOAT`                                 |
| `DATE`                    | `DATE`                                 |
| `TIMESTAMP`                    | `TIMESTAMP`                                 |
| `TIMESTAMP_NTZ`                   | Unsupported                                 |
| `STRING`                   | `STRING`                                 |
| `BINARY`                       | Unsupported                      |
| `DECIMAL`   | `DECIMAL`                                 |

### Scan data from a Unity Catalog table

You can use the `LOAD FROM` statement to scan the `numbers` table. Note that you need to prefix the 
external `numbers` table with the database alias (in our example `unity`).

```cypher
LOAD FROM unity.numbers
RETURN *
```

```table
┌────────┬────────────┐
│ as_int │ as_double  │
│ INT32  │ DOUBLE     │
├────────┼────────────┤
│ 564    │ 188.755356 │
│ 755    │ 883.610563 │
│ 644    │ 203.439559 │
│ 75     │ 277.880219 │
│ 42     │ 403.857969 │
│ 680    │ 797.691220 │
│ 821    │ 767.799854 │
│ 484    │ 344.003740 │
│ 477    │ 380.678561 │
│ 131    │ 35.443732  │
│ 294    │ 209.322436 │
│ 150    │ 329.197303 │
│ 539    │ 425.661029 │
│ 247    │ 477.742227 │
│ 958    │ 509.371273 │
└────────┴────────────┘
```

:::caution[Note]
Currently, Kuzu only supports scanning from Delta Lake tables registered in the Unity Catalog.
:::

### Use a default Unity Catalog name

You can attach a Unity Catalog with a default name using the `USE` statement, to avoid having to specify the full catalog name in every query.

For example, for the Unity Catalog above:

```cypher
ATTACH 'unity' AS unity (dbtype UC_CATALOG);
USE unity;
LOAD FROM numbers
RETURN *
```

### Copy a Unity Catalog table into Kuzu

You can use the `COPY FROM` statement to import data from a Unity Catalog table into Kuzu.

First, create a `numbers` table in Kuzu with the same schema as the one defined in the Unity Catalog.

```cypher
CREATE NODE TABLE numbers (id INT32 PRIMARY KEY, score DOUBLE);
```

Then, copy the data from the external Unity Catalog table to the Kuzu table.

```cypher
copy numbers from unity.numbers;
```

You can also use a subquery to copy only a subset of the columns:
```cypher
COPY numbers FROM (LOAD FROM unity.numbers RETURN score);
```

You can verify that the data has been copied successfully:

```cypher
MATCH (n:numbers) RETURN n.*;
```

```table
┌───────┬────────────┐
│ n.id  │ n.score    │
│ INT32 │ DOUBLE     │
├───────┼────────────┤
│ 564   │ 188.755356 │
│ 755   │ 883.610563 │
│ 644   │ 203.439559 │
│ 75    │ 277.880219 │
│ 42    │ 403.857969 │
│ 680   │ 797.691220 │
│ 821   │ 767.799854 │
│ 484   │ 344.003740 │
│ 477   │ 380.678561 │
│ 131   │ 35.443732  │
│ 294   │ 209.322436 │
│ 150   │ 329.197303 │
│ 539   │ 425.661029 │
│ 247   │ 477.742227 │
│ 958   │ 509.371273 │
└───────┴────────────┘
```

### Detach a Unity Catalog

```cypher
DETACH unity;
```
