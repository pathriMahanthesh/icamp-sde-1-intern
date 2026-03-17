import { fetchFeed } from '../lib/fetcher.js';
import { parseXML } from '../lib/parser.js';
import { loadState, saveState } from '../lib/state.js';
import fs from 'fs';
import chalk from 'chalk';

const FEEDS_FILE = '.feedwatch/feeds.json';

export async function runCommand(options) {
  let feeds = [];

  // Load feeds
  try {
    feeds = JSON.parse(fs.readFileSync(FEEDS_FILE, 'utf8'));
  } catch {
    console.log('No feeds found.');
    process.exit(0);
  }

  const state = loadState();
  const results = [];
  let hasFailed = false;

  for (const feed of feeds) {
    console.log(`\nFeed: ${feed.url}`);
    const feedResult = { name: feed.url, items: [], failed: false };

    try {
      const xml = await fetchFeed(feed.url);
      const items = parseXML(xml);
      const seen = state[feed.url] || [];

      for (const item of items) {
        const isSeen = seen.includes(item.guid);
        const status = isSeen ? 'SEEN' : 'NEW';

        feedResult.items.push({
          title: item.title,
          guid: item.guid,
          status,
          pubDate: item.pubDate,
          link: item.link,
        });

        // Default: only show NEW unless --all
        if (!isSeen || options.all) {
          const line = `[${status}] ${item.title}`;
          console.log(
            status === 'NEW' ? chalk.green(line) : chalk.gray(line)
          );
        }
      }

      // Update state
      state[feed.url] = items.map(i => i.guid);
    } catch (err) {
      feedResult.failed = true;
      hasFailed = true;
      console.log(chalk.red(`[FAILED] ${feed.url}`));
    }

    results.push(feedResult);
  }

  saveState(state);

  // Handle --json
  if (options.json) {
    console.log(JSON.stringify(results, null, 2));
  }

  // Exit code: 1 if any feed failed
  process.exit(hasFailed ? 1 : 0);
}