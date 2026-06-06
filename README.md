# Streamed Markdown Interview Exercise

This repo is a reference playground for discussing markdown stream rendering in React.

Live app:
- GitHub Pages: https://cloudpresser.github.io/react-markdown/

Repo:
- GitHub: https://github.com/cloudpresser/react-markdown

## What This Playground Covers

The app lets you compare two approaches side by side:

1. `react-markdown`
2. `streamdown`

It also includes controls for the main tradeoffs that usually come up in this exercise:

- static vs streaming rendering
- chunk size, speed, and variance
- `react-markdown` with and without `remend`
- Mermaid fallback behavior during partial streams

## The Core Problem

Rendering markdown is easy when the full document is available.

Rendering markdown while text is still streaming is harder because the input is often syntactically incomplete:

- unclosed `**bold`
- half-written links like `[docs](`
- unterminated code fences
- Mermaid blocks that are not complete yet

That creates a tension between:

- semantic correctness
- streaming UX
- implementation complexity
- styling control

## Main Alternatives

### 1. Plain `react-markdown`

This is the simplest baseline.

Pros:
- small mental model
- semantic HTML output
- styling-agnostic
- easy to explain in an interview

Cons:
- not designed for incomplete markdown streams
- partial formatting often waits until the block becomes valid
- fenced blocks, links, and Mermaid are rough during streaming

When to choose it:
- you want the cleanest baseline
- you want to own the streaming behavior yourself
- you care more about semantic rendering than built-in streaming UX

### 2. `react-markdown` + `remend`

This is the main middle ground used in this repo.

`remend` repairs some incomplete markdown before it reaches `react-markdown`.

Pros:
- keeps `react-markdown` as the renderer
- improves streaming behavior for incomplete emphasis, links, inline code, and similar syntax
- still keeps styling under your control

Cons:
- it is still a preprocessor layered on top of a non-streaming-first renderer
- it does not fully solve fenced block problems by itself
- Mermaid still needs special-case handling

When to choose it:
- you like `react-markdown`
- you want a small incremental improvement rather than a full renderer switch
- you want a solution that is still easy to reason about in an interview

### 3. `react-markdown` + manual remending logic

Instead of using `remend`, you can write your own repair logic for incomplete markdown.

Relevant reference:
- https://github.com/orgs/remarkjs/discussions/1332#discussioncomment-12211812

Pros:
- zero dependency on `remend`
- full control over exactly which streaming cases you support
- easier to justify if the interviewer wants to see custom reasoning rather than package selection

Cons:
- easy to underestimate edge cases
- likely to grow into ad hoc parser logic
- harder to maintain than a focused library once requirements expand

When to choose it:
- the exercise explicitly rewards building the logic yourself
- you only need to support a narrow subset of markdown
- you want to demonstrate tradeoff thinking more than library integration

### 4. `streamdown`

`streamdown` is purpose-built for streamed markdown.

Pros:
- better handling of incomplete markdown out of the box
- streaming-oriented behavior is the default rather than an add-on
- integrates well with `remend`-style repair and Mermaid plugins

Cons:
- more opinionated
- default presentation is coupled to Tailwind utility classes for full styling fidelity
- larger dependency and behavior surface area than `react-markdown`

When to choose it:
- streaming UX is the primary requirement
- you want a specialized renderer instead of assembling the pieces yourself
- you are comfortable with the styling/runtime tradeoffs

## Mermaid-Specific Tradeoffs

Mermaid is its own problem.

Even if text markdown is partially recoverable, partial Mermaid often is not.

The main options are:

### A. Render Mermaid immediately and catch failures

Pros:
- minimal logic
- starts rendering as early as possible

Cons:
- lots of churn while the diagram is still incomplete
- can feel jumpy
- error handling becomes part of the normal streaming path

### B. Keep the previous valid SVG on failure

Pros:
- visually stable
- avoids flashes and crashes

Cons:
- the diagram can become stale relative to the current text
- users may think they are looking at the latest diagram state when they are not

### C. Show a placeholder until the Mermaid block is complete

This is the direction currently explored here.

Pros:
- clear mental model
- avoids stale diagrams
- reduces render churn

Cons:
- requires block-completeness detection
- users do not see progressive Mermaid output

## How I Would Discuss This In An Interview

If I were narrating this exercise live, I would usually frame it like this:

1. Start with the smallest correct baseline.
2. Separate complete-markdown rendering from streaming-markdown rendering.
3. Decide whether the goal is semantic correctness or best-effort live UX.
4. Treat Mermaid as a special case instead of pretending it behaves like plain markdown.
5. Prefer explicit fallback states over invisible failure.

That leads naturally to a few implementation tiers:

### Tier 1

- `react-markdown`
- no repair logic
- no special Mermaid handling

Good for showing the baseline and its limits.

### Tier 2

- `react-markdown`
- `remend` or manual repair logic
- Mermaid fallback behavior

Good for showing practical problem-solving without fully changing renderers.

### Tier 3

- `streamdown`
- Mermaid plugin
- renderer-specific fallback controls

Good for showing what a streaming-first stack buys you, and what it costs.

## Current Experiment Setup In This Repo

This repo intentionally keeps both renderers visible so you can discuss:

- output fidelity
- streaming behavior
- Mermaid handling
- library ergonomics
- styling constraints

The `react-markdown` side currently exposes toggles for:

- `remend`
- Mermaid catch rendering
- Mermaid placeholder fallback

That makes it easy to show not just one answer, but the tradeoffs between several valid answers.

## Running Locally

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

## Bottom Line

If the interview goal is simplicity, start with `react-markdown`.

If the interview goal is realistic streaming UX, `react-markdown` usually needs help from either:

- `remend`
- manual repair logic
- Mermaid-specific fallback handling

If the interview goal is to optimize for streamed markdown as a first-class use case, `streamdown` is the stronger candidate, but it comes with more opinionated behavior and integration constraints.
