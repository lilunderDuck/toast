export const DATA_FOLDER = __devMode ? './out/data' : './data'
export const JOURNALS_FOLDER = `${DATA_FOLDER}/journals` as const
export const CACHE_FOLDER = `${DATA_FOLDER}/cache` as const