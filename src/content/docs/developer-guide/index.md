---
title: Build Kuzu from source
description: Developer guide for building Kuzu from source code with CMake, Python, and C++20 compiler requirements.
---

:::caution[Note]
This page is intended for developers who want to build Kuzu from source. If you are a user of Kuzu,
please refer to the [installation guide](https://kuzudb.github.io/docs/installation) for downloading pre-built binaries for your platform.
:::

To build from source code, Kuzu requires CMake (`>=3.15`), Python (`>=3.9`), and a compiler that supports C++20. The minimum supported versions of C++ compilers are GCC 12, Clang 18, and MSVC 19.20. The preferred compiler on Linux is GCC; on macOS, Apple Clang; and on Windows, MSVC. On Linux, Clang is also tested. Other compilers that support C++20 may also work, but are not tested.

Below are the instructions for building Kuzu on Ubuntu, AlmaLinux, Arch Linux, macOS, and Windows. These instructions should also work for other similar platforms:

- For other Debian-based Linux distributions, such as *Debian*, *Linux Mint*, and *Pop!_OS*, the instructions should be similar to Ubuntu.
- For other Red Hat-based Linux distributions, such as *Red Hat Enterprise Linux (RHEL)*, *CentOS*, *Fedora*, *Rocky Linux*, and *Oracle Linux*, the instructions should be similar to AlmaLinux.
- For other Arch-based Linux distributions, such as *Manjaro*, the instructions should be similar to Arch Linux.

:::note[Tip]
You can refer to our [multi-platform GitHub Actions workflow](https://github.com/kuzudb/kuzu/blob/master/.github/workflows/multiplatform-build-test.yml) for the exact commands we use on different platforms.
:::

## Building Instructions

### Ubuntu 24.04 LTS

```bash
apt update
apt install -y build-essential cmake gcc g++ python3
```

```bash
make release NUM_THREADS=$(nproc)
```

### AlmaLinux 9.2

```bash
dnf update
dnf install -y cmake gcc gcc-c++ python3
```

```bash
make release NUM_THREADS=$(nproc)
```

### Arch Linux

```bash
pacman -Syu
pacman -S --needed base-devel cmake gcc python
```

```bash
make release NUM_THREADS=$(nproc)
```

### macOS 14

Install [Homebrew](https://brew.sh/).

```bash
xcode-select --install
```

```bash
brew install cmake python
```

```bash
make release NUM_THREADS=$(sysctl -n hw.physicalcpu)
```

### Windows 10

#### Install Visual Studio

Install Visual Studio 2022 with C++ support, CMake, and the SDK for your version of Windows. For detailed instructions, please refer to [Microsoft's documentation](https://docs.microsoft.com/en-us/cpp/build/vscpp-step-0-installation).

#### Install Chocolatey

Follow the instructions at [https://chocolatey.org/install](https://chocolatey.org/install).

#### Install dependencies

```powershell
choco install -y python3 make ninja
```

#### Launch Visual Studio Command Prompt

Follow the instructions at [Microsoft's documentation](https://docs.microsoft.com/en-us/cpp/build/building-on-the-command-line).

#### Build Kuzu

```powershell
make release NUM_THREADS=$env:NUMBER_OF_PROCESSORS
```

## Run Tests

### C/C++ tests

```bash
make test NUM_THREADS=X
```

For additional information regarding the tests, please refer to the documentation for [Testing Framework](/developer-guide/testing-framework).

### Increase `ulimit` for running tests

For some platforms, such as macOS, the default limit for the number of open files is too low for running tests, which may cause some tests to fail. To increase the limit, please run the following command before running tests.

```bash
ulimit -n 10000
```

## Build Language Bindings

By default, only C and C++ libraries and the CLI are built. To build other language bindings, please follow the instructions below.

### Python

#### Prerequisites

To install the dependencies, please run the following command.

```bash
make -C tools/python_api requirements
```

In addition, the Python development headers are required. For example, on Ubuntu, the `python3-dev` package should be installed.

#### Build Python bindings

```bash
make python NUM_THREADS=$(nproc)
```

#### Run Python tests

```bash
make pytest-venv NUM_THREADS=$(nproc)
```

### Node.js

#### Prerequisites

Install Node.js and npm. Please refer to [the download page](https://nodejs.org/en/download/) for detailed instructions. The minimum supported version of Node.js is 14.15.0.

#### Install dependencies

```bash
make nodejs-deps
```

#### Build Node.js bindings

```bash
make nodejs NUM_THREADS=$(nproc)
```

#### Run Node.js tests

```bash
make nodejstest NUM_THREADS=$(nproc)
```

### Java

#### Prerequisites

The minimum supported version of JDK is 11. Oracle JDK, OpenJDK, and Eclipse Temurin are supported. For detailed instructions on installing JDK, please refer to one of the following links:

- For Oracle JDK, please refer to [the download page](https://www.oracle.com/java/technologies/downloads/).
- For OpenJDK, please refer to [the download page](https://jdk.java.net/).
- For Eclipse Temurin, please refer to [the download page](https://adoptium.net/).

#### Build Java bindings

```bash
make java NUM_THREADS=$(nproc)
```

#### Run Java tests

```bash
make javatest NUM_THREADS=$(nproc)
```

### Rust

#### Prerequisites

Rust 1.81.0 or later is required. Installing Rust with [rustup](https://rustup.rs/) is recommended. For detailed instructions, please refer to [the download page](https://www.rust-lang.org/tools/install).

#### Build Rust bindings

```bash
cd tools/rust_api && CARGO_BUILD_JOBS=$(nproc) cargo build
```

#### Run Rust tests

```bash
make rusttest
```
