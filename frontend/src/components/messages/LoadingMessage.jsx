import { AgentBadge } from './TextMessage'
import { dsfr } from '../../theme/tokens'

function Dot({ delay }) {
  return (
    <span
      style={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: dsfr.primary,
        animation: `lcblink 1.2s infinite ${delay}`,
      }}
    />
  )
}

// Affiche l'activité réelle (nom de l'outil MCP en cours d'appel, traduit en
// libellé lisible) telle que reçue en direct via le flux SSE — pas une
// progression simulée.
export default function LoadingMessage({ status }) {
  return (
    <div style={{ marginBottom: '1.8rem' }}>
      <AgentBadge />
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.55rem',
          background: dsfr.tool,
          border: `1px solid ${dsfr.borderLighter}`,
          borderRadius: 8,
          padding: '0.55rem 0.8rem',
          color: dsfr.textMuted,
          fontSize: '0.85rem',
        }}
      >
        <span style={{ display: 'inline-flex', gap: 4 }}>
          <Dot delay="0s" />
          <Dot delay=".2s" />
          <Dot delay=".4s" />
        </span>
        {status || 'Réflexion en cours…'}
      </div>
    </div>
  )
}
