import { Show } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./TagInput.module.css"
// ...
import { Popover, PopoverTrigger } from "~/components"
import { useEditorContext } from "~/features/editor/provider"
// ...
import { type TagData } from "../../../provider"
import type { ITableDataTypeComponentProps } from "../TableDataItem"
import TagInputPopover from "./TagInputPopover"
import { TagInputProvider } from "./TagInputProvider"
import { TagInputDisplay } from "./TagInputDisplay"

const style = stylex.create({
  tagInput: {
    // 
  },
  tagInput__display: {
    display: "flex",
    alignItems: "center",
    gap: 5
  },
  tagInput__label: {
    marginBlock: 10
  },
  tagInput__item: {
    justifyContent: "flex-start",
    width: "100%",
    gap: 10
  },
  tagInput__tagWrap: {
    position: "absolute",
    marginLeft: 15
  }
})

export default function TagInput(props: ITableDataTypeComponentProps<TagData[]>) {
  const { isReadonly$ } = useEditorContext()

  return (
    <div {...stylex.attrs(style.tagInput)}>
      {void console.log("[table] Additional data is:", props.additionalData$)}
      <TagInputProvider
        columnId$={props.columnKey$}
        options$={props.additionalData$.tags}
        value$={props.value$}
        onChange$={props.onChange$}
      >
        <Show when={isReadonly$()} fallback={
          <Popover>
            <PopoverTrigger as="div" {...stylex.attrs(style.tagInput__display)}>
              <TagInputDisplay />
            </PopoverTrigger>
            <TagInputPopover />
          </Popover>
        }>
          <TagInputDisplay />
        </Show>
      </TagInputProvider>
    </div>
  )
}