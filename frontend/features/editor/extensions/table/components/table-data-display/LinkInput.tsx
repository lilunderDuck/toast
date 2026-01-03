import { Popover, PopoverTrigger } from "~/components";
import type { ITableDataTypeComponentProps } from "./TableDataItem";
import LinkInputPopover from "./LinkInputPopover"
import { createSignal, Show } from "solid-js";
import { useEditorContext } from "~/features/editor/provider";

export default function LinkInput(props: ITableDataTypeComponentProps<string>) {
  const [link, setLink] = createSignal(props.value$)

  const { isReadonly$ } = useEditorContext()

  return (
    <Show when={isReadonly$()} fallback={
      <Popover>
        <PopoverTrigger as="a">
          {link()}
        </PopoverTrigger>
        <LinkInputPopover
          value$={link()}
          onChange$={(value) => {
            setLink(value)
            console.log(value)
          }}
        />
      </Popover>
    }>
      <a>
        {link()}
      </a>
    </Show>
  )
}