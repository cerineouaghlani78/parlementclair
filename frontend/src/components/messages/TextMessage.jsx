import { StarIcon } from '../icons'
import { dsfr } from '../../theme/tokens'

function AgentBadge() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: 6,
          background: dsfr.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: '0 0 auto',
        }}
      >
        <StarIcon size={13} fill="#fff" />
      </span>
      <span style={{ fontSize: '0.8rem', fontWeight: 500, color: dsfr.textMuted }}>LexClair</span>
    </div>
  )
}

export default function TextMessage({ text }) {
  return (
    <div style={{ marginBottom: '1.8rem' }}>
      <AgentBadge />
      <p style={{ fontSize: '0.98rem', lineHeight: 1.65, color: dsfr.textSecondary, margin: 0 }}>{text}</p>
    </div>
  )
}

export { AgentBadge }
