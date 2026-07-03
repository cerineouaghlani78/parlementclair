import { scaleLinear } from 'd3-scale'
import { SECTORS } from '../../data/fixtures'
import { dsfr } from '../../theme/tokens'

const MAX_ABS = 85

// Barres divergentes horizontales, indice -100 → +100.
// La demi-largeur maximale d'une barre est de 46 % du track (centré à 50 %).
const width = scaleLinear().domain([0, MAX_ABS]).range([0, 46])

export default function SectorBars() {
  return (
    <figure style={{ margin: 0, border: `1px solid ${dsfr.borderLighter}`, borderRadius: 10, padding: '1rem 1.1rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {SECTORS.map((d) => {
          const w = width(Math.abs(d.v))
          const positive = d.v >= 0
          const color = positive ? dsfr.primary : dsfr.error
          return (
            <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
              <div style={{ width: 180, fontSize: '0.79rem', textAlign: 'right', color: dsfr.textSecondary, lineHeight: 1.2, flex: '0 0 auto' }}>
                {d.label}
              </div>
              <div style={{ position: 'relative', flex: '1 1 auto', height: 20, background: dsfr.sidebar, borderRadius: 2 }}>
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, background: '#ccc' }} />
                <div
                  style={{
                    position: 'absolute',
                    top: 3,
                    bottom: 3,
                    left: `${positive ? 50 : 50 - w}%`,
                    width: `${w}%`,
                    background: color,
                    borderRadius: 2,
                  }}
                />
              </div>
              <div style={{ width: 40, fontSize: '0.8rem', fontWeight: 500, color, flex: '0 0 auto' }}>
                {(d.v > 0 ? '+' : '') + d.v}
              </div>
            </div>
          )
        })}
      </div>
      <figcaption style={{ display: 'flex', gap: '1.25rem', marginTop: '0.9rem', fontSize: '0.74rem', color: dsfr.textMuted }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ width: 11, height: 11, background: dsfr.primary, borderRadius: 2 }} />
          Effet favorable
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ width: 11, height: 11, background: dsfr.error, borderRadius: 2 }} />
          Effet défavorable
        </span>
        <span style={{ marginLeft: 'auto' }}>Indice −100 → +100</span>
      </figcaption>
    </figure>
  )
}
