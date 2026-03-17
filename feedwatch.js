#!/usr/bin/env bun
import fs from 'fs';
import path from 'path';
import { parseXML, resolveConfig } from './lib/parser.js';

const STORE_DIR = process.env.FEEDWATCH_STORE_DIR || './.feedwatch';
if (!fs.existsSync(STORE_DIR)) fs.mkdirSync(STORE_DIR, { recursive: true });

const args = process.argv.slice(2);
const command = args[0];

function storeFile(name) {
  return path.join(STORE_DIR, `${name}.json`);
}

// ---------- CLI Commands ----------
switch (command) {
  case 'add': {
    const [_, feedName, feedUrl] = args;
    if (!feedName || !feedUrl) {
      console.error('Missing feed name or URL');
      process.exit(1);
    }

    const file = storeFile(feedName);
    if (fs.existsSync(file)) {
      console.error('Feed already exists');
      process.exit(1);
    }

    fs.writeFileSync(file, JSON.stringify({ name: feedName, url: feedUrl }));
    console.log(`Added feed ${feedName}`);
    process.exit(0);
  }

  case 'list': {
    const files = fs.readdirSync(STORE_DIR).filter(f => f.endsWith('.json'));
    if (!files.length) {
        console.log('No feeds added yet');
    } else {
        files.forEach(f => console.log(JSON.parse(fs.readFileSync(path.join(STORE_DIR, f))).name));
    }
    process.exit(0);
  }

  case 'remove': {
    const [_, feedName] = args;
    const file = storeFile(feedName);
    if (!fs.existsSync(file)) {
      console.error('Feed not found');
      process.exit(1);
    }
    fs.unlinkSync(file);
    console.log(`Removed feed ${feedName}`);
    process.exit(0);
  }

  case 'read': {
    const [_, feedName] = args;
    const file = storeFile(feedName);
    if (!fs.existsSync(file)) {
      console.error('Feed not found');
      process.exit(1);
    }
    console.log(fs.readFileSync(file, 'utf-8'));
    process.exit(0);
  }

  case 'config':
    if (args[1] === 'show') {
      const cfg = resolveConfig({});
      console.log(JSON.stringify(cfg, null, 2) || '{}');
      process.exit(0);
    }
    break;
   

    case 'run': 
          console.log('FAILED');
          process.exit(1);
        
      default:
        console.error(`Unknown command: ${command}`);
        process.exit(1);
    }