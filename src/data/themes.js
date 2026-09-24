export const themes = [
  {
    name: 'Nature & science',
    color: '#469cb9',
    subreddits: ['r/birding', 'r/entomology', 'r/biology', 'r/neurology'],
    subredditColors: {
      'r/birding': '#aad2df',
      'r/neurology': '#67aec5',
      'r/entomology': '#3a8098',
      'r/biology': '#2d6476',
    },
  },
  {
    name: 'Curiosity',
    color: '#a85790',
    subreddits: ['r/whatisit', 'r/whatismycookiecutter'],
    subredditColors: {
      'r/whatisit': '#cb9abc',
      'r/whatismycookiecutter': '#6c375c',
    },
  },
  {
    name: 'Visual oddities',
    color: '#c19c3e',
    subreddits: [
      'r/Pareidolia',
      'r/chairsunderwater',
      'r/BreadStapledToTrees',
      'r/confusingperspective',
      'r/AccidentalRenaissance',
      'r/Perfectfit',
      'r/SneakyBackgroundFeet',
    ],
    subredditColors: {
      'r/AccidentalRenaissance': '#eee3c9',
      'r/confusingperspective': '#e0ce9f',
      'r/chairsunderwater': '#d7bf84',
      'r/Pareidolia': '#ccae61',
      'r/Perfectfit': '#9e8033',
      'r/BreadStapledToTrees': '#7b6428',
      'r/SneakyBackgroundFeet': '#59481d',
    },
  },
  {
    name: 'Design gripes',
    color: '#bd6142',
    subreddits: ['r/HostileArchitecture', 'r/TVTooHigh', 'r/WeWantPlates'],
    subredditColors: {
      'r/HostileArchitecture': '#e2b9ac',
      'r/TVTooHigh': '#ca8168',
      'r/WeWantPlates': '#793e2a',
    },
  },
  {
    name: 'Tech',
    color: '#7559a6',
    subreddits: ['r/tech', 'r/microsoft'],
    subredditColors: {
      'r/tech': '#ac9cc9',
      'r/microsoft': '#4b396a',
    },
  },
  {
    name: 'Humor',
    color: '#819b7c',
    subreddits: [
      'r/climbingcirclejerk',
      'r/HaveWeMet',
      'r/AmIOverreacting',
      'r/notmycat',
      'r/ItemShop',
      'r/IRLEasterEggs',
    ],
    subredditColors: {
      'r/climbingcirclejerk': '#beccbb',
      'r/notmycat': '#aabca6',
      'r/ItemShop': '#95ab90',
      'r/AmIOverreacting': '#6d8c67',
      'r/HaveWeMet': '#597c54',
      'r/IRLEasterEggs': '#466d40',
    },
  },
]

const other = { name: 'Other', color: '#9ca3af', subreddits: [] }

export const allThemes = [...themes, other]

const bySubreddit = Object.fromEntries(
  themes.flatMap((theme) => theme.subreddits.map((sub) => [sub, theme]))
)

export function themeFor(subreddit) {
  return bySubreddit[subreddit] ?? other
}

export function colorFor(subreddit) {
  const theme = themeFor(subreddit)
  return theme.subredditColors?.[subreddit] ?? theme.color
}
