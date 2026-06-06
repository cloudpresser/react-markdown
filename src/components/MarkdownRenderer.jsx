import { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remend from 'remend'
import MermaidDiagram from './MermaidDiagram.jsx'

function hasIncompleteMermaidFence(content) {
  const mermaidFencePattern = /^```mermaid\s*$/gm
  let openFenceCount = 0
  let match = mermaidFencePattern.exec(content)

  while (match) {
    openFenceCount += 1
    match = mermaidFencePattern.exec(content)
  }

  if (openFenceCount === 0) {
    return false
  }

  const closingFenceCount = (content.match(/^```\s*$/gm) ?? []).length

  return closingFenceCount < openFenceCount
}

function MermaidPlaceholder() {
  return <div className="mermaid-placeholder">Waiting for Mermaid...</div>
}

function MarkdownCode({
  className,
  children,
  isStreaming,
  useMermaidCatch,
  useMermaidPlaceholder,
  hasPendingMermaidFence,
  ...props
}) {
  if (className === 'language-mermaid') {
    if (useMermaidPlaceholder && isStreaming && hasPendingMermaidFence) {
      return <MermaidPlaceholder />
    }

    return (
      <MermaidDiagram
        chart={String(children).replace(/\n$/, '')}
        isStreaming={isStreaming}
        useCatchRendering={useMermaidCatch}
        usePlaceholder={useMermaidPlaceholder}
      />
    )
  }

  return (
    <code className={className} {...props}>
      {children}
    </code>
  )
}

function MarkdownPre({ children, ...props }) {
  if (children?.props?.className === 'language-mermaid') {
    return children
  }

  return <pre {...props}>{children}</pre>
}

function MarkdownRenderer({
  content,
  isStreaming,
  useRemend,
  useMermaidCatch,
  useMermaidPlaceholder,
}) {
  const processedContent = useMemo(() => {
    if (!isStreaming || !useRemend) {
      return content
    }

    return remend(content, {
      inlineKatex: false,
    })
  }, [content, isStreaming, useRemend])

  const hasPendingMermaidFence = useMemo(() => {
    if (!isStreaming || !useMermaidPlaceholder) {
      return false
    }

    return hasIncompleteMermaidFence(content)
  }, [content, isStreaming, useMermaidPlaceholder])

  const components = useMemo(
    () => ({
      code: (props) => (
        <MarkdownCode
          {...props}
          hasPendingMermaidFence={hasPendingMermaidFence}
          isStreaming={isStreaming}
          useMermaidCatch={useMermaidCatch}
          useMermaidPlaceholder={useMermaidPlaceholder}
        />
      ),
      pre: MarkdownPre,
    }),
    [hasPendingMermaidFence, isStreaming, useMermaidCatch, useMermaidPlaceholder],
  )

  return (
    <article className="panel preview-panel">
      <div className="panel-header">
        <h2>react-markdown</h2>
        <span>Reference renderer</span>
      </div>
      <div className="markdown-frame prose-area">
        <ReactMarkdown components={components}>{processedContent}</ReactMarkdown>
      </div>
    </article>
  )
}

export default MarkdownRenderer
