import { useState } from 'react'
import { themes, colorFor } from '../data/themes'

const SIZE = 200
const STROKE = 38

function ThemeDonut({ theme, counts }) {
  const [selected, setSelected] = useState(null)

  function toggle(sub) {
    setSelected((current) => (current === sub ? null : sub))
  }

  const slices = theme.subreddits
    .map((sub) => ({ sub, color: colorFor(sub), n: counts[sub] ?? 0 }))
    .filter((slice) => slice.n > 0)
    .sort((a, b) => b.n - a.n || a.sub.localeCompare(b.sub))

  const total = slices.reduce((sum, slice) => sum + slice.n, 0)
  if (total === 0) return null

  const c = SIZE / 2
  const r = (SIZE - STROKE) / 2
  const hole = SIZE - 2 * STROKE
  const circumference = 2 * Math.PI * r
  const hasSelection = selected != null
  const focused = slices.find((slice) => slice.sub === selected)

  let acc = 0

  return (
    <section className="pie-card" style={{ '--c': theme.color }}>
      <h3 className="pie-title">{theme.name}</h3>
      <svg
        className="pie-chart"
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="img"
        aria-label={`${theme.name}: upvotes by subreddit`}
      >
        <g transform={`rotate(-90 ${c} ${c})`}>
          {slices.map((slice) => {
            const len = (slice.n / total) * circumference
            const dim = hasSelection && slice.sub !== selected
            const el = (
              <circle
                key={slice.sub}
                cx={c}
                cy={c}
                r={r}
                fill="none"
                stroke={slice.color}
                strokeWidth={STROKE}
                strokeDasharray={`${len} ${circumference - len}`}
                strokeDashoffset={-acc}
                className={`pie-slice ${dim ? 'dim' : ''}`}
                onClick={() => toggle(slice.sub)}
              >
                <title>
                  {slice.sub}: {slice.n} {slice.n === 1 ? 'post' : 'posts'} (
                  {Math.round((slice.n / total) * 100)}%)
                </title>
              </circle>
            )
            acc += len
            return el
          })}
        </g>
        <foreignObject x={c - hole / 2} y={c - hole / 2} width={hole} height={hole}>
          <div className="pie-center">
            <span className="pie-total">{focused ? focused.n : total}</span>
          </div>
        </foreignObject>
      </svg>
      <p className="pie-selected">{focused ? focused.sub : '\u00A0'}</p>
    </section>
  )
}

export default function ThemeChart({ posts }) {
  const counts = {}
  for (const post of posts) {
    counts[post.subreddit] = (counts[post.subreddit] ?? 0) + 1
  }

  const totalFor = (theme) =>
    theme.subreddits.reduce((sum, sub) => sum + (counts[sub] ?? 0), 0)
  const cards = themes
    .filter((theme) => totalFor(theme) > 0)
    .sort((a, b) => totalFor(b) - totalFor(a))

  if (cards.length === 0) {
    return <p className="empty">No posts here.</p>
  }

  return (
    <div className="pie-grid">
      {cards.map((theme) => (
        <ThemeDonut key={theme.name} theme={theme} counts={counts} />
      ))}
    </div>
  )
}
