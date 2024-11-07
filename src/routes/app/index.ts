import { duck } from "~/entry-server"
import { readFile } from "~/server"
// ...
import { serveStatic } from 'hono/serve-static'
import { fileURLToPath, resolve } from 'node:url'
import { dirname } from 'node:path'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const appResourcePath = resolve(__dirname, `./resource` as const)

duck.use('/*', serveStatic({
  root: appResourcePath,
  getContent(path) {
    return readFile(path)
  },
}))

duck.notFound(async(context) => {
  const content = await readFile(`${appResourcePath}/index.html`, {
    encoding: 'utf-8'
  }) as string
  return context.html(content, 200)
})

duck.on('GET', ['/', '/journal/:id', '/too-technical', '*404'], async(context) => {
  const content = await readFile(`${appResourcePath}/index.html`, {
    encoding: 'utf-8'
  }) as string
  return context.html(content, 200)
})