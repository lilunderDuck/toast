import { serveStatic } from 'hono/serve-static'
import { fileURLToPath, resolve } from 'node:url'
import { dirname } from 'node:path'
// ...
import { duck } from "~/entry-server"
import { readFile } from "~/server"
import { apiRoute } from '~/common'
import { Context } from 'hono'

export function serveApp() {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  const appResourcePath = resolve(__dirname, `./server/static` as const)
  const API_ROUTE = apiRoute()

  console.log('app resource path is', appResourcePath)

  duck.use('*', serveStatic({
    root: appResourcePath,
    async getContent(path) {
      console.log('input path is:', path)
      // return await readFile(`${appResourcePath}/${path}`, {
      return await readFile(path, {
        encoding: 'utf-8'
      })
    },
  }))
  
  duck.notFound(async(context) => {
    const API_ROUTE = apiRoute('')
    const isApiRoute = context.req.path.includes(API_ROUTE)
    if (isApiRoute) {
      return context.text('not found', 404)
    }
  
    return returnBackIndexHtmlFile(appResourcePath, context)
  })
  
  duck.on('GET', ['/', '/journal/:id', '/too-technical', '*404'], async(context) => {
    return returnBackIndexHtmlFile(appResourcePath, context)
  })
}

async function returnBackIndexHtmlFile(resourcePath: string, context: Context) {
  const content = await readFile(`${resourcePath}/index.html`, {
    encoding: 'utf-8'
  }) as string
  return context.html(content, 200)
}