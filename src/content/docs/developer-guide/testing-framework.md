---
title: Testing framework
description: "End-to-end testing framework for Kuzu using Cypher statements and .test files"
---

## Introduction

Testing is a crucial part of Kuzu to ensure that existing features continue to work correctly 
while developing new features. In general, we avoid testing individual components of the code.
Instead, we test most of the functionality with end-to-end (e2e) tests using Cypher statements.

The e2e testing framework uses `.test` files stored in the `test/test_files` directory. These files
are similar to [sqllogictest](https://www.sqlite.org/sqllogictest/doc/trunk/about.wiki) files commonly
used to test SQL-based systems.

The test files are split into two sections: the test header and body, explained in the following sections.
Cypher statements are specified in the body, grouped under a `CASE` block, together with the expected result.
Here is a basic test file:

```
# test/test_files/basic.test
# Comments are allowed
-DATASET CSV tinysnb
-BUFFER_POOL_SIZE 64000000
--

-CASE BasicTest
-STATEMENT MATCH (p:person) RETURN COUNT(*);
---- 1
6000
```

The first three lines represent the header, ending with a `--`. The rest of the file is the body.
The testing framework parses these files and registers corresponding [GTest](https://google.github.io/googletest/advanced.html#registering-tests-programmatically) tests.
All e2e tests have an `e2e_test_` prefix in GTest, which helps distinguish the e2e tests from other internal tests.
For example, `BasicTest` is registered as `e2e_test_BasicTest`, which programmatically corresponds to:

```cpp
TEST_F(basic, e2e_test_BasicTest) { ... }
```

For test files stored in subdirectories of `test/test_files` or `extension/name_of_extension/test/test_files`, the test
name in GTest will be prepended with the relative path delimited by `~`, followed by a dot and the test case name.

The testing framework runs the Cypher statements specified in the test files and asserts that the actual output from Kuzu
matches the specified results.

:::caution[Note]
The `-` character is not allowed in test file names and case names. In the GTest framework, `-` has a special meaning
that can inadvertently exclude a test case, leading to the test file being silently skipped. The `e2e_test` runner will
throw an exception if a test file name contains `-`.
:::

## Running the tests

We primarily use `ctest` to run tests. Use the command
`make test` to build and run all tests. By default, the tests will run
concurrently with 10 threads, but it is also possible to change the number of parallel jobs by
running `make test TEST_JOBS=X`, where `X` is the desired number of jobs to be run in parallel.

### Running a specific group or test case

There are two ways to run a specific e2e test or group of tests:

#### 1. Using ctest

Example:

```bash
# Build tests
$ make test-build

# First cd to build/relwithdebinfo/test
$ cd build/relwithdebinfo/test

# Run all tests from `test/test_files/common/types/interval.test`
$ ctest -R common~types~interval

# Run only the DifferentTypesCheck test
$ ctest -R common~types~interval.DifferentTypesCheck

# Run in verbose mode
$ ctest -V -R common~types~interval.DifferentTypesCheck

# Run in parallel
$ ctest -j 10
```

To switch between main tests and extension tests, pass `E2E_TEST_FILES_DIRECTORY=extension` as an environment variable when calling `ctest`.

Example:

```bash
# Build extension tests
$ make extension-test-build

# First cd to build/relwithdebinfo/test
$ cd build/relwithdebinfo/test

# Run all the extension tests (-R e2e_test is used to filter the extension tests, as all extension tests are e2e tests)
$ E2E_TEST_FILES_DIRECTORY=extension ctest -R e2e_test
```

:::caution[Note]
Windows has different syntax for setting environment variables:
```cmd
$ set "E2E_TEST_FILES_DIRECTORY=extension" && ctest -R e2e_test
```
:::

#### 2. Using the `e2e_test` binary

The test binaries are available in the `build/{relwithdebinfo,release,debug}/test/runner`
folder. To run any of the main tests, you can run `e2e_test` specifying the relative path file inside
`test_files`:

```bash
# Run all tests inside test/test_files/copy
$ ./e2e_test copy

# Run all tests from test/test_files/long_string_pk.test file
$ ./e2e_test long_string_pk/long_string_pk.test

# Run all tests
$ ./e2e_test .
```

Use `E2E_TEST_FILES_DIRECTORY` to set a different root directory for the test files, for example when running the tests
from the root directory of the Kuzu repo:
```bash
# Run all tests inside test/test_files/copy
$ E2E_TEST_FILES_DIRECTORY='.' ./build/relwithdebinfo/test/runner/e2e_test test/test_files/copy

# Run all tests from test/test_files/long_string_pk.test file
$ E2E_TEST_FILES_DIRECTORY='.' ./build/relwithdebinfo/test/runner/e2e_test test/test_files/long_string_pk/long_string_pk.test

# Run all tests
$ E2E_TEST_FILES_DIRECTORY='.' ./build/relwithdebinfo/test/runner/e2e_test test/test_files
```

You can similarly run any of the extension tests:
```bash
# Run all tests inside extension/duckdb
$ E2E_TEST_FILES_DIRECTORY='.' ./build/relwithdebinfo/test/runner/e2e_test extension/duckdb

# Run all tests from extension/json/test/copy_to_json.test file
$ E2E_TEST_FILES_DIRECTORY='.' ./build/relwithdebinfo/test/runner/e2e_test extension/json/test/copy_to_json.test

# Run all extension tests
$ E2E_TEST_FILES_DIRECTORY='.' ./build/relwithdebinfo/test/runner/e2e_test extension
```

:::caution[Note]
Some test files contain multiple test cases, and sometimes it is not easy
to find the output from a failed test. In this situation, the flag
`--gtest_break_on_failure` might be helpful to break the test on failure.
:::

### Running skipped tests

Some tests in test files are marked as `SKIP` which are ignored by default when running the tests.
To run those tests without editing the files, you can use `--gtest_also_run_disabled_tests`:
```bash
$ E2E_TEST_FILES_DIRECTORY='.' ./build/relwithdebinfo/test/runner/e2e_test --gtest_also_run_disabled_tests extension/neo4j/test/test_files/basic.test
```

## Test file header

The `.test` file header contains one required parameter:
`-DATASET`, to specify the test group name and the dataset to be used. If no
dataset is required, use the keyword 'empty'.

### Specifying the dataset

| Property                         | Description                                                                                                                  |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `-DATASET [type] [dataset name]` | **Type:** CSV, PARQUET, NPY, KUZU or empty<br/> **Dataset name:** the name of a directory inside `dataset/`. E.g., `tinysnb`. |

The `KUZU` dataset type is a Kuzu database file.

Examples:

```
-DATASET CSV tinysnb
--
```

```
-DATASET PARQUET demo-db/parquet
--
```

#### Converting CSV to Parquet

It is also possible to make a conversion from CSV dataset to PARQUET file format
using `CSV_TO_PARQUET(dataset path)`. This case is especially useful to ensure
the expected result remains the same for both CSV and PARQUET file format
without storing the same dataset in the codebase twice.

```
-DATASET PARQUET CSV_TO_PARQUET(tinysnb)
--
```

### Other properties

Other optional parameters include `-BUFFER_POOL_SIZE`, `-CHECKPOINT_WAIT_TIMEOUT` and `-SKIP`. A
`-SKIP` in the header disables the entire suite, with the tests displayed as disabled when running `ctest`.
Skipped tests can be [forced to run](#running-skipped-tests) with a flag.

## Test case

The following example illustrates a basic structure of how to create a test case:

```
-DATASET tinysnb
--

-CASE MyTest
-LOG Test A Count
-STATEMENT MATCH (p:person) RETURN COUNT(*);
---- 1
6000
```

In the example above:

`-CASE` is the name of the test case, analogous to `TEST_F(Test, MyTest)` in C++.  
`-LOG` is optional and will be only used for display purposes when running in verbose mode.  
`-STATEMENT` is followed by 4 dashes `----` alongside the expected result (error, success, hash, or the number of the tuples).

When specifying a number after the dashes, it's necessary to add the same number of tuples in the
following lines.

If the subsequent lines contain additional statements to validate, they will be incorporated into the same test case
unless a new `-CASE` is written.

### Results

There are three ways to specify the expected result:

| Result                                                                                                                          | Description                                                                                                                |
| ------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `---- error`                                                                                                                    | The following lines must be the expected error message.                                                                    |
| `---- error(regex)`                                                                                                             | The following lines must be a regex pattern matching the expected error message.                                           |
| `---- ok`                                                                                                                       | Does not require any additional information below the line.                                                                |
| `---- hash`                                                                                                                     | A single line must follow containing the number of values in the query results and the md5 hash value of the query result. |
| <span style="text-wrap: nowrap;">`---- [number of expected tuples]` <br> `[expected tuple 1]` <br> `[expected tuple 2]` </span> | The first line after `----` contains the number of tuples and the following lines must exactly match the query results.    |
| <span style="text-wrap: nowrap;">`---- [number of expected tuples]` <br> `<FILE>:file_name.txt` </span> | A file stored under `test/answers/` containing the specified number of tuples.  |

:::note[Note]
By default, the expected result tuples can be written in any order. The runner will sort the
actual and expected results before comparing. If you want to test that the results are returned in
a specific order, for example to test an `ORDER BY` clause, you can
use `-CHECK_ORDER`. Note that when using the `hash` result type, the actual output must match the
original order of the tuples used to compute the specified hash.
:::

```
# Expects error message
-STATEMENT MATCH (p:person) RETURN COUNT(intended-error);
---- error
Error: Binder exception: Variable intended is not in scope.

# Expects regex-matching error message
-STATEMENT MATCH (p:person) RETURN COUNT(intended-error);
---- error(regex)
^Error: Binder exception: Variable .* is not in scope\.$

# Success results don't need anything after the dashes
-STATEMENT CREATE NODE TABLE Person (ID INT64 PRIMARY KEY);
---- ok

-CHECK_COLUMN_NAMES
-STATEMENT MATCH (a:person) RETURN a.fName LIMIT 4;
---- 5
a.fName
Alice
Bob
Carol
Dan

# Using hash with a query equivalent to the above
-STATEMENT MATCH (a:person) RETURN a.fName LIMIT 4;
-CHECK_ORDER # order of output tuples matters with hashes
---- hash
4 c921eb680e6d000e4b65556ae02361d2

# Arbitrary content can be inserted between the expected count and the md5 hash
# The following result is equivalent: 
-STATEMENT MATCH (a:person) RETURN a.fName LIMIT 4;
-CHECK_ORDER
---- hash
4 values hashed to c921eb680e6d000e4b65556ae02361d2

# Using a file
-STATEMENT MATCH (p0:person)-[r:knows]->(p1:person) RETURN ID(r);
---- 5001
<FILE>:file_with_answers.txt
```

### Additional properties

It is also possible to use the additional properties inside each test case:

| Property              | Parameter      | Description                                                                                                         |
| --------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------- |
| `-LOG`                | any string     | Define a name for each block for informational purposes.                                                            |
| `-SKIP`               | none           | Register the test but skip running it by default. It will display as disabled in the test run.                      |
| `-PARALLELISM`        | integer        | Default: 4. The number of threads that will be set by `connection.setMaxNumThreadForExec()`.                        |
| `-CHECK_ORDER`        | none           | By default, the query results and expected results are ordered before asserting comparison.                         |
| `-CHECK_COLUMN_NAMES` | none           | Includes the column names as the first row of query result. Requires +1 to number of expected tuples.               |
| `-RELOADDB`           | none           | Reload database from file system.                                                                                   |
| `-REMOVE_FILE`        | file path      | Delete the file at the given path.                                                                                  |
| `-IMPORT_DATABASE`    | directory path | Close current database. Open a new database in the given directory.                                                 |
| `-CHECK_PRECISION`    | none           | Checks floating point columns using machine epsilon precision. Requires `-CHECK_ORDER` enabled.                     |

### Defining variables

A variable can be defined and re-used inside a statement, results, or error
message:

```
-DEFINE EXPECTED_RESULT "0|1:0|0"
-CASE Backward
-STATEMENT MATCH (p0:person)<-[r:knows]-(p1:person) WHERE p0.ID = 0 RETURN p0.ID, ID(r), p1.ID;
---- 1
${EXPECTED_RESULT}

-CASE Forward
-STATEMENT MATCH (p0:person)-[r:knows]->(p1:person) WHERE p0.ID = 0 RETURN p0.ID, ID(r), p1.ID;
---- 1
${EXPECTED_RESULT}
```

A more practical example is using functions alongside `-DEFINE`. The framework
currently supports the following functions:

| Function                                | Description                                  | Example                                                                                   |
| --------------------------------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `-DEFINE [var] ARANGE [start] [end]`    | Generate a list of numbers from start to end | `-DEFINE STRING_OVERFLOW ARANGE 0 5` <br/> generates `STRING_OVERFLOW = [0,1,2,3,4,5]`    |
| `-DEFINE [var] REPEAT [count] "[text]"` | Repeat the text multiple times               | `-DEFINE MY_STR REPEAT 3 "MyString"`<br/> generates `MY_STR = "MyStringMyStringMyString"` |

#### Pre-defined variables

The following variables are available for use inside statements:

| Variable                 | Description                                                                                                                                                      |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `${KUZU_ROOT_DIRECTORY}` | Kuzu directory path                                                                                                                                              |
| `${DATABASE_PATH}`       | When a test case runs, a temporary database path is created and cleaned up after the suite finishes. This variable represents the path of the running test case. |

### Multiple queries

A statement can contain multiple queries, each separated by semi-colons, as per normal usage.
The statement would then have multiple results, in the order of the queries.

```
-STATEMENT CREATE NODE TABLE V1 (id UUID PRIMARY KEY);
           CREATE NODE TABLE V2 (id INT64 PRIMARY KEY);
           WITH NULL as bid MATCH (b:V1 {id: bid}) RETURN b;
---- ok
---- ok
---- 0
```

### Defining statement blocks

A statement block can be defined and re-used along the test file.  
`-DEFINE_STATEMENT_BLOCK` defines a block that can be used by
calling `-INSERT_STATEMENT_BLOCK` in any part of the test case body. It
can be useful to perform checks without having to re-write the same statements
again.

```
-DEFINE_STATEMENT_BLOCK CREATE_PERSON_REL [
-STATEMENT MATCH (a:person), (b:person) WHERE a.ID=10 AND b.ID=20 CREATE (a)-[e:knows]->(b);
---- ok
-STATEMENT MATCH (a:person), (b:person) WHERE a.ID=1 AND b.ID=2 CREATE (a)-[e:knows]->(b);
---- ok
]

-CASE TestCaseA
-INSERT_STATEMENT_BLOCK CREATE_PERSON_REL
-STATEMENT ...
---- ok

-CASE TestCaseB
-INSERT_STATEMENT_BLOCK CREATE_PERSON_REL
-STATEMENT ...
---- ok
```

### Multiple connections

The following example illustrates how to use multiple connections:

```
-DATASET CSV tinysnb

--

-CASE TimeoutErrorTest
-CHECKPOINT_WAIT_TIMEOUT 10000
-CREATE_CONNECTION conn_read
-CREATE_CONNECTION conn_write
-STATEMENT [conn_read] BEGIN READ TRANSACTION;
---- ok
-STATEMENT [conn_write] BEGIN WRITE TRANSACTION;
---- ok
-STATEMENT [conn_write] MATCH (a:person) WHERE a.ID=0 SET a.age=70;
---- ok
-STATEMENT [conn_write] COMMIT;
---- error
Timeout waiting for read transactions to leave the system before committing and checkpointing a write transaction. If you have an open read transaction close and try again.
-STATEMENT [conn_read] MATCH (a:person) WHERE a.ID=0 RETURN a.age;
---- 1
35
```

In the example above:

`-CREATE_CONNECTION conn.*` initiates a connection to the database. It's essential that the connection name matches the specified prefix `conn`, like `conn_write`, `conn_read`.  
`-STATEMENT` is followed by a connection name that was defined in the `-CREATE_CONNECTION` statement. If a connection name is not explicitly mentioned in a statement, the testing framework will default to using the default connection.

### Batch statements

You can use `-BATCH_STATEMENTS` to test a batch of query statements from a file:

```
-BATCH_STATEMENTS <FILE:>small_list_becomes_large_list_after_insertion.cypher
---- ok
```

In the example above:

`-BATCH_STATEMENTS` is followed by `<FILE>:` , indicating that you're specifying a file to be used.
The file must be created inside `test/statements/<name-of-the-file.cypher>`. By doing so, the testing
framework reads the query statements from the file and executes each query statement.

### Random Split Files to Copy

You can use `-MULTI_COPY_RANDOM` to randomly split a copy-able source into multiple csv files, which will then each be copied to a specified table.

```
-MULTI_COPY_RANDOM 5 test "${KUZU_ROOT_DIRECTORY}/dataset/large-serial/serialtable_merged.csv"
```

In the example above:

`-MULTI_COPY_RANDOM` is followed by an integer, being `5`, indicating the number of fragments the source should be split into. The next parameter is the table to copy into, here being `test`. The last parameter is a string that is the exact string used if the source were to be used in a `COPY FROM` statement (including the quotes and any specifications such as `delim` that follow).

Optionally, a seed can be specified after the table name to stably split the source or to reproduce a previous result. The seed is made up of two unsigned 64-bit integers. So, formally, the syntax for `-MULTI_COPY_RANDOM` is:

```
-MULTI_COPY_RANDOM <int> <string> [ SEED <int> <int> ] <string>
```

## Automatically creating test results

To avoid having to manually write test results, the test runner supports an `E2E_REWRITE_TESTS=1` mode,
similar to `sqllogictest`'s [completion mode](https://www.sqlite.org/sqllogictest/doc/trunk/about.wiki).
When turned on, the test runner switches from checking the specified output in a test file against
the actual output from Kuzu to overwriting the result section for each statement in the test file.
The mode is intended to make it easy to write new tests and also modify the existing tests if the
output from Kuzu changes during development.

The following example run shows how the tests are rewritten automatically:

```bash
$ cat test/test_files/demo.test
-DATASET CSV empty

--

-CASE demo
-STATEMENT CREATE NODE TABLE A(ID SERIAL PRIMARY KEY, name STRING);
---- ok
-STATEMENT CREATE (:A), (:A {name: 'Alice'});
---- ok
-STATEMENT CREATE (:A), (:A {name: 'Alice'}), (:A {name: 'Bob'});
---- ok
-STATEMENT MATCH (n) RETURN n.name;
---- 0

$ E2E_REWRITE_TESTS=1 E2E_TEST_FILES_DIRECTORY='.' ./build/relwithdebinfo/test/runner/e2e_test test/test_files/demo.test

$ cat test/test_files/demo.test                                                                                         
-DATASET CSV empty

--

-CASE demo
-STATEMENT CREATE NODE TABLE A(ID SERIAL PRIMARY KEY, name STRING);
---- ok
-STATEMENT CREATE (:A), (:A {name: 'Alice'});
---- error
Parser exception: Invalid input <CREATE (:A), (:A {name: 'Alice'};>: expected rule oC_SingleQuery (line: 1, offset: 32)
"CREATE (:A), (:A {name: 'Alice'};"
                                 ^
-STATEMENT CREATE (:A), (:A {name: 'Alice'}), (:A {name: 'Bob'});
---- ok
-STATEMENT MATCH (n) RETURN n.name;
---- 3

Alice
Bob
```

To rewrite the full test suite, the rewrite mode can be turned on using a single thread only:
```bash
$ E2E_REWRITE_TESTS=1 make test NUM_THREADS=7 TEST_JOBS=1
```

:::caution[Info]
If unordered results in a test file match the actual output from Kuzu, the
existing results will be left unmodified to avoid unnecessary changes. However,
on a mismatch, the correct results will be written in a sorted order.

Currently, this mode does not support rewriting tests using the following features and are left unmodified:
* Results stored in a file using `<FILE>:`.
* Statement in statement blocks or batch statements.
* Results containing variables such as `${KUZU_ROOT_DIRECTORY}`.
:::


## Examples

### Full example with comments

```
# Header
# We can add -SKIP here if we need to temporarily skip the whole file
-BUFFER_POOL_SIZE 64000000
-CHECKPOINT_WAIT_TIMEOUT 10000
-DATASET PARQUET CSV_TO_PARQUET(tinysnb)

--

-DEFINE_STATEMENT_BLOCK create_rel_set [
-STATEMENT MATCH (a:person), (b:person)
                 WHERE a.ID=10 AND b.ID=20
                 CREATE (a)-[e:knows]->(b);
---- ok
-STATEMENT MATCH (a:person), (b:person)
                 WHERE a.ID=1 AND b.ID=2
                 CREATE (a)-[e:knows]->(b);
---- ok
]

-CASE TestRelationSet

-LOG Current Relation Test
-STATEMENT MATCH (a:person)-[e:knows]->(b:person) RETURN COUNT(*);
---- 1
2

# This is also part of TestRelationSet test case
-LOG Create Relation Set
-INSERT_STATEMENT_BLOCK create_rel_set
-STATEMENT MATCH (a:person)-[e:knows]->(b:person) RETURN COUNT(*);
---- 1
4

# This is also part of TestRelationSet test case
-LOG Test Duplicated Primary Key
-STATEMENT MATCH (a:person), (b:person)
                 WHERE a.ID=1 AND b.ID=20
                 CREATE (a)-[e:knows]->(b);
---- error
"Exception: Duplicate primary key"


# New test case. Start a new database
-CASE OrderCheck

-CHECK_ORDER
-PARALLELISM 1
-STATEMENT MATCH (a:person)-[:studyAt]->(b:organisation)
             WHERE b.name = "Waterloo"
             RETURN a.name,
                    a.age ORDER BY a.age DESC;
---- 2
Karissa|40
Adam|30

# Read query results from a file to compare
-CASE PersonOrganisationRelTest
-STATEMENT MATCH (a:person)-[:studyAt]->(b:organisation)
RETURN a.ID, b.ID;
---- 16
<FILE>:person_study_at_answers.txt
```

### Sample test log

| File                                                                                                                                                   | Description             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| [set.test](https://github.com/kuzudb/kuzu/blob/1bd26e46eac7a5de1d8776bab74988b05c4913dc/test/test_files/tinysnb/update_node/set.test#LL78C33-L78C36)   | ARANGE example          |
| [copy_long_string.test](https://github.com/kuzudb/kuzu/blob/1bd26e46eac7a5de1d8776bab74988b05c4913dc/test/test_files/copy/copy_long_string.test)       | REPEAT example          |
| [copy_multiple_files.test](https://github.com/kuzudb/kuzu/blob/1bd26e46eac7a5de1d8776bab74988b05c4913dc/test/test_files/copy/copy_multiple_files.test) | Using statement blocks  |
| [catalog.test](https://github.com/kuzudb/kuzu/blob/1bd26e46eac7a5de1d8776bab74988b05c4913dc/test/test_files/exceptions/catalog/catalog.test)           | Dealing with exceptions |
