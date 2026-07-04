import { Button } from 'antd'
import { ChatBubbleIcon, PlusIcon, DocLinkIcon, TrashIcon } from './icons'
import { dsfr } from '../theme/tokens'

export default function Sidebar({ activeConv, onNewConversation, onOpenConv, onDeleteConv, sessions = [] }) {
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
          <ChatBubbleIcon size={16} fill="#fff" />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.05, color: dsfr.primary }}>ParlementClair</div>
        </div>
      </div>

      {/* actions */}
      <div style={{ padding: '0.4rem 0.9rem 0.7rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Button type="primary" block onClick={onNewConversation} style={{ height: 'auto', padding: '0.6rem 0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.88rem' }}>
          <PlusIcon size={17} /> Nouvelle analyse
        </Button>
      </div>

      {/* history */}
      <div className="lc-scroll" style={{ flex: '1 1 auto', overflowY: 'auto', padding: '0 0.55rem 0.5rem', minHeight: 0 }}>
        {sessions.length > 0 && (
          <div>
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
              Conversations
            </div>
            {sessions.map((s) => {
              const active = activeConv === s.id
              return (
                <div
                  key={s.id}
                  className="lc-session-row"
                  onClick={() => onOpenConv(s.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    display: 'flex',
                    gap: '0.55rem',
                    alignItems: 'center',
                    border: 'none',
                    background: active ? dsfr.accentActive : 'transparent',
                    borderRadius: 7,
                    padding: '0.5rem 0.4rem 0.5rem 0.6rem',
                    marginBottom: 1,
                    cursor: 'pointer',
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
                      flex: '1 1 auto',
                      fontSize: '0.82rem',
                      lineHeight: 1.3,
                      color: active ? dsfr.primary : dsfr.textSecondary,
                      fontWeight: active ? 500 : 400,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {s.title || 'Nouvelle conversation'}
                  </span>
                  <button
                    className="lc-session-delete"
                    title="Supprimer cette conversation"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteConv(s.id)
                    }}
                    style={{
                      flex: '0 0 auto',
                      border: 'none',
                      background: 'transparent',
                      padding: '0.2rem',
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: 5,
                      opacity: 0,
                    }}
                  >
                    <TrashIcon size={13} fill={dsfr.grey} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
        {sessions.length === 0 && (
          <div style={{ padding: '0.7rem 0.6rem', fontSize: '0.78rem', color: dsfr.grey, lineHeight: 1.4 }}>
            Aucune conversation pour le moment. Posez une question pour commencer une analyse.
          </div>
        )}
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
