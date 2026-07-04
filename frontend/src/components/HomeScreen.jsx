import Composer from './Composer'
import { ChatBubbleIcon } from './icons'
import { dsfr } from '../theme/tokens'

export default function HomeScreen({ conv }) {
  return (
    <div
      className="lc-scroll"
      style={{
        flex: '1 1 auto',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        minHeight: 0,
      }}
    >
      <div style={{ width: '100%', maxWidth: 640 }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: dsfr.primary,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.9rem',
            }}
          >
            <ChatBubbleIcon size={24} fill="#fff" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, lineHeight: 1.25 }}>
            Quelle loi souhaitez-vous comprendre&nbsp;?
          </h1>
        </div>

        <Composer
          docked={false}
          input={conv.input}
          onInput={conv.onInput}
          onKeyDown={conv.onKeyDown}
          streaming={conv.streaming}
          inputEmpty={conv.inputEmpty}
          onPrimary={conv.send}
          model={conv.model}
        />
      </div>
    </div>
  )
}
