import { For, Show } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./Editor.module.css"
// ...
import { type IBlockData, useEditorContext } from "./provider"
import { editor_log, editor_warn } from "./utils"
import { BlockButtonRow } from "./components"

const style = stylex.create({
  editor: {
    // ...
  },
  blockSetting: {
    position: 'absolute',
    transform: 'translate(calc(var(--x) * -1), var(--y))',
    right: 0,
    top: 0,
    willChange: 'transform'
  }
})

export function Editor() {
  const { blocks$, blockSetting$, buttonRow$, readonly$ } = useEditorContext()

  const mouseHoverTheBlock: EventHandler<"div", "onMouseEnter"> = (mouseEvent) => {
    const currentTarget = mouseEvent.currentTarget
    buttonRow$.updatePosition$(currentTarget)
  }

  const EditorBlock = (props: IBlockData) => {
    const BlockComponent = blockSetting$[props.type]?.blockComponent$
    if (!BlockComponent) {
      editor_warn("could not find block component for block type:", props)
      return undefined
    }
  
    return (
      <Show when={readonly$()} fallback={
        <div id={__style.block} data-id={props.id} onMouseEnter={mouseHoverTheBlock}>
          <BlockComponent dataIn$={props.data} blockId$={props.id} />
        </div>
      }>
        <div id={__style.block}>
          <BlockComponent dataIn$={props.data} blockId$={props.id} />
        </div>
      </Show>
    )
  }

  setInterval(() => {
    editor_log(blocks$.data$())
  }, 5000)

  return (
    <div {...stylex.attrs(style.editor)}>
      <For each={blocks$.data$()}>
        {it => <EditorBlock {...it} />}
      </For>
      <Show when={!readonly$()}>
        <div {...stylex.attrs(style.blockSetting)} style={{
          '--y': `${buttonRow$.currentButtonRowYPos$().y}px`,
          '--x': `${buttonRow$.currentButtonRowYPos$().x}px`,
        }}>
          <BlockButtonRow />
        </div>
      </Show>
    </div>
  )
}