---
title: Call
description: CALL clause is a reading clause used for executing schema functions.
---

The `CALL` clause is used for executing schema functions. This way of using `CALL` must be followed
by other query clauses, such as `RETURN` or `YIELD` (see below for example usage). Note that the `CALL` clause
defined here is different from the standalone [`CALL`](/cypher/configuration) **statement** used for changing
the database configuration.

The following table lists the built-in schema functions you can use with the `CALL` clause:

<div class="scroll-table">

| Function | Description                                                                                  |
| ----------- |----------------------------------------------------------------------------------------------|
| `CURRENT_SETTING('setting')` | returns the value of the given setting                                                       |
| `DB_VERSION()` | returns the version of Kuzu                                                                  |
| `SHOW_TABLES()` | returns the name, type, comment of all tables in the database                                |
| `SHOW_CONNECTION('tableName')` | returns the source/destination nodes for a relationship/relgroup in the database             |
| `SHOW_ATTACHED_DATABASES()` | returns the name, type of all attached databases                                             |
| `SHOW_FUNCTIONS()` | returns all registered functions in the database                                             |
| `SHOW_WARNINGS()` | returns the contents of the [Warnings Table](/import#warnings-table-inspecting-skipped-rows) |
| `CLEAR_WARNINGS()` | clears all warnings in the [Warnings Table](/import#warnings-table-inspecting-skipped-rows)  |
| `TABLE_INFO('tableName')` | returns metadata information of the given table                                              |
| `SHOW_OFFICIAL_EXTENSIONS` | returns all official [extensions](/extensions) which can be installed by `INSTALL <extension_name>` |
| `SHOW_LOADED_EXTENSIONS` | returns all loaded extensions |
| `SHOW_INDEXES` | returns all indexes built in the system |
| `SHOW_PROJECTED_GRAPHS` | returns all existing projected graphs in the system |
| `PROJECTED_GRAPH_INFO` | returns the given projected graph information |

</div>

## Functions

This section describes the schema functions that you can use with the `CALL` clause.

### TABLE_INFO

`TABLE_INFO` takes table name as a parameter and returns metadata information of the table.

| Column | Description | Type |
| ------ | ----------- | ---- |
| `property id` | Internal identifier of the property within table | INT64 |
| `name` | name of the property | STRING |
| `type` | data type of the property | STRING |
| `default expression` | default value of property when none is specified | STRING |
| `primary key` | if property is primary key | BOOLEAN |

```cypher
CALL TABLE_INFO('User') RETURN *;
```

```table
┌─────────────┬──────────────┬────────┬──────────────────────┬──────────────┐
│ property id │ name         │ type   │ default expression   │ primary key  │
│ INT32       │ STRING       │ STRING │ STRING               │ BOOL         │
├─────────────┼──────────────┼────────┼──────────────────────┼──────────────┤
│ 0           │ name         │ STRING │ NULL                 │ True         │
│ 1           │ age          │ INT64  │ 0                    │ False        │
└─────────────┴──────────────┴────────┴──────────────────────┴──────────────┘
```

### CURRENT_SETTING

`CURRENT_SETTING` returns the value of given database configuration.

```cypher
CALL current_setting('threads') RETURN *;
```

```table
┌─────────┐
│ threads │
│ STRING  │
├─────────┤
│ 12      │
└─────────┘
```

### DB_VERSION

`DB_VERSION` returns current database version.

| Column | Description | Type |
| ------ | ----------- | ---- |
| version | database version | STRING |


```cypher
CALL db_version() RETURN *;
```

```table
┌─────────┐
│ version │
│ STRING  │
├─────────┤
│ 0.x.0   │
└─────────┘
```

### SHOW_TABLES

`SHOW_TABLES` returns the id, name, type and comment of all tables in the database.

| Column | Description | Type |
| ------ | ----------- | ---- |
| id   | id of the table   | INT    |
| name | name of the table | STRING |
| type | type of the table | STRING |
| comment | comment of the table | STRING |

```cypher
CALL show_tables() RETURN *;
```

```table
┌────────┬─────────┬────────┬───────────────┬─────────┐
│ id     │ name    │ type   │ database name │ comment │
│ UINT64 │ STRING  │ STRING │ STRING        │ STRING  │
├────────┼─────────┼────────┼───────────────┼─────────┤
│ 0      │ User    │ NODE   │ local(kuzu)   │         │
│ 2      │ Follows │ REL    │ local(kuzu)   │         │
│ 1      │ City    │ NODE   │ local(kuzu)   │         │
│ 3      │ LivesIn │ REL    │ local(kuzu)   │         │
└────────┴─────────┴────────┴───────────────┴─────────┘
```

### SHOW_CONNECTION

`SHOW_CONNECTION` returns the source/destination nodes for a relationship/relationship group in the database.

| Column | Description | Type |
| ------ | ----------- | ---- |
| source table name | name of the source node table | STRING |
| destination table name | name of the destination node table | STRING |
| source table primary key | primary key of the source node table | STRING |
| destination table primary key | primary key of the destination node table | STRING |

Show connection on a relationship table:
```cypher
CALL show_connection('LivesIn') RETURN *;
```

```table
┌───────────────────┬────────────────────────┬──────────────────────────┬───────────────────────────────┐
│ source table name │ destination table name │ source table primary key │ destination table primary key │
│ STRING            │ STRING                 │ STRING                   │ STRING                        │
├───────────────────┼────────────────────────┼──────────────────────────┼───────────────────────────────┤
│ User              │ City                   │ name                     │ name                          │
└───────────────────┴────────────────────────┴──────────────────────────┴───────────────────────────────┘
```

### SHOW_ATTACHED_DATABASES

`SHOW_ATTACHED_DATABASES` returns the name, database type of all attached databases.

| name | db_type |
| ------ | ----------- |
| name | name of the attached databases | STRING |
| db_type | type of the table | STRING |

```cypher
CALL show_attached_databases() RETURN *;
```

```table
┌─────────────┬────────────────┐
│ name        │ database type  │
│ STRING      │ STRING         │
├─────────────┼────────────────┤
│ tinysnb     │ DUCKDB         │
│ anotherdb   │ POSTGRES       │
└─────────────┴────────────────┘
```

### SHOW_WARNINGS

`SHOW_WARNINGS` returns the contents of the
[Warnings Table](/import#warnings-table-inspecting-skipped-rows). This is a feature
related to [ignoring errors](/import#ignore-erroneous-rows) when running `COPY/LOAD FROM` statements to scan files.
They will only be reported if the [`IGNORE_ERRORS`](/import#ignore-erroneous-rows) setting is enabled.
Note that the number of warnings that are stored is limited by the `warning_limit` parameter.
See [configuration](/cypher/configuration#configure-warning-limit) for more details on how to set the warning limit.
After `warning_limit` many warnings are stored, any new warnings generated will not be stored.

| Column | Description | Type |
| ------ | ----------- | ---- |
| query_id | The query that triggered the warning | UINT64 |
| message | A description of what triggered the warning | STRING |
| file_path | The path to the file that triggered the warning | STRING |
| line_number | The line number in the file that triggered the warning. | UINT64 |
| skipped_line_or_record | The line or record (depending on the type of file that is being read from) containing the actual value that triggered the warning. For example, for CSV files this will be the line number and for JSON files this will be the record number. | STRING |

```cypher
CALL show_warnings() RETURN *;
```

```table
┌──────────┬─────────────────────────────────────────────────────────────────────────────┬─────────────┬─────────────┬────────────────────────┐
│ query_id │ message                                                                     │ file_path   │ line_number │ skipped_line_or_record │
│ UINT64   │ STRING                                                                      │ STRING      │ UINT64      │ STRING                 │
├──────────┼─────────────────────────────────────────────────────────────────────────────┼─────────────┼─────────────┼────────────────────────┤
│ 1        │ Conversion exception: Cast failed. Could not convert "2147483650" to INT32. │ vPerson.csv │ 2           │ 2,2147483650           │
└──────────┴─────────────────────────────────────────────────────────────────────────────┴─────────────┴─────────────┴────────────────────────┘
```

### CLEAR_WARNINGS
If you would like to clear the contents of the [Warnings Table](/import#warnings-table-inspecting-skipped-rows), you can run the `CLEAR_WARNINGS` function.
This function has no output.

```cypher
CALL clear_warnings();
```

### SHOW_OFFICIAL_EXTENSIONS
If you would like to know all official [extensions](/extensions) available in Kuzu, you can run the `SHOW_OFFICIAL_EXTENSIONS` function.

| Column | Description | Type |
| ------ | ----------- | ---- |
| name | name of the extension | STRING |
| description | description of the extension | STRING |

```cypher
CALL SHOW_OFFICIAL_EXTENSIONS() RETURN *;
```

```table
┌──────────┬─────────────────────────────────────────────────────────────────────────┐
│ name     │ description                                                             │
│ STRING   │ STRING                                                                  │
├──────────┼─────────────────────────────────────────────────────────────────────────┤
│ SQLITE   │ Adds support for reading from SQLITE tables                             │
│ JSON     │ Adds support for JSON operations                                        │
│ ICEBERG  │ Adds support for reading from iceberg tables                            │
│ HTTPFS   │ Adds support for reading and writing files over a HTTP(S)/S3 filesystem │
│ DELTA    │ Adds support for reading from delta tables                              │
│ POSTGRES │ Adds support for reading from POSTGRES tables                           │
│ FTS      │ Adds support for full-text search indexes                               │
│ DUCKDB   │ Adds support for reading from duckdb tables                             │
└──────────┴─────────────────────────────────────────────────────────────────────────┘
```

### SHOW_LOADED_EXTENSIONS
If you would like to know information about loaded extensions in Kuzu, you can run the `SHOW_LOADED_EXTENSIONS` function.

| Column | Description | Type |
| ------ | ----------- | ---- |
| extension name | name of the extension | STRING |
| extension source | whether the extension is officially supported by the Kuzu team or is developed by a third-party | STRING |
| extension path | the path to the extension | STRING |

```cypher
CALL SHOW_LOADED_EXTENSIONS() RETURN *;
```

```table
┌────────────────┬──────────────────┬─────────────────────────────────────────────────────────────────────────────┐
│ extension name │ extension source │ extension path                                                              │
│ STRING         │ STRING           │ STRING                                                                      │
├────────────────┼──────────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ FTS            │ OFFICIAL         │ extension/fts/build/libfts.kuzu_extension                                   │
└────────────────┴──────────────────┴─────────────────────────────────────────────────────────────────────────────┘
```

### SHOW_INDEXES
If you would like to know information about indexes built in kuzu, you can run the `SHOW_INDEXES` function.

| Column | Description | Type |
| ------ | ----------- | ---- |
| table name | the table which the index is built on | STRING |
| index name | the name of the index | STRING |
| index type | the type of the index (e.g. FTS, HNSW) | STRING |
| property names | the properties which the index is built on | STRING[] |
| extension loaded | whether the depended extension has been loaded | BOOL |
| index definition | the cypher query to create the index | STRING |

Note:
Some indexes are implemented within extensions. If a required extension is not loaded, the extension loaded field will display false, and the index definition field will be null.

```cypher
CALL SHOW_INDEXES() RETURN *;
```

```table
┌────────────┬────────────┬────────────┬─────────────────────────┬──────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ table name │ index name │ index type │ property names          │ extension loaded │ index definition                                                                                 │
│ STRING     │ STRING     │ STRING     │ STRING[]                │ BOOL             │ STRING                                                                                           │
├────────────┼────────────┼────────────┼─────────────────────────┼──────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ book       │ bookIdx    │ FTS        │ [abstract,author,title] │ True             │ CALL CREATE_FTS_INDEX('book', 'bookIdx', ['abstract', 'author', 'title' ], stemmer := 'porter'); │
└────────────┴────────────┴────────────┴─────────────────────────┴──────────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### SHOW_PROJECTED_GRAPHS
To list all existing projected graphs in a Kuzu database, you can use the `SHOW_PROJECTED_GRAPHS` function.

| Column | Description | Type |
| ------ | ----------- | ---- |
| name | the name of the projected graph | STRING |
| type | the type of the projected graph | STRING |

```cypher
CALL SHOW_PROJECTED_GRAPHS() RETURN *;
```

```table
┌────────────────┬────────┐
│ name           │ type   │
│ STRING         │ STRING │
├────────────────┼────────┤
│ student        │ CYPHER │
│ social-network │ NATIVE │
└────────────────┴────────┘
```

### PROJECTED_GRAPH_INFO
To show detailed information of the projected graph, you can utilize the `PROJECTED_GRAPH_INFO` function.

There are two types of projected graphs:

### Native projected graph
| Column | Description | Type |
| ------ | ----------- | ---- |
| table type | the type of the table (NODE/REL) | STRING |
| table name | the name of the table | STRING |
| predicate | the predicates defined on the table | STRING |


### Cypher projected graph
| Column | Description | Type |
| ------ | ----------- | ---- |
| cypher statement | the cypher statement used to create the projected graph | STRING |

### Cypher

```cypher
call PROJECTED_GRAPH_INFO('student-social-network') RETURN *;
```

```table
┌────────────┬────────────┬────────────────┐
│ table type │ table name │ predicate      │
│ STRING     │ STRING     │ STRING         │
├────────────┼────────────┼────────────────┤
│ NODE       │ person     │ n.age < 18     │
│ REL        │ knows      │ r.since > 1997 │
└────────────┴────────────┴────────────────┘
```

```cypher
call PROJECTED_GRAPH_INFO('student') RETURN *;
```

```table
┌─────────────────────────────────────┐
│ cypher statement                    │
│ STRING                              │
├─────────────────────────────────────┤
│ MATCH (n) WHERE n.age < 18 RETURN n │
└─────────────────────────────────────┘
```

## YIELD

The `YIELD` clause in Kuzu allows renaming the return columns of a `CALL` function to prevent naming conflicts and improve readability.
Usage:
```cypher
CALL FUNC()
YIELD COLUMN0 [AS ALIAS0], COLUMN1 [AS ALIAS1]
RETURN ALIAS0, ALIAS1
```

Below is an example. To rename the output column name of `current_setting('threads')` from `threads` to `threads_num`, you can use the following query:
```cypher
CALL current_setting('threads')
YIELD threads as threads_num
RETURN *;
```
```table
┌─────────────┐
│ threads_num │
│ STRING      │
├─────────────┤
│ 10          │
└─────────────┘
```

Another useful scenario is to avoid naming conflicts when two call functions in the same query return a column with the same name.
```cypher
CALL table_info('person')
YIELD `property id` as person_id,  name as person_name, type as person_type, `default expression` as person_default, `primary key` as person_pk
CALL table_info('student')
YIELD `property id` as student_id,  name as student_name, type as student_type, `default expression` as student_default, `primary key` as student_pk
RETURN *;
```
```table
┌───────────┬─────────────┬─────────────┬────────────────┬───────────┬────────────┬──────────────┬──────────────┬─────────────────┬────────────┐
│ person_id │ person_name │ person_type │ person_default │ person_pk │ student_id │ student_name │ student_type │ student_default │ student_pk │
│ INT32     │ STRING      │ STRING      │ STRING         │ BOOL      │ INT32      │ STRING       │ STRING       │ STRING          │ BOOL       │
├───────────┼─────────────┼─────────────┼────────────────┼───────────┼────────────┼──────────────┼──────────────┼─────────────────┼────────────┤
│ 0         │ id          │ INT64       │ NULL           │ True      │ 0          │ id           │ INT64        │ NULL            │ True       │
└───────────┴─────────────┴─────────────┴────────────────┴───────────┴────────────┴──────────────┴──────────────┴─────────────────┴────────────┘
```

#### All columns must appear in the `YIELD` clause

If the `YIELD` clause is used after a `CALL` function, **all** return columns of the function must appear in the `YIELD` clause. Using `YIELD *` is not allowed in Kuzu.

For example:
```cypher
CALL table_info('person')
YIELD `property id` as person_id
RETURN person_id
```
The query throws an exception since not all returns columns of the `table_info` function appear in the yield clause.

#### Column names must match origin

The column names to yield must match the original return column names of the call function.
For example:
```cypher
CALL current_setting('threads')
YIELD thread as threads_num
RETURN *;
```
The query throws an exception since the column name to yield is `thread` which doesn't match the return column name(`threads`) of the call function.
