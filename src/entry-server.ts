import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'

import { 
  CACHE_FOLDER, 
  createDirectoryIfNotExist, 
  JOURNALS_FOLDER,
  serveApp 
} from './server'

export const duck = new Hono()

duck.use('/*', cors())
__devMode && duck.use('*', logger())

serve({
  fetch: duck.fetch,
  port: 8000
}).on('listening', async() => {
  console.group('duck on the other side listening on port 8000')
  await import("./routes/api")
  serveApp()
  await createDirectoryIfNotExist(JOURNALS_FOLDER)
  await createDirectoryIfNotExist(CACHE_FOLDER)
  console.groupEnd()
})