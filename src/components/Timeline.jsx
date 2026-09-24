import { useState } from 'react'
import { allThemes, colorFor } from '../data/themes'

const WIDTH = 1000
const HEIGHT = 212
const GAP = 8
const OUTLINE_GAP = 3
const MARGIN = 4

function groupsFor(focus, dated) {
  if (focus?.kind === 'subreddit') {
    return [
      {
        key: focus.value,
        color: colorFor(focus.value),
        matches: (p) => p.subreddit === focus.value,
      },
    ]
  }
  if (focus?.kind === 'theme') {
    const counts = {}
    for (const p of dated) {
      if (p.theme.name === focus.value) counts[p.subreddit] = (counts[p.subreddit] ?? 0) + 1
    }
    return Object.keys(counts)
      .sort((a, b) => counts[b] - counts[a])
      .map((sub) => ({ key: sub, color: colorFor(sub), matches: (p) => p.subreddit === sub }))
  }
  return allThemes
    .filter((t) => dated.some((p) => p.theme === t))
    .map((t) => ({ key: t.name, color: t.color, matches: (p) => p.theme === t }))
}

export default function Timeline({ posts, focus, year, onYear, onClear }) {
  const [mode, setMode] = useState('count')

  const dated = posts.filter((p) => p.year != null)
  const first = Math.min(...dated.map((p) => p.year))
  const last = Math.max(...dated.map((p) => p.year))
  const years = Array.from({ length: last - first + 1 }, (_, i) => first + i)
  const groups = groupsFor(focus, dated)

  const columns = years.map((y) => {
    const inYear = dated.filter((p) => p.year === y)
    const segments = groups
      .map((g) => ({ ...g, n: inYear.filter(g.matches).length }))
      .filter((s) => s.n > 0)
    const matched = segments.reduce((sum, s) => sum + s.n, 0)
    return { year: y, total: inYear.length, segments, matched }
  })

  const maxTotal = Math.max(1, ...columns.map((c) => c.total))
  const colWidth = WIDTH / years.length

  function barHeight(n, total) {
    if (mode === 'share') return total ? (n / total) * HEIGHT : 0
    return (n / maxTotal) * HEIGHT
  }

  return (
    <div className="timeline">
      <div className="timeline-controls">
        {['count', 'share'].map((m) => (
          <button
            key={m}
            type="button"
            className={`button ${mode === m ? 'active' : ''}`}
            onClick={() => setMode(m)}
          >
            {m === 'count' ? 'Number of posts' : 'Share of each year'}
          </button>
        ))}
        {onClear && (
          <button type="button" className="button clear" onClick={onClear}>
            Clear filters
          </button>
        )}
      </div>

      <svg
        viewBox={`0 ${-MARGIN} ${WIDTH} ${HEIGHT + 2 * MARGIN}`}
        className="timeline-chart"
      >
        {columns.map((col, i) => {
          const x = i * colWidth + GAP / 2
          const w = colWidth - GAP
          const fullHeight = barHeight(col.total, col.total)
          let y = HEIGHT
          return (
            <g
              key={col.year}
              className={`timeline-col ${year === col.year ? 'selected' : ''}`}
              onClick={() => onYear(col.year)}
            >
              <title>
                {col.year}: {focus ? `${col.matched} of ` : ''}
                {col.total} posts
              </title>
              <rect x={i * colWidth} y={0} width={colWidth} height={HEIGHT} fill="transparent" />
              {focus && (
                <rect
                  x={x}
                  y={HEIGHT - fullHeight}
                  width={w}
                  height={fullHeight}
                  className="timeline-rest"
                />
              )}
              {col.segments.map((s) => {
                const h = barHeight(s.n, col.total)
                y -= h
                return (
                  <rect key={s.key} x={x} y={y} width={w} height={h} fill={s.color}>
                    <title>
                      {col.year}: {s.key}, {s.n} {s.n === 1 ? 'post' : 'posts'}
                    </title>
                  </rect>
                )
              })}
              <rect
                x={x - OUTLINE_GAP}
                y={HEIGHT - fullHeight - OUTLINE_GAP}
                width={w + 2 * OUTLINE_GAP}
                height={fullHeight + 2 * OUTLINE_GAP}
                className="timeline-outline"
              />
            </g>
          )
        })}
      </svg>

      <div className="timeline-years">
        {years.map((y) => (
          <button
            key={y}
            type="button"
            className={year === y ? 'selected' : ''}
            onClick={() => onYear(y)}
          >
            {y}
          </button>
        ))}
      </div>

      {focus?.kind !== 'subreddit' && (
        <ul className="legend">
          {groups.map((g) => (
            <li key={g.key}>
              <span className="swatch" style={{ background: g.color }} />
              {g.key}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
