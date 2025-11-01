---
title: Export CSV
description: Export query results to CSV files with customizable formatting options including headers, delimiters, and quotes.
---

The `COPY TO` clause can export query results to a CSV file and is used as follows:

```cypher
COPY (MATCH (u:User) RETURN u.*) TO 'user.csv' (header=true);
```

The CSV file consists of the following fields:

```csv
u.name,u.age
Adam,30
Karissa,40
Zhang,50
Noura,25
```

Nested data types such as lists and structs will be represented as strings within their respective columns.

Available options are:

<div class="scroll-table">

| Option                   | Default Value           | Description                                                               |
|:------------------------:|:-----------------------:|---------------------------------------------------------------------------|
| `ESCAPE`                 | `\`                     | Character used to escape special characters in CSV                        |
| `DELIM` or `DELIMITER`   | `,`                     | Character that separates fields in the CSV                                |
| `QUOTE`                  | `"`                     | Character used to enclose fields containing special characters or spaces  |
| `HEADER`                 | `false`                 | Indicates whether to output a header row                                  |

</div>

Another example is shown below.

```cypher
COPY (MATCH (a:User)-[f:Follows]->(b:User) RETURN a.name, f.since, b.name) TO 'follows.csv' (header=false, delim='|');
```

This outputs the following results to `follows.csv`:
```csv
Adam|2020|Karissa
Adam|2020|Zhang
Karissa|2021|Zhang
Zhang|2022|Noura
```
