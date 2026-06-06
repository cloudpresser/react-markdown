import { useEffect, useId, useRef, useState } from 'react'
import mermaid from 'mermaid'

let mermaidInitialized = false

function ensureMermaidInitialized() {
  if (mermaidInitialized) {
    return
  }

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    suppressErrorRendering: true,
  })

  mermaidInitialized = true
}

function MermaidPlaceholder() {
  return <div className="mermaid-placeholder">Waiting for Mermaid...</div>
}

function MermaidDiagram({ chart, isStreaming, useCatchRendering, usePlaceholder }) {
  const containerRef = useRef(null)
  const renderCountRef = useRef(0)
  const baseId = useId().replaceAll(':', '-')
  const [svg, setSvg] = useState('')
  const [error, setError] = useState('')
  const [isWaiting, setIsWaiting] = useState(false)

  useEffect(() => {
    let cancelled = false

    const renderDiagram = async () => {
      ensureMermaidInitialized()

      try {
        setIsWaiting(false)
        const diagramId = `${baseId}-${renderCountRef.current}`
        renderCountRef.current += 1

        const result = await mermaid.render(diagramId, chart)

        if (cancelled) {
          return
        }

        setSvg(result.svg)
        setError('')
      } catch (renderError) {
        if (cancelled) {
          return
        }

        if (useCatchRendering) {
          if (usePlaceholder && isStreaming) {
            setIsWaiting(true)
          }
          return
        }

        setError(renderError instanceof Error ? renderError.message : 'Failed to render Mermaid diagram.')
      }
    }

    renderDiagram()

    return () => {
      cancelled = true
    }
  }, [baseId, chart, isStreaming, useCatchRendering, usePlaceholder])

  if (isWaiting) {
    return <MermaidPlaceholder />
  }

  if (error) {
    return <div className="mermaid-error">{error}</div>
  }

  return <div ref={containerRef} className="mermaid-diagram" dangerouslySetInnerHTML={{ __html: svg }} />
}

export default MermaidDiagram
