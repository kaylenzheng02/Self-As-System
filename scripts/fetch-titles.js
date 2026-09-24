import { readFileSync, writeFileSync } from "fs";

const rows = JSON.parse(readFileSync("src/data/reddit-upvotes.json", "utf8"));
const ids = rows.map((r) => r["Post URL"].match(/comments\/([a-z0-9]+)/i)[1]);

const results = {};
for (let i = 0; i < ids.length; i += 100) {
  const batch = ids.slice(i, i + 100).join(",");
  const url = `https://arctic-shift.photon-reddit.com/api/posts/ids?ids=${batch}&fields=id,title,created_utc,score`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed (${res.status}) at post ${i}`);
  const { data } = await res.json();
  for (const post of data) {
    results[post.id] = { title: post.title, score: post.score, created: post.created_utc };
  }
  console.log(`Fetched ${Object.keys(results).length} of ${ids.length}`);
  await new Promise((r) => setTimeout(r, 500));
}

writeFileSync("data/reddit-titles.json", JSON.stringify(results, null, 2));
