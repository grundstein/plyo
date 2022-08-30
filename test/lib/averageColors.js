import { averageColor } from '../../src/lib/index.js'

export default [
  { fn: averageColor(1, 3), expect: 2, info: 'average of 1 and 3 is 2' },
  { fn: averageColor(1, 4), expect: 3, info: 'average of 1 and 4 is 3' },
  { fn: averageColor(255, 0), expect: 128, info: 'average of 255 and 0 is 128' },
  { fn: averageColor(255, 255), expect: 255, info: 'average of 255 and 255 is 255' },
  { fn: averageColor(0, 0), expect: 0, info: 'average of 0 and 0 is 0' },
]
