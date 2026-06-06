# `react-markdown` Implementation Notes

## When It Is A Good Fit

`react-markdown` is the best fit when you want a relatively unopinionated renderer that outputs semantic HTML and stays compatible with plain CSS, CSS modules, styled-components, or whatever styling system the project already uses.

It is especially attractive when:

- the app does not use Tailwind
- markdown is important, but streaming-specific behavior is not yet deeply productized
- you want a simple baseline before layering custom behavior

## Main Tradeoff

`react-markdown` is good at rendering complete markdown.

It is not a streaming-first renderer, so partial input usually needs help.

Typical rough edges:

- incomplete emphasis does not always render the way users expect
- partial links and inline code can look broken or laggy
- unterminated fences are awkward
- Mermaid needs special handling during streaming

## Implementation Strategies

### Strategy 1: Plain `react-markdown`

Use it directly and accept that only valid markdown renders cleanly.

Good for:
- simplest baseline
- fastest initial implementation
- demonstrating the problem clearly in an interview

### Strategy 2: `react-markdown` + `remend`

Use a preprocessor to repair incomplete markdown before it reaches the parser.

This is a strong middle ground when you want to keep `react-markdown` but improve streamed UX.

Useful links:
- `remend`: https://www.npmjs.com/package/remend
- supported incomplete patterns: https://streamdown.ai/docs/termination#supported-incomplete-patterns

Opinion:
- this is usually the first pragmatic upgrade I would try before building custom repair logic

### Strategy 3: `react-markdown` + manual repair logic

Write your own incomplete-markdown repair path.

Useful links:
- manual repair discussion: https://github.com/orgs/remarkjs/discussions/1332#discussioncomment-12211812
- supported incomplete patterns: https://streamdown.ai/docs/termination#supported-incomplete-patterns

Opinion:
- this can be a good interview answer if the scope is intentionally narrow
- it becomes risky quickly once more markdown features are introduced

## Mermaid Guidance

Mermaid should usually be handled outside the default markdown happy path.

Recommended options:

1. Render Mermaid only after the fence is complete.
2. Show a placeholder like `Waiting for Mermaid...` while streaming incomplete Mermaid.
3. If rendering fails during streaming, prefer a placeholder or deferred state over hard errors.
4. Only show explicit errors once the stream is complete and the final Mermaid is still invalid.

Opinion:
- Mermaid is the clearest case where a placeholder strategy is often better than trying to force live progressive rendering.

## Animation Tradeoff

`react-markdown` does not provide a streaming-aware animation model by itself.

If the product wants streamed presentation polish, that usually has to be implemented outside the renderer, for example through:

- parent-owned stream cadence
- placeholder states while blocks are incomplete
- custom transitions for text or block reveal
- renderer-specific fallback UI for things like Mermaid

Opinion:
- `react-markdown` can absolutely participate in a polished streamed experience, but the animation layer is typically your responsibility rather than the renderer's.

## Useful Plugin / Pipeline References

- `react-markdown`: https://github.com/remarkjs/react-markdown
- `remark-gfm`: https://github.com/remarkjs/remark-gfm
- `rehype-raw`: https://github.com/rehypejs/rehype-raw
- `rehype-sanitize`: https://github.com/rehypejs/rehype-sanitize

## Suggested Interview Framing

If you pick `react-markdown`, a strong explanation is:

1. Start with the simplest semantic renderer.
2. Separate complete-document rendering from streamed-document rendering.
3. Add repair or fallback behavior only where the baseline breaks down.
4. Treat Mermaid and raw HTML as explicit policy decisions, not implicit defaults.

## Bottom Line

Use `react-markdown` when you want a strong, flexible baseline and are willing to own the streaming strategy.
