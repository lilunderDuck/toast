import { createSignal, type Setter } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
// ...
import {
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuGroupLabel,
  ContextMenuItemIcon,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "~/components"
// ...
import { useTextDataContext, SubOrSupscript, TextOption } from "../provider"
import { createBorder, createColorPicker, createPadding } from "../components"

const style = stylex.create({
  menu: {
    width: '12rem'
  },
  menuSubContent: {
    paddingLeft: '2rem',
    paddingBlock: '.5rem'
  }
})

interface ITextInputMenuProps {
  data$: TextOption
  currentIndex$: number
  setData$: Setter<TextOption>
}

export default function TextInputMenu(props: ITextInputMenuProps) {
  const { updateData$ } = useTextDataContext()

  const [subOrSuperscript, setSubOrSuperscript] = createSignal<string>(SubOrSupscript.none + '')
  const { ColorPickerSubMenu$ } = createColorPicker(props.data$, props.currentIndex$, updateData$)
  const { PaddingSubMenu$ } = createPadding(props.data$, props.currentIndex$, updateData$)
  const { BorderSubMenu$ } = createBorder(props.data$, props.currentIndex$, updateData$)

  type Handler = (input: any) => void
  const handle = (fn: AnyFunction, signal: Setter<any>): Handler => {
    return (input) => {
      fn(input)
      signal(input)
    }
  }
  
  const _setSubOrSuperscript = handle((input: string) => {
    const mode = parseInt(input) as SubOrSupscript
    updateData$(props.currentIndex$, {
      subOrSupscript: mode
    })
  }, setSubOrSuperscript)

  return (
    <ContextMenuContent {...stylex.attrs(style.menu)}>
      <ContextMenuGroup>
        <ContextMenuGroupLabel>
          Text stuff
        </ContextMenuGroupLabel>
        <ColorPickerSubMenu$ />
        <PaddingSubMenu$ />
        <BorderSubMenu$ />
      </ContextMenuGroup>
      {/* ... */}
      <ContextMenuGroup>
        <ContextMenuGroupLabel>
          Subscript and superscript
        </ContextMenuGroupLabel>
        <ContextMenuRadioGroup value={subOrSuperscript()} onChange={_setSubOrSuperscript}>
          <ContextMenuRadioItem value={SubOrSupscript.none + ''}>
            None
          </ContextMenuRadioItem>
          <ContextMenuRadioItem value={SubOrSupscript.subscript + ''}>
            Subscript
          </ContextMenuRadioItem>
          <ContextMenuRadioItem value={SubOrSupscript.superscript + ''}>
            Superscript
          </ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuGroup>
    </ContextMenuContent>
  )
}