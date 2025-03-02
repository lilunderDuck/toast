import { DropdownMenuGroupLabel, Input } from "~/components"

import stylex from "@stylexjs/stylex"

const style = stylex.create({
  item: {
    // ...
  }
})

interface IBorderItemProps {
  label$: string
  value$: number
  onChange$(value: number): void
}

export default function BorderItem(props: IBorderItemProps) {
  const changeStuff: EventHandler<"input", "onInput"> = (inputEvent) => {
    const currentValue = parseInt(inputEvent.currentTarget.value)
    if (isNaN(currentValue)) {
      return // you somehow hit this case and I don't know why
    }

    if (currentValue < 0) {
      return
    }

    props.onChange$(currentValue)
  }

  return (
    <div {...stylex.attrs(style.item)}>
      <DropdownMenuGroupLabel>
        {props.label$}
      </DropdownMenuGroupLabel>
      <Input 
        type="number" 
        placeholder="in pixels" 
        min={0} 
        onInput={changeStuff} 
        value={props.value$}
      />
    </div>
  )
}