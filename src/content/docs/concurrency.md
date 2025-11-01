---
title: "Connections & Concurrency"
description: "Understanding Kuzu's concurrency model, connection handling, and best practices for parallel access"
---

:::caution[Note]
This section is for users who are interested in gaining a deeper understanding of Kuzu's concurrency model
and some of its limitations. If you are just getting started with Kuzu, you can skip to the [FAQ](#faqs)
section below to get answers to common questions.
:::

In this section, we will go over the basics of how applications connect to a Kuzu database and list some
best practices for concurrent connection handling.

Kuzu supports both **on-disk** and **in-memory** modes of operation.
When operating under on-disk mode, your data and the underlying database files are stored in a
local database, whereas under [in-memory](/get-started#in-memory-database) mode,
no data is persisted to disk.

Throughout this documentation, let's suppose you open a Kuzu database file that's on-disk, named
`example.kuzu`.

## Understand connections

### Database and connection objects
Application processes must connect to a Kuzu database in two steps before they can start querying it:

**Step 1.** Create an instance of a `Database` object `db` and pass it the database filename (`example.kuzu` in our example below), and
a read-write mode which can be either:
1. `READ_WRITE` (default); or
2. `READ_ONLY`

**Step 2.** Create a `Connection` object `conn` from the Database object `db`.

- A Connection object that was created using a `READ_WRITE` `Database` object can execute queries that
do both read (e.g., queries with `MATCH WHERE RETURN` statements) as well as write operations
(e.g., queries with `CREATE` or `COPY FROM` statements).
- In contrast, a Connection object that was created using a `READ_ONLY` database can only execute
queries that do read operations.

Then, using `conn`, one can execute Cypher queries against the `example.kuzu` database.
Here's a simple example application in Python that demonstrates these two steps for creating a `READ_WRITE`
database and a connection. The same principles apply to other language APIs as well:

```python
import kuzu

# Open the database in `READ_WRITE` mode. The below code is equivalent to:
# db = kuzu.Database("example.kuzu", read_only=False)
db = kuzu.Database("example.kuzu")
conn = kuzu.Connection(db)
conn.execute("CREATE (a:Person {name: 'Alice'});")
```

### Restrictions of in-memory databases

When working with in-memory databases, there are a few restrictions to keep in mind.
- An in-memory database cannot be opened as `READ_ONLY` -- only `READ_WRITE` processes are allowed
- When using the [httpfs](/extensions/httpfs) extension, we do not support remote file caching for in-memory databases
- [Attaching](/extensions/attach) an in-memory database is not allowed

## Understand concurrency

### Limitations of creating multiple Database objects
Kuzu is an embedded database, i.e., it is a library you embed inside an application process and run as part
of this application process, rather than as a separate process.
You can think of the `Database` object as the Kuzu database software.
Specifically, the `Database` object contains
different components of the Kuzu database software, such as its buffer manager, storage manager, transaction manager, etc.
Several of the components inside a `Database` object, such as the buffer manager,
cache parts of the data that are stored on disk. This limits the number of `Database` objects that can be created
pointing to the same database, either in the same process or across multiple processes.

The possible settings are:
1. One `READ_WRITE` database object; OR
2. Multiple `READ_ONLY` database objects.

:::caution[Note]
The core idea related to concurrency is this: you cannot have a `READ_WRITE` Database object `db1`
and a separate `READ_ONLY` or `READ_WRITE` Database object `db2`, and also concurrently query the same
database through connections from both `db1` and `db2`. This is not safe.
:::

The reason for this limitation is that if a connection `conn1` from `db1` makes a
write operation, say deleting some node record, then the `db1` object is able to ensure
that any cached data in `db1` is refreshed and is accurate. However, it cannot notify other Database objects that may exist
about the change. So in our example, `db2`'s cache would no longer represent the true state of the
data on disk that was cached. This can lead to problems if
connections from `db2` try to run queries after `db1`'s modification. Therefore, Kuzu will
not allow multiple Database objects to be created unless they are all `READ_ONLY`.

The limitation of having either one `READ_WRITE` Database object or multiple `READ_ONLY` Database objects applies
even if these Database objects are created in the same application process. That said, there is often no good reason for
creating multiple Database instances within the same process (you should instead share the same Database object
in that process).

However, there are common scenarios when you may want to launch
multiple application processes that connect to the same database. One such scenario
is when developing your workflow in Python using a Jupyter notebook
that connects to `example.kuzu`. Say you want to also run the Kuzu CLI alongside your Jupyter notebook,
which also connects to the same `example.kuzu`. When you launch Kuzu CLI and point it to
`example.kuzu`, Kuzu CLI embeds Kuzu and tries to create a `READ_WRITE` Database object. So if your notebook process already
has created a Database object, this will fail with an error that looks like this:

```console
RuntimeError: IO exception: Could not set lock on file : /path/to/database/example.kuzu
```

If this happens, you would have to shut down your notebook process (or simply restart your Jupyter server),
so that its Database object is destroyed, before the CLI can run.

### Create multiple Connections from the same Database object

Note that the above limitation about creating multiple Database objects does not mean that you cannot create
multiple Connections from the same `READ_WRITE` Database object and issue concurrent queries. For example,
you can write a program that creates a single `READ_WRITE` Database object `db` that points to `example.kuzu`.
Then, you can spawn multiple threads
T<sub>1</sub>, ..., T<sub>k</sub>, and each T<sub>i</sub> obtains a connection from `db` and concurrently issues
read or write queries. This is safe. Every read and write statement in Kuzu is wrapped around a transaction
(either automatically or manually by you). Concurrent transactions that operate on the same database
`example.kuzu` are safely executed by Kuzu's transaction manager (i.e., the transaction manager inside `db`),
again as long as those transactions are issued by connections that were created from the same Database object.
See the documentation on [transactions](/cypher/transaction) for the transactional guarantees that Kuzu provides.

## Example scenarios

Below, we provide some examples and best practices for common scenarios you are likely to run Kuzu under:

### Scenario 1: One process that creates a `READ_WRITE` database
In this scenario, you have a single application process that embeds Kuzu and creates a `READ_WRITE` Database object
that opens the `example.kuzu` database. Within this process, you can create multiple concurrent connections, each of which
can execute queries that can read and write to the database, which will be handled safely
by Kuzu's transaction manager. Pictorially, this scenario looks as follows:

<img src="/img/concurrency/kuzu-concurrency-1.svg" width="400"/>

For simplicity, in the above image queries
from `conn1` and `conn2` are executed sequentially but they could be running concurrently as well.

### Scenario 2: Multiple processes that create `READ_ONLY` databases
In this scenario, you have multiple application processes that embed
Kuzu and create `READ_ONLY` Database objects that open the same database `example.kuzu`.
Each process can create multiple concurrent connections and issue queries.
However, each connection can only execute read-only queries (because the database is opened in `READ_ONLY` mode).
Since the connections and queries are read-only, none of the queries can change the actual database files on disk.
Therefore, even though the queries are coming
from connections from different Database objects, this is safe and allowed.

<img src="/img/concurrency/kuzu-concurrency-2.svg" />

If you're interested in running multiple processes that can read and write to the same database, see the next section.

### Performing read-write operations from multiple processes
In certain production settings, you may need to have multiple processes that read and write to the same Kuzu database,
say again stored under `example.kuzu`.
This is the case for example if you have an online application. Say you have a browser application and multiple users
use your application from different browsers and each user interaction leads to concurrent read-write queries
on the same database. To support such scenarios, a common design pattern is this:
1. **One API server process** that embeds Kuzu
   and creates a single `READ_WRITE` Database object pointing to `example.kuzu`.
   The API server is responsible for handling incoming requests from clients, say through HTTP or gRPC. The
   requests' Cypher queries, which can read and write data to the database, are executed
   (possibly) concurrently.
2. **Multiple client processes** that connect to the API server and send requests to the API server (again through some protocol, such
as HTTP or gRPC). You are free to open any number of client processes that issue read or write queries to the API server.

Note that in terms of processes that embed Kuzu, this design pattern follows
[scenario 1](#scenario-1-one-process-that-creates-a-read_write-database) above as there is actually
one process that creates a `READ_WRITE` Database object. To enable you to get up and running with such an architecture,
we provide a REST-style [Kuzu API server](https://github.com/kuzudb/api-server) powered by Express.js.
Pictorially, this design pattern looks as follows:

<img src="/img/concurrency/kuzu-concurrency-3.svg" />

:::caution[Note]
There are potential performance implications of executing queries via a REST API server, because the HTTP
protocol involves passing query results as JSON over the network. In general, it is faster to execute
queries directly on the database by embedding Kuzu in your application.
:::

## Known Issue: Kuzu Explorer not recognizing the file lock permissions

Kuzu ensures that multiple `Database` objects, where one of them is a `READ_WRITE` instance, are not
created by setting some permission flags when opening the database file. This is a lightweight
locking mechanism. However, there is a known issue that Kuzu Explorer is not
able to see the flags put by other processes. The core problem is that Explorer runs as a Docker container
and the flags are not propagated between the host operating system and the Docker environment. We do not currently
have a fix to this. So if you have a process (or processes) that has
opened a database and you concurrently start Kuzu Explorer, you should manually ensure that
either: (i) both Explorer and your other process are in `READ_ONLY` mode; or (ii) you shut down your other
process first before opening Explorer in `READ_WRITE` mode.

## FAQs

In this section, we address some commonly asked questions related to concurrency and connections in Kuzu.

##### Can I embed Kuzu using both `READ_ONLY` and `READ_WRITE` processes in my application?

No, when embedding Kuzu in your application, you cannot have both `READ_WRITE` and `READ_ONLY` database processes
open at any given time (in a safe manner). Technical details for this limitation are described in the sections above.

In short, the reason for this limitation is that at any given time, a `READ_WRITE` process can make changes
to the disk layout, which may or may not be reflected in the buffer manager of other open `READ_ONLY` connections, and this
can lead to inconsistencies or data corruption. To avoid this issue, the best practice when embedding Kuzu in your
application is to use design patterns as per one of the scenarios shown pictorially in the sections above.

##### I'm seeing an error related to locks when running Kuzu in a Jupyter notebook. How can I resolve this?

Sometimes, when you are working in a Jupyter notebook and building your Kuzu graph while also trying to
open other processes that connect to the same directory as the database file, you may come across this error:

```console
RuntimeError: IO exception: Could not set lock on file : /path/to/database/example.kuzu
```

The lock, as described in earlier sections on this page, is present to protect you from inadvertent
data corruption due to multiple `Database` instances trying to access the same database concurrently.
To resolve this, simply click the `Restart server` button in your Jupyter notebook (or close the Jupyter
notebook entirely). Restarting the Jupyter notebook server (or closing it) will release the lock on the
database file, allowing you to safely connect to the database via another connection,
for example, a CLI or Kuzu Explorer for graph visualization. In general, it's recommended to only
open the CLI or Kuzu Explorer *after* you have finished any operations to the database (and closing or
restarting the Jupyter notebook server).

##### Can I open an in-memory database as `READ_ONLY`?

No, you cannot open in-memory databases as `READ_ONLY` -- only `READ_WRITE` processes are allowed
when operating under in-memory mode. When you create a Kuzu database, there are two things to keep
in mind:
- The database mode (on-disk or in-memory)
- Whether you will read and write to the database or only read from it

An in-memory database is stored in memory and not on disk. This means that the database is temporary
and the data will be lost when the process that created the database is terminated, so without a `READ_WRITE` process,
in-memory databases won't have any data to operate on.

See the [getting started](/get-started#in-memory-database) section for more details on how to create
and work with in-memory databases in your client API of choice.
