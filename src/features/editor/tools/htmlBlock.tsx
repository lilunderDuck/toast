import { BlockToolConstructorOptions } from '@editorjs/editorjs/types/tools'
// ...
import stylex from '@stylexjs/stylex'
import __style from './tools.module.css'
// ...
import { createSolidRenderer } from '~/utils'
// ...
import { createToolbox } from '../utils'
import { createSignal } from 'solid-js'

export type HtmlSavedData = {
  html: string
}

type HtmlToolClass = BlockToolConstructorOptions<HtmlSavedData, {}>

const style = stylex.create({
  input: {
    width: '100%',
    resize: 'none',
    paddingInline: 10,
    paddingBlock: 5,
    border: 'none',
    backgroundColor: 'var(--gray3)',
    color: 'var(--gray12)',
    outline: 'none',
    borderRadius: 7,
    fontSize: 13,
    fontFamily: 'Menlo,Monaco,Consolas,Courier New,monospace',
    lineHeight: 1.25,
    overflowY: 'hidden',
  }
})

export class HtmlBlock {
  static readonly isReadOnlySupported = true
  static readonly enableLineBreaks = true
  static readonly toolbox = createToolbox('Html', /*html*/`
    <svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg">
      <path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/>
    </svg>  
  `)
  
  constructor(protected options: HtmlToolClass) {}

  protected $textarea!: HTMLTextAreaElement
  protected $dispose!: () => void
  render() {
    const [height, setHeight] = createSignal<string>('auto')

    const onSlappingYourKeyboard = (inputEvent: InputEvent) => {
      const current = inputEvent.currentTarget as HTMLTextAreaElement
      setHeight('auto')
      setHeight(`${current.scrollHeight}px`)
    }

    const [element, dispose] = createSolidRenderer(() => (
      <textarea 
        {...stylex.attrs(style.input)} 
        rows={2} 
        placeholder='Input some html code' 
        style={`height: ${height()}`}
        readonly={this.options.readOnly}
        ref={this.$textarea} 
        value={this.options.data.html}
        onInput={onSlappingYourKeyboard}
      />
    ), { class: __style.tool })

    this.$dispose = dispose
    return element
  }

  save(): HtmlSavedData {
    return {
      html: this.$textarea.value
    }
  }

  destroy() {
    this.$dispose()
    this.$textarea = null as unknown as HTMLTextAreaElement
  }
}