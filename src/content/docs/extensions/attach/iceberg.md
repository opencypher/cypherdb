---
title: "Iceberg extension"
description: Scan and copy from Apache Iceberg tables with metadata access and snapshot management capabilities.
---

The `iceberg` extension adds support for scanning and copying from the [Apache Iceberg format](https://iceberg.apache.org/).
Iceberg is an open-source table format originally developed at Netflix for large-scale analytical datasets.

## Usage

Please see [Install an extension](/extensions#install-an-extension) and [Load an extension](/extensions#load-an-extension) first before getting started.

### Example dataset

Download [iceberg_tables.zip](https://kuzudb.github.io/data/iceberg-extension/iceberg_tables.zip) and unzip
it to the `/tmp` directory.

```shell
cd /tmp
wget https://kuzudb.github.io/data/iceberg-extension/iceberg_tables.zip
unzip iceberg_tables.zip
```

### Scan Iceberg tables

`LOAD FROM` is a Cypher query that scans a file or object element by element, but doesn’t actually
copy the data into a Kuzu table.

```cypher
LOAD FROM
    '/tmp/iceberg_tables/university'
    (file_format='iceberg', allow_moved_paths=true)
RETURN *;
```
```table
┌────────────┬──────┬──────────┐
│ University │ Rank │ Funding  │
├────────────┼──────┼──────────┤
│ Stanford   │ 2    │ 250.300  │
│ Yale       │ 6    │ 190.700  │
│ Harvard    │ 1    │ 210.500  │
│ Cambridge  │ 5    │ 280.200  │
│ MIT        │ 3    │ 170.000  │
│ Oxford     │ 4    │ 300.000  │
└────────────┴──────┴──────────┘

```

:::note[Notes]
- The `file_format` parameter is required here to explicitly specify the file format of the given path.
Kuzu is currently not capable of autodetecting Iceberg tables.
- The `allow_moved_paths` option ensures that proper path resolution is performed, which allows scanning
Iceberg tables that are moved from their original location.
:::

### Copy Iceberg tables into Kuzu
You can use a `COPY FROM` statement to copy the contents of an Iceberg table into Kuzu.

```cypher
CREATE NODE TABLE university (name STRING PRIMARY KEY, age INT64);
COPY university FROM
    '/tmp/iceberg_tables/person_table'
    (file_format='iceberg', allow_moved_paths=true);
```
```table
┌─────────────────────────────────────────────────────┐
│ result                                              │
│ STRING                                              │
├─────────────────────────────────────────────────────┤
│ 6 tuples have been copied to the university table.  │
└─────────────────────────────────────────────────────┘
```

### Access Iceberg metadata
At the heart of Iceberg’s table structure is the metadata, which tracks everything from the schema, to partition information,
and snapshots of the table's state.

The `ICEBERG_METADATA` function lists the metadata files for an Iceberg table.

```cypher
CALL ICEBERG_METADATA(
    '/tmp/iceberg_tables/lineitem_iceberg',
    allow_moved_paths := true
)
RETURN *;
```

```table
┌──────────────────────────┬──────────────────────────┬──────────────────┬─────────┬──────────┬──────────────────────────┬─────────────┬──────────────┐
│ manifest_path            │ manifest_sequence_number │ manifest_content │ status  │ content  │ file_path                │ file_format │ record_count │
│ STRING                   │ INT64                    │ STRING           │ STRING  │ STRING   │ STRING                   │ STRING      │ INT64        │
├──────────────────────────┼──────────────────────────┼──────────────────┼─────────┼──────────┼──────────────────────────┼─────────────┼──────────────┤
│ lineitem_iceberg/meta... │ 2                        │ DATA             │ ADDED   │ EXISTING │ lineitem_iceberg/data... │ PARQUET     │ 51793        │
│ lineitem_iceberg/meta... │ 2                        │ DATA             │ DELETED │ EXISTING │ lineitem_iceberg/data... │ PARQUET     │ 60175        │
└──────────────────────────┴──────────────────────────┴──────────────────┴─────────┴──────────┴──────────────────────────┴─────────────┴──────────────┘
```

### List Iceberg snapshots
Iceberg tables maintain a series of snapshots, which are consistent views of the table at a specific point in time.
Snapshots are the core of Iceberg’s versioning system, allowing you to track, query, and manage changes to your table over time.

The `ICEBERG_SNAPSHOTS` function lists the snapshots for an Iceberg table.
Note that for snapshots, you do not need to specify the `allow_moved_paths` option.

```cypher
CALL ICEBERG_SNAPSHOTS('/tmp/iceberg_tables/lineitem_iceberg') RETURN *;
```
```table
┌─────────────────┬─────────────────────┬─────────────────────────┬────────────────────────────────────────────────────────────────────────────────────────────────┐
│ sequence_number │ snapshot_id         │ timestamp_ms            │ manifest_list                                                                                  │
│ UINT64          │ UINT64              │ TIMESTAMP               │ STRING                                                                                         │
├─────────────────┼─────────────────────┼─────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 1               │ 3776207205136740581 │ 2023-02-15 15:07:54.504 │ lineitem_iceberg/metadata/snap-3776207205136740581-1-cf3d0be5-cf70-453d-ad8f-48fdc412e608.avro │
│ 2               │ 7635660646343998149 │ 2023-02-15 15:08:14.73  │ lineitem_iceberg/metadata/snap-7635660646343998149-1-10eaca8a-1e1c-421e-ad6d-b232e5ee23d3.avro │
└─────────────────┴─────────────────────┴─────────────────────────┴────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Access Iceberg tables hosted on S3

Kuzu also supports scanning and copying Iceberg tables hosted on S3.

#### Configure the S3 connection

Before reading and writing from S3, you have to configure the connection using a [CALL](/cypher/configuration) statement.
```cypher
CALL <option_name>='<option_value>'
```

| Option name | Description |
|----------|----------|
| `s3_access_key_id` | S3 access key id |
| `s3_secret_access_key` | S3 secret access key |
| `s3_endpoint` | S3 endpoint |
| `s3_region` | S3 region |
| `s3_url_style` | Uses [S3 url style](https://docs.aws.amazon.com/AmazonS3/latest/userguide/VirtualHosting.html) (should either be `vhost` or `path`) |

#### Requirements on the S3 server APIs

| Feature | Required S3 API features |
|----------|----------|
| Public file reads | HTTP Range request |
| Private file reads | Secret key authentication |

#### Scan Iceberg tables from S3

```cypher
LOAD FROM
    's3://path/to/iceberg_table'
    (file_format='iceberg', allow_moved_paths=true)
RETURN *;
```

#### Copy Iceberg tables from S3 into Kuzu

```cypher
CREATE NODE TABLE student (ID INT64 PRIMARY KEY, name STRING);
COPY student FROM
    's3://path/to/iceberg_table'
    (file_format='iceberg', allow_moved_paths=true);
```

## Optional parameters

The following optional parameters are supported when using the functions from the `iceberg` extension.

#### `allow_moved_paths`
- Type: `BOOLEAN`
- Default: `false`

Allows scanning Iceberg tables that are not located in their original directory.

#### `metadata_compression_codec`
- Type: `STRING`
- Allowed values: `gzip`
- Default: `''`

By default, this extension will look for `v{version}.metadata.json` and `{version}.metadata.json` files for metadata.
When `metadata_compression_codec = 'gzip'` is specified, it will look for `v{version}.gz.metadata.json` and `{version}.gz.metadata.json` files instead.

```cypher
LOAD FROM '/tmp/iceberg_tables/lineitem_iceberg_gz' (
    file_format='iceberg',
    allow_moved_paths=true,
    metadata_compression_codec = 'gzip'
)
RETURN *;
```

#### `version`
- Type: `STRING`
- Default: determined from `version-hint.txt`

You can specify an explicit Iceberg metadata version:

```cypher
LOAD FROM '/tmp/iceberg_tables/lineitem_iceberg' (
    file_format='iceberg',
    allow_moved_paths=true,
    version='2'
)
RETURN *;
```

#### `version_name_format`
- Type: `STRING`
- Default: `'v%s%s.metadata.json,%s%s.metadata.json'`

You can specify a custom metadata file name format.
For example, if your metadata is named as `rev-2.metadata.json`:

```cypher
LOAD FROM '/tmp/iceberg_tables/lineitem_iceberg_alter_name' (
    file_format='iceberg',
    allow_moved_paths=true,
    version_name_format = 'rev-%s.metadata.json'
)
RETURN *;
```

## Limitations

Currently, the `iceberg` extension does not support:

- Exporting to Iceberg tables from Kuzu is not supported.
- Scanning/copying nested data (i.e., of type `STRUCT`) in Iceberg table columns is not supported.
