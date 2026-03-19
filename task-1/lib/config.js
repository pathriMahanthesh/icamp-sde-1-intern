import fs from 'fs';

const defaults = {
  retries: 3,
  timeout: 8000,
  maxItems: 10,
  logLevel: 'info',
};

const envMap = {
  retries: 'FEEDWATCH_RETRIES',
  timeout: 'FEEDWATCH_TIMEOUT',
  maxItems: 'FEEDWATCH_MAX_ITEMS',
  logLevel: 'FEEDWATCH_LOG_LEVEL',
};

export function resolveConfig(opts = {}) {
  let fileConfig = {};

  if (fs.existsSync('./feedwatch.config.json')) {
    fileConfig = JSON.parse(fs.readFileSync('./feedwatch.config.json', 'utf-8'));
  }

  const config = {};
  const sources = {};

  for (const key in defaults) {
    config[key] = defaults[key];
    sources[key] = 'default';

    if (fileConfig[key] !== undefined) {
      config[key] = fileConfig[key];
      sources[key] = 'file';
    }

    if (process.env[envMap[key]]) {
      config[key] = isNaN(process.env[envMap[key]])
        ? process.env[envMap[key]]
        : Number(process.env[envMap[key]]);
      sources[key] = 'env';
    }

    if (opts[key] !== undefined) {
      config[key] = opts[key];
      sources[key] = 'flag';
    }
  }

  return { config, sources };
}