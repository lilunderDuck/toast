import { createSignal } from "solid-js"
import { BsPaletteFill } from "solid-icons/bs"
// ...
import { ITextContext, TextOption } from "../../provider"
import { handle } from "../../utils"
import ColorPickerSubMenu from "./ColorPickerSubMenu"
import ColorPickerSubContent from "./ColorPickerSubContent"

export function createColorPicker(
  dataIn: TextOption, 
  currentIndex: number, 
  updateDataFn: ITextContext["updateData$"]
) {
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

  return () => (
    <>
      <ColorPickerSubMenu icon$={BsPaletteFill} text$="Text color">
        <ColorPickerSubContent 
          color$={color} 
          setColor$={updateTextColor} 
          resetColor$={() => updateDataFn(currentIndex, {
            color: ''
          })} 
        />
      </ColorPickerSubMenu>
      <ColorPickerSubMenu icon$={BsPaletteFill} text$="Background color">
        <ColorPickerSubContent 
          color$={bgColor} 
          setColor$={updateBackgroundColor} 
          resetColor$={() => updateDataFn(currentIndex, {
            bgColor: ''
          })} 
        />
      </ColorPickerSubMenu>
    </>
  )
}