import ModelSelector from './ModelSelector'
import { dsfr } from '../theme/tokens'

export default function TopBar({ model, modelOpen, onModelOpenChange, onSelectModel }) {
  return (
    <header
      style={{
        flex: '0 0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.55rem 1.25rem',
        borderBottom: `1px solid ${dsfr.borderLighter}`,
      }}
    >
      <p
        style={{
          margin: 0,
          fontWeight: 700,
          fontSize: '0.68rem',
          lineHeight: 1.1,
          textTransform: 'uppercase',
          letterSpacing: '0.01em',
          color: dsfr.textSecondary,
        }}
      >
        République
        <br />
        Française
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <ModelSelector model={model} open={modelOpen} onOpenChange={onModelOpenChange} onSelect={onSelectModel} />
        <a
          href="#"
          style={{ fontSize: '0.82rem', color: dsfr.primary, textDecoration: 'underline', textUnderlineOffset: 2 }}
        >
          Aide
        </a>
      </div>
    </header>
  )
}
