import fs from '@magic/fs'

import { convertFile } from './convertFile.js'

export const convertDir = async args => {
  const { dir, extendName } = args

  const files = await fs.getFiles(dir, { extension: 'ply' })

  await Promise.all(
    files.map(async file => {
      const isOptimized = file.endsWith(`${extendName}.ply`)
      if (isOptimized) {
        return
      }

      return await convertFile({ ...args, file })
    }),
  )
}
