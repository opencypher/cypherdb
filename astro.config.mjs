import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import starlight from "@astrojs/starlight";
import starlightLinksValidator from "starlight-links-validator";
import fs from "fs";
import path from 'path'

const cypherGrammar = JSON.parse(
    fs.readFileSync(path.resolve('./src/styles/cypher.tmLanguage.json'), 'utf8')
  )

const site = "https://kuzudb.github.io/";

process.env.ASTRO_TELEMETRY_DISABLED = '1';

// https://astro.build/config
export default defineConfig({
    site,
    base: "/docs",
    integrations: [
        sitemap(),
        starlight({
            favicon: '/img/favicon.ico',
            title: 'Kuzu',
            logo: {
                light: '/src/assets/logo/kuzu-logo.png',
                dark: '/src/assets/logo/kuzu-logo-inverse.png',
                replacesTitle: true,
            },
            social: {
                github: 'https://github.com/kuzudb/kuzu',
            },
            editLink: {
                baseUrl: 'https://github.com/kuzudb/kuzu-docs/edit/main',
            },
            customCss: ['./src/styles/custom.css'],
            expressiveCode: {
                shiki: {
                  langs: [
                    { name: 'cypher', ...cypherGrammar }
                  ],
                }
              },
            head: [
                // Basic OG tags
                {
                    tag: 'meta',
                    attrs: { property: 'og:type', content: 'website' },
                },
                {
                    tag: 'meta',
                    attrs: { property: 'og:url', content: site },
                },
                {
                    tag: 'meta',
                    attrs: { property: 'og:title', content: 'Kuzu - Graph Database' },
                },
                {
                    tag: 'meta',
                    attrs: { property: 'og:description', content: 'Documentation for Kuzu, an open source, embedded graph database' },
                },
                {
                    tag: 'meta',
                    attrs: { property: 'og:image', content: site + '/img/og.png' },
                },

                // Twitter specific tags
                {
                    tag: 'meta',
                    attrs: { name: 'twitter:card', content: 'summary_large_image' },
                },
                {
                    tag: 'meta',
                    attrs: { property: 'twitter:domain', content: 'docs.kuzudb.com' },
                },
                {
                    tag: 'meta',
                    attrs: { property: 'twitter:url', content: site },
                },
                {
                    tag: 'meta',
                    attrs: { name: 'twitter:title', content: 'Kuzu - Graph Database' },
                },
                {
                    tag: 'meta',
                    attrs: { name: 'twitter:description', content: 'Documentation for Kuzu, an open source, embedded graph database' },
                },
                {
                    tag: 'meta',
                    attrs: { name: 'twitter:image', content: site + '/img/og.png' },
                },
                {
                    tag: "script",
                    attrs: { src: "/remove-prompt.js", type: "text/javascript" }
                },

            ],
            components: {
                Header: './src/components/overrides/Header.astro',
                Banner: './src/components/overrides/Banner.astro',
                ThemeSelect: './src/components/overrides/ThemeSelect.astro',
                PageFrame: './src/components/overrides/PageFrame.astro',
                TwoColumnContent: './src/components/overrides/TwoColumnContent.astro',
            },
            sidebar: [
                {
                    label: 'Home',
                    link: '/',
                },
                {
                    label: 'Install Kuzu',
                    collapsed: true,
                    items: [
                        { label: 'Install Kuzu', link: '/installation', },
                        { label: 'System requirements', link: '/system-requirements'},
                    ]
                },
                {
                    label: 'Get started',
                    collapsed: false,
                    items: [
                        { label: 'Create your first graph', link: '/get-started' },
                        { label: 'Query & visualize your graph', link: '/get-started/cypher-intro' },
                        { label: 'Run prepared Cypher statements', link: '/get-started/prepared-statements' },
                        { label: 'Scan data from various sources', link: '/get-started/scan'},
                        { label: 'Run graph algorithms', link: '/get-started/graph-algorithms' },
                    ]
                },
                {
                    label: 'Tutorials',
                    collapsed: true,
                    items: [
                        { label: 'Overview', link: '/tutorials' },
                        { label: 'Cypher', link: '/tutorials/cypher' },
                        { label: 'Python', link: '/tutorials/python' },
                        { label: 'Rust', link: '/tutorials/rust' },
                    ]
                },
                {
                    label: 'Import data',
                    collapsed: true,
                    items: [
                        {
                            label: 'Copy from files/formats',
                            items: [
                                { label: 'Overview', link: '/import' },
                                { label: 'Copy from CSV', link: '/import/csv' },
                                { label: 'Copy from Parquet', link: '/import/parquet' },
                                { label: 'Copy from NumPy', link: '/import/npy' },
                                { label: 'Copy from DataFrame', link: '/import/copy-from-dataframe' },
                                { label: 'Copy from subquery', link: '/import/copy-from-subquery' },
                                { label: 'Copy from JSON', link: '/import/copy-from-json' },
                            ]
                        },
                        { label: 'Merge', link: '/import/merge' },
                    ]
                },
                {
                    label: 'Export data',
                    collapsed: true,
                    items: [
                        { label: 'Overview', link: '/export' },
                        { label: 'Copy to CSV', link: '/export/csv' },
                        { label: 'Copy to Parquet', link: '/export/parquet' },
                        { label: 'Copy to JSON', link: '/export/json'},
                    ]
                },
                {
                    label: 'Migrate your database',
                    collapsed: true,
                    items: [
                        { label: 'Overview', link: '/migrate' },
                    ]
                },
                {
                    label: 'Visualize graphs',
                    collapsed: true,
                    items: [
                        {
                            label: 'Kuzu Explorer',
                            collapsed: true,
                            items: [
                                { label: 'Intro to Kuzu Explorer', link: '/visualization/kuzu-explorer'},
                                { label: 'Query panel', link: '/visualization/kuzu-explorer/query-panel'},
                                { label: 'Schema panel', link: '/visualization/kuzu-explorer/schema-panel' },
                                { label: 'Import panel', link: '/visualization/kuzu-explorer/import-panel' },
                                { label: 'Settings panel', link: '/visualization/kuzu-explorer/settings-panel' },
                            ],
                        },
                        {
                            label: 'Third-party integrations',
                            collapsed: true,
                            items: [
                                { label: 'G.V()', link: '/visualization/third-party-integrations/gdotv', badge: { text: 'New' }},
                                { label: 'yFiles Jupyter Graphs', link: '/visualization/third-party-integrations/yfiles', badge: { text: 'New' }},
                            ],
                        },
                    ],
                },
                {
                    label: 'Cypher manual',
                    collapsed: true,
                    items: [
                        { label: 'Overview', link: '/cypher'},
                        { label: 'Syntax', link: '/cypher/syntax'},
                        { label: 'Data types', link: '/cypher/data-types'},
                        { label: 'Query clauses', link: '/cypher/query-clauses' },
                        { label: 'Functions, expressions, & operators', link: '/cypher/expressions' },
                        { label: 'Data definition language (DDL)', link: '/cypher/data-definition' },
                        { label: 'Data manipulation clauses', link: '/cypher/data-manipulation-clauses' },
                        { label: 'Subqueries', link: '/cypher/subquery' },
                        { label: 'Macros', link: '/cypher/macro' },
                        { label: 'Transactions', link: '/cypher/transaction' },
                        { label: 'Attach/Detach to external databases', link: '/cypher/attach' },
                        { label: 'Configuration', link: '/cypher/configuration' },
                        { label: 'Differences with Neo4j', link: '/cypher/difference' },
                    ],
                },
                {
                    label: 'Use client APIs',
                    collapsed: true,
                    items: [
                        { label: 'Overview', link: '/client-apis/' },
                        { label: 'CLI', link: '/client-apis/cli' },
                        { label: 'Python', link: '/client-apis/python' },
                        { label: 'Node.js', link: '/client-apis/nodejs' },
                        { label: 'Java', link: '/client-apis/java' },
                        { label: 'Rust', link: '/client-apis/rust' },
                        { label: 'Go', link: '/client-apis/go' },
                        { label: 'Swift', link: '/client-apis/swift' },
                        { label: 'C++', link: '/client-apis/cpp' },
                        { label: 'C', link: '/client-apis/c' },
                        { label: '.NET', link: '/client-apis/net', badge: { text: 'Community', variant: 'caution'}},
                        { label: 'Elixir', link: '/client-apis/elixir', badge: { text: 'Community', variant: 'caution'}},
                        { label: 'Ruby', link: '/client-apis/ruby', badge: { text: 'Community', variant: 'caution'}},
                        { label: 'Nim', link: '/client-apis/nim', badge: { text: 'Community', variant: 'caution'}},
                    ],
                },
                { label: 'Kuzu-Wasm', link: '/client-apis/wasm' },
                { label: 'Connections & concurrency', link: '/concurrency' },
                {
                    label: 'Developer guide',
                    collapsed: true,
                    items: [
                        { label: 'Build Kuzu from source', link: '/developer-guide' },
                        { label: 'Performance debugging', link: '/developer-guide/performance-debugging' },
                        { label: 'Testing framework', link: '/developer-guide/testing-framework' },
                        { label: 'Join order hints', link: '/developer-guide/join-order-hint' },
                        { label: 'On-disk files', link: '/developer-guide/files' },
                        {
                            label: 'Database internals',
                            items: [
                                { label: 'Overview', link: '/developer-guide/database-internal' },
                                { label: 'Data types', link: '/developer-guide/database-internal/datatype' },
                                { label: 'Vector types', link: '/developer-guide/database-internal/vector' },
                                { label: 'Execution', link: '/developer-guide/database-internal/execution' },
                            ]
                        }
                    ]
                },
                {
                    label: 'Extensions',
                    collapsed: true,
                    items: [
                        { label: 'Overview', link: '/extensions'},
                        { 
                            label: 'Cloud storage systems',
                            collapsed: true,
                            items: [
                                { label: 'Amazon S3', link: '/extensions/s3'},
                                { label: 'Google Cloud Storage', link: '/extensions/gcs' },
                                { label: 'Microsoft Azure', link: '/extensions/azure', badge: { text: 'New' }},
                            ]
                        },
                        { label: 'External Kuzu databases', link: '/extensions/attach/kuzu' },
                        { label: 'Full-text search', link: '/extensions/full-text-search' },
                        {
                            label: 'Graph algorithms',
                            collapsed: true,
                            items: [
                                { label: 'Overview', link: '/extensions/algo'},
                                { label: 'K-Core Decomposition', link: '/extensions/algo/kcore'},
                                { label: 'Louvain', link: '/extensions/algo/louvain'},
                                { label: 'PageRank', link: '/extensions/algo/pagerank'},
                                { label: 'Shortest paths', link: '/extensions/algo/path'},
                                { label: 'Strongly Connected Components', link: '/extensions/algo/scc'},
                                { label: 'Weakly Connected Components', link: '/extensions/algo/wcc'},
                            ]
                        },
                        { label: 'HTTPS file system', link: '/extensions/httpfs' },
                        { label: 'JSON', link: '/extensions/json' },
                        {
                            label: 'Lakehouse formats',
                            collapsed: true,
                            items: [
                                { label: 'Iceberg', link: '/extensions/attach/iceberg' },
                                { label: 'Delta Lake', link: '/extensions/attach/delta' },
                                { label: 'Unity Catalog', link: '/extensions/attach/unity' },
                            ]
                        },
                        { label: 'LLM', link: '/extensions/llm', badge: { text: 'New' }},
                        { label: 'Neo4j', link: '/extensions/neo4j'},
                        {
                            label: 'Relational databases',
                            collapsed: true,
                            items: [
                                { label: 'Overview', link: '/extensions/attach/rdbms' },
                                { label: 'PostgreSQL', link: '/extensions/attach/postgres' },
                                { label: 'DuckDB', link: '/extensions/attach/duckdb' },
                                { label: 'SQLite', link: '/extensions/attach/sqlite' },
                            ]
                        },
                        { label: 'Vector search', link: '/extensions/vector'},
                    ],
                },
            ],
            plugins: process.env.CHECK_LINKS
                ? [
                        starlightLinksValidator({
                            errorOnFallbackPages: true,
                            errorOnInconsistentLocale: true,
                            exclude: ['http://localhost:8000'],
                        }),
                  ]
                : [],
            lastUpdated: true,
            routeMiddleware: './src/route-data.ts',
        }),
    ],
});
