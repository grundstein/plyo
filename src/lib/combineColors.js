import is from '@magic/types'

import { averageColor } from './averageColor.js'

export const combineColors = (c1 = {}, c2 = {}) => {
  const colorKeys = ['red', 'green', 'blue', 'alpha']

  const merged = colorKeys.map(key => {
    if (!c1.hasOwnProperty(key)) {
      if (!c2.hasOwnProperty(key)) {
        if (key !== 'alpha') {
          throw new Error('E_COMBINE_COLORS_KEY_NOT_FOUND', 'both colors do not include key:', key)
        }
      } else {
        return [key, c2[key]]
      }
    } else if (!c2.hasOwnProperty(key)) {
      return [key, c1[key]]
    }

    const color1 = c1[key]
    const color2 = c2[key]
    const mergedColor = averageColor(color1, color2)

    return [key, mergedColor]
  })

  const filtered = merged.filter(a => is.array(a))

  return Object.fromEntries(filtered)
}
