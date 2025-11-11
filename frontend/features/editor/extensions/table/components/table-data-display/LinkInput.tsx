import { Popover, PopoverTrigger } from "~/components";
import type { ITableDataTypeComponentProps } from "./TableDataItem";
import LinkInputPopover from "./LinkInputPopover"
import { createSignal } from "solid-js";

export default function LinkInput(props: ITableDataTypeComponentProps<string>) {
  const [link, setLink] = createSignal(props.value$)

  return (
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
  )
}