import type { BlockToolConstructorOptions } from '@editorjs/editorjs/types/tools'
import { EditorView, basicSetup } from "codemirror"
import { coolGlow } from 'thememirror'
// import { css } from "@codemirror/lang-css"
// ...
import { createToolbox } from '../utils'
// ...
import __style from './tools.module.css'

export type CodeSavedData = {
  code: string
}

type CodeToolClass = BlockToolConstructorOptions<CodeSavedData, {}>

export class CodeBlock {
  static readonly isReadOnlySupported = true
  static readonly enableLineBreaks = true
  static readonly toolbox = createToolbox('Code', /*html*/`
    <svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg">
      <path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/>
    </svg>
  `)
  
  constructor(protected options: CodeToolClass) {}

  protected editorView$!: EditorView
  render() {
    const mountingPoint = document.createElement('div')
    const view = new EditorView({
      parent: mountingPoint,
      doc: `p { background-color: purple }`,
      extensions: [basicSetup, coolGlow]
    })

    mountingPoint.id = __style.tool

    this.editorView$ = view

    return mountingPoint
  }

  save(): CodeSavedData {
    return {
      code: this.editorView$.state.doc.toString()
    }
  }

  destroy() {
    this.editorView$.destroy()
  }
}