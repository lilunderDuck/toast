import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
// import { serve } from '@hono/node-server'

import { 
  CACHE_FOLDER, 
  createDirectoryIfNotExist, 
  JOURNALS_FOLDER,
  serveApp 
} from './server'

console.log('standing by for full throttle...')

export const duck = new Hono()

duck.use('/*', cors())
__devMode && duck.use('*', logger())

async function main() {
  await import("./routes/api")
  __devMode ? null : serveApp()
  await createDirectoryIfNotExist(JOURNALS_FOLDER)
  await createDirectoryIfNotExist(CACHE_FOLDER)
  // @ts-ignore - currently there's no work-arounds to make completion without messing up the types
  // on the client
  Deno.serve({ 
    port: 8000
  }, duck.fetch)
}

main()

// serve({
//   fetch: duck.fetch,
//   port: 8000
// }).on('listening', async() => {
//   console.group('duck on the other side listening on port 8000')
//   await import("./routes/api")
//   serveApp()
//   await createDirectoryIfNotExist(JOURNALS_FOLDER)
//   await createDirectoryIfNotExist(CACHE_FOLDER)
//   console.groupEnd()
//   console.log('throttled up!')
// })