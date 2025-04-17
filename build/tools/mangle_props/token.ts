/// <reference types="@types/deno" />

import path from "node:path"
import fs from "node:fs/promises"

export type FileData = {
  name: string
  content: string
  newContent?: string
}

export async function getAllFiles(): Promise<FileData[]> {
  const PATH = path.join(import.meta.dirname, "../out/static")
  const datas = []
  for await (const dir of Deno.readDir(PATH)) {
    if (dir.name.endsWith(".png") || dir.name.endsWith(".html")) {
      continue
    }

    datas.push({
      name: dir.name,
      content: await fs.readFile(`${PATH}/${dir.name}`, { encoding: 'utf-8' })
    })
  }

  return datas
}

const PROPS_ENDS_WITH_DOLLAR_SIGN = /[a-zA-Z]+\$/gm
export function getTokens(data: FileData): string[] {
  return data.content.match(PROPS_ENDS_WITH_DOLLAR_SIGN) ?? []
}

