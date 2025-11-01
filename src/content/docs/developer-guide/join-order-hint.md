---
title: Join order hints
description: Join order hints that allow users to enforce a specific join order
---

`HINT` is an optional clause, available since Kuzu 0.5.0 and upward, that allows you to enforce a specific query plan
for some of your queries. Specifically, you can explicitly declare the join order and/or sometimes the
join algorithm used by the system.

## HINT and JOIN clauses

We explain the `HINT` clause through an example. Consider the following query:
```cypher
MATCH (a:person)-[e:LivesIn]->(b:City)
WHERE b.ID = 0
RETURN *;
```
The Kuzu optimizer has the freedom to generate a query plan that matches all relationships from `a` to `b` using
forward adjacency lists or from `b` to `a` using backward adjacency lists.
Both query plans are correct and will generate the same query result. However, there is a potential performance difference because
there may be a different number of nodes connected to `a` and `b`, i.e., `a` and `b` may have different cardinalities.
In the above case, because there is a filter on `b`, you can expect there to be very few, possibly only one `b` node that matches the predicate in the `WHERE` clause.

For experimental purposes, or when the optimizer provides a sub-optimal plan, you can enforce a particular join order
by using the `HINT` clause and writing a join order. This works as follows:
- Join hints work within the scope of a single `MATCH` pattern.
- The pattern must be connected, e.g., it cannot be `MATCH (a:Person), (b:Person) RETURN *;` where there are 2 disconnected components.
- Every node/relationship variable must be named and appear in the join order exactly once. Relationship variables can be [recursive](https://kuzudb.github.io/docs/cypher/query-clauses/match/#match-variable-lengthrecursive-relationships), e.g., `-[e*1..3]->` or `-[e* SHORTEST]->`.
- The join order is a binary tree, expressed through the structure of the parentheses inside the `HINT` clause. Every sub-tree in the plan specified by `HINT` must be connected.

As an example, the below hint enforces a query plan that scans edges using backward adjacency lists from `b`:
```cypher
MATCH (a)-[e]->(b)
WHERE b.ID = 0
HINT a JOIN (e JOIN b)
RETURN *;
```

The full parenthesization is this: `(a JOIN (e JOIN b))`. The top join operator joins `a`
with the result of `(e JOIN b)`. The `(e JOIN b)` enforces the join of b node records with e, which will happen by scanning the b nodes in the backward direction.
The result of this will then be joined with `a` node records. If the parenthesization was `((a JOIN e) JOIN b)`, then the
top join operator would join `(a JOIN e)`, which would be computed by scanning `a` nodes in the forward direction, with `b`.

### Effect of left/right side of JOIN:
In a single parenthesis that uses the `JOIN` clause, swapping the left and right sides of JOIN has an effect.
Specifically, `(x JOIN y)` and `(y JOIN x)` will generally (though not always) lead to different plans.
In both cases `x` and `y` will be joined, however if the JOIN operator is a hash join operator, then the left side
is the probe and the right side is the build side of the hash join. This can have an impact on performance.

In the case when the parenthesis looks as follows `(a JOIN e1)`, where
one of these variables is a node variable and the other is a relationship variable, then `(a JOIN e1)` vs `(e1 JOIN a)` produce the
same plan because such joins are compiled as scanning node tables followed by scanning relationship tables.

### MULTI_JOIN clause: Worst-case optimal join plans

Kuzu plans can use a combination of binary join operators and [worst-case optimal join (WCOJ)](https://kuzudb.github.io/blog/post/wcoj/) operators.
WCOJ operators are useful if your `MATCH` pattern contains cycles, e.g., when finding triangles or larger cliques of nodes in your databases.
Using HINT, you can also force the optimizer to use a WCOJ operator as follows:

- Within `k` tree nodes, `k-1` of them must be edge/relationship variables and not results of more complex sub-join plans.
Let us refer to these edges as `e1`, ..., `e(k-1)`. These edges must intersect at a single intersected node variable.
Let us call that node variable `c`. The last tree node, which we will call the "probe node" can be the result of an arbitrary sub-join plan.
Let us refer to the probe node with `(probeNode)`.
- Start with the probe side node and list the `k-1` edge variables, all separated with `k-1` `MULTI_JOIN` clauses inside a single parenthesis.
That is, this component looks like `((probeNode) MULTI_JOIN e1 MULTI_JOIN e2 ... MULTI_JOIN e(k-1))`.
- Then join this above parenthesis with the intersected node variable `c`. You can do either
`(((probeNode) MULTI_JOIN e1 MULTI_JOIN e2 ... MULTI_JOIN e(k-1)) JOIN c)` or
`(c JOIN ((probeNode) MULTI_JOIN e1 MULTI_JOIN e2 ... MULTI_JOIN e(k-1)))`. This changes the build side and probe side
of how the properties of c, if needed, would be placed in the join plan (see above for the details of build and probe sides).

When we perform the k-way join between the probeNode and `k-1` relationships, for each input tuple from the probeNode subplan, we find an adjacency list from each edge table and sort-merge join them on the intersected node.
That's the essence of the WCOJ operator in Kuzu.

For example, in the following triangle query,  Kuzu will compute `(a JOIN e1)`, which will produce a set of `(a, e1, b)` tuples.
Then for each `(a, e1, b)` tuple, the Kuzu's WCOJ operator will find the forward adjacency list for `e2` and `e3` and intersect them to
produce  `(a, e1, b, e2, e3, c)` outputs.
```cypher
MATCH (a:person)<-[e1:knows]-(b:person)-[e2:knows]->(c:person),
      (a)-[e3:knows]->(c)
HINT (((a JOIN e1) JOIN b) MULTI_JOIN e2 MULTI_JOIN e3) JOIN c
RETURN COUNT(*)
```

:::note[Note]
If in your `HINT` you use `MULTI_JOIN` with a single relation, i.e., when k-1 is 1, then this will not produce
a plan with a WCOJ operator because to perform intersections, there needs to be at least 2 sets of adjacency lists to intersect.
Instead `MULTI_JOIN` will be treated as JOIN.
:::
