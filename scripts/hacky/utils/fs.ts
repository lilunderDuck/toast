import fs from 'node:fs'

export function getAllFilesFromDir<const T extends string>(path: T) {
  return fs.readdirSync(path, {
    recursive: true,
    encoding: 'utf-8'
  })
}

export function deleteDir<const T extends string>(path: T) {
  console.log('delete', path)
  return fs.rmSync(path, { recursive: true, force: true })
}

export function copyDir<const T extends string, const U extends string>(path: T, to: U) {
  console.log('copy', path, 'to', to)
  return fs.cpSync(path, to, { recursive: true })
}

export function readFile<const T extends string>(path: T, encoding?: BufferEncoding | 'default') {
  console.log('read', path)
  return fs.readFileSync(path, encoding === 'default' ? {} : {
    encoding: !encoding ? 'utf-8' : encoding
  })
}

export function writeFile<const T extends string>(path: T, data: string) {
  console.log('write', path)
  return fs.writeFileSync(path, data)
}

export function createDir<const T extends string>(path: T) {
  fs.mkdirSync(path, {
    recursive: true
  })

  console.log('create', path)
}