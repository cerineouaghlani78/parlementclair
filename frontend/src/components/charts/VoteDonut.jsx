import { pie, arc } from 'd3-shape'
import { VOTE } from '../../data/fixtures'
import { dsfr } from '../../theme/tokens'

const SIZE = 190
const C = SIZE / 2 // 95
const R_OUTER = 90
const R_INNER = 56

// Donut de répartition du vote (Assemblée nationale).
export default function VoteDonut() {
  const layout = pie()
    .sort(null)
    .value((d) => d.count)
    .startAngle(-Math.PI / 2)
    .endAngle((3 * Math.PI) / 2)
    .padAngle(0.02)

  const arcGen = arc().innerRadius(R_INNER).outerRadius(R_OUTER)
  const arcs = layout(VOTE.segments)

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE} style={{ display: 'block' }}>
      <g transform={`translate(${C}, ${C})`}>
        {arcs.map((a, i) => (
          <path key={i} d={arcGen(a)} fill={VOTE.segments[i].color} />
        ))}
      </g>
      <text x={C} y={C - 6} textAnchor="middle" fontSize={13} fontWeight={700} fill={dsfr.success}>
        Adoptée
      </text>
      <text x={C} y={C + 13} textAnchor="middle" fontSize={11} fill={dsfr.textMuted}>
        {VOTE.total} votants
      </text>
    </svg>
  )
}
