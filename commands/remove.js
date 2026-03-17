import { loadFeeds, saveFeeds } from '../lib/store.js';

export function removeFeed(url) {
  let feeds = loadFeeds();

  feeds = feeds.filter(f => f !== url);
  saveFeeds(feeds);

  console.log('Feed removed');
}