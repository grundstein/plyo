import { is, tryCatch } from '@magic/test'

import plyoDefault, { plyo } from '../src/index.js'

export default [
  { fn: () => plyo, expect: is.fn, info: 'plyo is a function' },
  { fn: tryCatch(plyo), expect: is.error, info: 'calling plyo without args errors' },
  { fn: is.deep.equal(plyoDefault, plyo), info: 'default and scoped exports both export the same' },
]
