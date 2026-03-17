#!/usr/bin/env node

import { Command } from 'commander';
import { resolveConfig } from './lib/config.js';
import chalk from 'chalk';
import Table from 'cli-table3';

const program = new Command();

const configCmd = program.command('config');

configCmd
  .command('show')
  .option('--retries <retries>')
  .option('--timeout <timeout>')
  .option('--max-items <maxItems>')
  .option('--log-level <logLevel>')
  .action((opts) => {
    

    const { config, sources } = resolveConfig(opts);

    const table = new Table({
      head: ['Key', 'Value', 'Source'],
    });

    for (const key in config) {
      let sourceColor = sources[key];

      if (sourceColor === 'default') sourceColor = chalk.gray('default');
      if (sourceColor === 'file') sourceColor = chalk.blue('file');
      if (sourceColor === 'env') sourceColor = chalk.yellow('env');
      if (sourceColor === 'flag') sourceColor = chalk.green('flag');

      table.push([key, config[key], sourceColor]);
    }

    console.log(table.toString());
  });

program.parse();