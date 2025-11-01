---
title: Create table
description: Create table DDL statements for node and relationship tables
---

As a first step to creating your database, you need to define your nodes and relationships.
In the property graph model, nodes and relationships have labels. In Kuzu, every node or
relationship can have only **one** label. Nodes and relationships, and their properties, are
defined through `CREATE NODE TABLE` and `CREATE REL TABLE` statements.
The choice of using the term "table" over "label" is intentional and explained below.

:::note[Why are there no "labels"?]
Kuzu uses the term **table** rather than **label** because, unlike other graph systems, Kuzu is
ultimately a relational system in the sense that it stores and processes sets of tuples, i.e., tables
or relations.

In fact, Kuzu's data model can be viewed as a _structured_ property graph model, in
which you tag your tables as "node" and "relationship" tables depending on their roles in your
application data. Nodes are generally
well-suited for representing entities, while relationships are used to represent the
connections between these entities. Relationships are also the primary means to *join* nodes with each other to
find paths and patterns in your graph database. When you sketch out a mental map of your
nodes and relationships, it is equivalent to defining your records as nodes or relationship tables.

Similar to table definitions in SQL, node and relationship tables have
primary keys. Node tables explicitly define primary keys as one of their properties, while relationship tables
implicitly define primary keys using the primary keys of the corresponding `FROM` and `TO` node records. 
Furthermore, properties can be thought of as equivalent to columns in a table, similar to relational systems,
justifying our choice of using the term "table" in our design of the system.
:::

## Create a node table

To create a node table, use the `CREATE NODE TABLE` statement as shown below:

```cypher
CREATE NODE TABLE User (
    name STRING,
    age INT64 DEFAULT 0,
    reg_date DATE,
    PRIMARY KEY (name)
);
```

Alternatively, you can specify the keyword `PRIMARY KEY` immediately after the column name, as follows:
```cypher
CREATE NODE TABLE User (
    name STRING PRIMARY KEY,
    age INT64 DEFAULT 0,
    reg_date DATE
);
```

The above statements add a `User` table to the database with three properties: `name`, `age`, and `reg_date`,
with `name` set as the primary key of the table.

The name of the node table (`User`) serves as the "label" with which we can query in Cypher. For example:
```cypher
MATCH (a:User)
RETURN a.name, a.age;
```

### Primary key

