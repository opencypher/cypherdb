---
title: Text functions
description: Text functions are used to manipulate text.
---

Text functions are used to manipulate text. The following operators are valid for text fields.

| Operator | Description | Example | Result |
| ----------- | ----------- |  ----------- |  ----------- |
| `[index]` | alias of array extract | `STRING("TEXT")[1]` | `"T"` |
| `[begin:end]` | alias of array slice | `STRING("TEXT")[1:3]` | `"TEX"` |
| `CONTAINS`| alias of the `contains()` function | 'Alice' CONTAINS 'ice' | true |

The below functions are available for text fields.

:::caution[Note]
Scroll the table to the right to see example usage.
:::

<div class="scroll-table">

| Function | Description | Example | Result |
| ----------- | ----------- |  ----------- |  ----------- |
| `array_extract(list, index)` | extracts a single character from string using 1-based index | `array_extract("year", 2)` | `"e"` |
| `array_slice(list, begin, end)` | slices a string using 1-based index | `array_slice("year", 1, 4)` | `"year"` |
| `concat(string1, string2, string3, ...)` | concatenates multiple strings | `concat("university", " of", " waterloo")` | `"university of waterloo"` |
| `contains(string1, string2)`| returns true if `string2` is a substring of `string1` | `contains("aa", "a")`| true |
| `ends_with(string1, string2)` | alias of suffix | `ends_with("best student", "student")` | `true` |
| `lower(string)` | returns the string in lower case | lower("WaterLoo") | "waterloo" |
| `lcase(string)` | alias of `lower` | `lcase("UPPER CASE")` | `"upper case"` |
| `left(string, count)` | returns the leftmost `count` number of characters from string | `left("long string", 2)` | `"lo"` |
| `levenshtein(s1, s2)` | returns the minimum number of single-character edits<br/>(insertions, deletions or substitutions) required to transform<br/>string s1 to s2 (case-insensitive). | `levenshtein('kitten', 'sitting')` | `3` |
| `size(string)` | returns the number of characters in string | `size("database")` | `8` |
| `list_element(string, index)` | alias of array_extract | `list_element("university", 3)` | `"i"` |
| `list_extract(string, index)` | alias of array_extract | `list_extract("waterloo", 2)` | `"a"` |
| `lpad(string, count, character)` | pads the string with the character from the left until it has count characters | `lpad("WaterLoo", 10, ">")` | `">>WaterLoo"` |
| `ltrim(string)` | removes any whitespace in the beginning of the string | `ltrim("  waterloo  ")` | `"waterloo  "` |
| `prefix(string, search_string)` | returns whether the string starts with `search_string` | `prefix("good university", "good")` | `True` |
| `repeat(string, count)` | repeats the string count number of times | `repeat("##", 5)` | `"##########"` |
| `reverse(string)` | reverses the string | `reverse("<<12345>>")` | `">>54321<<"` |
| `right(string, count)` | returns the rightmost `count` number of characters from string | `right("toronto", 2)` | `"to"` |
| `rpad(string, count, character)` | pads the string with the character from the right until it has count characters | `rpad("toronto", 10, '<')` | `"toronto<<<"` |
| `rtrim(string)` | removes any whitespace in the end of the string | `rtrim("  toronto  ")` | `"  toronto"` |
| `starts_with(string1, string2)` | alias of prefix | `starts_with("best student", "best")` | `True` |
| `substring(string, start, length)` | extracts the string from start position until length number of characters using 1-based index | `substring("toronto", 1, 2)` | `"to"` |
| `substr(string, start, length)` | alias of `substring` | `substr("long str", 2, 3)` | `"ong"` |
| `suffix(string, search_string)` | returns whether the string ends with search_string | `suffix("toronto12", "12")` | `True` |
| `trim(string)` | removes any whitespace in the beginning or end of the string | `trim("  good  ")` | `"good"` |
| `upper(string)` | returns the string in upper case | `upper("small case")` | `"SMALL CASE"` |
| `ucase(string)` | alias of upper | `ucase("small case")` | `"SMALL CASE"` |
| `initcap(string)` | returns the string with only the first letter in uppercase | `initcap("roma")` | `"Roma"` |
| `string_split(string, separator)` | splits the string along the separator | `string_split('this is a sentence', ' ')` | `[this,is,a,sentence]` |
| `split_part(string, separator, index)` | splits the string along the separator and returns the data at the (1-based) index of the list. Returns empty string if index out of range | `split_part('this is a sentence', ' ', 1)` | `this` |
| `ws_concat(separator, string)` | concatenates all string inputs with separator | `CONCAT_WS(',', '1', '3', '5', '7')` | `1,3,5,7` |
</div>
