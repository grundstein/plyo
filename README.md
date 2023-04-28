## plyo

this is a cli tool that optimizes pointcloud files.

### converts:

#### precision

- x, y, z and nx, ny, nz get reduced in precision (default: 3, 0.001, 1mm)

#### removes alpha

- alpha gets removed if all alpha values are 255

#### removes normals

- if the --remove-normals flag is used, nx, ny and nz get removed. (useful when your engine lets the faces look at your camera)

#### merge duplicate points

- merges colors of points at the same location (with 0.001, 1mm precision).

#### install

##### global

to get access to the plyo command in your terminal

```bash
npm i -g plyo
```

now the global executable `plyo` exists.

##### local

to get access to plyo in your app / library:

```bash
npm i plyo
```

#### cli script:

if installed globally (npm i -g):

```bash
plyo --help
```

#### usage:

some usage examples:

##### convert one file

`plyo -i in.ply -o out.ply`

#### convert one file, remove normals

`plyo -i in.ply -o out.ply --remove-normals`

#### convert one file, with precision of 2 (0.01, 1cm)

`plyo -i in.ply -o out.ply --precision 2`

#### convert a directory of files

`plyo -d docs --extend-name -optimized`

#### convert a directory of files and overwrite the originals

if installed locally, in your repository:

```
node_modules/.bin/plyo --help
```

#### api

plyo also exposes a javascript api

```javascript
import plyo from 'plyo'

const buildFunction = async () => {
  await plyo({
    input: undefined,
    output: undefined,
    extendName: '-optimized',
    overwrite: false,
    removeNormals: false,
    precision: 3,
    dryRun: false,
  })
}

buildFunction()
```

#### Changelog

##### v0.0.2 - unreleased

...

##### v0.0.1 - 28.04.2023, 19:54 (GMT+1)

first release
