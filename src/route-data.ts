import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

export const onRequest = defineRouteMiddleware((context) => {
  const { sidebar } = context.locals.starlightRoute;

  const searchPaths = [
    '/cypher/data-definition',
    '/cypher/data-manipulation-clauses',
    '/cypher/data-types',
    '/cypher/expressions',
    '/cypher/query-clauses',
  ];

  function processEntryGroup(group: any) {
    for (const entry of group) {
      if (entry.type === 'link') {
        if (searchPaths.includes(entry.href)) {
          entry.isCurrent = context.url.pathname.startsWith(entry.href);
        }
      } else if (entry.type === 'group') {
        processEntryGroup(entry.entries);
      }
    }
  }

  processEntryGroup(sidebar);
});
