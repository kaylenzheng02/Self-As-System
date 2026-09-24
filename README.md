# Self as System

A React + Vite app that visualizes my Reddit upvote history. Posts are grouped into themes like Nature & science, Humor, and Visual oddities, shown as interactive donut charts and a ranked topic map. A timeline filters by year, and clicking a theme or subreddit narrows the post list.

**[View it live](https://kaylenzheng02.github.io/Self-As-System/share/)**

## Features

- **Pie chart visualization**: one donut chart per theme, broken down by subreddit. Click a slice to see its count.
- **Topics of interest**: every subreddit grouped by theme, ranked from most to least upvoted. Click a theme or subreddit to filter the post list.
- **Timeline**: posts grouped by the year they were published. Click a year to filter.
- **Post list**: the matching posts, newest first, linking back to Reddit.

## Running it

Requires [Node.js](https://nodejs.org/).

```bash
npm install
npm run dev
```

Then open the address it prints (usually http://localhost:5173).

## Building

| Command | Output |
| --- | --- |
| `npm run build` | A standard build in `dist/` |
| `npm run share` | A single self-contained file at `share/index.html` that opens by double-clicking, with no server needed |

## Updating the data

1. Put the upvote export at `data/reddit-upvotes.xlsx`, with `Post URL` and `Subreddit` columns.
2. `npm run convert` turns the spreadsheet into `src/data/reddit-upvotes.json`.
3. `npm run fetch-titles` looks up each post's title, score, and date from the [Arctic Shift](https://arctic-shift.photon-reddit.com/) archive and saves them to `data/reddit-titles.json`.
4. `npm run convert` again merges the titles into the app's data.
5. `npm run share` rebuilds the shareable file.

## Customizing themes

Themes, the subreddits in each, and their colors are defined in `src/data/themes.js`. Subreddits that aren't assigned to a theme appear under **Other**.

## Project structure

```
src/
  App.jsx               page layout, filters, and state
  components/
    ThemeChart.jsx      donut charts
    InterestMap.jsx     topics of interest
    Timeline.jsx        posts by year
    PostList.jsx        filtered post list
  data/
    themes.js           theme definitions and colors
    reddit-upvotes.json the upvote data
  styles/
scripts/
  convert.js            spreadsheet to JSON
  fetch-titles.js       fetches post titles and dates
```
