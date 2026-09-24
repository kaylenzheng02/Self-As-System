import { useState } from 'react'
import upvotes from './data/reddit-upvotes.json'
import { themeFor } from './data/themes'
import InterestMap from './components/InterestMap'
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
  const [focus, setFocus] = useState(null)
  const [year, setYear] = useState(null)

  const matchesFocus = focus
    ? (p) => (focus.kind === 'theme' ? p.theme.name : p.subreddit) === focus.value
    : null
  const inYear = year == null ? posts : posts.filter((p) => p.year === year)
  const shown = inYear
    .filter((p) => !matchesFocus || matchesFocus(p))
    .sort((a, b) => (b.created ?? 0) - (a.created ?? 0))

  function toggleFocus(next) {
    setFocus((f) => (f?.kind === next.kind && f.value === next.value ? null : next))
  }

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
        <h2>Pie Chart Visualization</h2>
        <p className="hint">Each theme broken down by subreddit. Click a slice to view more details.</p>
        <ThemeChart posts={posts} />
      </section>

      <section className="panel">
        <h2>Topics of  Interest</h2>
        <p className="hint">
          {`The number next to each subreddit is how many posts I've upvoted${year != null ? ` from ${year}` : ''}.`}
        </p>
        <InterestMap posts={inYear} focus={focus} onFocus={toggleFocus} />
      </section>

      <section className="panel">
        <h2>Timeline</h2>
        <p className="hint">Posts grouped by the year they were published.</p>
        <Timeline
          posts={posts}
          focus={focus}
          year={year}
          onYear={toggleYear}
          onClear={
            focus || year != null
              ? () => {
                  setFocus(null)
                  setYear(null)
                }
              : null
          }
        />
      </section>

      <section className="panel">
        <h2>
          {shown.length} {shown.length === 1 ? 'post' : 'posts'}
          {focus && ` in ${focus.value}`}
          {year != null && ` from ${year}`}
        </h2>
        <PostList key={`${focus?.value}-${year}`} posts={shown} />
      </section>
    </main>
  )
}

export default App
