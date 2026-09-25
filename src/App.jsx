import { useState } from 'react'
import upvotes from './data/reddit-upvotes.json'
import { themeFor } from './data/themes'
import ThemeChart from './components/ThemeChart'
import Timeline from './components/Timeline'
import PostList from './components/PostList'
import './styles/App.css'

const posts = upvotes.map((row) => ({
  url: row['Post URL'],
  subreddit: row.Subreddit,
  theme: themeFor(row.Subreddit),
  title: row.title ?? row['Post URL'].replace('https://www.reddit.com', ''),
  score: row.score,
  created: row.created,
  year: row.created ? new Date(row.created * 1000).getFullYear() : null,
}))

function App() {
  const [selected, setSelected] = useState([])
  const [year, setYear] = useState(null)

  const inYear = year == null ? posts : posts.filter((p) => p.year === year)
  const shown = inYear
    .filter((p) => selected.length === 0 || selected.includes(p.subreddit))
    .sort((a, b) => (b.created ?? 0) - (a.created ?? 0))

  function toggleSub(sub) {
    setSelected((current) =>
      current.includes(sub) ? current.filter((s) => s !== sub) : [...current, sub],
    )
  }

  function toggleTheme(subs) {
    setSelected((current) => {
      const allOn = subs.every((sub) => current.includes(sub))
      if (allOn) return current.filter((sub) => !subs.includes(sub))
      return [...new Set([...current, ...subs])]
    })
  }

  const selectionLabel =
    selected.length === 0
      ? ''
      : selected.length === 1
        ? ` in ${selected[0]}`
        : selected.length === 2
          ? ` in ${selected[0]} and ${selected[1]}`
          : ` in ${selected.length} subreddits`

  function toggleYear(next) {
    setYear((y) => (y === next ? null : next))
  }

  return (
    <main className="app">
      <header>
        <h1>My Visualized Reddit Data</h1>
        <p className="subtitle">
          {posts.length} posts across {new Set(posts.map((p) => p.subreddit)).size}{' '}
          subreddits. 
        </p>
      </header>

      <section className="panel">
        <h2>Themes</h2>
        <p className="hint">
          {`Each theme’s share of posts upvoted${year != null ? ` in ${year}` : ''}. Click slices to combine them. Click again to remove one.`}
        </p>
        <ThemeChart
          posts={inYear}
          selected={selected}
          onToggle={toggleSub}
          onToggleTheme={toggleTheme}
        />
      </section>

      <section className="panel">
        <h2>Timeline</h2>
        <p className="hint">Posts grouped by the year they were published.</p>
        <Timeline
          posts={posts}
          selected={selected}
          year={year}
          onYear={toggleYear}
          onClear={
            selected.length > 0 || year != null
              ? () => {
                  setSelected([])
                  setYear(null)
                }
              : null
          }
        />
      </section>

      <section className="panel">
        <h2>
          {shown.length} {shown.length === 1 ? 'post' : 'posts'}
          {selectionLabel}
          {year != null && ` from ${year}`}
        </h2>
        <PostList key={`${selected.join()}-${year}`} posts={shown} />
      </section>
    </main>
  )
}

export default App
