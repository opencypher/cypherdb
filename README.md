# CypherDB - SQLite for graphs

CypherDB is an embedded graph database. It is optimized for handling complex analytical workloads 
on very large databases and provides a set of retrieval features, such as a full text search and vector indices. 

Core features:

- Flexible Property Graph Data Model and Cypher query language
- Embeddable, serverless integration into applications
- Native full text search and vector index
- Columnar disk-based storage
- Columnar sparse row-based (CSR) adjacency list/join indices
- Vectorized and factorized query processor
- Novel and very fast join algorithms
- Multi-core query parallelism
- Serializable ACID transactions
- Wasm (WebAssembly) bindings for fast, secure execution in the browser

CypherDB was initially developed by Kùzu Inc as Kuzu. CypherDB's focus is on supporting an open-source,
community-based project that is a reference implementation of [openCypher](https://opencypher.org).


## Build from Source

You can build from source using the instructions provided in the [developer guide](https://kuzu.github.io/docs/developer-guide).

## License
CypherDB is licensed under the [MIT License](LICENSE) by [Neo4j, Inc.](https://neo4j.com).
