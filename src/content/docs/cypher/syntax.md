---
title: Syntax
description: Basics of the Cypher query language syntax
---

In this page, we list the syntactic features of Cypher as implemented in Kuzu. As described in the
[overview](/cypher) page, Cypher is a declarative graph query language, and Kuzu's implementation is
based on [openCypher](https://opencypher.org/resources/).

## Parsing

### Encoding

The Cypher query parser looks for an input `STRING` that consists of ASCII or unicode characters.
An example is shown below for creating and querying from a node table of German books.

```cypher
// Create a node table of books in German
CREATE NODE TABLE Bücher (title STRING PRIMARY KEY, price INT64);
CREATE (n:Bücher {title: 'Der Thron der Sieben Königreiche'});
SET n.price = 20;
// Query using the unicode representation of the table name
MATCH (n:Bücher)
RETURN label(n);
```
```table
┌─────────┐
│ Bücher  │
│ STRING  │
├─────────┤
│ Bücher  │
└─────────┘
```

### Escaping

To use reserved keywords in identifiers, you can escape them by encapsulating the identifier in backticks `` ` ``.
For example, using the label `Return` for a node table requires escaping.

```cypher
// Create a node table using a label that is also a reserved keyword
CREATE NODE TABLE `Return` (id INT64 PRIMARY KEY, date TIMESTAMP);
CREATE (n:`Return` {id: 1})
SET n.date = TIMESTAMP('2025-01-01');
// Query the node table
MATCH (n:`Return`)
RETURN n.*;
```
```table
┌───────┬─────────────────────┐
│ n.id  │ n.date              │
│ INT64 │ TIMESTAMP           │
├───────┼─────────────────────┤
│ 1     │ 2025-01-01 00:00:00 │
└───────┴─────────────────────┘
```

### Multiline statements and termination

Breaking a query into multiple lines is allowed (and recommended for readability reasons). The query
parser ignores leading and trailing whitespaces.

```cypher
MATCH (a:Person)
WHERE a.age < 30
RETURN a.*;
```

Termination is always indicated by a semicolon `;`, and the parser looks for this symbol to
know when a statement is complete.

## Clauses

A Cypher query may contain one or more clauses and their associated subclauses, and can span multiple lines.
The end of a statement is marked with a semicolon `;`, and the query parser looks for this symbol
to know when a statement is complete.

Examples of clauses include:
- `MATCH`: Find patterns in the graph
- `RETURN`: Specify what subset of the matched data to return

Examples of subclauses (that must reside under a clause) include:
- `WHERE`: Filter the results of a `MATCH` clause
- `LIMIT`: Limit the number of results returned by a query

## Comments

Comments are for humans to read and document their code, and are ignored by the
query parser.
- Single line comments begin with `//` and continue up to the end of the
line. They can be placed at the beginning, in the middle, or at the end of a query.
- Multi-line comments begin with `/*` and continue until they encounter `*/`.
They can be used for comments that are too long to fit on one line.

Some examples are below.

```cypher
// Whole-line comment before a query
MATCH (a:Person) RETURN a.*
```

```cypher
MATCH (a:Person) RETURN a.*  // Comment at the end of a query
```

```cypher
MATCH (a:Person)
// Comment in the middle of a query
WHERE a.age < 30
RETURN a.*
```

```cypher
/*
This is a comment
spanning multiple lines
*/
MATCH (a:Person) RETURN a.* 
```

## Case insensitivity

By and large, you can assume that Cypher queries are case-insensitive.

- **Table names** are case-insensitive. For example, `Person` and `person` are considered the same table.
- **Table column names** are case-insensitive. For example, `LOAD FROM 'myfile.csv' RETURN MyCoLuMn` will work even if
the column name in the source is `mycolumn`.
- **Query keywords** are case-insensitive. For example, `MATCH (a:Person)` and `match (a:person)` are the same.
- **Variable names** are case-insensitive. For example, `MATCH (a) RETURN A` and `MATCH (a) return a` are the same.

### Naming rules and guidelines

The following naming rules and guidelines apply to node and relationship table names:

- Should begin with a valid alphabetic character of type unicode string: `Person`, `CarOwner` 
- Should **not** begin with a number: `1Person` is invalid, but `Person1` is valid
- Should **not** contain whitespaces or special characters other than underscores: `CarOwner` is valid, but `Car Owner` is invalid

The following naming conventions are recommended for node and relationship tables:

| Type | Naming convention | Do | Don't |
|---|---|---|---|
| Node tables | CamelCase | `CarOwner` | `car_owner` |
| Relationship tables | CamelCase or UPPERCASE separated by underscores | `IsPartOf`/`IS_PART_OF` | `isPartOf` or `is_part_of` |

## Parameters

Parameters in Cypher queries are placeholders for values that are provided at runtime.
Parameters are prefixed with a dollar sign `$` and can be used in any part of a query. They are useful for
preventing Cypher injection attacks, and for reusing query templates with different values.

See the [prepared statements](/get-started/prepared-statements) guide for more information on how to use parameters in Kuzu.

## Reserved keywords

Reserved keywords are words that have a special meaning in Cypher. They cannot be used as identifiers
in the following contexts:

- Variables
- Function names
- Parameters

To use a reserved keyword as an identifier, you can [escape it](#escaping).

The following list shows the reserved keywords in Cypher, organized by category:

### Clauses

- `COLUMN`
- `CREATE`
- `DBTYPE`
- `DEFAULT`
- `GROUP`
- `HEADERS`
- `INSTALL`
- `MACRO`
- `OPTIONAL`
- `PROFILE`
- `UNION`
- `UNWIND`
- `WITH`

### Subclauses

- `LIMIT`
- `ONLY`
- `ORDER`
- `WHERE`

### Expressions

- `ALL`
- `CASE`
- `CAST`
- `ELSE`
- `END`
- `ENDS`
- `EXISTS`
- `GLOB`
- `SHORTEST`
- `THEN`
- `WHEN`

### Literals

- `NULL`
- `FALSE`
- `TRUE`

### Modifiers

- `ASC`
- `ASCENDING`
- `DESC`
- `DESCENDING`
- `ON`

### Operators

- `AND`
- `DISTINCT`
- `IN`
- `IS`
- `NOT`
- `OR`
- `STARTS`
- `XOR`

### Schema

- `FROM`
- `PRIMARY`
- `TABLE`
- `TO`
