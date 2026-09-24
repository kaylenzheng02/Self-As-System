import { useState } from 'react'
import { colorFor } from '../data/themes'

const PAGE_SIZE = 50

function formatDate(created) {
  return new Date(created * 1000).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function PostList({ posts }) {
  const [limit, setLimit] = useState(PAGE_SIZE)

  return (
    <>
      <ol className="posts">
        {posts.slice(0, limit).map((post) => (
          <li key={post.url}>
            <a href={post.url} target="_blank" rel="noreferrer" title={post.title}>
              {post.title}
            </a>
            <div className="post-meta">
              <span className="post-subreddit">
                <span className="swatch" style={{ background: colorFor(post.subreddit) }} />
                {post.subreddit}
              </span>
              {post.created && <span>{formatDate(post.created)}</span>}
              {post.score != null && <span>{post.score} points</span>}
            </div>
          </li>
        ))}
      </ol>
      {posts.length > limit && (
        <button type="button" className="button" onClick={() => setLimit((l) => l + PAGE_SIZE)}>
          Show more ({posts.length - limit} left)
        </button>
      )}
    </>
  )
}
