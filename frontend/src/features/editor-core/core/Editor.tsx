import { For, Show } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./Editor.module.css"
// ...
import { type IBlockData, useEditorContext } from "../provider"
import { dontUpdateIfYouPressSomeKey, editor_warn } from "../utils"
import { BlockButtonRow } from "../components"
import { debounce } from "~/utils"

const style = stylex.create({
  editor: {
    paddingInline: 10,
  },
  blockList: {
    width: '100%',
    height: '100%',
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
  const { blocks$, blockSetting$, buttonRow$, isReadonly$, update$ } = useEditorContext()

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
      <Show when={isReadonly$()} fallback={
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

  const updateDebouce = debounce(update$, 1000)

  const onPressingYourKeyboard: EventHandler<"div", "onKeyUp"> = (keyboardEvent) => {
    const keyYouJustPress = keyboardEvent.key.toLowerCase()
    if (dontUpdateIfYouPressSomeKey(keyYouJustPress)) {
      return // don't call update
    }

    updateDebouce()
  }

  return (
    <div {...stylex.attrs(style.editor)}>
      <div onKeyUp={onPressingYourKeyboard}>
        <For each={blocks$.data$()}>
          {it => <EditorBlock {...it} />}
        </For>
      </div>
      <Show when={!isReadonly$()}>
        <div {...stylex.attrs(style.blockSetting)} style={{
          '--y': `${buttonRow$.currentButtonRowYPos$().y}px`,
          // '--x': `${buttonRow$.currentButtonRowYPos$().x}px`,
          '--x': `0px`,
        }}>
          <BlockButtonRow />
        </div>
      </Show>
    </div>
  )
}