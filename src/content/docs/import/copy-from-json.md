---
title: "Copy from JSON"
description: Bulk import data from JSON files into Kuzu node and relationship tables using the JSON extension.
---

## JSON files

You can copy from JSON files directly into Kuzu using the `COPY FROM` command. To use this feature,
you have to install the `JSON` extension using the instructions shown [here](/extensions/json).

Consider the following JSON file:

```json
// people.json
[
    {
        "p_id": "p1",
        "name": "Gregory",
        "info": {
            "height": 1.81,
            "weight": 75.5,
            "age": 35,
            "insurance_provider": [
                {
                    "type": "health",
                    "name": "Blue Cross Blue Shield",
                    "policy_number": "1536425345"
                }
            ]
        }
    },
    {
        "p_id": "p2",
        "name": "Alicia",
        "info": {
            "height": 1.65,
            "weight": 60.1,
            "age": 28,
            "insurance_provider": [
                {
                    "type": "health",
                    "name": "Aetna",
                    "policy_number": "9876543210"
                }
            ]
        }
    },
    {
        "p_id": "p3",
        "name": "Rebecca"
    }
]
```

### Import to node table

The following example creates a node table `Person` and copies data from a JSON file `people.json` into it:

```cypher
CREATE NODE TABLE Person (
    p_id STRING,
    name STRING,
    info STRUCT(
        height FLOAT,
        weight FLOAT,
        age UINT8,
        insurance_provider STRUCT(type STRING, name STRING, policy_number STRING)[]
    ),
    PRIMARY KEY(p_id)
);
COPY Person FROM 'people.json';
```

See the [`JSON`](/extensions/json) extension documentation for more related features on working with JSON files.

### Import to relationship table

To copy from a JSON file to a relationship table, the relationship JSON file must contain
the `"from"` and `"to"` keys. We'll need two more JSON files to complete this example.

```json
// condition.json
[
    {
        "c_id": "c1",
        "name": "Diabetes"
    },
    {
        "c_id": "c2",
        "name": "Hypertension"
    }
]
```

```json
// has_condition.json
[
    {
        "from": "p1",
        "to": "c1",
        "since": 2019
    },
    {
        "from": "p2",
        "to": "c2",
        "since": 2015
    },
    ...
]
```

The `condition.json` file contains medical conditions that patients can have, while the `has_condition.json`
indicates which patients have which conditions.

As mentioned, to copy relationships, a `from` and `to` key are essential in the JSON file. Any other keys that
are not `"from"` or `"to"` are treated as relationship properties.

First, let's create a node table called `Condition`:

```cypher
CREATE NODE TABLE Condition (
    c_id STRING,
    name STRING,
    PRIMARY KEY(c_id)
);
```

Next, let's create a relationship table `HAS_CONDITION`:

```cypher
CREATE REL TABLE IF NOT EXISTS HAS_CONDITION(
    FROM Patient TO Condition,
    since UINT16
)
```

The `has_condition.json` file can then directly be copied into the relationship table that was just created. 
```cypher
COPY HAS_CONDITION FROM 'has_condition.json'
```

See the [`JSON`](/extensions/json) extension documentation for more related features on working with JSON files.

### Ignoring erroneous rows

Like for CSV files, Kuzu can skip rows when some types of errors are encountered when importing from JSON.
However, not every error type that is skippable by the CSV reader can be skipped by the JSON reader.
See the [Ignore erroneous rows](/import#ignore-erroneous-rows) section for more details.




