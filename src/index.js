import path from 'node:path'

import fs from '@magic/fs'
import is from '@magic/types'
import log from '@magic/log'

import { combineColors } from './lib/index.js'

const convertFile = async args => {
  const {
    file,
    output,
    removeNormals,
    precision = 3,
    extendName,
    dryRun = false,
    overwrite = false,
    verbose = false,
  } = args

  const startTime = log.hrtime()

  const convertStats = []

  const contents = await fs.readFile(file, 'utf8')

  if (contents.includes('format binary')) {
    log.error('BINARY Files not supported.', 'file:', file)
    return
  }

  let removeAlpha = true

  const positions = {}

  let [head, content] = contents.split('end_header\n')
  const lines = content.split('\n')

  convertStats.push(['Filesize before optimizations', contents.length])
  convertStats.push(['Vertex count before optimizations', lines.length])

  let firstProperty = -1

  const indices = {}

  head = head
    .split('\n')
    .map((line, i) => {
      if (line.startsWith('property')) {
        if (firstProperty === -1) {
          firstProperty = i
        }

        if (line.startsWith('property uchar') || line.startsWith('property float')) {
          const [_, _2, name] = line.split(' ')
          indices[name] = i - firstProperty
        }
      }

      return line
    })
    .filter(a => a)
    .join('\n')

  lines.forEach(line => {
    const lineParts = line.split(' ')

    const lineObject = Object.fromEntries(
      Object.entries(indices)
        .map(([k, i]) => {
          if (!i && i !== 0) {
            return
          }

          const value = parseFloat(lineParts[i]).toFixed(precision) / 1.0
          return [k, value]
        })
        .filter(a => a),
    )

    const { x, y, z } = lineObject

    positions[x] = positions[x] || {}
    positions[x][y] = positions[x][y] || {}

    const old = positions[x][y][z]
    if (!old) {
      positions[x][y][z] = lineObject
    } else {
      const mergedObject = {
        ...lineObject,
        ...combineColors(lineObject, old),
      }

      positions[x][y][z] = mergedObject
    }
  })

  const finalLines = []
  Object.values(positions).map(xPos => {
    Object.values(xPos).map(yPos => {
      Object.values(yPos).map(lineObject => {
        const line = Object.keys(indices)
          .map(k => {
            if (removeAlpha && k === 'alpha') {
              return
            }

            if (removeNormals) {
              if (k === 'nx' || k === 'ny' || k === 'nz') {
                return
              }
            }

            return lineObject[k]
          })
          .filter(a => a || a === 0)

        finalLines.push(line.join(' '))
      })
    })
  })

  if (removeAlpha) {
    convertStats.push(['all alpha values are 255, removing alpha.'])

    head = head.replace('property uchar alpha\n', '')
  }

  if (removeNormals) {
    convertStats.push(['removing normals.'])

    head = head
      .replace('property float nx\n', '')
      .replace('property float ny\n', '')
      .replace('property float nz\n', '')
  }

  const finalLineCount = finalLines.length
  head = head.replace(/element vertex .*\n/gim, `element vertex ${finalLineCount - 1}\n`)

  const finalContent = [head, finalLines.join('\n')].join('\nend_header\n')

  convertStats.push(['Outputfile size after optimizations', finalContent.length])
  convertStats.push(['Outputfile pointcount after optimizations', finalLineCount])

  let outFile = output
  if (overwrite) {
    outFile = file
  } else if (!outFile) {
    outFile = file.replace('.ply', `${extendName}.ply`)
  }

  try {
    const exists = await fs.exists(outFile)
    let isDir = false
    if (exists) {
      const stat = await fs.stat(outFile)
      isDir = stat.isDirectory()
    }

    if (isDir || !outFile.endsWith('ply')) {
      outFile = file.replace(path.dirname(file), outFile)
    }
  } catch (e) {
    if (e.code === 'ENOENT' && !outFile.endsWith('ply')) {
      outFile = file.replace(path.dirname(file), outFile)
    } else {
      throw e
    }
  }

  convertStats.push(['Writing', outFile])

  if (!path.isAbsolute(outFile)) {
    outFile = path.join(process.cwd(), outFile)
  }

  if (!dryRun) {
    if (verbose) {
      convertStats.forEach(stat => log.info(...stat))
    }
    const outDir = path.dirname(outFile)

    // create dir if it does not exist
    await fs.mkdirp(outDir)

    await fs.writeFile(outFile, finalContent)

    log.timeTaken(startTime, `Building ${file} took`)
  }
}

const convertDir = async args => {
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

export const plyo = async args => {
  let { input } = args

  if (!is.array(input)) {
    input = [input]
  }

  await Promise.all(
    input.map(async fd => {
      const stat = await fs.stat(fd)
      if (stat.isFile()) {
        await convertFile({ ...args, file: fd })
      } else if (stat.isDirectory()) {
        await convertDir({ ...args, dir: fd })
      }
    }),
  )
}

export default plyo
