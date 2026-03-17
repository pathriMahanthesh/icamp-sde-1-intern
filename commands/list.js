import { loadFeeds } from '../lib/store.js';

export function listFeeds() {
  const feeds = loadFeeds();

  if (feeds.length === 0) {
    console.log('No feeds found');
    return;
  }

  feeds.forEach((feed, i) => {
    console.log(`${i + 1}. ${feed}`);
  });
}