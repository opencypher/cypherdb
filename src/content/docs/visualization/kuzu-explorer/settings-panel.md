---
title: Settings Panel
description: Configure Kuzu Explorer display options, graph layout settings, and visualization preferences.
---

The Settings Panel, which you can access by clicking `Settings` in the top right corner,
contains several options to configure your schema and query result visualizations. Below is 
a screenshot of the Settings Panel.

<img src="/img/visualization/settings-panel.png" />

The available configurations are:

- **Changing the color, size, and captions of nodes and relationships in graph views:** The size and caption
configurations only change the rendering of the nodes and relationships in the query results and not the
graph schema. For captions, you can choose to display a property, the table name of the nodes/relationships,
or omit the caption completely. Changing the color of a node or relationship changes both the
database schema visualization as well as the query result visualization. 
- **Max number of nodes to draw when visualizing query results:** If a query returns a very large number
of nodes, rendering them on the canvas can be very cumbersome and slow. To avoid this, there is a maximum limit on the
number of nodes and the edges between these nodes that are drawn.
Under the `Performance Options` heading, this limit can be changed.
- **Option to display or omit the relationship table names:** If your database schema is complex and contains many relationship
tables, it might be cumbersome to display relationship table names on every relationship. You can instead omit displaying
relationship table names on the graph schema view and only show them when you hover or click on a relationship.
To do so, choose the `On hover or click` option from the dropdown menu next to `Show relationship labels` instead of the default `Always`.
- **Number of rows per page in table view:** When you visualize query results as a table, if the table is large, we paginate the results.
This option sets the number of rows per page.  
