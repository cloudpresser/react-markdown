# Streamed Markdown In React

This repo is a reference playground for discussing markdown stream rendering in React.

Live app:
- GitHub Pages: https://cloudpresser.github.io/react-markdown/

Repo:
- GitHub: https://github.com/cloudpresser/react-markdown

## Decision Tree

Start with the renderer decision first.

### Choose `streamdown` when:

- the project already uses Tailwind
- streamed AI output is a first-class product feature
- you want more built-in handling for incomplete markdown and AI-specific rendering concerns
- you are comfortable with a more opinionated renderer

Read next:
- `docs/streamdown.md`

### Choose `react-markdown` when:

- you want semantic HTML with minimal renderer opinionation
- you want styling independence from Tailwind
- you want to control the streaming and fallback strategy yourself
- you want the simplest baseline and are willing to layer behavior on top

Read next:
- `docs/react-markdown.md`

## Core Concerns

These are likely concerns when dealing with streaming markdown rendering.

### 1. Incomplete Stream Handling

Streaming markdown is often syntactically incomplete:

- unclosed emphasis
- partial links
- unterminated code fences
- incomplete Mermaid blocks

This is the main reason a plain markdown renderer can feel rough under streamed input.

### 2. Project Compatibility

Renderer fit depends heavily on the existing app:

- Is Tailwind already present?
- Is styling tightly controlled already?
- Is the app already using a markdown pipeline built around `remark` / `rehype`?

### 3. Rich Block Behavior

Mermaid, syntax highlighting, tables, math, and raw HTML usually need explicit decisions.

Mermaid in particular should be treated as a separate concern from plain markdown streaming.

### 4. Security / Trust Model

The right implementation depends on who produced the content:

- trusted internal content
- AI-generated content
- untrusted user-generated content

Read next:
- `docs/security.md`

### 5. UX During Failure Or Incompleteness

For incomplete or invalid streamed content, you usually need to choose one of these behaviors:

- repair the markdown
- defer rendering until the block is complete
- show a placeholder
- keep the previous valid render
- surface an error immediately

### 6. Animation And Presentation

Streaming markdown is not only about correctness.

The product may also care about:

- progressive reveal
- reduced visual jumpiness
- renderer-aware transitions
- an AI-like streamed presentation style

`streamdown` has a stronger built-in story here.

With `react-markdown`, animation usually needs to be implemented separately at the stream state or UI layer.

## Reference Docs

Local docs:
- `docs/react-markdown.md`
- `docs/streamdown.md`
- `docs/security.md`

Upstream docs:
- `react-markdown`: https://github.com/remarkjs/react-markdown
- `streamdown`: https://streamdown.ai/
- `remend`: https://www.npmjs.com/package/remend
- incomplete stream patterns: https://streamdown.ai/docs/termination#supported-incomplete-patterns
- manual repair discussion: https://github.com/orgs/remarkjs/discussions/1332#discussioncomment-12211812
- `rehype-sanitize`: https://github.com/rehypejs/rehype-sanitize
- `remark-gfm`: https://github.com/remarkjs/remark-gfm
- `rehype-raw`: https://github.com/rehypejs/rehype-raw

## Running Locally

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```
