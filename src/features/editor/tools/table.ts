import TableTool from '@editorjs/table'
// ...
import "./table.css"
// ...
import { BlockToolConstructorArgs } from "../utils"

type TableToolOptions = BlockToolConstructorArgs<typeof TableTool>

export function createTable() {
  return {
    table: TableTool
  }
}