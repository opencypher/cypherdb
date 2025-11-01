---
title: Create macros
description: "Define reusable Cypher expressions with parameters and default values using macros"
---

Kuzu allows you to define macros via custom C++ code in the catalog using the `create macro` statement.
The process of creating macros involves using the `CREATE MACRO` keyword followed by the macro's name.
You can optionally include parameters with optional default value within parentheses after the name.
The `AS` keyword comes next, followed by the actual Cypher expression of the macro. It's important to
note that a scalar macro is limited to returning only a single value.

## Default parameters

You can assign default values to parameters. If a query does not specify a value for a parameter,
the predefined default value (if it exists) will be applied instead.

:::caution[Note]
Parameters with a default value must be defined after parameters without a default value in the signature of the macro.
:::

```cpp
// Create a macro which adds two parameters. If the second parameter(b) is not provided, the default value (3) will be used instead.
create macro addWithDefault(a,b:=3) as a + b;
// Executes the macro without providing the default value.
return addWithDefault(2);  // returns 5 (2 + 3)
// Executes the macro by providing the default value (actual parameter value will be used).
return addWithDefault(4, 7);  // returns 11 (4 + 7)
```

## Supported macro expression types

The following expression types are supported by macros.

### Case expression macro

```cypher
// Creates a case macro which executes sub-expressions based on input value.
CREATE MACRO case_macro(x) AS CASE x WHEN 35 THEN x + 1 ELSE x - 5 END
// Executes queries using the case macro.
MATCH (a:person) RETURN case_macro(a.age) AS age
```

### Function expression macro

```cypher
// Creates a function macro which executes an arithmetic expression.
CREATE MACRO func_macro(x) AS x + 3 + 2.5 + to_float(2.1)
// Executes queries using the function macro.
MATCH (a:person) RETURN func_macro(a.age) AS age
```

### Literal expression macro

```cypher
// Creates a literal macro which simply returns a literal value.
CREATE MACRO str_literal() AS 'result'
// Executes queries using the literal macro.
RETURN str_literal()
```

### Property expression macro

```cypher
// Creates a property macro which simply returns a property of the parameter.
CREATE MACRO prop_macro(x) AS x.ID
// Executes queries using the property macro.
MATCH (a:person) RETURN prop_macro(a) AS age
```

### Variable expression macro

```cypher
// Creates a variable macro which simply returns the parameter.
CREATE MACRO var_macro(x) AS x
// Executes queries using the variable macro.
MATCH (a:person) RETURN var_macro(a.ID)
```
