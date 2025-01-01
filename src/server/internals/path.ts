import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const DATA_FOLDER = `${__devMode ? './out' : __dirname}/data` as const
export const JOURNALS_FOLDER = `${DATA_FOLDER}/journals` as const
export const CACHE_FOLDER = `${DATA_FOLDER}/cache` as const