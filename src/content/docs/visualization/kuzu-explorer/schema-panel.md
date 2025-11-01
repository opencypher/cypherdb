---
title: Schema Panel
description: Explore database schema visually with node and relationship table information in Kuzu Explorer.
---

If you click on the `Schema` tab in the top right corner of Kuzu Explorer, you get to the Schema Panel,
where you can see the existing node and relationship tables in your database in a graph view.
The screenshot below shows the default schema you would see if you loaded the `demo-db` database that is bundled
with Kuzu Explorer.

<img src="/img/visualization/schema-panel.png" />

As shown in the figure, the right panel, when you have not clicked on a node or relationship, shows the set of
node and relationship tables under `Node Tables`, `Relationship Tables`, and `Relationship Groups` headings. Let's call this the "main right panel".
In the main right panel, there are two `Add` buttons to add new node and relationship tables. The screenshot below shows the
right panel you would see if you clicked on the `Add` button next to the `Node Tables` heading. In the screenshot,
we are adding a new node table called `Organization` with two properties: (i) a string `name` property; and
(ii) a date `foundationDate` property.

<img src="/img/visualization/new-node-table-panel.png" />

You can also edit the schema of your existing tables, specifically
add or remove properties from them as follows. When you click on a node or relationship in the
graph view or the edit icon next to a table, the properties of the corresponding table are shown
in the right panel as shown below. This panel contains buttons to add/remove/rename properties of an existing table.
There is also a `Drop Table` button to drop the entire table.

<img src="/img/visualization/table-editing-panel.png" />
