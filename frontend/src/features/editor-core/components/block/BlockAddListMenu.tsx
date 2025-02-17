import stylex from "@stylexjs/stylex"
import { createSignal, For, JSX } from "solid-js"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Input } from "~/components"
import { useEditorContext } from "~/features/editor-core/provider"

const style = stylex.create({
  menu: {
    width: '12rem'
  },
  input: {
    fontSize: 14
  }
})

interface IBlockAddListMenuProps {
  trigger$: JSX.Element
}

export default function BlockAddListMenu(props: IBlockAddListMenuProps) {
  const { blockSetting$, blocks$ } = useEditorContext()
  const original = Object.entries(blockSetting$)
  const [options, setOptions] = createSignal(original)

  let inputRef!: Ref<"input">
  let interval = 0
  const somethingSelected = (blockType: string) => () => {
    blocks$.insert$(null, parseInt(blockType))
    clearInterval(interval)
  }

  const onSlapKeyboardToSearch: EventHandler<"input", "onInput"> = (inputEvent) => {
    const value = inputEvent.currentTarget.value
    if (value === '') {
      return resetOptionMenu()
    }
    
    setOptions(prev => prev.filter(it => it.includes(value)))
  }

  const resetOptionMenu = () => setOptions(original)

  const keepFocusTilMenuClose = () => {
    resetOptionMenu()

    // absolutely force focus the input because I don't know why it automatically unfocus
    interval = setInterval(() => {
      inputRef.focus()
    }, 1000)
  }

  return (
    <DropdownMenu placement="bottom-end">
      <DropdownMenuTrigger as="div">
        {props.trigger$}
      </DropdownMenuTrigger>
      <DropdownMenuContent {...stylex.attrs(style.menu)}>
        {
          void keepFocusTilMenuClose()
        }

        <Input 
          {...stylex.attrs(style.input)} 
          onInput={onSlapKeyboardToSearch} 
          placeholder="Search something" 
          ref={inputRef}
        />

        <For each={options()} fallback={
          <span>Nothing here...</span>
        }>
          {([blockType, blockOptions]) => (
            <DropdownMenuItem onClick={somethingSelected(blockType)}>
              {blockOptions.displayName$}
            </DropdownMenuItem>
          )}
        </For>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}