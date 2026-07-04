import { dsfr } from '../../theme/tokens'

// Version « document » de la fiche synthèse, dédiée à l'impression PDF
// (window.print). Reformate les mêmes données que LawFiche pour un rendu
// sobre type document officiel : en-tête, sections, pied de page avec la
// date d'export et la mention de vérification. Aucun élément interactif.

const asArray = (v) => (Array.isArray(v) ? v : [])

function formatDate(value) {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

const IMPACT_LABEL = {
  positif: 'Positif',
  negatif: 'Négatif',
  mixte: 'Mixte',
}

const sectionTitle = {
  fontSize: '10pt',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: dsfr.primary,
  margin: '0 0 0.4rem',
  paddingBottom: '0.2rem',
  borderBottom: `1px solid ${dsfr.border}`,
}

function Section({ title, children }) {
  return (
    <section className="pf-section" style={{ marginBottom: '1.3rem' }}>
      <div style={sectionTitle}>{title}</div>
      {children}
    </section>
  )
}

function BulletList({ items }) {
  return (
    <ul style={{ margin: 0, paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      {items.map((it, i) => (
        <li key={i} style={{ fontSize: '10.5pt', lineHeight: 1.5, color: dsfr.text }}>
          {it}
        </li>
      ))}
    </ul>
  )
}

export default function PrintableFiche({ data }) {
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

  const heading = titreCourt || titre || 'Fiche synthèse'
  const subheading = titreCourt && titre && titreCourt !== titre ? titre : null

  const meta = [
    numero && `n° ${numero}`,
    datePromulgation && `Adoptée le ${formatDate(datePromulgation)}`,
    !datePromulgation && datePublication && `JO du ${formatDate(datePublication)}`,
  ].filter(Boolean)

  const voteRows = vote
    ? [
        { label: 'Pour', value: vote.pour },
        { label: 'Contre', value: vote.contre },
        { label: 'Abstention', value: vote.abstention },
      ].filter((r) => typeof r.value === 'number')
    : []
  const voteTotal = voteRows.reduce((sum, r) => sum + r.value, 0)

  const exportDate = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <article
      style={{
        fontFamily: 'Marianne, Arial, sans-serif',
        color: dsfr.text,
        background: '#fff',
        maxWidth: '170mm',
        margin: '0 auto',
        lineHeight: 1.5,
      }}
    >
      {/* En-tête document */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          borderBottom: `2px solid ${dsfr.primary}`,
          paddingBottom: '0.5rem',
          marginBottom: '1.1rem',
        }}
      >
        <span style={{ fontSize: '11pt', fontWeight: 700, color: dsfr.primary, letterSpacing: '0.02em' }}>
          ParlementClair
        </span>
        <span style={{ fontSize: '9.5pt', color: dsfr.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Fiche synthèse
        </span>
      </header>

      {/* Titre */}
      <div style={{ marginBottom: '1.2rem' }}>
        <h1 style={{ fontSize: '17pt', fontWeight: 700, margin: '0 0 0.3rem', lineHeight: 1.25 }}>{heading}</h1>
        {subheading && (
          <p style={{ fontSize: '10.5pt', color: dsfr.textMuted, margin: '0 0 0.4rem', lineHeight: 1.4 }}>{subheading}</p>
        )}
        {meta.length > 0 && (
          <p style={{ fontSize: '10pt', color: dsfr.textSecondary, margin: 0 }}>{meta.join('  ·  ')}</p>
        )}
      </div>

      {/* Résumé */}
      {resume && (
        <p
          className="pf-section"
          style={{
            fontSize: '11pt',
            lineHeight: 1.6,
            color: dsfr.text,
            background: dsfr.sidebar,
            border: `1px solid ${dsfr.border}`,
            borderRadius: 6,
            padding: '0.7rem 0.85rem',
            margin: '0 0 1.3rem',
          }}
        >
          {resume}
        </p>
      )}

      {mesures.length > 0 && (
        <Section title="Ce que fait la loi">
          <BulletList items={mesures} />
        </Section>
      )}

      {changements.length > 0 && (
        <Section title="Ce que ça change concrètement">
          <BulletList items={changements} />
        </Section>
      )}

      {voteRows.length > 0 && (
        <Section title="Le vote">
          {(vote.chambre || vote.date) && (
            <p style={{ fontSize: '10pt', color: dsfr.textMuted, margin: '0 0 0.4rem' }}>
              {[vote.chambre, formatDate(vote.date)].filter(Boolean).join(' · ')}
            </p>
          )}
          <table style={{ borderCollapse: 'collapse', fontSize: '10.5pt' }}>
            <tbody>
              {voteRows.map((r) => (
                <tr key={r.label}>
                  <td style={{ padding: '0.15rem 1.5rem 0.15rem 0', fontWeight: 600 }}>{r.label}</td>
                  <td style={{ padding: '0.15rem 1.5rem 0.15rem 0' }}>{r.value}</td>
                  <td style={{ padding: '0.15rem 0', color: dsfr.textMuted }}>
                    {voteTotal ? `${Math.round((r.value / voteTotal) * 100)} %` : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      )}

      {impacts.length > 0 && (
        <Section title="Impacts par secteur">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {impacts.map((imp, i) => (
              <div key={i} style={{ fontSize: '10.5pt', lineHeight: 1.45 }}>
                <strong>{imp.secteur}</strong>
                {imp.niveau ? <span style={{ color: dsfr.textMuted }}>{` (${IMPACT_LABEL[imp.niveau] || imp.niveau})`}</span> : null}
                {imp.detail ? <span style={{ color: dsfr.textSecondary }}>{` — ${imp.detail}`}</span> : null}
              </div>
            ))}
          </div>
        </Section>
      )}

      {sources.length > 0 && (
        <Section title="Sources">
          <ul style={{ margin: 0, paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {sources.map((s, i) => (
              <li key={i} style={{ fontSize: '9.5pt', lineHeight: 1.45, color: dsfr.textSecondary }}>
                {s.label || s.url}
                {s.label && s.url ? <span style={{ color: dsfr.textMuted }}>{` — ${s.url}`}</span> : null}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {nonDisponible.length > 0 && (
        <p
          className="pf-section"
          style={{
            fontSize: '9.5pt',
            color: dsfr.textMuted,
            background: dsfr.neutralBg,
            border: `1px solid ${dsfr.neutralBorder}`,
            borderRadius: 6,
            padding: '0.5rem 0.7rem',
            margin: '0 0 1.2rem',
          }}
        >
          <strong style={{ color: dsfr.textSecondary }}>Non trouvé dans les données consultées : </strong>
          {nonDisponible.join(' · ')}
        </p>
      )}

      {/* Pied de page */}
      <footer
        style={{
          marginTop: '1.5rem',
          paddingTop: '0.5rem',
          borderTop: `1px solid ${dsfr.border}`,
          fontSize: '8.5pt',
          color: dsfr.textMuted,
          lineHeight: 1.5,
        }}
      >
        Exporté le {exportDate} depuis ParlementClair — synthèse générée par IA, à vérifier auprès des sources
        officielles.
      </footer>
    </article>
  )
}
