import Composer from './Composer'
import { StarIcon } from './icons'
import { EXAMPLES } from '../data/fixtures'
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
      <div style={{ width: '100%', maxWidth: 720 }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 13,
              background: dsfr.primary,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <StarIcon size={28} fill="#fff" />
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 700, margin: '0 0 0.5rem', lineHeight: 1.2 }}>
            Quelle loi souhaitez-vous comprendre&nbsp;?
          </h1>
          <p style={{ fontSize: '1rem', color: dsfr.textMuted, margin: 0, lineHeight: 1.5 }}>
            Posez une question sur un texte récemment promulgué. L'agent interroge la base Légifrance et produit une
            étude d'impact sourcée.
          </p>
        </div>

        <Composer
          docked={false}
          input={conv.input}
          onInput={conv.onInput}
          onKeyDown={conv.onKeyDown}
          legifrance={conv.legifrance}
          onToggleLegifrance={conv.toggleLegifrance}
          streaming={conv.streaming}
          inputEmpty={conv.inputEmpty}
          onPrimary={conv.send}
          model={conv.model}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginTop: '1.1rem' }}>
          {EXAMPLES.map((ex) => (
            <button
              key={ex.q}
              onClick={() => conv.runAnalysis(ex.q, ex.law)}
              style={{
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.2rem',
                background: '#fff',
                border: `1px solid ${dsfr.border}`,
                borderRadius: 12,
                padding: '0.8rem 0.9rem',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = dsfr.primary
                e.currentTarget.style.background = dsfr.accentHover
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = dsfr.border
                e.currentTarget.style.background = '#fff'
              }}
            >
              <span style={{ fontSize: '0.88rem', fontWeight: 500, lineHeight: 1.35, color: dsfr.text }}>{ex.q}</span>
              <span style={{ fontSize: '0.74rem', color: dsfr.grey }}>{ex.sub}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
