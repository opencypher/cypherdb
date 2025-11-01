---
title: "Delta Lake extension"
description: Scan and copy from Delta Lake tables using the delta extension with support for local and S3-hosted data.
---

The `delta` extension adds support for scanning/copying from the [`Delta Lake format`](https://delta.io/).
Delta Lake is an open-source storage framework that enables building a format-agnostic lakehouse architecture.
Using this extension, you can interact with Delta tables directly within Kuzu using the `LOAD FROM` and `COPY FROM` clauses.

## Usage

Please see [Install an extension](/extensions#install-an-extension) and [Load an extension](/extensions#load-an-extension) first before getting started.

### Example dataset

Let's create a Delta table containing student information using Python and save the Delta table in the `'/tmp/student'` directory:
```shell
pip install deltalake pandas
```

```python
# create_delta_table.py
import pandas as pd
from deltalake import DeltaTable, write_deltalake

student = {
    "name": ["Alice", "Bob", "Carol"],
    "ID": [0, 3, 7]
}

write_deltalake(f"/tmp/student", pd.DataFrame.from_dict(student))
```

### Scan Delta tables

`LOAD FROM` is a Cypher clause that scans a file or object element by element, but doesn’t actually
copy the data into a Kuzu table.
To scan the Delta table created above, you can do the following:

```cypher
LOAD FROM '/tmp/student' (file_format='delta') RETURN *;
```
```table
┌────────┬───────┐
│ name   │ ID    │
│ STRING │ INT64 │
├────────┼───────┤
│ Alice  │ 0     │
│ Bob    │ 3     │
│ Carol  │ 7     │
└────────┴───────┘
```
:::note[Note]
The `file_format` parameter is required here to explicitly specify the file format of the given path.
Kuzu is currently not capable of autodetecting Delta tables.
:::

### Copy Delta tables into Kuzu
You can use a `COPY FROM` statement to copy the contents of a Delta table into Kuzu.

```cypher
CREATE NODE TABLE student (ID INT64 PRIMARY KEY, name STRING);
COPY student FROM '/tmp/student' (file_format='delta');
```
```table
┌─────────────────────────────────────────────────┐
│ result                                          │
│ STRING                                          │
├─────────────────────────────────────────────────┤
│ 3 tuples have been copied to the student table. │
└─────────────────────────────────────────────────┘
```

### Access Delta tables hosted on S3
Kuzu also supports scanning and copying Delta tables hosted on S3.

#### Configure the S3 connection

Before reading and writing from S3, you have to configure the connection using a [CALL](/cypher/configuration) statement.
```cypher
CALL <option_name>='<option_value>'
```

The following options are supported:
| Option | Description |
|----------|----------|
| `s3_access_key_id` | S3 access key ID |
| `s3_secret_access_key` | S3 secret access key |
| `s3_endpoint` | S3 endpoint |
| `s3_region` | S3 region |
| `s3_url_style` | Uses [S3 URL style](https://docs.aws.amazon.com/AmazonS3/latest/userguide/VirtualHosting.html) (should either be `vhost` or `path`) |

#### Requirements on the S3 server API

| Feature | Required S3 API features |
|----------|----------|
| Public file reads | HTTP Range request |
| Private file reads | Secret key authentication |

#### Scan Delta tables from S3
```cypher
LOAD FROM 's3://kuzu-sample/sample-delta' (file_format='delta')
RETURN *;
```

#### Copy Delta tables from S3 into Kuzu

```cypher
CREATE NODE TABLE student (ID INT64 PRIMARY KEY, name STRING);
COPY student FROM 's3://kuzu-sample/student-delta' (file_format='delta');
```

## Limitations

The `delta` extension currently does not support exporting data from Kuzu to Delta files.
