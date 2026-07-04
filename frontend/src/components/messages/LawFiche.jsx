import { AgentBadge } from './TextMessage'
import { CheckIcon, ChevronDownIcon, ExternalIcon, DocIcon } from '../icons'
import { dsfr } from '../../theme/tokens'

const IMPACT_STYLE = {
  positif: { icon: '✅', color: dsfr.success, bg: dsfr.successBg, border: dsfr.successBorder },
  negatif: { icon: '📉', color: dsfr.error, bg: dsfr.errorBg, border: dsfr.errorBorder },
  mixte: { icon: '⚠️', color: dsfr.textSecondary, bg: dsfr.neutralBg, border: dsfr.neutralBorder },
}

const sectionTitle = {
  fontSize: '0.72rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  color: dsfr.grey,
  margin: '0 0 0.7rem',
}

function formatDate(value) {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function Badge({ children }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        fontSize: '0.76rem',
        fontWeight: 500,
        color: dsfr.primary,
        background: dsfr.accentBg,
        borderRadius: 20,
        padding: '0.25rem 0.7rem',
      }}
    >
      {children}
    </span>
  )
}

function VoteDonut({ pour = 0, contre = 0, abstention = 0 }) {
  const total = pour + contre + abstention
  if (!total) return null

  const r = 34
  const strokeWidth = 14
  const circumference = 2 * Math.PI * r
  const segments = [
    { value: pour, color: dsfr.success },
    { value: contre, color: dsfr.error },
    { value: abstention, color: dsfr.grey },
  ]

  let offset = 0
  return (
    <svg width={88} height={88} viewBox="0 0 88 88">
      <g transform="rotate(-90 44 44)">
        {segments.map((s, i) => {
          if (!s.value) return null
          const frac = s.value / total
          const dash = frac * circumference
          const el = (
            <circle
              key={i}
              cx={44}
              cy={44}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
            />
          )
          offset += dash
          return el
        })}
      </g>
    </svg>
  )
}

