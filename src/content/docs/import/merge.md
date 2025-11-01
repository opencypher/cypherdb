---
title: Merge
description: Insert small amounts of data into existing Kuzu tables using the MERGE clause with nodes and relationships.
---

For small graphs (a few thousand nodes), the `MERGE` [Cypher clause](/cypher/data-manipulation-clauses)
can be used to insert nodes and
relationships to existing tables in Kuzu. These are similar to SQL's `INSERT` statements, but bear in
mind that they are slower than `COPY FROM`, which is optimized for bulk inserts. It's generally
recommended that the `MERGE` clause is only used to do small additions or updates on a sporadic basis.

If you want to do bulk inserts, see the [COPY FROM](/import) page for instructions for your input format.

## `MERGE` single nodes or relationships

Say you have an existing node table `User` with `name` and `age` properties and you want to insert a new user.

```cypher
MATCH (a:User) RETURN a
```
Initially, there is just one user in the database:

```table
┌────────┬───────┐
│ a.name │ a.age │
│ STRING │ INT64 │
├────────┼───────┤
│ Alice  │ 25    │
└────────┴───────┘
```

Now you want to insert a new user with the name `Bob` and age `30` that was obtained from an
external source.

```cypher
MERGE (u:User {name: 'Bob', age: 30})
```

The result will be:

```table
┌────────┬───────┐
│ a.name │ a.age │
│ STRING │ INT64 │
├────────┼───────┤
│ Alice  │ 25    │
│ Bob    │ 30    │
└────────┴───────┘
```

The same approach can be used to import relationships -- just ensure that the node tables and their
data with the primary key values from your source data exist before trying to merge relationships.

## `MERGE` from DataFrames

If you have a DataFrame whose entire data you want to `MERGE` into an existing node or relationship table,
you can use the `LOAD FROM` clause in combination with the `MERGE` clause.

:::note[Note]
This approach is useful if you are
obtaining updated data from an external source and want to merge them into your table all at once,
without having to merge the rows one by one (i.e., **without for loops**).
:::

Let's see this in action with an example.

```py
import kuzu
import pandas as pd

db = kuzu.Database('example.kuzu')
conn = kuzu.Connection(db)

df = pd.DataFrame({
    'name': ['Karissa', 'Rhea', 'James'],
    'current_city': ['Seattle', 'New York', 'San Francisco'],
    'item': ['smartphone', 'laptop', 'headphones']
})

# Create tables
conn.execute("CREATE NODE TABLE Person (name STRING PRIMARY KEY, current_city STRING)")
conn.execute("CREATE NODE TABLE Item (name STRING PRIMARY KEY)")
conn.execute("CREATE REL TABLE Purchased (FROM Person TO Item)")
# Copy data into tables
conn.execute("COPY Person FROM (LOAD FROM df RETURN name, current_city)")
conn.execute("COPY Item FROM (LOAD FROM df RETURN item)")
conn.execute("COPY Purchased FROM (LOAD FROM df RETURN name, item)")
# Query data
res = conn.execute("MATCH (p:Person)-[:PURCHASED]->(i:Item) RETURN p.*, i.*")
print(res.get_as_df())
```

Initially, there are 3 rows in the `Person` and `Item` tables:
```
    p.name p.current_city      i.name
0  Karissa        Seattle  smartphone
1     Rhea       New York      laptop
2    James  San Francisco  headphones
```

Now, say you obtain updated information about Karissa and Rhea who purchased new items.
Also, say Karissa has moved to a new city, so her `current_city` is now `Boston`.

```py
df = pd.DataFrame({
    'name': ['Karissa', 'Rhea'],
    'current_city': ['Boston', 'New York'],
    'item': ['headphones', 'smartphone']
})
```

You can avoid using a for loop by using the `LOAD FROM` clause in combination with the `MERGE` clause
to merge the rows in the DataFrame into the database, all at once.

```py
conn.execute(
    """
    LOAD FROM df
    MERGE (p:Person {name: name})
    MERGE (i:Item {name: item})
    MERGE (p)-[:PURCHASED]->(i)
    ON MATCH SET p.current_city = current_city
    ON CREATE SET p.current_city = current_city
    """
)

# Query data
res = conn.execute("MATCH (p:Person)-[:PURCHASED]->(i:Item) RETURN p.*, i.*")
print(res.get_as_df())
```

The following steps are performed:
1. The `LOAD FROM` clause loads the data from the DataFrame into the database.
2. The first two `MERGE` clauses merge the data into the `Person` and `Item` tables.
3. The third `MERGE` clause merges the data into the `Purchased` relationship table.
4. The `ON MATCH SET` clause updates the `current_city` property for Karissa if she is already in the database.
5. The `ON CREATE SET` clause sets the `current_city` property for Karissa if she is created
(i.e., if she is not already in the database).

The resulting data looks like this:

```
    p.name p.current_city      i.name
0  Karissa         Boston  smartphone
1  Karissa         Boston  headphones
2     Rhea       New York      laptop
3     Rhea       New York  smartphone
4    James  San Francisco  headphones
```