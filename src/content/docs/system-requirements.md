---
title: System requirements
description: Hardware and software requirements for running Kuzu graph database including memory, CPU, and OS specifications.
---

## CLI, C, and C++

The Kuzu CLI and the C and C++ APIs are pre-compiled for:
- **macOS >= 11.0**, as a universal binary that supports both Intel-based and ARM-based Macs.
- **Linux**, as a universal binary that supports both x86-64 and aarch64 architectures and supports most modern Linux distributions such as **RHEL/CentOS/Rocky Linux/Oracle Linux 8.0 or later and Ubuntu 22.04 or later**.
- **Windows**, as a universal binary that supports both x86-64 and aarch64 architectures and supports most modern Windows versions such as **Windows 10 and 11**.

## Python

Kuzu's Python API wheel has been pre-compiled for **CPython 3.7 to 3.11**. Compatibility for macOS and Windows is
the same as the pre-compiled C++ API (i.e. macOS >= 11.0, Windows 10 and 11). For Linux, the pre-compiled wheels follow
the [`manylinux_2_28`](https://github.com/pypa/manylinux) standard for both x86-64 and aarch64 architectures.

## Node.js

Kuzu's Node.js API is based on **Node-API version 5**. For a list of compatible Node.js versions, please refer to [the official documentation](https://nodejs.org/api/n-api.html#node-api-version-matrix). The native module is pre-compiled for all supported platforms and will be automatically installed when you run `npm install kuzu`. The OS compatibility is the same as the pre-compiled CLI, C and C++ APIs.

## Java and Android

Kuzu's Java API is compatible with **Java 11+**. The OS compatibility is the same as the C/C++ APIs.
The Java API is distributed as a `JAR` file with pre-compiled native libraries for all supported platforms bundled inside. It does not require any additional dependencies.

The Java API also works on the Android ARMv8-A platform. The precompiled binaries are compiled targeting [API level 21](https://developer.android.com/tools/releases/platforms). 


## Rust

The minimum supported Rust version is 1.81.0. The Rust API is closely linked with the C++ API. By default, it compiles the C++ library from source, and this build process has been tested using MSVC on Windows, GCC on Linux, and Clang on macOS and Linux. If you're linking to the pre-built libraries instead (see [here](https://docs.rs/kuzu/latest/kuzu/#building)), the restrictions mentioned for the C++ API above apply.

## Go

Kuzu's Go API is a wrapper around the C API. The minimum supported Go version is 1.20.

## Swift

Kuzu's Swift API requires Swift 5.9 or later. It supports the following platforms:
- macOS v11 or later
- iOS v14 or later
- Linux (see the [Swift documentation](https://www.swift.org/platform-support/) for officially supported list of distributions)

Windows is not supported and there is no future plan to support it. 
