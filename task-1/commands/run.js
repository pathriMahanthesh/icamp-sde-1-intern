import { fetchFeed } from '../lib/fetcher.js';
import { parseXML } from '../lib/parser.js';
import { loadState, saveState } from '../lib/state.js';
import fs from 'fs';
import chalk from 'chalk';

export async function runCommand(options) {
  const STORE_DIR = process.env.FEEDWATCH_STORE_DIR || './.feedwatch';

  let feeds = [];

  try {
    const files = fs
  .readdirSync(STORE_DIR)
  .filter(f => f.endsWith('.json') && f !== 'state.json');

    feeds = [];

for (const file of files) {
  const content = fs.readFileSync(`${STORE_DIR}/${file}`, 'utf8');
  const parsed = JSON.parse(content);

  if (Array.isArray(parsed)) {
    feeds.push(...parsed); // flatten array
  } else {
    feeds.push(parsed); // single object
  }
}

    if (feeds.length === 0) {
      if (!options.json) console.log('No feeds found.');
      return 0;
    }

  } catch {
    if (!options.json) console.log('No feeds found.');
    return 0;
  }

  const state = loadState();
  const results = [];
  let hasFailed = false;

  for (const feed of feeds) {
    const result = { name: feed?.name || feed?.url || 'Unknown Feed' };

    try {
      const xml = await fetchFeed(feed.url);
      const items = parseXML(xml);
      const seen = state[feed.url] || [];

      const processedItems = items.map(item => {
        const isSeen = seen.includes(item.guid);
        return {
          title: item.title,
          guid: item.guid,
          status: isSeen ? 'SEEN' : 'NEW',
          pubDate: item.pubDate,
          link: item.link,
        };
      });

      result.status = 'ok';
      result.items = processedItems;

      // Print output (non-JSON mode)
      if (!options.json) {
        console.log(`\nFeed: ${feed.name || feed.url}`);
        for (const item of processedItems) {
          if (item.status === 'NEW' || options.all) {
            const line = `[${item.status}] ${item.title}`;
            console.log(
              item.status === 'NEW'
                ? chalk.green(line)
                : chalk.gray(line)
            );
          }
        }
      }

      // Update state
      state[feed.url] = items.map(i => i.guid);

    } catch (err) {
      hasFailed = true;

      result.status = 'failed';
      result.error = err.message;

      if (!options.json) {
        console.log(chalk.red(`[FAILED] ${feed?.name || feed?.url || 'Unknown Feed'}`));
      }
    }

    results.push(result);
  }

  saveState(state);

  // JSON output
  if (options.json) {
    console.log(JSON.stringify(results, null, 2));
  }

  return hasFailed ? 1 : 0;
}