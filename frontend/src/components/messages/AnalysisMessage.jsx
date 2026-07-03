import { AgentBadge } from './TextMessage'
import { CheckIcon, ExternalIcon, DocIcon } from '../icons'
import SectorBars from '../charts/SectorBars'
import BudgetChart from '../charts/BudgetChart'
import VoteDonut from '../charts/VoteDonut'
import { LAWS, MESURES, VOTE, GROUPS, SOURCES, FOLLOWUPS } from '../../data/fixtures'
import { dsfr } from '../../theme/tokens'

const GROUP_TONE = {
  pour: { bg: dsfr.successBg, fg: dsfr.success, bd: dsfr.successBorder },
  contre: { bg: dsfr.errorBg, fg: dsfr.error, bd: dsfr.errorBorder },
  abst: { bg: dsfr.neutralBg, fg: dsfr.textSecondary, bd: dsfr.neutralBorder },
}

const sectionTitle = {
  fontSize: '1.02rem',
  fontWeight: 700,
  margin: '1.5rem 0 0.6rem',
  paddingBottom: '0.35rem',
  borderBottom: `1px solid ${dsfr.borderLighter}`,
}

function ToolSearching() {
  const dot = (delay) => (
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
  return (
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
        {dot('0s')}
        {dot('.2s')}
        {dot('.4s')}
      </span>
      Recherche dans la base Légifrance…
    </div>
  )
}

function FoundCard({ title }) {
  return (
    <div
      className="lc-fade"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.7rem',
        background: dsfr.tool,
        border: `1px solid ${dsfr.borderLight}`,
        borderRadius: 8,
        padding: '0.6rem 0.8rem',
        marginBottom: '1rem',
      }}
    >
      <CheckIcon size={17} fill={dsfr.success} style={{ flex: '0 0 auto' }} />
      <span style={{ minWidth: 0, flex: '1 1 auto' }}>
        <span style={{ display: 'block', fontSize: '0.74rem', color: dsfr.grey, lineHeight: 1.2 }}>
          Texte identifié via la base Légifrance
        </span>
        <span
          style={{
            display: 'block',
            fontSize: '0.86rem',
            fontWeight: 500,
            color: dsfr.text,
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </span>
      </span>
      <a
        href="#"
        style={{
          flex: '0 0 auto',
          fontSize: '0.76rem',
          color: dsfr.primary,
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
        }}
      >
        Consulter
        <ExternalIcon size={13} />
      </a>
    </div>
  )
}

export default function AnalysisMessage({ conv }) {
  const foundTitle = conv.foundLaw ? conv.foundLaw.title : LAWS.aper.title

  return (
    <div style={{ marginBottom: '1.8rem' }}>
      <AgentBadge />

      {conv.searching && <ToolSearching />}

      {conv.showAnswer && (
        <>
          <FoundCard title={foundTitle} />
          <p style={{ fontSize: '0.98rem', lineHeight: 1.65, color: dsfr.textSecondary, margin: '0 0 0.4rem' }}>
            La <strong style={{ color: dsfr.text }}>loi APER</strong> vise à lever les principaux freins au déploiement
            des énergies renouvelables, avec un objectif de{' '}
            <strong style={{ color: dsfr.text }}>40 % d'électricité renouvelable d'ici 2030</strong>. L'analyse
            systémique identifie un effet net positif sur la production d'énergie et l'emploi de filière, un impact
            modéré sur les finances publiques via les dispositifs de soutien, et des points de vigilance sur
            l'acceptabilité locale et la biodiversité.
          </p>
        </>
      )}

      {conv.showMesures && (
        <div className="lc-fade">
          <h3 style={sectionTitle}>Mesures clés</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {MESURES.map((mz) => (
              <div key={mz} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                <CheckIcon size={17} fill={dsfr.success} style={{ marginTop: 3, flex: '0 0 auto' }} />
                <span style={{ fontSize: '0.94rem', lineHeight: 1.55, color: dsfr.textSecondary }}>{mz}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {conv.showSectors && (
        <div className="lc-fade">
          <h3 style={sectionTitle}>Impact estimé par secteur</h3>
          <SectorBars />
        </div>
      )}

      {conv.showBudget && (
        <div className="lc-fade">
          <h3 style={sectionTitle}>Projection du soutien public</h3>
          <figure style={{ margin: 0, border: `1px solid ${dsfr.borderLighter}`, borderRadius: 10, padding: '1rem 1.1rem' }}>
            <div style={{ width: '100%', overflow: 'hidden' }}>
              <BudgetChart />
            </div>
            <figcaption style={{ fontSize: '0.74rem', color: dsfr.grey, marginTop: '0.5rem' }}>
              Charges de soutien aux ENR estimées (Md€), 2023–2030 — source : CRE / PLF
            </figcaption>
          </figure>
        </div>
      )}

      {conv.showVote && (
        <div className="lc-fade">
          <h3 style={sectionTitle}>Analyse du vote — Assemblée nationale</h3>
          <figure
            style={{
              margin: 0,
              border: `1px solid ${dsfr.borderLighter}`,
              borderRadius: 10,
              padding: '1rem 1.1rem',
              display: 'flex',
              gap: '1.5rem',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <div style={{ flex: '0 0 auto' }}>
              <VoteDonut />
            </div>
            <div style={{ flex: '1 1 260px', minWidth: 230 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.9rem' }}>
                {VOTE.segments.map((s) => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                    <span style={{ width: 12, height: 12, borderRadius: 2, background: s.color }} />
                    <strong style={{ width: 88 }}>{s.label}</strong>
                    <span>{s.count}</span>
                    <span style={{ color: dsfr.grey, marginLeft: 'auto' }}>{s.pct}&nbsp;%</span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                  color: dsfr.grey,
                  marginBottom: '0.4rem',
                }}
              >
                Positions des groupes
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {GROUPS.map((g) => {
                  const tone = GROUP_TONE[g.k]
                  return (
                    <span
                      key={g.name}
                      style={{
                        fontSize: '0.75rem',
                        padding: '0.2rem 0.55rem',
                        borderRadius: 4,
                        background: tone.bg,
                        color: tone.fg,
                        border: `1px solid ${tone.bd}`,
                      }}
                    >
                      {g.name}
                    </span>
                  )
                })}
              </div>
            </div>
          </figure>
        </div>
      )}

      {conv.showSources && (
        <div className="lc-fade" style={{ marginTop: '1.6rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.74rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
              color: dsfr.grey,
              marginBottom: '0.55rem',
            }}
          >
            <DocIcon size={14} fill={dsfr.grey} />
            Sources · vérifiées via Légifrance (MCP)
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {SOURCES.map((s) => (
              <a
                key={s.title}
                href="#"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  background: dsfr.sidebar,
                  border: `1px solid ${dsfr.border}`,
                  borderRadius: 7,
                  padding: '0.4rem 0.65rem',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = dsfr.primary
                  e.currentTarget.style.background = dsfr.accentHover
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = dsfr.border
                  e.currentTarget.style.background = dsfr.sidebar
                }}
              >
                <span
                  style={{
                    fontSize: '0.66rem',
                    fontWeight: 500,
                    color: dsfr.primary,
                    background: dsfr.accentBg,
                    padding: '0.1rem 0.4rem',
                    borderRadius: 3,
                    flex: '0 0 auto',
                  }}
                >
                  {s.tag}
                </span>
                <span style={{ fontSize: '0.79rem', color: dsfr.text, fontWeight: 500 }}>{s.title}</span>
                <ExternalIcon size={12} fill={dsfr.grey} />
              </a>
            ))}
          </div>
        </div>
      )}

      {conv.showFollowups && (
        <div className="lc-fade" style={{ marginTop: '1.4rem' }}>
          <div
            style={{
              fontSize: '0.74rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
              color: dsfr.grey,
              marginBottom: '0.5rem',
            }}
          >
            Poursuivre l'analyse
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {FOLLOWUPS.map((q) => (
              <button
                key={q}
                onClick={() => conv.sendFollowup(q)}
                style={{
                  fontSize: '0.82rem',
                  color: dsfr.primary,
                  background: '#fff',
                  border: `1px solid ${dsfr.primary}`,
                  borderRadius: 20,
                  padding: '0.4rem 0.8rem',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = dsfr.accentHover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
