# Security And Sanitization Notes

## Core Question

Who do you trust to produce the markdown?

That answer changes the right implementation.

Typical trust levels:

1. trusted internal content
2. AI-generated content
3. untrusted user-generated content

## Main Security Decision

Do you allow raw HTML in markdown?

If yes, you need a policy for sanitization.

Useful references:
- `rehype-sanitize`: https://github.com/rehypejs/rehype-sanitize
- `rehype-raw`: https://github.com/rehypejs/rehype-raw

## Practical Guidance

### Lowest-risk path

- do not allow raw HTML
- render markdown only
- keep the allowed feature set small

### Middle ground

- allow some richer markdown features
- sanitize aggressively
- explicitly choose allowed tags/attributes

### Highest-risk path

- allow broad raw HTML from untrusted sources

Opinion:
- this should usually be avoided unless there is a very clear product requirement and a carefully reviewed sanitization policy

## Interview Follow-Up Angle

This topic matters because a common follow-up is not just “render markdown,” but:

- render user content safely
- support embedded HTML
- support richer markdown features without introducing XSS risk

## Bottom Line

Renderer choice is only part of the decision. The content trust model should drive the sanitization policy.
