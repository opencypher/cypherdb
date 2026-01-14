# CypherDB

## About CypherDB

CypherDB is a fork of [Kuzu](https://github.com/kuzudb/kuzu), an embedded graph database that is now a public archive.

The openCypher organization is evaluating how we can best support this 
technology and its community. Our initial goals are to:

1. Explore whether CypherDB can serve as a reference implementation of 
   ISO-GQL's mandatory features
2. Determine what sustainable open source stewardship looks like for this project
3. Learn about the community of users and contributors

**This is an evaluation phase.** We're committed to transparent communication 
with both the existing Kuzu community and potential contributors as we determine 
the best path forward. Our decisions will be guided by what serves the broader 
graph database ecosystem.

The extensive `s/kuzu/cypherdb/` is to acknowledgement that the original project
name belongs to the original commercial venture, and this is not that.

## Database Features

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

The focus of this fork is on supporting an open-source, community-based project that is a reference 
implementation of [openCypher](https://opencypher.org).


## Build from Source

You can build from source using the instructions provided in the [developer guide](https://opencypher.github.io/cypherdb/developer-guide/).

## Disclaimer

This repository is not an official Neo4j product or project. It is maintained by Neo4j employees or contributors in a personal or experimental capacity. The content here is provided “as is,” comes with no guarantees, and is unsupported.

## License
CypherDB is licensed under the [MIT License](LICENSE), with initial support from [Neo4j, Inc.](https://neo4j.com).
