import { scaleLinear } from 'd3-scale'
import { line, area, curveLinear } from 'd3-shape'
import { BUDGET } from '../../data/fixtures'
import { dsfr } from '../../theme/tokens'

const W = 560
const H = 200
const PAD = { l: 40, r: 14, t: 14, b: 28 }
const MAX_Y = 13
const GRID = [0, 4, 8, 12]

// Courbe (ligne + aire) des charges de soutien aux ENR, 2023–2030.
export default function BudgetChart() {
  const x = scaleLinear()
    .domain([0, BUDGET.length - 1])
    .range([PAD.l, W - PAD.r])
  const y = scaleLinear().domain([0, MAX_Y]).range([H - PAD.b, PAD.t])

  const pts = BUDGET.map((d, i) => [x(i), y(d[1])])

  const linePath = line()
    .x((_, i) => x(i))
    .y((d) => y(d[1]))
    .curve(curveLinear)(BUDGET)

  const areaPath = area()
    .x((_, i) => x(i))
    .y0(y(0))
    .y1((d) => y(d[1]))
    .curve(curveLinear)(BUDGET)

  const last = BUDGET[BUDGET.length - 1]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: W, display: 'block' }}>
      {GRID.map((g) => (
        <line key={`g${g}`} x1={PAD.l} x2={W - PAD.r} y1={y(g)} y2={y(g)} stroke={dsfr.borderLighter} strokeWidth={1} />
      ))}
      {GRID.map((g) => (
        <text key={`t${g}`} x={PAD.l - 8} y={y(g) + 3} textAnchor="end" fontSize={10} fill={dsfr.grey}>
          {g}
        </text>
      ))}
      <path d={areaPath} fill="rgba(0,0,145,0.10)" />
      <path d={linePath} fill="none" stroke={dsfr.primary} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((p, i) => (
        <circle key={`c${i}`} cx={p[0]} cy={p[1]} r={3} fill="#fff" stroke={dsfr.primary} strokeWidth={2} />
      ))}
      {BUDGET.map((d, i) => (
        <text key={`x${i}`} x={x(i)} y={H - 8} textAnchor="middle" fontSize={10} fill={dsfr.textMuted}>
          {d[0]}
        </text>
      ))}
      <text x={x(BUDGET.length - 1)} y={y(last[1]) - 10} textAnchor="end" fontSize={11} fontWeight={700} fill={dsfr.primary}>
        12 Md€
      </text>
    </svg>
  )
}
