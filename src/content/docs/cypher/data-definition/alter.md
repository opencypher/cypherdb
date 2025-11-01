---
title: Alter
description: Alter DDL statements
---

## Add column

`ADD COLUMN` allows you to add a new column to a node or relationship table. If you don't specify a default value, the newly added column is filled with `NULL` values.

Column names must be unique within a node or relationship table.

For example, consider that you try to run the following command to add a column `age`, but it
already exists in the `User` table:
```cypher
ALTER TABLE User ADD age INT64;
```
The query will raise the following exception:
```
"Binder exception: Property: age already exists."
```

The following query adds a new column with the default value `NULL` to the User table.
```cypher
ALTER TABLE User ADD grade INT64;
```

You can also specify the default value of the added column.
```cypher
ALTER TABLE User ADD grade INT64 DEFAULT 40;
```

#### Add column if not exists

If the given column name already exists in the table, Kuzu throws an exception when you try to create it.
To avoid the exception being raised, use the `IF NOT EXISTS` modifier. This tells Kuzu to do nothing when
the given column name already exists in the table.

Example:
```cypher
ALTER TABLE User ADD IF NOT EXISTS grade INT64;
```
This query tells Kuzu to only create the `grade` column if it doesn't exist.

The same applies to relationship tables.

## Drop column

`DROP COLUMN` allows you to remove a column from a table.

The following query drops the age column from the User table.
```cypher
ALTER TABLE User DROP age;
```

#### Drop column if exists

If the given column name does not exist in the table, Kuzu throws an exception when you try to drop it.
To avoid the exception being raised, use the `IF EXISTS` modifier. This tells Kuzu to do nothing when
the given column name does not exist in the table.

Example:
```cypher
ALTER TABLE User DROP IF EXISTS grade;
```
This query tells Kuzu to only drop the `grade` column if it exists.

The same applies to relationship tables.

## Add connection to relationship table

`ADD FROM <node_table_name> TO <node_table_name>` allows you to add a connection between two node tables into an existing relationship table.

The following example creates a node table `Celebrity` and adds `User` follows `Celebrity` into `Follows` relationship table.
```cypher
CREATE NODE TABLE Celebrity(name STRING PRIMARY KEY);
ALTER TABLE Follows ADD FROM User TO Celebrity;
```

#### Add connection if not exists

Use the `IF NOT EXISTS` modifier to do nothing if the given connection already exists.

Example:
```cypher
ALTER TABLE Follows ADD IF NOT EXISTS FROM User TO Celebrity;
```

## Drop connection from relationship table

`DROP FROM <node_table_name> TO <node_table_name>` allows you to drop a connection between two node tables from an existing relationship table.

The following example drops the connection between `User` and `Celebrity` from `Follows` relationship table.
```cypher
ALTER TABLE Follows DROP FROM User TO Celebrity;
```

#### Drop connection if exists

Use the `IF  EXISTS` modifier to do nothing if the given connection does not exist.

Example:
```cypher
ALTER TABLE Follows DROP IF EXISTS FROM User TO Celebrity;
```

## Rename table

`RENAME TABLE` allows you to rename a table.

The following query renames table User to Student.
```cypher
ALTER TABLE User RENAME TO Student;
```

## Rename column

`RENAME COLUMN` allows you to rename a column of a table.<br />

The following query renames the age column to grade.
```cypher
ALTER TABLE User RENAME age TO grade;
```

## Comment on a table

`COMMENT ON` allows you to add comments to a table.

The following query adds a comment to `User` table.
```cypher
COMMENT ON TABLE User IS 'User information';
```
Comments can be extracted through the `SHOW_TABLES()` function. See [CALL](/cypher/query-clauses/call) for more information.
```cypher
CALL SHOW_TABLES() RETURN *;
```
```table
┌───────────┬───────────┬──────────────────┐
│ TableName │ TableType │ TableComment     │
├───────────┼───────────┼──────────────────┤
│ User      │ NODE      │ User information │
│ City      │ NODE      │                  │
└───────────┴───────────┴──────────────────┘
```

