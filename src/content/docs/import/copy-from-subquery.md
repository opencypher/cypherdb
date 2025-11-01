---
title: Copy from subquery
description: Bulk import data from MATCH queries or LOAD FROM scans using subqueries in COPY FROM statements.
---

You can bulk import the results of a subquery like `MATCH ....` by attaching
that query as a subquery of a `COPY FROM` statement. Because the `COPY FROM` command is part of
the Data Definition Language (DDL) in Kuzu, it follows SQL's semantics and hence, a subquery
is passed within parentheses `()` that contains a `RETURN` clause.

Copying using a subquery is useful when you need to transform data
before inserting it into the database, or if you want to copy data from a `LOAD FROM` scan operation
on a data structure that's already in memory, such as a DataFrame.

#### Create node/relationship tables

Consider that we have a database of `Person`, `Product` and `HasReward` relationships (where a
person is eligible for a product reward if they have made a certain number of purchases).

```cypher
CREATE NODE TABLE Person(name STRING PRIMARY KEY, num_purchases INT64)
CREATE NODE TABLE Product(name STRING PRIMARY KEY, price DOUBLE)
CREATE REL TABLE HasReward(FROM Person TO Product);
```

### `COPY FROM` a `MATCH` subquery

Now, let's say we want to reward a particular product (e.g., a `gift voucher`) to all the `Person`s
who have made more than 10 purchases. We can do this with a `MATCH` subquery as follows:

```cypher
COPY HasReward FROM (
    MATCH (p:Person)
    WHERE p.num_purchases > 10
    RETURN p.name, "gift voucher"
)
```

### `COPY FROM` a `LOAD FROM` scan subquery

An alternate use case for this feature would be when you want to directly scan data from an existing
object, such as a Pandas DataFrame using `LOAD FROM` and use its results as input to the `COPY FROM`
command. This can be combined with predicate filters as follows:

```python
import kuzu
import pandas as pd

db = kuzu.Database("example.kuzu")
conn = kuzu.Connection(db)

df = pd.DataFrame({
    "name": ["Adam", "Karissa", "Zhang", "Noura"],
    "age": [30, 40, 50, 25]
})

conn.execute("CREATE NODE TABLE Person(name STRING PRIMARY KEY, age INT64)")

# Apply a predicate filter while scanning the DataFrame
# Pass the results of the scan to the COPY FROM command
conn.execute("COPY Person FROM (LOAD FROM df WHERE age < 30 RETURN *)")
```

You can similarly use this approach to subset your data, for example, read only a part of your
DataFrame, Parquet or CSV file, and then copy that subset into Kuzu.

```python
# Load specific columns only
conn.execute("COPY Person FROM (LOAD FROM df RETURN name)")
```
