import { XMLParser } from 'fast-xml-parser';

// ---------- Parser ----------
export function parseXML(xml) {
  try {
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
    const data = parser.parse(xml);

    // RSS
    if (data.rss?.channel?.item) {
      const items = Array.isArray(data.rss.channel.item)
        ? data.rss.channel.item
        : [data.rss.channel.item];
      return items.map(normalizeRSSItem);
    }

    // Atom
    if (data.feed?.entry) {
      const entries = Array.isArray(data.feed.entry)
        ? data.feed.entry
        : [data.feed.entry];
      return entries.map(normalizeAtomItem);
    }

    return [];
  } catch (err) {
    return [];
  }
}

// ---------- Normalizers ----------
function normalizeRSSItem(item) {
  return {
    title: item.title || '',
    link: item.link || '',
    pubDate: toISO(item.pubDate),
    description: item.description || '',
    guid: item.guid || item.link || item.title || '',
  };
}

function normalizeAtomItem(entry) {
  return {
    title: entry.title || '',
    link: entry.link?.['@_href'] || '',
    pubDate: toISO(entry.updated || entry.published),
    description: entry.summary || entry.content || '',
    guid: entry.id || entry.link?.['@_href'] || entry.title || '',
  };
}

function toISO(date) {
  if (!date) return '';
  const d = new Date(date);
  return isNaN(d) ? '' : d.toISOString();
}

// ---------- Config Resolver ----------
export function resolveConfig(opts = {}) {
  const defaults = {
    retries: 3,
    timeout: 5000,
    logLevel: 'info',
    storeDir: './.feedwatch',
  };

  const config = { ...defaults };

  if (process.env.FEEDWATCH_TIMEOUT) {
    const t = Number(process.env.FEEDWATCH_TIMEOUT);
    if (!isNaN(t)) config.timeout = t;
  }

  if (opts.logLevel) config.logLevel = opts.logLevel;
  if (opts.storeDir) config.storeDir = opts.storeDir;

  return config;
}