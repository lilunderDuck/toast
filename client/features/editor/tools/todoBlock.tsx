import { createSignal } from 'solid-js'
import type { BlockToolConstructorOptions } from '@editorjs/editorjs/types/tools'
// ...
import __style from './tools.module.css'
// ...
import { createSolidRenderer } from 'client/utils'
// ...
import { createToolbox, type NoOptions } from '../utils'
import { TodoBlockRoot } from '../components'
import type { TodoSavedData } from '../types'

type TodoBlockOptions = BlockToolConstructorOptions<TodoSavedData, NoOptions>

export class TodoBlock {
  static readonly isReadOnlySupported = true
  static readonly toolbox = createToolbox('Link', /*html*/`
    <svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg">
      <path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/>
    </svg>
  `)

  constructor(protected options: TodoBlockOptions) {}

  protected dispose$!: () => void
  protected data$ = createSignal({} as TodoSavedData)
  render() {
    console.log('data in', this.options.data)
    const [element, dispose] = createSolidRenderer(() => (
      <TodoBlockRoot 
        dataOut$={this.data$}
        dataIn$={this.options.data}
        readOnly={this.options.readOnly}
      />
    ), { class: __style.tool })

    this.dispose$ = dispose
    return element
  }

  save(): TodoSavedData {
    const [data] = this.data$
    return data()
  }

  destroy() {
    this.dispose$()
    this.data$ = undefined
  }
}