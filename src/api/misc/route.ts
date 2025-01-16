import { apiRoute } from "~/common"

const BASE_PATH = apiRoute('/miscellaneous')

export const MEMORY_USAGE_ROUTE = `${BASE_PATH}/mem`
export const LIBARY_USED_ROUTE = `${BASE_PATH}/lib`
export const SPLASH_TEXT_ROUTE = `${BASE_PATH}/splash-text`