import { fetchFeed } from '../lib/fetcher.js';
import { parseXML } from '../lib/parser.js';
import fs from 'fs';

const FEEDS_FILE = '.feedwatch/feeds.json';

export async function readCommand(name) {
  let feeds = [];
  try {
    feeds = JSON.parse(fs.readFileSync(FEEDS_FILE, 'utf8'));
  } catch {
    console.error('No feeds found.');
    process.exit(1);
  }

  const feed = feeds.find(f => f.name === name || f.url.includes(name));
  if (!feed) {
    console.error(`Feed "${name}" not found`);
    process.exit(1);
  }

  try {
    const xml = await fetchFeed(feed.url);
    const items = parseXML(xml);

    items.forEach(item => {
      console.log(`- ${item.title} (${item.pubDate || 'No Date'})`);
      console.log(`  ${item.link}\n`);
    });
  } catch {
    console.error(`Failed to fetch feed "${name}"`);
    process.exit(1);
  }
}