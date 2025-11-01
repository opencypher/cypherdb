---
title: Example database
description: "Sample graph dataset with User and City nodes used in query clause examples"
---

We use the following example graph dataset that
consists of `User` and `City` nodes, `Follows` relationships between users,
and `LivesIn` relationships between users and cities.

![](/img/running-example.png)

The DDL statements to define the schema of this database, the csv files containing
the records of the tables in the database and the data import (`COPY FROM`) commands
are shown below.

### User nodes
Schema:
```cypher
CREATE NODE TABLE User(name STRING PRIMARY KEY, age INT64)
```

user.csv:
```
Adam,30
Karissa,40
Zhang,50
Noura,25
```
Data import (You need to give full path to user.csv. We assume ${PATH-TO-DIR} is that directory):
```cypher
COPY User FROM "${PATH-TO-DIR}/user.csv"
```

### City nodes

Schema:
```cypher
CREATE NODE TABLE City(name STRING PRIMARY KEY, population INT64)
```
city.csv
```
Waterloo,150000
Kitchener,200000
Guelph,75000
```
Data import:
```cypher
COPY City FROM "${PATH-TO-DIR}/city.csv"
```

### Follows relationships

Schema:
```cypher
CREATE REL TABLE Follows(FROM User TO User, since INT64)
```
follows.csv
```
Adam,Karissa,2020
Adam,Zhang,2020
Karissa,Zhang,2021
Zhang,Noura,2022
```
Data import:
```cypher
COPY Follows FROM "${PATH-TO-DIR}/follows.csv"
```

### LivesIn relationships

Schema:
```cypher
CREATE REL TABLE LivesIn(FROM User TO City)
```
lives-in.csv
```
Adam,Waterloo
Karissa,Waterloo
Zhang,Kitchener
Noura,Guelph
```
Data import:
```cypher
COPY LivesIn FROM "${PATH-TO-DIR}/lives-in.csv"
```