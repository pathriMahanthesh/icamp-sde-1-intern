import fs from 'fs';

const FILE = './feeds.json';

export function loadFeeds() {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE, 'utf-8'));
}

export function saveFeeds(feeds) {
  fs.writeFileSync(FILE, JSON.stringify(feeds, null, 2));
}