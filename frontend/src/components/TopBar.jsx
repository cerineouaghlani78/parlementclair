import ModelSelector from './ModelSelector'
import { dsfr } from '../theme/tokens'

export default function TopBar({ model, modelOpen, onModelOpenChange, onSelectModel }) {
  return (
    <header
      style={{
        flex: '0 0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0.55rem 1.25rem',
        borderBottom: `1px solid ${dsfr.borderLighter}`,
      }}
    >
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
