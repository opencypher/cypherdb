# macOS Development Environment Setup Plan for CypherDB

This document outlines the step-by-step plan for setting up a local development environment for CypherDB on macOS, based on the [official developer guide](https://opencypher.github.io/cypherdb/developer-guide/).

## Prerequisites Overview

- **CMake**: >= 3.15
- **Python**: >= 3.9 (3.11 recommended based on CI workflows)
- **C++ Compiler**: Clang 18+ (Apple Clang is preferred on macOS)
- **Homebrew**: Package manager for macOS
- **Xcode Command Line Tools**: Required for C++ compilation

## Step-by-Step Setup Instructions

### 1. Install Homebrew (if not already installed)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Verify installation:
```bash
brew --version
```

### 2. Install Xcode Command Line Tools

The command line tools provide the necessary C++ compiler (Apple Clang) and other build tools:

```bash
xcode-select --install
```

Verify installation:
```bash
clang --version
# Should show Apple Clang version 18 or later. xcode clang may be lower. if so, install llvm via brew
```

### 3. Install Build Dependencies via Homebrew

Install CMake and Python (if not already present):

```bash
brew install cmake python
```

Optionally install `llvm` for a newer version of clang (if xcode version is outdated):

```
brew install llvm
```

Verify versions:
```bash
cmake --version  # Should be >= 3.15
python3 --version  # Should be >= 3.9 (3.11 recommended)
```

**Note**: If you already have Python installed, ensure it's version 3.9 or higher. The CI workflows use Python 3.11.

### 4. Optional: Install Python Development Headers

If you plan to build Python bindings, ensure Python development headers are available. On macOS, these are typically included with Python installed via Homebrew, but you may need:

```bash
brew install python3-dev  # If available, otherwise headers come with python
```

### 5. Verify System Requirements

Ensure your system meets the compiler requirements:
- **C++ Standard**: C++20 support required
- **Compiler**: Apple Clang 18+ (check with `clang --version`)
- **Architecture**: macOS supports both x86_64 (Intel) and arm64 (Apple Silicon)

### 6. Build CypherDB Core

Navigate to the project root and build the release version:

```bash
cd /Users/akollegger/Developer/opencypher/cypherdb
make release NUM_THREADS=$(sysctl -n hw.physicalcpu)
```

This will:
- Configure CMake with Release build type
- Build the core C++ library and CLI (the `kuzu` interactive shell)
- Use all available physical CPU cores for compilation

**Note**: On macOS, `sysctl -n hw.physicalcpu` gives you the number of physical CPU cores, which is the recommended setting according to the developer guide.

**Note**: The interactive CLI shell (`kuzu`) is built by default (`BUILD_SHELL=TRUE`). After building, you can find the executable at `build/release/tools/shell/kuzu` (or `build/debug/tools/shell/kuzu` for debug builds). You can run it with:
```bash
./build/release/tools/shell/kuzu [database_path]
# or for in-memory database:
./build/release/tools/shell/kuzu :memory:
```

### 7. Run Basic Tests

After building, verify the installation by running tests:

```bash
make test NUM_THREADS=$(sysctl -n hw.physicalcpu)
```

**Important for macOS**: If you encounter test failures related to "too many open files", increase the file limit:

```bash
ulimit -n 10000
make test NUM_THREADS=$(sysctl -n hw.physicalcpu)
```

### 8. Build Python Bindings (Optional)

If you want to develop with Python bindings:

#### 8.1 Install Python Dependencies

```bash
make -C tools/python_api requirements
```

This will:
- Create a virtual environment
- Install development dependencies from `tools/python_api/requirements_dev.txt`

#### 8.2 Build Python Bindings

```bash
make python NUM_THREADS=$(sysctl -n hw.physicalcpu)
```

#### 8.3 Run Python Tests

```bash
make pytest-venv NUM_THREADS=$(sysctl -n hw.physicalcpu)
```

### 9. Build Node.js Bindings (Optional)

If you want to develop with Node.js bindings:

#### 9.1 Prerequisites

Install Node.js (version 14.15.0 or higher):
```bash
brew install node
node --version  # Verify >= 14.15.0
```

#### 9.2 Install Dependencies

```bash
make nodejs-deps
```

#### 9.3 Build Node.js Bindings

```bash
make nodejs NUM_THREADS=$(sysctl -n hw.physicalcpu)
```

#### 9.4 Run Node.js Tests

```bash
make nodejstest NUM_THREADS=$(sysctl -n hw.physicalcpu)
```

### 10. Build Java Bindings (Optional)

If you want to develop with Java bindings:

#### 10.1 Prerequisites

Install JDK 11 or higher:
```bash
brew install openjdk@11
# Or install via Oracle JDK, OpenJDK, or Eclipse Temurin
```

#### 10.2 Build Java Bindings

```bash
make java NUM_THREADS=$(sysctl -n hw.physicalcpu)
```

#### 10.3 Run Java Tests

```bash
make javatest NUM_THREADS=$(sysctl -n hw.physicalcpu)
```

### 11. Build Rust Bindings (Optional)

If you want to develop with Rust bindings:

#### 11.1 Prerequisites

Install Rust 1.81.0 or later:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustc --version  # Verify >= 1.81.0
```

#### 11.2 Build Rust Bindings

```bash
cd tools/rust_api && CARGO_BUILD_JOBS=$(sysctl -n hw.physicalcpu) cargo build
cd ../..
```

#### 11.3 Run Rust Tests

```bash
make rusttest
```

## Build Variants

### Debug Build

For development with debug symbols:

```bash
make debug NUM_THREADS=$(sysctl -n hw.physicalcpu)
```

### RelWithDebInfo Build

For optimized builds with debug info:

```bash
make relwithdebinfo NUM_THREADS=$(sysctl -n hw.physicalcpu)
```

### Build Everything

To build all components (benchmarks, examples, extensions, tests, and all language bindings):

```bash
make all NUM_THREADS=$(sysctl -n hw.physicalcpu)
```

### Build Shell CLI (Included by Default)

The interactive CLI shell (`kuzu`) is **built by default** with all standard build targets (`release`, `debug`, `relwithdebinfo`). The `BUILD_SHELL` CMake option defaults to `TRUE`.

To explicitly ensure the shell is built:

```bash
make release NUM_THREADS=$(sysctl -n hw.physicalcpu)
# Shell is automatically included - no special flags needed
```

To test the shell after building:

```bash
make shell-test
```

**Note**: If you're building Python bindings with `make python`, note that it temporarily sets `BUILD_SHELL=FALSE` to avoid conflicts, but the shell will still be available from your earlier `make release` build.

## Common Issues and Solutions

### Issue: clang < 18.x

**Solution**: Install using `llvm` homebrew:
```bash
brew install llvm
```

Then follow post-install instructions, deciding whether to override default clang,
or just tell cmake about it by setting `CMAKE_PREFIX_PATH`.

### Issue: "Too many open files" during tests

**Solution**: Increase the file descriptor limit:
```bash
ulimit -n 10000
```

### Issue: Python development headers not found

**Solution**: Ensure Python was installed via Homebrew, which includes headers by default. Alternatively:
```bash
brew install python3
```

### Issue: Compiler version too old

**Solution**: Update Xcode Command Line Tools:
```bash
xcode-select --install
softwareupdate --all --install --force
```

### Issue: CMake version too old

**Solution**: Update via Homebrew:
```bash
brew upgrade cmake
```

## Verification Checklist

After setup, verify your environment:

- [ ] `cmake --version` shows >= 3.15
- [ ] `python3 --version` shows >= 3.9
- [ ] `clang --version` shows Apple Clang 18+
- [ ] Core build completes: `make release`
- [ ] Tests pass: `make test`
- [ ] (Optional) Python bindings work: `make python && make pytest-venv`

## Next Steps

Once your environment is set up:

1. Review the [Contributing Guidelines](CONTRIBUTING.md)
2. Explore the codebase structure
3. Check out example code in the `examples/` directory
4. Review test files in `test/` to understand expected behavior
5. Join the [Discord community](https://discord.gg/neo4j) for real-time communication

## Additional Resources

- [Developer Guide](https://opencypher.github.io/cypherdb/developer-guide/)
- [Testing Framework Documentation](https://opencypher.github.io/cypherdb/developer-guide/testing-framework/)
- [Performance Debugging](https://opencypher.github.io/cypherdb/developer-guide/performance-debugging/)
- [GitHub Actions Workflows](.github/workflows/) - Reference for exact build commands used in CI

