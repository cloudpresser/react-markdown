import { startTransition, useEffect, useState } from 'react'
import './App.css'
import MarkdownRenderer from './components/MarkdownRenderer.jsx'
import StreamdownRenderer from './components/StreamdownRenderer.jsx'

const defaultMarkdown = [
  '# Q3 rollout memo',
  '',
  '## Overview',
  '',
  'We are testing **markdown rendering with a long bold section** side by side while simulating streamed AI output.',
  '',
  '- Launch plan is on track',
  '- Finance wants a tighter pricing summary',
  '- Customer success asked for a migration checklist',
  '',
  '## Next steps',
  '',
  '1. Review the launch notes',
  '2. Stream the content in variable chunks',
  '3. Compare static and streaming behavior',
  '',
  '## Rollout flow',
  '',
  '```mermaid',
  'flowchart LR',
  '  Draft[Draft memo] --> Review[Review with stakeholders]',
  '  Review --> Approve{Approved?}',
  '  Approve -- Yes --> Launch[Launch experiment]',
  '  Approve -- No --> Revise[Revise markdown]',
  '  Revise --> Review',
  '```',
  '',
  '> This block is useful for validating how quotes and paragraph spacing behave.',
  '',
  '```js',
  "const status = 'ready to stream'",
  'console.log(status)',
  '```',
].join('\n')

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

function App() {
  const [markdownInput, setMarkdownInput] = useState(defaultMarkdown)
  const [renderedMarkdown, setRenderedMarkdown] = useState(defaultMarkdown)
  const [useRemend, setUseRemend] = useState(true)
  const [useMermaidCatch, setUseMermaidCatch] = useState(true)
  const [useMermaidPlaceholder, setUseMermaidPlaceholder] = useState(true)
  const [isStreamingMode, setIsStreamingMode] = useState(true)
  const [isStreaming, setIsStreaming] = useState(false)
  const [chunkSize, setChunkSize] = useState(18)
  const [chunkSpeed, setChunkSpeed] = useState(80)
  const [chunkVariance, setChunkVariance] = useState(6)
  const [cursor, setCursor] = useState(defaultMarkdown.length)
  const [playCount, setPlayCount] = useState(0)

  const totalCharacters = markdownInput.length
  const progress = totalCharacters === 0 ? 0 : Math.round((cursor / totalCharacters) * 100)

  useEffect(() => {
    if (!isStreaming) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      const variance = chunkVariance > 0 ? Math.round((Math.random() * 2 - 1) * chunkVariance) : 0
      const nextCursor = clamp(cursor + chunkSize + variance, 0, markdownInput.length)

      startTransition(() => {
        setRenderedMarkdown(markdownInput.slice(0, nextCursor))
      })

      setCursor(nextCursor)

      if (nextCursor >= markdownInput.length) {
        setIsStreaming(false)
      }
    }, chunkSpeed)

    return () => window.clearTimeout(timeoutId)
  }, [chunkSize, chunkSpeed, chunkVariance, cursor, isStreaming, markdownInput, playCount])

  useEffect(() => {
    if (isStreaming) {
      return
    }

    startTransition(() => {
      setRenderedMarkdown(markdownInput)
    })
    setCursor(markdownInput.length)
  }, [isStreaming, markdownInput])

  const handlePlay = () => {
    if (!isStreamingMode) {
      startTransition(() => {
        setRenderedMarkdown(markdownInput)
      })
      setCursor(markdownInput.length)
      setIsStreaming(false)
      setPlayCount((count) => count + 1)
      return
    }

    setRenderedMarkdown('')
    setCursor(0)
    setIsStreaming(true)
    setPlayCount((count) => count + 1)
  }

  return (
    <main className="app-shell">
      <section className="toolbar">
        <div className="control-group playback-controls">
          <span className="group-label">Markdown controls</span>
          <label className="switch-row">
            <span>Streaming mode</span>
            <button
              type="button"
              className={`toggle-button ${isStreamingMode ? 'enabled' : ''}`}
              onClick={() => {
                setIsStreaming(false)
                setIsStreamingMode((value) => !value)
              }}
            >
              {isStreamingMode ? 'Streaming' : 'Static'}
            </button>
          </label>

          <label>
            Chunk size
            <input
              type="range"
              min="1"
              max="80"
              value={chunkSize}
              onChange={(event) => setChunkSize(Number(event.target.value))}
            />
            <span>{chunkSize} chars</span>
          </label>

          <label>
            Streaming speed
            <input
              type="range"
              min="20"
              max="500"
              step="10"
              value={chunkSpeed}
              onChange={(event) => setChunkSpeed(Number(event.target.value))}
            />
            <span>{chunkSpeed} ms</span>
          </label>

          <label>
            Chunk variability
            <input
              type="range"
              min="0"
              max="30"
              value={chunkVariance}
              onChange={(event) => setChunkVariance(Number(event.target.value))}
            />
            <span>{chunkVariance} chars</span>
          </label>

          <button type="button" className="play-button" onClick={handlePlay}>
            {isStreaming ? 'Restart stream' : 'Play'}
          </button>

          <div className="playback-stats">
            <span className={`status-pill ${isStreaming ? 'live' : 'idle'}`}>
              {isStreaming ? 'Streaming live' : isStreamingMode ? 'Ready to stream' : 'Static mode'}
            </span>
            <span>{totalCharacters} chars</span>
            <span>{progress}% complete</span>
          </div>

          <div className="renderer-toggles">
            <span className="group-label">react-markdown</span>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={useRemend}
                onChange={(event) => setUseRemend(event.target.checked)}
              />
              <span>Enable remend</span>
            </label>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={useMermaidCatch}
                onChange={(event) => setUseMermaidCatch(event.target.checked)}
              />
              <span>Enable Mermaid catch rendering</span>
            </label>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={useMermaidPlaceholder}
                onChange={(event) => setUseMermaidPlaceholder(event.target.checked)}
              />
              <span>Enable Mermaid placeholder path</span>
            </label>
          </div>
        </div>

        <article className="panel input-panel toolbar-input-panel">
          <div className="panel-header">
            <h2>Markdown Input</h2>
            <span>Raw text only</span>
          </div>
          <textarea
            value={markdownInput}
            onChange={(event) => setMarkdownInput(event.target.value)}
            placeholder="Type markdown here"
            spellCheck={false}
          />
        </article>
      </section>

      <section className="workspace">
        <div className="preview-stack">
          <MarkdownRenderer
            content={renderedMarkdown}
            isStreaming={isStreaming}
            useRemend={useRemend}
            useMermaidCatch={useMermaidCatch}
            useMermaidPlaceholder={useMermaidPlaceholder}
          />
          <StreamdownRenderer
            content={renderedMarkdown}
            mode={isStreamingMode ? 'streaming' : 'static'}
            isAnimating={isStreaming}
          />
        </div>
      </section>
    </main>
  )
}

export default App
