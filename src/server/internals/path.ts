import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const BASE_PATH = __devMode ? './out/server' : __dirname
export const DATA_FOLDER = `${BASE_PATH}/data` as const
export const JOURNALS_FOLDER = `${DATA_FOLDER}/journals` as const
export const CACHE_FOLDER = `${DATA_FOLDER}/cache` as const

export const INTERNAL_DATA_FOLDER = `${BASE_PATH}/public` as const