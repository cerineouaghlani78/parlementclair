import { Dropdown } from 'antd'
import { StarIcon, ChevronDownIcon } from './icons'
import { MODELS } from '../data/fixtures'
import { dsfr } from '../theme/tokens'

export default function ModelSelector({ model, open, onOpenChange, onSelect }) {
  const dropdownRender = () => (
    <div
      style={{
        width: 270,
        background: '#fff',
        border: `1px solid ${dsfr.border}`,
        borderRadius: 10,
        boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
        padding: '0.35rem',
      }}
    >
      {MODELS.map((m) => {
        const selected = m.name === model
        return (
          <button
            key={m.name}
            onClick={() => onSelect(m.name)}
            style={{
              width: '100%',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.55rem',
              background: selected ? dsfr.accentHover : 'transparent',
              border: 'none',
              borderRadius: 7,
              padding: '0.55rem 0.6rem',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = dsfr.accentHover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = selected ? dsfr.accentHover : 'transparent')}
          >
            <StarIcon size={16} fill={selected ? dsfr.primary : dsfr.primaryDisabled} style={{ marginTop: 2, flex: '0 0 auto' }} />
            <span style={{ minWidth: 0 }}>
              <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: dsfr.text }}>{m.name}</span>
              <span style={{ display: 'block', fontSize: '0.74rem', color: dsfr.textMuted, lineHeight: 1.3 }}>{m.desc}</span>
            </span>
          </button>
        )
      })}
    </div>
  )

  return (
    <Dropdown open={open} onOpenChange={onOpenChange} trigger={['click']} placement="bottomRight" dropdownRender={dropdownRender}>
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          background: dsfr.sidebar,
          border: `1px solid ${dsfr.border}`,
          borderRadius: 8,
          padding: '0.4rem 0.7rem',
          fontSize: '0.82rem',
          color: dsfr.text,
        }}
      >
        <StarIcon size={15} fill={dsfr.primary} />
        <span style={{ fontWeight: 500 }}>{model}</span>
        <ChevronDownIcon size={15} fill={dsfr.textMuted} />
      </button>
    </Dropdown>
  )
}
