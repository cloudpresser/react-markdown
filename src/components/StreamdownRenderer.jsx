import { Streamdown } from 'streamdown'
import { mermaid } from '@streamdown/mermaid'
import 'streamdown/styles.css'

function StreamdownRenderer({ content, mode, isAnimating }) {
  return (
    <article className="panel preview-panel">
      <div className="panel-header">
        <h2>streamdown</h2>
        <span>Streaming-aware renderer</span>
      </div>
      <div className="markdown-frame prose-area streamdown-shell">
        <Streamdown mode={mode} isAnimating={isAnimating} plugins={{ mermaid }} mermaid={{}}>
          {content}
        </Streamdown>
      </div>
    </article>
  )
}

export default StreamdownRenderer
