---
title: Export to JSON
description: Export query results to JSON files with support for nested data structures using the JSON extension.
---

The `COPY TO` clause can export query results to a JSON file. To use this feature, you have to install the
JSON extension using the instructions shown [here](/extensions/json).

To demonstrate this, we will create a node table and insert some data into it.
```cypher
CREATE NODE TABLE Person (id SERIAL PRIMARY KEY, name STRING, info STRUCT(height DOUBLE, age INT64, previous_usernames STRING[]));
```
```cypher
CREATE (:Person {name: "Alice", info: {height: 1.68, age: 45, previous_usernames: ["alice123", "alice_34425"]}});
CREATE (:Person {name: "Bob", info: {height: 1.81, age: 71, previous_usernames: ["the_builder", "the_minion"]}});
CREATE (:Person {name: "Gregory", info: {height: 1.73, age: 22, previous_usernames: ["gregory7"]}});
```

The following query will export the data from the `Person` node table to a JSON file.
```cypher
COPY (MATCH (p:Person) RETURN p.*) TO 'people-output.json';
```
```json
[
{"p.id":0,"p.name":"Alice","p.info":{"height":1.68,"age":45,"previous_usernames":["alice123","alice_34425"]}},
{"p.id":1,"p.name":"Bob","p.info":{"height":1.81,"age":71,"previous_usernames":["the_builder","the_minion"]}},
{"p.id":2,"p.name":"Gregory","p.info":{"height":1.73,"age":22,"previous_usernames":["gregory7"]}}
]
```

You can use a JSON formatter to make the output more readable.