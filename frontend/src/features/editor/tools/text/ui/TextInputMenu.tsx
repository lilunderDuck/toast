import stylex from "@stylexjs/stylex"
import { createSignal, type Setter } from "solid-js"
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuGroupLabel,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "~/components"
import { useTextDataContext, SubOrSupscript, TextData } from "../provider"

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
  data$: TextData
  currentIndex$: number
  setData$: Setter<TextData>
}

export default function TextInputMenu(props: ITextInputMenuProps) {
  const { updateData$ } = useTextDataContext()

  const [subOrSuperscript, setSubOrSuperscript] = createSignal<string>(SubOrSupscript.none + '')

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
    <DropdownMenuContent 
      {...stylex.attrs(style.menu)}
    >
      <DropdownMenuGroup>
        <DropdownMenuGroupLabel>
          Text colors
        </DropdownMenuGroupLabel>
        <DropdownMenuSub overlap>
          <DropdownMenuSubTrigger {...stylex.attrs(style.menuSubContent)}>
            Colors
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Nothing here</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuGroup>
      <DropdownMenuGroup>
        <DropdownMenuGroupLabel>
          Subscript and superscript
        </DropdownMenuGroupLabel>
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