function VoteSection({ vote }) {
  if (!vote) return null

  const rows = [
    { label: 'Pour', value: vote.pour, color: dsfr.success },
    { label: 'Contre', value: vote.contre, color: dsfr.error },
    { label: 'Abstention', value: vote.abstention, color: dsfr.grey },
  ].filter((r) => typeof r.value === 'number')

  // Pas de vrai décompte chiffré : rien de fiable à représenter graphiquement.
  if (rows.length === 0) return null

  const total = rows.reduce((sum, r) => sum + r.value, 0)
  const pct = (n) => (total ? Math.round((n / total) * 100) : 0)

  return (
    <div style={{ marginBottom: '1.4rem' }}>
      <div style={sectionTitle}>Le vote</div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.2rem',
          flexWrap: 'wrap',
          border: `1px solid ${dsfr.borderLighter}`,
          borderRadius: 10,
          padding: '0.9rem 1rem',
        }}
      >
        <VoteDonut pour={vote.pour} contre={vote.contre} abstention={vote.abstention} />
        <div style={{ flex: '1 1 180px', minWidth: 160 }}>
          {(vote.chambre || vote.date) && (
            <div style={{ fontSize: '0.78rem', color: dsfr.grey, marginBottom: '0.5rem' }}>
              {[vote.chambre, formatDate(vote.date)].filter(Boolean).join(' · ')}
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {rows.map((r) => (
              <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: r.color, flex: '0 0 auto' }} />
                <strong style={{ width: 78 }}>{r.label}</strong>
                <span>{r.value}</span>
                <span style={{ color: dsfr.grey, marginLeft: 'auto' }}>{pct(r.value)}&nbsp;%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ImpactsSection({ impacts }) {
  if (!impacts?.length) return null
  return (
    <div style={{ marginBottom: '1.4rem' }}>
      <div style={sectionTitle}>Impacts par secteur</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {impacts.map((imp, i) => {
          const style = IMPACT_STYLE[imp.niveau] || IMPACT_STYLE.mixte
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.6rem',
                background: style.bg,
                border: `1px solid ${style.border}`,
                borderRadius: 8,
                padding: '0.55rem 0.75rem',
              }}
            >
              <span style={{ fontSize: '1.05rem', lineHeight: 1.3, flex: '0 0 auto' }}>{style.icon}</span>
              <span style={{ fontSize: '0.88rem', lineHeight: 1.45 }}>
                <strong style={{ color: dsfr.text }}>{imp.secteur}</strong>
                {imp.detail ? <span style={{ color: dsfr.textSecondary }}>{' — ' + imp.detail}</span> : null}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Filet de sécurité : si un champ censé être un tableau arrive mal formé
// (chaîne, objet unique...), on l'ignore proprement plutôt que de planter le
// rendu sur un .map()/.length.
const asArray = (v) => (Array.isArray(v) ? v : [])

export default function LawFiche({ data }) {
  if (!data) return null
  const {
    titre,
    titre_court: titreCourt,
    numero,
    date_promulgation: datePromulgation,
    date_publication: datePublication,
    resume,
    vote,
  } = data
  const mesures = asArray(data.mesures)
  const changements = asArray(data.changements)
  const impacts = asArray(data.impacts)
  const sources = asArray(data.sources)
  const nonDisponible = asArray(data.non_disponible)

  return (
    <div style={{ marginBottom: '1.8rem' }}>
      <AgentBadge />

      <div
        style={{
          border: `1px solid ${dsfr.border}`,
          borderRadius: 14,
          padding: '1.1rem 1.2rem 1.3rem',
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        }}
      >
        {/* En-tête */}
        <div style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.45rem', color: dsfr.text, lineHeight: 1.3 }}>
            {titreCourt || titre}
          </h2>
          {titreCourt && titre && titreCourt !== titre && (
            <p style={{ fontSize: '0.82rem', color: dsfr.grey, margin: '0 0 0.55rem', lineHeight: 1.4 }}>{titre}</p>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {numero && <Badge>n° {numero}</Badge>}
            {datePromulgation && <Badge>Adoptée le {formatDate(datePromulgation)}</Badge>}
            {datePublication && !datePromulgation && <Badge>JO du {formatDate(datePublication)}</Badge>}
          </div>
        </div>

        {/* Résumé vulgarisé */}
        {resume && (
          <p
            style={{
              fontSize: '1rem',
              lineHeight: 1.6,
              color: dsfr.textSecondary,
              background: dsfr.tool,
              borderRadius: 10,
              padding: '0.8rem 0.95rem',
              margin: '0 0 1.4rem',
            }}
          >
            {resume}
          </p>
        )}

        {/* Mesures concrètes */}
        {mesures?.length > 0 && (
          <div style={{ marginBottom: '1.4rem' }}>
            <div style={sectionTitle}>Ce que fait la loi</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {mesures.map((mz, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                  <CheckIcon size={16} fill={dsfr.success} style={{ marginTop: 3, flex: '0 0 auto' }} />
                  <span style={{ fontSize: '0.92rem', lineHeight: 1.5, color: dsfr.textSecondary }}>{mz}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ce que ça change */}
        {changements?.length > 0 && (
          <div style={{ marginBottom: '1.4rem' }}>
            <div style={sectionTitle}>Ce que ça change concrètement</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {changements.map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                  <ChevronDownIcon
                    size={14}
                    fill={dsfr.primary}
                    style={{ marginTop: 4, flex: '0 0 auto', transform: 'rotate(-90deg)' }}
                  />
                  <span style={{ fontSize: '0.92rem', lineHeight: 1.5, color: dsfr.textSecondary }}>{c}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <VoteSection vote={vote} />
        <ImpactsSection impacts={impacts} />

        {/* Sources */}
        {sources?.length > 0 && (
          <div style={{ marginBottom: nonDisponible?.length ? '1.2rem' : 0 }}>
            <div style={sectionTitle}>Sources</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {sources.map((s, i) =>
                s.url ? (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      background: dsfr.sidebar,
                      border: `1px solid ${dsfr.border}`,
                      borderRadius: 7,
                      padding: '0.4rem 0.65rem',
                      textDecoration: 'none',
                      fontSize: '0.79rem',
                      color: dsfr.text,
                      fontWeight: 500,
                    }}
                  >
                    {s.label || s.url}
                    <ExternalIcon size={12} fill={dsfr.grey} />
                  </a>
                ) : (
                  <span
                    key={i}
                    style={{
                      background: dsfr.sidebar,
                      border: `1px solid ${dsfr.border}`,
                      borderRadius: 7,
                      padding: '0.4rem 0.65rem',
                      fontSize: '0.79rem',
                      color: dsfr.text,
                      fontWeight: 500,
                    }}
                  >
                    {s.label}
                  </span>
                ),
              )}
            </div>
          </div>
        )}

        {/* Informations non disponibles */}
        {nonDisponible?.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: '0.6rem',
              alignItems: 'flex-start',
              background: dsfr.neutralBg,
              border: `1px solid ${dsfr.neutralBorder}`,
              borderRadius: 8,
              padding: '0.6rem 0.75rem',
            }}
          >
            <DocIcon size={15} fill={dsfr.grey} style={{ flex: '0 0 auto', marginTop: 2 }} />
            <div style={{ fontSize: '0.82rem', color: dsfr.textMuted, lineHeight: 1.5 }}>
              <strong style={{ color: dsfr.textSecondary }}>Non trouvé dans les données consultées : </strong>
              {nonDisponible.join(' · ')}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
