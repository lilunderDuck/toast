import { createSignal } from "solid-js";
// ...
import stylex from "@stylexjs/stylex"
// ...
import { DropdownMenuGroupLabel, FlexCenterY, PopoverHexColorInput, Tooltip } from "~/components";
// ...
import BorderItem from "./BorderItem";
import BorderStyleSelectMenu from "./BorderStyleSelectMenu";
import { ITextContext, TextFormatting } from "../../provider";
import { handle } from "../../utils";

const style = stylex.create({
  wholeThing: {
    gap: 15
  },
  input: {
    width: '5rem'
  },
  colorPicker: {
    flexShrink: 1
  }
})

export default function createBorderFormatting(
  where: 'top' | 'left' | 'bottom' | 'right', 
  dataIn: TextFormatting, 
  currentIndex: number, 
  updateDataFn: ITextContext["updateData$"]
) {
  const BORDER_STYLE_PLACEHOLDER = 'default'

  const [thiccness, setThiccness] = createSignal(dataIn.border ?? 0)
  const [color, setColor] = createSignal(dataIn.borderColor ?? '#000')
  const [borderStyle, setBorderStyle] = createSignal(BORDER_STYLE_PLACEHOLDER)

  const updateBorderThiccness = handle((input: number) => {
    updateDataFn(currentIndex, {
      [where]: {
        border: input
      }
    })
  }, setThiccness)

  const updateBorderColor = handle((input: string) => {
    updateDataFn(currentIndex, {
      [where]: {
        borderColor: input
      }
    })
  }, setColor)

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
            placeholder$={BORDER_STYLE_PLACEHOLDER}
            defaultValue$={borderStyle()}
            onChange$={updateBorderStyle}
          />
        </Tooltip>
        <PopoverHexColorInput 
          color$={color} 
          setColor$={updateBorderColor} 
          onReset$={() => updateDataFn(currentIndex, {
            [where]: {
              borderColor: ""
            }
          })} 
        />
      </FlexCenterY>
    </>
  )
}