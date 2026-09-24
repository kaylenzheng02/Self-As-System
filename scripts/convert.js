import * as XLSX from "xlsx";
import { existsSync, readFileSync, writeFileSync } from "fs";

const workbook = XLSX.read(readFileSync("data/reddit-upvotes.xlsx"));
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

const titles = existsSync("data/reddit-titles.json")
  ? JSON.parse(readFileSync("data/reddit-titles.json", "utf8"))
  : {};

for (const row of rows) {
  const id = row["Post URL"].match(/comments\/([a-z0-9]+)/i)?.[1];
  Object.assign(row, titles[id]);
}

writeFileSync("src/data/reddit-upvotes.json", JSON.stringify(rows, null, 2));
console.log(`Sheets: ${workbook.SheetNames.join(", ")}`);
console.log(`Converted ${rows.length} rows (${rows.filter((r) => r.title).length} with titles)`);
