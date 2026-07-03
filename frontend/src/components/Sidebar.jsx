import { Button } from 'antd'
import { StarIcon, PlusIcon, SearchIcon, DocLinkIcon } from './icons'
import { HIST_GROUPS } from '../data/fixtures'
import { dsfr } from '../theme/tokens'

export default function Sidebar({ activeConv, onNewConversation, onOpenConv }) {
  return (
    <aside
      style={{
        flex: '0 0 280px',
        display: 'flex',
        flexDirection: 'column',
        background: dsfr.sidebar,
        borderRight: `1px solid ${dsfr.borderLight}`,
        minHeight: 0,
      }}
    >
      {/* brand */}
      <div style={{ padding: '0.9rem 0.9rem 0.6rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 7,
            background: dsfr.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: '0 0 auto',
          }}
        >
          <StarIcon size={17} fill="#fff" />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.05, color: dsfr.primary }}>LexClair</div>
          <div style={{ fontSize: '0.66rem', color: dsfr.grey, lineHeight: 1.1 }}>République Française</div>
        </div>
      </div>

      {/* actions */}
      <div style={{ padding: '0.4rem 0.9rem 0.7rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Button type="primary" block onClick={onNewConversation} style={{ height: 'auto', padding: '0.6rem 0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.88rem' }}>
          <PlusIcon size={17} /> Nouvelle analyse
        </Button>
        <Button block style={{ height: 'auto', padding: '0.55rem 0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem', color: dsfr.textSecondary }}>
          <SearchIcon size={16} fill={dsfr.primary} /> Rechercher une loi
        </Button>
      </div>

      {/* history */}
      <div className="lc-scroll" style={{ flex: '1 1 auto', overflowY: 'auto', padding: '0 0.55rem 0.5rem', minHeight: 0 }}>
        {HIST_GROUPS.map((grp) => (
          <div key={grp.label}>
            <div
              style={{
                padding: '0.7rem 0.45rem 0.3rem',
                fontSize: '0.68rem',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                color: dsfr.grey,
              }}
            >
              {grp.label}
            </div>
            {grp.items.map((h) => {
              const active = activeConv === h.id
              return (
                <button
                  key={h.id}
                  onClick={() => onOpenConv(h.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    display: 'flex',
                    gap: '0.55rem',
                    alignItems: 'center',
                    border: 'none',
                    background: active ? dsfr.accentActive : 'transparent',
                    borderRadius: 7,
                    padding: '0.5rem 0.6rem',
                    marginBottom: 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.background = dsfr.accentHover2
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <DocLinkIcon size={14} fill={active ? dsfr.primary : dsfr.grey} style={{ flex: '0 0 auto' }} />
                  <span
                    style={{
                      minWidth: 0,
                      fontSize: '0.82rem',
                      lineHeight: 1.3,
                      color: active ? dsfr.primary : dsfr.textSecondary,
                      fontWeight: active ? 500 : 400,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {h.title}
                  </span>
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {/* mcp status */}
      <div
        style={{
          flex: '0 0 auto',
          borderTop: `1px solid ${dsfr.borderLight}`,
          padding: '0.7rem 0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.55rem',
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: dsfr.success, flex: '0 0 auto' }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '0.76rem', fontWeight: 500, color: dsfr.textSecondary, lineHeight: 1.1 }}>
            Base Légifrance connectée
          </div>
          <div style={{ fontSize: '0.68rem', color: dsfr.grey, lineHeight: 1.2 }}>Serveur MCP · réponses sourcées</div>
        </div>
      </div>
    </aside>
  )
}
