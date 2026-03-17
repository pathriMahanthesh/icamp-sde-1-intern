import fs from 'fs';
import path from 'path';

const STATE_DIR = path.resolve('.feedwatch');
const STATE_FILE = path.join(STATE_DIR, 'state.json');

// Load existing state
export function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  } catch {
    return {};
  }
}

// Save state
export function saveState(state) {
  if (!fs.existsSync(STATE_DIR)) {
    fs.mkdirSync(STATE_DIR);
  }

  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}
