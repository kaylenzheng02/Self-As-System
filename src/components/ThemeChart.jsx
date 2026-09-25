import { themes, colorFor, themeFor } from '../data/themes'

const SIZE = 200
const STROKE = 38

function percent(n, of) {
  if (!of) return 0
  return Math.round((n / of) * 100)
}

function themeActive(focus, themeName) {
  if (focus?.kind === 'theme') return focus.value === themeName
  if (focus?.kind === 'subreddit') return themeFor(focus.value).name === themeName
  return false
}

function ThemeDonut({ theme, counts, postTotal, focus, onFocus }) {
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
  const focused = slices.find(
    (slice) => focus?.kind === 'subreddit' && slice.sub === focus.value,
  )
  const shown = focused ? percent(focused.n, total) : percent(total, postTotal)

  let acc = 0

  return (
    <section className="pie-card" style={{ '--c': theme.color }}>
      <h3 className="pie-title">
        <button
          type="button"
          className={`map-theme-name ${themeActive(focus, theme.name) ? 'active' : ''}`}
          onClick={() => onFocus({ kind: 'theme', value: theme.name })}
        >
          {theme.name}
          <span className="stat">
            <span className="stat-pct">{percent(total, postTotal)}%</span>
          </span>
        </button>
      </h3>
      <svg
        className="pie-chart"
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="img"
        aria-label={`${theme.name}: ${percent(total, postTotal)}% of posts`}
      >
        <g transform={`rotate(-90 ${c} ${c})`}>
          {slices.map((slice) => {
            const len = (slice.n / total) * circumference
            const dim = focused != null && slice.sub !== focused.sub
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
                onClick={() => onFocus({ kind: 'subreddit', value: slice.sub })}
              >
                <title>
                  {slice.sub}: {percent(slice.n, total)}%
                </title>
              </circle>
            )
            acc += len
            return el
          })}
        </g>
        <foreignObject x={c - hole / 2} y={c - hole / 2} width={hole} height={hole}>
          <div className="pie-center">
            <span className="pie-total">{shown}%</span>
          </div>
        </foreignObject>
      </svg>
      <p className="pie-selected">{focused ? focused.sub : '\u00A0'}</p>
    </section>
  )
}

export default function ThemeChart({ posts, focus, onFocus }) {
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
    return <p className="empty">No posts from this year.</p>
  }

  return (
    <div className="pie-grid">
      {cards.map((theme) => (
        <ThemeDonut
          key={theme.name}
          theme={theme}
          counts={counts}
          postTotal={posts.length}
          focus={focus}
          onFocus={onFocus}
        />
      ))}
    </div>
  )
}
