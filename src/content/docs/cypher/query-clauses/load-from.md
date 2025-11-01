---
title: Load (Scan)
description: Direct scan over file using the LOAD FROM clause
---

The `LOAD FROM` clause performs a direct scan over an input file **without copying it into the database**.
This clause is very useful for inspecting a subset of a larger file to display or load into a node table, or to
perform simple transformation tasks like rearranging column order.

`LOAD FROM` can be followed by arbitrary clauses like `MATCH`, `CREATE`, `WHERE`, `RETURN`, and so on.
For an input source with `k` columns, `LOAD FROM` will bind each tuple `t=(col0, col1, ..., col(k-1))` of the scanned input source to `k` variables
with the same property names and data types. The names and data types of the properties can either be specified
in the `LOAD FROM` statement using the [`WITH HEADERS`](#bound-variable-names-and-data-types) clause, or they will be automatically inferred from the source.

## Scan Data Formats
`LOAD FROM` can scan several in-memory or file-based formats:
- CSV
- Parquet
- Pandas
- Polars
- Arrow tables
- JSON


### File format detection
`LOAD FROM` determines the file format based on the file extension if the `file_format` option is not given. For instance, files with a `.csv` extension are automatically recognized as CSV format.

If the file format cannot be inferred from the extension or if you need to override the default sniffing behavior, the `file_format` option can be used.

For example, to load a CSV file that has a `.tsv` extension (for tab-separated data), you must explicitly specify the file format using the `file_format` option, as shown below:
```cypher
LOAD FROM 'data.tsv' (file_format='csv')
RETURN *
```


Below we give examples of using `LOAD FROM` to scan data from each of these formats. We assume `WITH HEADERS`
is not used in the examples below, so we discuss how Kuzu infers the variable names and data types of
that bind to the scanned tuples.

### CSV

:::caution[Note]
See the
[CSV Configurations](/import/csv#csv-configurations) and [ignore erroneous rows
](/import/csv#ignore-erroneous-rows) documentation pages for the `COPY FROM` file.
The configurations documented in those pages can also be specified after the `LOAD FROM` statement inside `()` when scanning
CSV files. For example, you can indicate that the first line should
be interpreted as a header line by setting `(headers = true)` or that the CSV delimiter is '|' by setting `(DELIM="|")`.
Some of these configurations are also by default [automatically detected](/import/csv#csv-configurations) by Kuzu when scanning CSV files.
These configurations determine the names and data types of the
variables that bind to the fields scanned from CSV files.
This page does not document those options in detail. We refer you to [CSV Configurations](/import/csv#csv-configurations) and
[ignore erroneous rows](/import/csv#ignore-erroneous-rows) documentation pages for details.
:::

The syntax for using `LOAD FROM` to scan a CSV file is similar to the one used for using `COPY FROM` with CSV files.
#### CSV header
If (i) the CSV file has a header line, i.e., a first line that should not be interpreted
as a tuple to be scanned; and (ii) `(header = true)` set, then the column names in the first line
provide the names of the columns. The data types are always automatically inferred from the CSV file (except of course
if `LOAD WITH HEADERS (...) FROM` is used, in which case the data types provided inside the `(...)` are used as
described [above](#bound-variable-names-and-data-types)).

Suppose `user.csv` is a CSV file with the following contents:
```
name,age
Adam,30
Karissa,40
Zhang,50
```

Then if you run the following query, Kuzu will infer the column names `name` and `age` from the first line of the CSV:

```cypher
LOAD FROM "user.csv" (header = true) RETURN *;
```
```table
┌─────────┬───────┐
│ name    │ age   │
│ STRING  │ INT64 │
├─────────┼───────┤
│ Adam    │ 30    │
│ Karissa │ 40    │
│ Zhang   │ 50    │
└─────────┴───────┘
```


If (header = false), then the names of the columns will be column0, column1, ..., column(k-1), where k is the number of columns in the CSV file.
Suppose user.csv has the following contents instead:
```
Adam,30
Karissa,40
Zhang,50
```

```cypher
LOAD FROM "user.csv" (header = false) RETURN *;
```
```table
┌─────────┬─────────┐
│ column0 │ column1 │
│ STRING  │ STRING  │
├─────────┼─────────┤
│ name    │ age     │
│ Adam    │ 30      │
│ Karissa │ 40      │
│ Zhang   │ 50      │
└─────────┴─────────┘
```

### Parquet

Since Parquet files contain schema information in their metadata, Kuzu will always use the available
schema information when loading from Parquet files (except again
if `LOAD WITH HEADERS (...) FROM` is used). Suppose we have a Parquet file `user.parquet` with two columns `f0` and `f1`
and the same content as in the `user.csv` file above. Then the query below will scan the Parquet file and output the following:

```cypher
LOAD FROM "user.parquet" RETURN *;
```
```table
┌─────────┬───────┐
│ f0      │  f1   │
│ STRING  │ INT64 │
├─────────┼───────┤
│ Adam    │ 30    │
│ Karissa │ 40    │
│ Zhang   │ 50    │
└─────────┴───────┘
```

### Pandas

Kuzu allows zero-copy access to Pandas DataFrames. The variable names and data types of scanned columns
within a Pandas DataFrame will be
inferred from the schema information of the data frame. Here is an example:

```py
# main.py
import kuzu
import pandas as pd

db = kuzu.Database(":memory:")
conn = kuzu.Connection(db)

df = pd.DataFrame({
    "name": ["Adam", "Karissa", "Zhang"],
    "age": [30, 40, 50]
})

result = conn.execute("LOAD FROM df RETURN *;")
print(result.get_as_df())
```
```
      name  age
0     Adam   30
1  Karissa   40
2    Zhang   50
```
Here, `name` and `age` have string and integer types in the defined Pandas DataFrame, and so the output table
contains two columns with the same names and data types.

:::note[Note]
Pandas can use either a NumPy or Arrow backend - Kuzu can natively scan from either backend.
:::

### Polars

Kuzu can also scan Polars DataFrames via the underlying PyArrow layer. The rules for determining the
variable names and data types is identical to scanning Pandas data frames. Here is an example:

```python
import kuzu
import polars as pl

db = kuzu.Database(":memory:")
conn = kuzu.Connection(db)

df = pl.DataFrame({
    "name": ["Adam", "Karissa", "Zhang"],
    "age": [30, 40, 50]
})

res = conn.execute("LOAD FROM df RETURN *")
print(res.get_as_pl())
```
```table
shape: (3, 2)
┌─────────┬─────┐
│ name    ┆ age │
│ ---     ┆ --- │
│ str     ┆ i64 │
╞═════════╪═════╡
│ Adam    ┆ 30  │
│ Karissa ┆ 40  │
│ Zhang   ┆ 50  │
└─────────┴─────┘
```


### Arrow tables

You can scan an existing PyArrow table as follows:

```python
import kuzu
import pyarrow as pa

db = kuzu.Database(":memory:")
conn = kuzu.Connection(db)

pa_table = pa.table({
    "name": ["Adam", "Karissa", "Zhang"],
    "age": [30, 40, 50]
})

res = conn.execute("LOAD FROM pa_table RETURN *")
print(res.get_as_arrow())
```
```
pyarrow.Table
name: string
age: int64
----
name: [["Adam","Karissa","Zhang"]]
age: [[30,40,50]]
```

### JSON files

Kuzu can scan directly scan JSON files `LOAD FROM`, but it requires installing the JSON extension.
Say you have a JSON file with the following contents:

```json
[
    {
        "name": "Rebecca",
        "age": 25
    },
    {
        "name": "Gregory",
        "age": 30
    },
    {
        "name": "Alicia",
        "age": 28
    }
]
```

You can scan this file using the following query:

```cypher
// Install the JSON extension
INSTALL json;
LOAD json;

// Scan the JSON file
LOAD FROM "user.json" RETURN *;
```
```table
┌─────────┬─────┐
│ name    ┆ age │
│ ---     ┆ --- │
│ str     ┆ u8  │
╞═════════╪═════╡
│ Rebecca ┆ 25  │
│ Gregory ┆ 30  │
│ Alicia  ┆ 28  │
└─────────┴─────┘
```

See the documentation on the JSON extension [here](/extensions/json) for details.

### In-memory JSON objects

Sometimes, you may have JSON objects you obtain from an external source, such as a REST API, or a
document database like MongoDB (or even a search engine like Elasticsearch). In such cases, you
may want to scan these objects without persisting them to JSON files.

The JSON extension provides the `json_structure` function for this use case (see its documentation
[here](/extensions/json#json-functions)).

As an example, let's say we have the same JSON object as shown above in the JSON file example,
but this time, we obtain the JSON object on the fly from a REST API. We can use the client language
to return a _string_ representation of the JSON object, and then use the `json_structure` function
in Kuzu's JSON extension to read the JSON string and convert its contents into the types needed
for the Kuzu table.

```js
// This is the JSON string we get from the REST API
'[{"name": "Rebecca", "age": 25}, {"name": "Gregory", "age": 30}, {"name": "Alicia", "age": 28}]'
```
```table
┌───────────────────────────────────────┐
│ structure                             │
│ STRING                                │
├───────────────────────────────────────┤
│ STRUCT(name STRING, age UINT8)[]      │
└───────────────────────────────────────┘
```

Alternatively. you can handle the JSON string in your client language and pass it to Kuzu.
Here's how you would do it in Python:

```python
import json

json_str = '[{"name": "Rebecca", "age": 25}, {"name": "Gregory", "age": 30}, {"name": "Alicia", "age": 28}]'

result = conn.execute("RETURN json_structure($obj) AS json_obj", {"obj": json_str})

for row in response:
    print(row)
```

```
['STRUCT(name STRING, age UINT8)[]']
```

Once you have the JSON structure, you can handle query the properties as structs using the dot notation in Kuzu.

## Basic usage

Basic usage examples for the `LOAD FROM` clause are shown below.

### Filtering/aggregating

```cypher
LOAD FROM "user.csv" (header = true)
WHERE age > 25
RETURN COUNT(*);
```
This returns:
```table
┌──────────────┐
│ COUNT_STAR() │
│ INT64        │
├──────────────┤
│ 3            │
└──────────────┘
```

### Skipping lines

To skip the first 2 lines of the CSV file, you can use the `SKIP` parameter as follows:

```cypher
LOAD FROM "user.csv" (header = true, skip = 2)
RETURN *;
```

### Create nodes from input file

You can pass the contents of `LOAD FROM` to a `CREATE` statement.

```cypher
// Create a node table
// Scan file and use its contents to create nodes
LOAD FROM "user.csv" (header = true)
CREATE (:User {name: name, age: CAST(age AS INT64)});

// Return the nodes we just created
MATCH (u:User) RETURN u.name, u.age;
```
```table
┌─────────┬───────┐
│ u.name  │ u.age │
│ STRING  │ INT64 │
├─────────┼───────┤
│ Adam    │ 30    │
│ Karissa │ 40    │
│ Zhang   │ 50    │
│ Noura   │ 25    │
└─────────┴───────┘
```

### Reorder and subset columns

You can also use the scan functionality to reorder and subset columns from a given dataset. For
example, the following query will return just the `age` and `name` in that order, even if the
input file has more columns specified in a different order.

```cypher
// Return age column before the name column
LOAD FROM "user.csv" (header = true)
RETURN age, name LIMIT 3;
```
```table
┌───────┬─────────┐
│ age   │ name    │
│ INT64 │ STRING  │
├───────┼─────────┤
│ 30    │ Adam    │
│ 40    │ Karissa │
│ 50    │ Zhang   │
└───────┴─────────┘
```

### Bound variable names and data types

By default, Kuzu will infer the column names and data types from the scan source automatically.
- For Parquet, Pandas, Polars and PyArrow, column names and data types are always available in the data source
- For CSV: The behavior is determined by the [CSV scanning configuration](/import/csv#csv-configurations), which are specified at the end of `LOAD FROM`,  inside `()`, similar
to `COPY FROM` statements. We review the details of this behavior [below](#csv).
- For JSON, we use keys as column names, and infer a common data type from each key's values. To use `LOAD FROM` with JSON, you need
to have the [JSON extension](/extensions/json) installed. More details on using `LOAD FROM` with JSON files is provided
on the documentation page for the [JSON extension](/extensions/json).

You can enforce specific column names and data types when reading, by using the `LOAD WITH HEADERS (<name> <dataType>, ...) FROM ...` syntax.

The following query will first bind the column `name` to the `STRING` type and second column `age` to the `INT64` type.
You can combine this with a `WHERE` clause to filter the data as needed.

```cypher
LOAD WITH HEADERS (name STRING, age INT64) FROM "user.csv" (header = true)
WHERE name =~ 'Adam*'
RETURN name, age;
```
```table
┌────────┬───────┐
│ name   │ age   │
│ STRING │ INT64 │
├────────┼───────┤
│ Adam   │ 30    │
└────────┴───────┘
```

:::caution[Note]
If `WITH HEADERS` is specified manually:
- Kuzu will throw an exception if the given number of columns in `WITH HEADERS` does not the match number of columns in the file.
- Kuzu will always try to cast to the type specified header. An exception will be thrown if the
casting operation fails.
:::

## Ignore erroneous rows
Errors can happen when scanning different lines or elements of an input file with `LOAD FROM`.
Error can happen for several reasons, such as a line in the scanned file is malformed (e.g., in CSV files)
or a field in the scanned line cannot be cast into its expected data type (e.g., due to an integer overflow).
You can  skip erroneous lines when scanning large files by setting [`IGNORE_ERRORS`](/import#ignore-erroneous-rows)
configuration to `true`. This configuration is also supported when using `COPY FROM` and the details of this feature
is documented in the [ignore erroneous rows section of `COPY FROM`](/import#ignore-erroneous-rows).

Here is an example. Suppose the CSV file `user.csv` contain the following rows:
```csv
Alice,4
Bob,2147483650
```

Suppose we write a `LOAD FROM` statement that tries to read the second column as an INT32.
The second row `(Bob,2147483650)` would be malformed because 2147483650 does not fit into an INT32 and will cause an error.
By setting `IGNORE_ERRORS` to true, instead of erroring, we can make `LOAD FROM` simply skip over this line:
```cypher
LOAD WITH HEADERS (name STRING, age INT32) FROM "user.csv" (ignore_errors = true)
RETURN name, age;
```
```table
┌────────┬───────┐
│ name   │ age   │
│ STRING │ INT32 │
├────────┼───────┤
│ Alice  │ 4     │
└────────┴───────┘
```
You can also see the details of any warnings generated by the skipped lines using the [SHOW_WARNINGS](/cypher/query-clauses/call#show_warnings) function.
See the "Ignore erroneous rows" [`section`](/import#ignore-erroneous-rows) of `COPY FROM` for more details.
