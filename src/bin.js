#!/usr/bin/env node

import cli from '@magic/cli'
import ply from './index.js'

const cliArgs = {
  options: [
    ['--input', '-i'],
    ['--remove-normals'],
    ['--overwrite', '-f'],
    '--dry-run',
    ['--output', '--out', '-o'],
    '--precision',
    '--extend-name',
    '--verbose',
  ],
  single: [
    '--file',
    '--remove-normals',
    '--output',
    '--dir',
    '--precision',
    '--extend-name',
    '--overwrite',
    '--dry-run',
    '--verbose',
  ],
  default: {
    '--extend-name': '-optimized',
  },
  help: {
    name: 'plyo',
    header: 'optimizes ply files.',
    options: {
      '--input': 'file or directory with files to optimize.',
      '--output': 'file to write changes to',
      '--remove-normals': 'remove normals from the ply file.',
      '--precision': 'precision of values. default is 3 (0.001, 1mm)',
      '--extend-name': 'appendix added to optimized files.',
      '--overwrite': 'overwrite existing files. ignores --extend-name.',
      '--dry-run': 'will not write any changes to disk',
      '--verbose': 'log more output',
    },
    example: `
# optimize a file
plyo -i opt.ply

# optimize a directory
plyo -i docs
`,
  },
}

const { args } = cli(cliArgs)

ply(args)
