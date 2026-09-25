import { allThemes, colorFor, themeFor } from '../data/themes'

function percent(n, of) {
  if (!of) return 0
  return Math.round((n / of) * 100)
}

function isFocused(focus, kind, value) {
  return focus?.kind === kind && focus.value === value
}

function themeActive(focus, themeName) {
  if (focus?.kind === 'theme') return focus.value === themeName
  if (focus?.kind === 'subreddit') return themeFor(focus.value).name === themeName
  return false
}

export default function InterestMap({ posts, focus, onFocus }) {
  const counts = {}
  for (const post of posts) {
    counts[post.subreddit] = (counts[post.subreddit] ?? 0) + 1
  }
  const groups = allThemes
    .map((theme) => {
      const subs = Object.keys(counts)
        .filter((sub) => themeFor(sub) === theme)
        .sort((a, b) => counts[b] - counts[a] || a.localeCompare(b))
      const total = subs.reduce((sum, sub) => sum + counts[sub], 0)
      return { theme, subs, total }
    })
    .filter((group) => group.total > 0)
    .sort((a, b) => b.total - a.total)

  if (groups.length === 0) {
    return <p className="empty">No posts from this year.</p>
  }

  return (
    <div className="map">
      {groups.map(({ theme, subs, total }) => (
        <section
          key={theme.name}
          className="map-theme"
          style={{ '--c': theme.color }}
        >
          <button
            type="button"
            className={`map-theme-name ${themeActive(focus, theme.name) ? 'active' : ''}`}
            onClick={() => onFocus({ kind: 'theme', value: theme.name })}
          >
            {theme.name}
            <span className="stat">
              <span className="stat-n">{total}</span>
              <span className="stat-pct">{percent(total, posts.length)}%</span>
            </span>
          </button>
          <ul className="sub-list">
            {subs.map((sub) => (
              <li key={sub}>
                <button
                  type="button"
                  className={`sub-row ${isFocused(focus, 'subreddit', sub) ? 'active' : ''}`}
                  onClick={() => onFocus({ kind: 'subreddit', value: sub })}
                >
                  <span className="swatch" style={{ background: colorFor(sub) }} />
                  <span className="sub-name">{sub}</span>
                  <span className="stat">
                    <span className="stat-n">{counts[sub]}</span>
                    <span className="stat-pct">{percent(counts[sub], total)}%</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
