import { loadFeeds, saveFeeds } from '../lib/store.js';

export function addFeed(url) {
  const feeds = loadFeeds();

  if (feeds.includes(url)) {
    console.log('Feed already exists');
    return;
  }

  feeds.push(url);
  saveFeeds(feeds);

  console.log('Feed added');
}