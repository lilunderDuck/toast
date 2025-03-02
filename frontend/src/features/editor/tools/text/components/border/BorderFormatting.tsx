import { DropdownMenuGroupLabel, FlexCenterY, Tooltip } from "~/components";
import BorderItem from "./BorderItem";
import BorderStyleSelectMenu from "./BorderStyleSelectMenu";

import stylex from "@stylexjs/stylex"
import { createSignal } from "solid-js";
import { ITextContext, TextFormatting } from "../../provider";
import { handle } from "../../utils";

const style = stylex.create({
  wholeThing: {
    gap: 15
  },
  input: {
    width: '5rem'
  }
})

export default function createBorderFormatting(
  where: 'top' | 'left' | 'bottom' | 'right', 
  dataIn: TextFormatting, 
  currentIndex: number, 
  updateDataFn: ITextContext["updateData$"]
) {
  const [thiccness, setThiccness] = createSignal(dataIn.border ?? 0)
  const [radius, setRadius] = createSignal(dataIn.borderRadius ?? 0)
  const [color, setColor] = createSignal(dataIn.borderColor ?? '#000')
  const [borderStyle, setBorderStyle] = createSignal('')

  const updateBorderThiccness = handle((input: number) => {
    updateDataFn(currentIndex, {
      [where]: {
        border: input
      }
    })
  }, setThiccness)

  const updateBorderRadius = handle((input: number) => {
    updateDataFn(currentIndex, {
      [where]: {
        borderRadius: input
      }
    })
  }, setRadius)

  const updateBorderColor = handle((input: string) => {
    updateDataFn(currentIndex, {
      [where]: {
        borderColor: input
      }
    })
  }, setColor)

  const BORDER_STYLE_PLACEHOLDER = 'No style'
  const updateBorderStyle = handle((input: string) => {
    if (input === BORDER_STYLE_PLACEHOLDER) {
      return updateDataFn(currentIndex, {
        [where]: {
          borderStyle: ''
        }
      })
    }

    updateDataFn(currentIndex, {
      [where]: {
        borderStyle: input
      }
    })
  }, setBorderStyle)

  if (!dataIn.borderStyle) {
    setBorderStyle(BORDER_STYLE_PLACEHOLDER)
  }

  return () => (
    <>
      <DropdownMenuGroupLabel>
        Border {where}
      </DropdownMenuGroupLabel>
      <FlexCenterY {...stylex.attrs(style.wholeThing)}>
        <div {...stylex.attrs(style.input)}>
          <Tooltip label$="Change border thiccness">
            <BorderItem 
              {...stylex.attrs(style.input)}
              value$={thiccness()} 
              onChange$={updateBorderThiccness} 
            />
          </Tooltip>
        </div>
        <Tooltip label$="Change border style">
          <BorderStyleSelectMenu 
            placeholder$={'Default'}
            defaultValue$={borderStyle()}
            onChange$={updateBorderStyle}
          />
        </Tooltip>
        <div {...stylex.attrs(style.input)}>
          <Tooltip label$="Change border radius">
            <BorderItem 
              {...stylex.attrs(style.input)}
              value$={radius()} 
              onChange$={updateBorderRadius} 
            />
          </Tooltip>
        </div>
      </FlexCenterY>
    </>
  )
}