---
title: Hash functions
description: Hash functions are used to create and return hashes for a given value.
---

A hash function maps data of arbitrary size to fixed-size values. The following hash functions have
been implemented to be used in Cypher.

<div class="scroll-table">

| Function | Description | Example | Result |
| ----------- | --------------- | ----------- | ----------- |
| `md5(string)` | returns an MD5 hash of the provided input | `md5('kuzu')` | `caca2358cada60d679fc0310d440f8ca` |
| `sha256(string)` | returns a SHA-256 hash of the provided input | `sha256('kuzu')` | `e129f5000a4b71ccc3a0e6353a86cc57989106e670793db98efa34b7527aefa5` |
| `hash(string)` | returns a Murmurhash64 hash of the provided input | `hash('kuzu')` | `-144620710730482887` |

</div>
