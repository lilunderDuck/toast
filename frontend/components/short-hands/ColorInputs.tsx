import type { Accessor, Setter } from "solid-js"
import { HexColorPicker, HexColorInput as _HexColorInput } from 'solid-colorful'
import { BsX } from "solid-icons/bs"
// ...
import stylex from "@stylexjs/stylex"
import "./ColorInputs.css"
// ...
import { Button, Tooltip, HoverCard, HoverCardTrigger, HoverCardContent } from "../ui"

const style = stylex.create({
  wholeColorInput: {
    marginTop: 10,
    gap: 15,
    display: "flex",
    alignItems: 'center',
  },
  colorPicker: {
    width: '100%'
  },
  input: {
    width: '100%',
    fontSize: 15,
    paddingInline: 15,
    backgroundColor: 'var(--gray4)',
    ':focus': {
      outline: 'none'
    }
  },
  colorPreview: {
    width: 25,
    height: 25,
    backgroundColor: 'var(--color)',
    borderRadius: 6,
    flexShrink: 0,
    transition: "0.25s ease-out",
    border: "2px solid transparent",
    ":hover": {
      borderColor: "var(--gray8)"
    }
  },
  resetButton: {
    flexShrink: 0
  },
  popoverCard_content: {
    width: "15rem"
  }
})

interface IHexColorInputProps {
  color$: Accessor<string>
  setColor$: Setter<string>
  onReset$?: () => void
  class?: string
}

export function HexColorInput(props: IHexColorInputProps) {
  return (
    <div class={props.class}>
      <HexColorPicker color={props.color$()} onChange={props.setColor$} />
      <div {...stylex.attrs(style.wholeColorInput)}>
        <_HexColorInput 
          color={props.color$()} 
          onChange={props.setColor$}
          {...stylex.attrs(style.input)}
        />
        <div {...stylex.attrs(style.resetButton)}>
          <Tooltip label$="Reset color">
            <Button 
              size$={ButtonSize.ICON} 
              onClick={() => {
                props.setColor$("#000000")
                props.onReset$?.()
              }} 
            >
              <BsX />
            </Button>
          </Tooltip>
        </div>
        <div {...stylex.attrs(style.colorPreview)} style={{
          '--color': props.color$()
        }} />
      </div>
    </div>
  )
}

export function PopoverHexColorInput(props: IHexColorInputProps) {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <button {...stylex.attrs(style.colorPreview)} style={{
          '--color': props.color$()
        }} />
      </HoverCardTrigger>
      <HoverCardContent {...stylex.attrs(style.popoverCard_content)}>
        <HexColorInput {...props} />
      </HoverCardContent>
    </HoverCard>
  )
}