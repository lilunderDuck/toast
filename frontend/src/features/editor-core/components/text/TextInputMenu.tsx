import stylex from "@stylexjs/stylex"
import { createSignal, Setter } from "solid-js"
import {
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuGroupLabel,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "~/components"
import { TextData } from "./data"
import { useTextDataContext } from "./TextProvider"
import { SubOrSupscript } from "./data"

const style = stylex.create({
  menu: {
    width: '12rem'
  }
})

interface ITextInputMenuProps {
  data$: TextData
  currentIndex$: number
  setData$: Setter<TextData>
}

export default function TextInputMenu(props: ITextInputMenuProps) {
  const { updateData$, focusState$ } = useTextDataContext()
  const [, setIsFocused] = focusState$

  const [bold, setBold] = createSignal(props.data$?.bold ?? false)
  const [italic, setItalic] = createSignal(props.data$?.italic ?? false)
  const [strikethrough, setStrikethrough] = createSignal(props.data$?.strikethrough ?? false)
  const [underline, setUnderline] = createSignal(props.data$?.underline ?? false)
  const [subOrSuperscript, setSubOrSuperscript] = createSignal<string>(SubOrSupscript.none + '')

  type Handler = (input: any) => void
  const handle = (fn: AnyFunction, signal: Setter<any>): Handler => {
    return (input) => {
      fn(input)
      signal(input)
    }
  }

  const _setBold = handle((input: boolean) => {
    updateData$(props.currentIndex$, {
      bold: input
    })
  }, setBold)

  const _setItalic = handle((input: boolean) => {
    updateData$(props.currentIndex$, {
      italic: input
    })
  }, setItalic)

  const _setStrikethrough = handle((input: boolean) => {
    updateData$(props.currentIndex$, {
      strikethrough: input
    })
  }, setStrikethrough)

  const _setUnderline = handle((input: boolean) => {
    updateData$(props.currentIndex$, {
      underline: input
    })
  }, setUnderline)

  const _setSubOrSuperscript = handle((input: string) => {
    const mode = parseInt(input) as SubOrSupscript
    updateData$(props.currentIndex$, {
      subOrSupscript: mode
    })
  }, setSubOrSuperscript)

  return (
    <DropdownMenuContent 
      {...stylex.attrs(style.menu)}
    >
      <DropdownMenuGroup>
        <DropdownMenuGroupLabel>
          Text styles
        </DropdownMenuGroupLabel>
        <DropdownMenuCheckboxItem checked={bold()} onChange={_setBold}>
          Bold
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={italic()} onChange={_setItalic}>
          Italic
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={strikethrough()} onChange={_setStrikethrough}>
          Strikethrough
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={underline()} onChange={_setUnderline}>
          Underline
        </DropdownMenuCheckboxItem>
        {/* ... */}
        <DropdownMenuSub overlap>
          <DropdownMenuSubTrigger>Colors</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Nothing here</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        {/* ... */}
        <DropdownMenuRadioGroup value={subOrSuperscript()} onChange={_setSubOrSuperscript}>
          <DropdownMenuRadioItem value={SubOrSupscript.none + ''}>
            None
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={SubOrSupscript.subscript + ''}>
            Subscript
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={SubOrSupscript.superscript + ''}>
            Superscript
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  )
}