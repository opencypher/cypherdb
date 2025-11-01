---
title: Numeric functions
description: Numeric functions are used to perform numeric operations.
---

Numeric functions are used to transform and manipulate numeric types. Common functions that have been
implemented so far are listed below.

<div class="scroll-table">

| Function | Description | Example | Result |
| ----------- | ----------- |  ----------- |  ----------- |
| `abs(x)` | returns the absolute value of x | `abs(-25.2)` | `25.2` |
| `acos(x)` | returns the arccosine of x | `acos(0.43)` | `1.126304` |
| `asin(x)` | returns the arcsine of x | `asin(0.4)` | `0.411517` |
| `atan(x)` | returns the arctangent of x | `atan(0.221)` | `0.217504` |
| `atan2(x, y)` | returns the arctangent of x, y | `atan2(0.4, 0.2)` | `0.342411` |
| `bitwise_xor(x, y)` | returns the bitwise xor of x and y | `bitwise_xor(2, 3)` | `1` |
| `ceil(x)` | rounds up x to the next nearest integer | `ceil(4.2)` | `5.0` |
| `ceiling(x)` | alias of ceil | `ceiling(3.27)` | `4.0` |
| `cos(x)` | returns the cosine value of x | `cos(2.79)` | `-0.938825` |
| `cot(x)` | returns the cotangent of x | `cot(0.78)` | `1.010855` |
| `degrees(x)` | converts radians to degree | `degrees(1.2534)` | `71.814530` |
| `even(x)` | rounds to next even number by<br/> rounding away from 0 | `even(3.4)` | `4` |
| `factorial(x)` | returns the factorial of x | `factorial(4)` | `24` |
| `floor(x)` | rounds down x to the nearest integer | `floor(3.3)` | `3` |
| `gamma(x)` | interpolation of (x-1) factorial | `gamma(2.4)` | `1.242169` |
| `lgamma(x)` | returns the log of gamma(x) | `lgamma(1.4)` | `-0.119613` |
| `ln(x)` | returns the natural logarithm of x | `ln(2.11)` | `0.746688` |
| `log(x)` | returns the 10-log of x | `log(2.11)` | `0.324282` |
| `log2(x)` | returns the 2-log of x | `log2(3)` | `1.584963` |
| `log10(x)` | alias of log(x) | `log10(100)` | `2` |
| `negate(x)` | returns the opposite number of x | `negate(100)` | `-100` |
| `pi()` | returns the value of pi | pi() | `3.141593` |
| `pow(x, y)` | returns the value of x to the power of y | `pow(4, 5)` | `1024` |
| `radians(x)` | converts the degree to radians | `radians(89)` | `1.553343` |
| `round(x, s)` | rounds x to s decimal places | `round(42.651, 1)` | `42.700000` |
| `sin(x)` | returns the sin of x | `sin(413.31)` | `-0.981897` |
| `sign(x)` | returns the sign of x | `sign(-451)` | `-1` |
| `sqrt(x)` | returns the square root of x | `sqrt(4.25)` | `2.061553` |
| `tan(x)` | returns the tangent of x | `tan(75)` | `-0.420701` |

</div>
