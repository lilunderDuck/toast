import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'

import { CACHE_FOLDER, createDirectoryIfNotExist, JOURNALS_FOLDER } from './server'

export const duck = new Hono()

duck.use('/*', cors())
__devMode && duck.use('*', logger())

serve({
  fetch: duck.fetch,
  port: 8000
}).on('listening', () => {
  console.log('duck on the other side listening on port 8000')
  import("./routes/api")
  import("./routes/app")
  createDirectoryIfNotExist(JOURNALS_FOLDER)
  createDirectoryIfNotExist(CACHE_FOLDER)
})