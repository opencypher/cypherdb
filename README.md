# Kuzu Documentation

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

This documentation site is built with [Astro](https://astro.build) and
[Starlight](https://starlight.astro.build). The sections below describe the site's structure and
the commands for installation, local development and build instructions.

## 🚀 Project Structure

Inside of this Astro + Starlight project, there exist the following folders and files:

```
.
├── public/
├── src/
│   ├── assets/
│   ├── content/
│   │   ├── docs/
│   │   └── config.ts
│   └── env.d.ts
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

Starlight looks for `.md` or `.mdx` files in the `src/content/docs/` directory. Each file is exposed
as a route based on its file name.

> [!NOTE]
> MDX combines JSX and Markdown to make it easier to write component-driven content like tabbed code blocks.
> Starlight requires that you work with `.mdx` files instead of `.md` when using JSX components. See the official
> [documentation](https://mdxjs.com/) for more information on MDX syntax and why it exists.

Images are added to `src/assets/` and embedded in Markdown with a relative link.

Any additional static assets (like fonts, favicon, PDFs, etc.) that will not be processed by Astro
are placed in the `public/` directory.

## Customizations

### Table Syntax Highlighting

Add tag "table" after the three backticks to indicate the table custom css style to code block

**Usage:**
```table
┌─────────┬─────────┬─────────┐
│ column1 │ column2 │ column3 │
├─────────┼─────────┼─────────┤
│ value1  │ value2  │ value3  │
└─────────┴─────────┴─────────┘
```


### Tab Synchronization

Include "syncKey=<syncKey_name>" to Tabs tag. To have tabs synchronize, ensure <syncKey_name> are the same across different tabs.
The tabitems do not need to be the same. Identical tabitems will have synchronization applied to them when clicked.

**Usage:**
<Tabs syncKey="langs">
  <TabItem label="Python" />
  <TabItem label="Rust" />
</Tabs>

<Tabs syncKey="langs">
  <TabItem label="C++" />
  <TabItem label="Rust" />
  <TabItem label="Java" />
</Tabs>

Pressing on "Rust" will result in both tabs switching onto Rust.


## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm start`               | Starts local server and builds site              |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
| `npm run check-links`     | Check for broken links in the documentation      |

## 👀 Learn more

Check out [Starlight’s docs](https://starlight.astro.build/) and read
[the Astro documentation](https://docs.astro.build) for further customization of the site.
