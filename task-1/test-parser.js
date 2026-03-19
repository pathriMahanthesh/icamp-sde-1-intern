import { parseXML } from './lib/parser.js';
import fs from 'fs';

const rss  = parseXML(fs.readFileSync('tests/fixtures/rss.xml',  'utf8'));
const atom = parseXML(fs.readFileSync('tests/fixtures/atom.xml', 'utf8'));
const bad  = parseXML(fs.readFileSync('tests/fixtures/bad.xml',  'utf8'));

console.log('RSS:', rss[0]);
console.log('ATOM:', atom[0]);
console.log('BAD:', bad);