import { is, tryCatch } from '@magic/test'

import { combineColors } from '../../src/lib/index.js'

const white = {
  red: 255,
  green: 255,
  blue: 255,
  alpha: 255,
}

const black = {
  red: 0,
  green: 0,
  blue: 0,
  alpha: 255,
}

const grey = {
  red: 128,
  green: 128,
  blue: 128,
  alpha: 255,
}

const empty = {}

const partial = {
  red: 255,
}

const blackPlusPartial = {
  red: 128,
  green: 0,
  blue: 0,
  alpha: 255,
}

export default [
  { fn: tryCatch(combineColors), expect: is.error, info: 'empty objects throw an error' },
  {
    fn: tryCatch(combineColors, empty, grey),
    expect: is.deep.equal(grey),
    info: 'empty first arguments leads to second being returned',
  },
  {
    fn: combineColors(black, empty),
    expect: is.deep.equal(black),
    info: 'if only the first arg is a color, it does not get changed',
  },

  {
    fn: combineColors(partial, black),
    expect: is.deep.equal(blackPlusPartial),
    info: 'if the first arg is a partial color, those parts get used',
  },
  {
    fn: combineColors(black, partial),
    expect: is.deep.equal(blackPlusPartial),
    info: 'if the second arg is a partial color, those parts get used',
  },

  {
    fn: combineColors(black),
    expect: is.deep.equal(black),
    info: 'if only one object arg is given, it does not get changed',
  },
  {
    fn: combineColors(white, black),
    expect: is.deep.equal(grey),
    info: 'average of black and white is grey',
  },
  {
    fn: combineColors(white, white),
    expect: is.deep.equal(white),
    info: 'average of white and white is white',
  },
  {
    fn: combineColors(grey, grey),
    expect: is.deep.equal(grey),
    info: 'average of grey and grey is grey',
  },
  {
    fn: combineColors(black, black),
    expect: is.deep.equal(black),
    info: 'average of black and black is black',
  },
  {
    fn: combineColors(black),
    expect: is.deep.equal(black),
    info: 'if only one object is a color, it does not get changed',
  },
]
