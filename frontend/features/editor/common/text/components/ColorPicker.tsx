import { createSignal, ParentProps } from "solid-js"
import { BsPaletteFill } from "solid-icons/bs"
// ...
import { ContextMenuItemIcon, ContextMenuPortal, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, DropdownMenuGroupLabel, HexColorInput } from "~/components"
// ...
import { ITextContext, TextOption } from "../provider"
import { handle } from "../utils"

import stylex from "@stylexjs/stylex"

const style = stylex.create({
  input: {
    padding: 10
  }
})

export function createColorPicker(dataIn: TextOption, currentIndex: number, updateDataFn: ITextContext["updateData$"]) {
  const [color, setColor] = createSignal(dataIn.color ?? '#000000')

  const [bgColor, setBgColor] = createSignal(dataIn.bgColor ?? '#000000')

  const updateTextColor = handle((input: string) => {
    updateDataFn(currentIndex, {
      color: input
    })
  }, setColor) 

  const updateBackgroundColor = handle((input: string) => {
    updateDataFn(currentIndex, {
      bgColor: input
    })
  }, setBgColor) 

  const ColorSubMenu = (props: ParentProps) => (
    <ContextMenuSub overlap>
      <ContextMenuSubTrigger>
        <ContextMenuItemIcon>
          <BsPaletteFill />
        </ContextMenuItemIcon>
        Colors
      </ContextMenuSubTrigger>
      <ContextMenuPortal>
        <ContextMenuSubContent>
          {props.children}
        </ContextMenuSubContent>
      </ContextMenuPortal>
    </ContextMenuSub>
  )

  const ColorPickerSubMenu = () => (
    <ColorSubMenu>
      <DropdownMenuGroupLabel>
        Text color
      </DropdownMenuGroupLabel>
      <HexColorInput 
        {...stylex.attrs(style.input)}
        color$={color} 
        setColor$={updateTextColor} 
        onReset$={() => {
          updateDataFn(currentIndex, {
            color: ''
          })
        }}
      />
      <br />
      <DropdownMenuGroupLabel>
        Background color
      </DropdownMenuGroupLabel>
      <HexColorInput 
        {...stylex.attrs(style.input)}
        color$={bgColor} 
        setColor$={updateBackgroundColor} 
        onReset$={() => {
          updateDataFn(currentIndex, {
            bgColor: ''
          })
        }}
      />
    </ColorSubMenu>
  )

  return {
    ColorPickerSubMenu$: ColorPickerSubMenu
  }
}