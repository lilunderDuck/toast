import { usePopoverContext } from "@kobalte/core/popover"
import { onMount } from "solid-js"
// ...
import { Button, ButtonRow, Label, Input, PopoverContent } from "~/components"
// ...
import stylex from "@stylexjs/stylex"

const style = stylex.create({
  linkInput__input: {
    color: "var(--blue9)"
  }
})

interface ILinkInputPopoverProps {
  value$?: string
  onChange$(newUrl: string): any
}

export default function LinkInputPopover(props: ILinkInputPopoverProps) {
  const { close: closePopover } = usePopoverContext()
  let inputRef!: Ref<"input">

  onMount(() => {
    inputRef?.focus()
  })

  const keypressHandler: EventHandler<"input", "onKeyUp"> = (keyboardEvent) => {
    const keyPressed = keyboardEvent.key.toLowerCase()
    switch (keyPressed) {
      case "escape": return closePopover()
      case "enter": return callEventThenClose()
    }
  }

  const callEventThenClose = () => {
    props.onChange$(inputRef.value)
    closePopover()
  }

  return (
    <PopoverContent>
      <Label>
        Enter a new url
      </Label>
      <Input
        type="url"
        value={props.value$}
        onKeyUp={keypressHandler}
        ref={inputRef}
        {...stylex.attrs(style.linkInput__input)}
      />
      <ButtonRow>
        <Button
          variant$={ButtonVariant.DANGER}
          size$={ButtonSize.SMALL}
          onClick={closePopover}
        >
          Discard
        </Button>
        <Button
          variant$={ButtonVariant.DEFAULT}
          size$={ButtonSize.SMALL}
          onClick={callEventThenClose}
        >
          Save
        </Button>
      </ButtonRow>
    </PopoverContent>
  )
}