import { createSignal } from "solid-js";
import { BsBorderAll } from "solid-icons/bs";
// ...
import { 
  ContextMenuItemIcon, 
  ContextMenuPortal, 
  ContextMenuSub, 
  ContextMenuSubContent, 
  ContextMenuSubTrigger, 
  DropdownMenuGroupLabel,
  HexColorInput,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "~/components";
// ...
import { ITextContext, TextOption } from "../../provider";
import { handle } from "../../utils";
import BorderItem from "./BorderItem";
// ...
import stylex from "@stylexjs/stylex"

const style = stylex.create({
  colorPicker: {
    padding: 15
  },
  selectMenu: {
    textTransform: 'capitalize'
  }
})

export function createBorder(dataIn: TextOption, currentIndex: number, updateDataFn: ITextContext["updateData$"]) {
  const [thiccness, setThiccness] = createSignal(dataIn.border ?? 0)
  const [radius, setRadius] = createSignal(dataIn.borderRadius ?? 0)
  const [color, setColor] = createSignal(dataIn.borderColor ?? '#000')
  const [borderStyle, setBorderStyle] = createSignal('')

  const updateBorderThiccness = handle((input: number) => {
    updateDataFn(currentIndex, {
      border: input
    })
  }, setThiccness)

  const updateBorderRadius = handle((input: number) => {
    updateDataFn(currentIndex, {
      borderRadius: input
    })
  }, setRadius)

  const updateBorderColor = handle((input: string) => {
    updateDataFn(currentIndex, {
      borderColor: input
    })
  }, setColor)

  const BORDER_STYLE_PLACEHOLDER = 'No style'
  const updateBorderStyle = handle((input: string) => {
    if (input === BORDER_STYLE_PLACEHOLDER) {
      return updateDataFn(currentIndex, {
        borderStyle: ''
      })
    }

    updateDataFn(currentIndex, {
      borderStyle: input
    })
  }, setBorderStyle)

  if (!dataIn.borderStyle) {
    setBorderStyle(BORDER_STYLE_PLACEHOLDER)
  }

  const BorderStyleSelectMenu = () => (
    <Select<string>
      onChange={updateBorderStyle}
      options={[
        BORDER_STYLE_PLACEHOLDER,
        "solid", "dashed", "dotted"
      ]}
      defaultValue={borderStyle()}
      placeholder={BORDER_STYLE_PLACEHOLDER}
      // @ts-ignore
      itemComponent={(props) => (
        <SelectItem item={props.item}>
          {props.item.rawValue}
        </SelectItem>
      )}
    >
      <SelectTrigger>
        <SelectValue<string>>
          {(state) => state.selectedOption()}
        </SelectValue>
      </SelectTrigger>
      <SelectContent {...stylex.attrs(style.selectMenu)} />
    </Select>
  )

  const BorderSubMenu = () => (
    <ContextMenuSub overlap>
      <ContextMenuSubTrigger>
        <ContextMenuItemIcon>
          <BsBorderAll />
        </ContextMenuItemIcon>
        Border
      </ContextMenuSubTrigger>
      <ContextMenuPortal>
        <ContextMenuSubContent>
          <BorderItem label$="Border thiccness" value$={thiccness()} onChange$={updateBorderThiccness} />
          <BorderItem label$="Border radius" value$={radius()} onChange$={updateBorderRadius} />
          <DropdownMenuGroupLabel>
            Border style
          </DropdownMenuGroupLabel>
          <BorderStyleSelectMenu />
          
          <DropdownMenuGroupLabel>
            Border color
          </DropdownMenuGroupLabel>
          <HexColorInput 
            {...stylex.attrs(style.colorPicker)}
            color$={color} 
            setColor$={updateBorderColor} 
            onReset$={() => {
              updateDataFn(currentIndex, {
                borderColor: ''
              })
            }} 
          />
        </ContextMenuSubContent>
      </ContextMenuPortal>
    </ContextMenuSub>
  )

  return {
    BorderSubMenu$: BorderSubMenu
  }
}