import { useEffect, useRef } from 'react'
import UserMessage from './messages/UserMessage'
import TextMessage from './messages/TextMessage'
import AnalysisMessage from './messages/AnalysisMessage'
import Composer from './Composer'

export default function Conversation({ conv }) {
  const scroller = useRef(null)

  // Auto-scroll vers le bas quand un bloc se révèle ou qu'un message arrive.
  useEffect(() => {
    if (scroller.current) {
      scroller.current.scrollTop = scroller.current.scrollHeight
    }
  }, [conv.step, conv.messages.length])

  return (
    <>
      <div className="lc-scroll" ref={scroller} style={{ flex: '1 1 auto', overflowY: 'auto', minHeight: 0 }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '1.75rem 1.5rem 1rem' }}>
          {conv.messages.map((m, i) => {
            if (m.role === 'user') return <UserMessage key={i} text={m.text} />
            if (m.kind === 'text') return <TextMessage key={i} text={m.text} />
            if (m.kind === 'analysis') return <AnalysisMessage key={i} conv={conv} />
            return null
          })}
        </div>
      </div>

      <div style={{ flex: '0 0 auto', padding: '0.5rem 1.5rem 1rem', background: '#fff' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <Composer
            docked
            input={conv.input}
            onInput={conv.onInput}
            onKeyDown={conv.onKeyDown}
            legifrance={conv.legifrance}
            onToggleLegifrance={conv.toggleLegifrance}
            streaming={conv.streaming}
            inputEmpty={conv.inputEmpty}
            onPrimary={conv.streaming ? conv.stopStream : conv.send}
            model={conv.model}
          />
        </div>
      </div>
    </>
  )
}
