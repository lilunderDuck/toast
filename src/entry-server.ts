import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { 
  CACHE_FOLDER, 
  createDirectoryIfNotExist, 
  JOURNALS_FOLDER,
  serveApp 
} from './server'

console.log('standing by for full throttle...')
await createDirectoryIfNotExist(JOURNALS_FOLDER)
await createDirectoryIfNotExist(CACHE_FOLDER)
function loadStuff() { return import("./routes/api") }

export const duck = new Hono()

duck.use('/*', cors())
__devMode && duck.use('*', logger())
__devMode ? null : serveApp()

loadStuff()

// currently there's no workarounds to autocomplete Deno's related stuff 
// without messing up the types on the client
// update: there is a workaround :)
Deno.serve({ 
  port: 8000
}, duck.fetch)