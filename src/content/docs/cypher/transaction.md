---
title: Transactions
description: "ACID-compliant transaction management with atomic, durable, and serializable operations"
---

Kuzu implements a transaction management subsystem that is atomic, durable and supports serializability.
Satisfying these properties makes Kuzu ACID-compliant, as per database terminology.

Every query, data manipulation command, DDL (i.e., new node/rel table schema definitions), or `COPY FROM` command to Kuzu is part of a transaction. Therefore, they exhibit all-or-nothing behavior. After one or more of these commands are executed and committed successfully, you are guaranteed that all changes will persist in their entirety. If the commands do not execute successfully or are rolled back, you are guaranteed that none of the changes will persist.

These conditions hold even if your system crashes at any point during a transaction. That is, once you commit a transaction successfully, all your changes will persist even if there is an error *after* committing. Similarly, if your system crashes before committing or rolling back, then none of your updates will persist.

:::danger[Important properties of transactions]
- Each transaction is identified as a read or write transaction (see below for how this is done)
- At any point in time, there can be multiple read transactions but only **one** write transaction
- There are two ways to use transactions: (i) manually beginning and committing/rolling back transactions;
or (ii) auto-committing (see below for more details on both)
:::

## Manual Transaction

### Transaction Statement

Kuzu supports the following transaction statements.

- `BEGIN TRANSACTION`: starts a read-write transaction.
- `BEGIN TRANSACTION READ ONLY`: starts a read-only transaction.
- `COMMIT`: commit changes in current transaction.
- `ROLLBACK`: rollback changes in current transaction.

### Manual transaction
```cypher
BEGIN TRANSACTION;
CREATE (a:User {name: 'Alice', age: 72});
MATCH (a:User) RETURN *;
COMMIT;
```
The above statements start a manual read-write transaction, add a new node, and within the same transaction also read all of the tuples in the User table. Finally, the transaction is committed.

You can also start a read-only transaction with `BEGIN TRANSACTION READ ONLY`. Read-only transactions are not allowed to write to the database. You would typically start a read-only transaction for two main reasons: (i) if you want to run multiple read queries ensuring that the database does not change between those transactions; and/or (ii) you don't want to block a write transaction from writing to the database in parallel (recall that at any point in time Kuzu allows one write transaction in the system).

If you replace `COMMIT` with `ROLLBACK`, the added `('Alice', 72)` node record will not persist in the database.

### Auto transaction
If you send a command without manually beginning a transaction, it will automatically be wrapped around a transaction. For example, the following query will be automatically wrapped around a transaction that will be executed in a serializable manner.

```cypher
CREATE (a:User {name: 'Alice', age: 72});
```

## Checkpoint
The `CHECKPOINT` statement merges data in the write-ahead-log (WAL) to database data files.

```cypher
CHECKPOINT;
```

By default, checkpoint happens automatically at the end of a write transaction when the WAL file size goes beyond the `CHECKPOINT_THRESHOLD` (see [Configuration](/cypher/configuration)) and there are no active transactions in the system.

This statement is used to manually trigger checkpoint actions in the system.
Note that checkpoint can only happen when there are no active transactions in the system, and we don't allow forcing checkpointing yet. Thus when there are still active transactions in the system, calling this statement will result in errors.