Kuzu requires a primary key column for node tables, which can be a property of the node of type `STRING`, numeric, `DATE`, or `BLOB`.
Kuzu will generate an index to do quick lookups on the primary key (e.g., `name` in the above example).
Alternatively, you can use the [`SERIAL`](/cypher/data-types/#serial) data type to use an auto-incremented integers as the primary key.

### Default value

Each property in a table can have a default value. If not specified, the default value is `NULL`.

```cypher
CREATE NODE TABLE User(
    name STRING PRIMARY KEY,
    age INT64 DEFAULT 0,
    reg_date DATE
);
```

In the above example, the `age` property is set to a default value of `0` rather than `NULL`. The
`name` and `reg_date` properties do not have default values, so they will be `NULL` if not provided
during data insertion.

The default value can also be a function call.
For example, if you want to set the default value of a timestamp property to the current timestamp,
you can use the `current_timestamp()` function.
```cypher
CREATE NODE TABLE User(
    id INT64 PRIMARY KEY,
    happens_at TIMESTAMP DEFAULT current_timestamp()
);
```

## Create a relationship table

Once you create node tables, you can define relationships between them using the `CREATE REL TABLE` statement.
The following statement adds to the catalog a `Follows` relationship table between `User` and `User` with one `date` property on the relationship.

```cypher
CREATE REL TABLE Follows(FROM User TO User, since DATE);
```

Defining a relationship table with multiple node table pairs is also possible. The following statement
adds a `Knows` relationship table between two node table pairs: (i) `User` and `User`, and (ii) `User` and `City`.

```cypher
CREATE REL TABLE Knows(FROM User TO User, FROM User TO City);
```

:::caution[Note]
- **Syntax**: There is no comma between the `FROM` and `TO` clauses. However, a comma is needed between two node table pairs.
- **Directionality**: Each relationship has a direction following the property graph model. So when `Follows` relationship records are added, each one has a specific source (`FROM`) node and a specific destination (`TO`) node.
- **Primary keys**: You cannot define a primary key for relationships. Each relationship gets a unique internally-generated edge ID. To check if two edges are the same, i.e., have the same edge ID, use the `=` and `!=` operator with the `ID()` function. For example, the query `MATCH ()-[r1:Follows]->()<-[r2:Follows]-() WHERE ID(r1) != ID(r2) RETURN *` ensures that different relationships bind to `r1` and `r2`.
:::

### Relationship multiplicities

For any relationship label `E`, by default there can be multiple relationships from any node `v` both in the forward and backward direction. In database terminology, relationships are by default many-to-many. In the first `Follows` example above: (i) `v` can follow multiple other user nodes; and (ii) `v` can be followed by multiple other user nodes.

You can optionally constrain the multiplicity to _at most 1_ in either direction, using the `MANY_ONE`, `ONE_MANY`, `MANY_MANY` or `ONE_ONE` clauses.

:::note[Note]
We don't yet support "exactly 1" semantics as you may be used to via foreign key constraints in relational systems. This is planned for a future release.
:::

We show a few examples below:

```cypher
CREATE REL TABLE LivesIn(FROM User TO City, MANY_ONE);
```

The `LivesIn` relationship has `n-to-1` multiplicity, implying that each user can live in _at most one_ city.
It does not put any constraint in the "backward" direction, i.e., there can be multiple users living in the same city.


```cypher
CREATE REL TABLE Likes(FROM Pet TO User, ONE_MANY);
```

The `Likes` relationship has `1-to-n` multiplicity, implying that each user node can like _at most one_ pet.
It does not place any constraints in the forward direction, i.e., each pet may be liked by multiple users.

In general, considering the multiplicity of a relationship `E`, if the "source side" is `ONE`,
then for each node `v` that can be the destination of `E` relationships, `v` can have at most one backward edge of label `E`.
If the "destination side" is `ONE`, then each node `v` that can be the source of `E` relationships, `v` can have at most one forward edge of label `E`.

### Create relationship table group [deprecated]
:::note[Note]
Relationship table group has been deprecated since our v0.8.0 release. You can now define multiple node table pairs in rel table using multiple `FROM ... TO ...` clauses.
:::


You can use relationship table groups to gain added flexibility in your data modelling, by defining a relationship table with multiple node table pairs. This is done via the `CREATE REL TABLE GROUP` statement. This has a similar syntax to `CREATE REL TABLE`, but uses multiple `FROM ... TO ...` clauses. Internally, a relationship table group defines a relationship table for _each_ `FROM ... TO ...` block. Any query to a relationship table group is treated as a query on the union of _all_ relationship tables in the group.


```cypher
CREATE REL TABLE GROUP Knows(FROM User TO User, FROM User TO City, year INT64);
```

The above statement creates a `Knows_User_User` rel table, a `Knows_User_City` rel table, and a `Knows` rel table group referring to these two rel tables.

A relationship table group can be used as a regular relationship table for querying purposes.

```cypher
MATCH (a:User)-[:Knows]->(b)
RETURN *;
```

The query above is equivalent to the following:

```cypher
MATCH (a:User)-[:Knows_User_User|:Knows_User_City]->(b)
RETURN *;
```

As you can imagine, the more relationships you want to selectively query on, the more useful relationship table groups become.

## If not exists

If the given table name already exists in the database, Kuzu throws an exception when you try to create it again.
You can use the `IF NOT EXISTS` clause to avoid the error. This tells Kuzu to do nothing when
the given table name already exists in the database. For example:

```cypher
CREATE NODE TABLE IF NOT EXISTS User (name STRING PRIMARY KEY, age INT64 DEFAULT 0, reg_date DATE);
CREATE NODE TABLE IF NOT EXISTS User (name STRING PRIMARY KEY, age INT64 DEFAULT 0, reg_date DATE);
CREATE REL TABLE IF NOT EXISTS Follows(FROM User TO User, since DATE);
CREATE REL TABLE IF NOT EXISTS Follows(FROM User TO User, since DATE);
```
The second node and relationship table creation statements will be ignored.

## Create table as

A common operation is to create a table and then immediately import some data into it.
You can simplify this process by using the `CREATE NODE TABLE AS` or `CREATE REL TABLE AS` clauses.

### Create node table as

Say you want to create a `Person` node table and insert data from a CSV file:

```cypher
CREATE NODE TABLE Person(id INT64 PRIMARY KEY, name STRING, city STRING, age INT64);
COPY Person FROM "person.csv";
```

You can instead use `CREATE NODE TABLE AS` to perform the two operations in a single query:

```cypher
CREATE NODE TABLE Person AS
    LOAD FROM "person.csv"
    RETURN *;
```

Note that the above query did not need an explicit schema for the table. Kuzu will automatically infer the
schema from the result of the subquery. In this case, `LOAD FROM` infers the properties names and types from
the CSV file header, which in turn is used to define the schema of the `Person` table.

Another example is to use a `MATCH` clause to create a new node table from an existing one:

```cypher
CREATE NODE TABLE YoungPerson AS
    MATCH (p:Person)
    WHERE p.age < 25
    RETURN p.*;
```

### Create rel table as

You can use the same technique to create relationship tables. For example:
```cypher
// From a CSV file
CREATE REL TABLE Knows(FROM Person TO Person) AS
    LOAD FROM "knows.csv"
    RETURN *;

// From a MATCH clause
CREATE REL TABLE KnowsSameCity(FROM Person TO Person) AS
    MATCH (a:Person)-[e:Knows]->(b:Person)
    WHERE a.city = b.city
    RETURN a.id, b.id;
```

### Create table as if not exists

You can also use `IF NOT EXISTS` to create the tables only if they don't already exist:
```cypher
CREATE NODE TABLE IF NOT EXISTS Person AS
    LOAD FROM "person.csv"
    RETURN *;

CREATE REL TABLE IF NOT EXISTS Knows(FROM Person TO Person) AS
    LOAD FROM "knows.csv"
    RETURN *;
```
