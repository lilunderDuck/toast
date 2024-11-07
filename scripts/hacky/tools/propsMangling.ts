import { makeid } from "../utils"

const propsList = [
  'editor-tour-sidebar',
  'editor-tour-create-journal-button',
  'editor-tour-create-journal-category-button',
  'editor-tour-toggle-edit-or-readonly-button',
  'editor-tour-customize-layout-button',
  'editor-tour-home-button',
  'app-scrollbar',
  'app-scrollbar-vertical',
  'app-invs-scrollbar'
]

const propsStartWithDollarSignRegex = /\$(_|)[a-zA-Z0-9]+/gm

export function mangleProps(fileContent: string) {
  let newFileContent = fileContent
  const propsStartWithDollarSign = (newFileContent.match(propsStartWithDollarSignRegex) ?? [])
    .filter(it => it.length > 2)
  // ...
  
  for (const key of [...propsList, ...propsStartWithDollarSign]) {
    newFileContent = newFileContent.replaceAll(key, makeid(3))
  }

  return newFileContent
}