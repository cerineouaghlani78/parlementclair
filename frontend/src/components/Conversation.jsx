import { useEffect, useRef } from 'react'
import UserMessage from './messages/UserMessage'
import TextMessage from './messages/TextMessage'
import LawFiche from './messages/LawFiche'
import LoadingMessage from './messages/LoadingMessage'
import Composer from './Composer'

export default function Conversation({ conv }) {
  const scroller = useRef(null)

  // Auto-scroll vers le bas à chaque nouveau message ou apparition/disparition
  // de l'indicateur de chargement.
  useEffect(() => {
    if (scroller.current) {
      scroller.current.scrollTop = scroller.current.scrollHeight
    }
  }, [conv.messages.length, conv.streaming, conv.toolActivity])

  return (
    <>
      <div className="lc-scroll" ref={scroller} style={{ flex: '1 1 auto', overflowY: 'auto', minHeight: 0 }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '1.75rem 1.5rem 1rem' }}>
          {conv.messages.map((m, i) => {
            if (m.role === 'user') return <UserMessage key={i} text={m.text} />
            if (m.kind === 'fiche') return <LawFiche key={i} data={m.data} />
            if (m.kind === 'text') return <TextMessage key={i} text={m.text} />
            return null
          })}
          {conv.streaming && <LoadingMessage status={conv.toolActivity} />}
        </div>
      </div>

      <div style={{ flex: '0 0 auto', padding: '0.5rem 1.5rem 1rem', background: '#fff' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <Composer
            docked
            input={conv.input}
            onInput={conv.onInput}
            onKeyDown={conv.onKeyDown}
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
