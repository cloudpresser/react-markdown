# `streamdown` Implementation Notes

## When It Is A Good Fit

`streamdown` is a strong fit when streamed AI markdown is already an important product surface and the project is compatible with its styling/runtime assumptions.

It is especially attractive when:

- the app already uses Tailwind
- you want more built-in handling for incomplete markdown
- you want a renderer that is explicitly optimized for streamed output
- you expect AI-specific markdown edge cases to be common

## Main Tradeoff

`streamdown` reduces the amount of streaming behavior you need to assemble yourself, but it is more opinionated than `react-markdown`.

The biggest compatibility question is usually styling.

Opinion:
- if Tailwind is already present, `streamdown` can easily be the best practical answer
- if the project is not using Tailwind and wants renderer styling independence, the integration tradeoff is larger

## Why It Is Attractive For AI Output

`streamdown` is built around streamed markdown as the default case rather than the exception.

That matters because AI output often includes:

- incomplete emphasis
- partially written links
- incomplete code fences
- Mermaid and other structured blocks arriving incrementally

Useful links:
- home/docs: https://streamdown.ai/
- incomplete pattern support: https://streamdown.ai/docs/termination#supported-incomplete-patterns

## Built-In UX Advantages

Beyond correctness, `streamdown` is attractive because it already has a stronger presentation model for streamed output.

That can include:

- progressive reveal behavior
- less custom glue for AI-style streamed rendering
- animation and transition behavior that feels more native to the renderer

Opinion:
- if the product cares about the feel of streamed output as much as the final rendered result, this is one of `streamdown`'s biggest advantages.

## Things To Evaluate Early

1. Tailwind compatibility
2. DOM/output shape compared to your existing markdown styling expectations
3. Plugin support you need, especially Mermaid and any code/table behavior
4. Whether the built-in streaming behavior matches your product UX expectations

## Mermaid Guidance

If you use `streamdown`, prefer leaning on its Mermaid support and plugin docs first instead of re-implementing custom behavior immediately.

Still decide explicitly:

- what to do with incomplete Mermaid blocks
- what to do with invalid Mermaid after stream completion
- how much renderer-specific UI you want to expose

## Useful References

- `streamdown`: https://streamdown.ai/
- termination / repair behavior: https://streamdown.ai/docs/termination#supported-incomplete-patterns
- Mermaid plugin package: https://www.npmjs.com/package/@streamdown/mermaid

## Suggested Interview Framing

If you pick `streamdown`, a strong explanation is:

1. The product requirement is streamed markdown, not just markdown.
2. A streaming-first renderer reduces custom glue code.
3. The main decision is whether the project is compatible with its styling/runtime assumptions.
4. If Tailwind is already in place, the tradeoff becomes much more favorable.

## Bottom Line

Use `streamdown` when streamed markdown is central to the product and project compatibility already points in its direction.
