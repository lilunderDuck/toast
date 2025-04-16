import { Accessor } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { Handler } from "../../utils"
import { HexColorInput } from "~/components"

interface IColorPickerSubContentProps {
  color$: Accessor<string>
  setColor$: Handler
  resetColor$: () => void
}

const style = stylex.create({
  input: {
    padding: 10
  }
})

export default function ColorPickerSubContent(props: IColorPickerSubContentProps){
  return (
    <>
      <HexColorInput 
        {...stylex.attrs(style.input)}
        color$={props.color$} 
        setColor$={props.setColor$} 
        onReset$={props.resetColor$}
      />
    </>
  )
}