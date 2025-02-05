import { BlockToolConstructorOptions } from '@editorjs/editorjs/types/tools'
// ...
import stylex from '@stylexjs/stylex'
import __style from './tools.module.css'
// ...
import { createSolidRenderer } from 'client/utils'
// ...
import { createToolbox } from '../utils'

export type LinkSavedData = {
  link: string
}

type LinkBlockOptions = BlockToolConstructorOptions<LinkSavedData, {}>

const style = stylex.create({
  input: {
    width: '100%',
    resize: 'vertical',
    paddingInline: 10,
    paddingBlock: 5,
    border: 'none',
    backgroundColor: 'var(--gray3)',
    color: 'var(--gray12)',
    outline: 'none',
    borderRadius: 7,
    fontSize: 12,
    fontFamily: 'Menlo,Monaco,Consolas,Courier New,monospace',
    lineHeight: 1.25
  }
})

export class LinkBlock {
  static readonly isReadOnlySupported = true
  static readonly toolbox = createToolbox('Link', /*html*/`
    <svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg">
      <path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/>
    </svg>  
  `)

  constructor(protected options: LinkBlockOptions) {}

  protected input$!: Ref<"input">
  protected dispose$!: () => void
  render() {
    const [element, dispose] = createSolidRenderer(() => (
      <input 
        {...stylex.attrs(style.input)} 
        placeholder='Enter some link into here' 
        readonly={this.options.readOnly}
        value={this.options.data.link}
        ref={this.input$} 
      />
    ), { class: __style.tool })

    this.dispose$ = dispose
    return element
  }

  save(): LinkSavedData {
    return {
      link: this.input$.value
    }
  }

  destroy() {
    this.dispose$()
    this.input$ = null as unknown as HTMLInputElement
  }
}