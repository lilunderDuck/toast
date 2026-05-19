import type { Accessor, Setter } from "solid-js"
import { HexColorPicker, HexColorInput as _HexColorInput } from 'solid-colorful'
import { BsX } from "solid-icons/bs"
// ...
import stylex from "@stylexjs/stylex"
import "./ColorInputs.css"
// ...
import { Tooltip, HoverCard, HoverCardTrigger, HoverCardContent } from "../ui"
import type { HoverCardRootProps } from "@kobalte/core/hover-card"

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
    paddingInline: 10,
    paddingBlock: 5,
    borderRadius: 6,
    backgroundColor: 'var(--surface0)',
    ':focus': {
      outline: 'none'
    }
  },
  colorPreview: {
    width: 25,
    height: 25,
    backgroundColor: 'var(--color)',
    borderRadius: "50%",
    flexShrink: 0,
    transition: "outline-color 0.25s ease-out",
    outline: "2px solid transparent",
    ":hover": {
      outlineColor: "var(--overlay1)"
    }
  },
  resetButton: {
    flexShrink: 0,
    width: 28,
    height: 28,
    backgroundColor: 'var(--surface0)',
    color: "var(--subtext0)",
    ":hover": {
      backgroundColor: 'var(--surface1)',
      color: "var(--text)",
    }
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
        <div>
          <Tooltip label$="Reset color">
            <button 
              {...stylex.attrs(style.resetButton)}
              onClick={() => {
                props.setColor$("#000000")
                props.onReset$?.()
              }} 
            >
              <BsX size={20} />
            </button>
          </Tooltip>
        </div>
        <div {...stylex.attrs(style.colorPreview)} style={{
          '--color': props.color$()
        }} />
      </div>
    </div>
  )
}

interface IHoveredHexColorInputProps extends IHexColorInputProps {
  onOpen$?: HoverCardRootProps["onOpenChange"]
}

export function HoveredHexColorInput(props: IHoveredHexColorInputProps) {
  return (
    <HoverCard openDelay={10} closeDelay={10} onOpenChange={props.onOpen$}>
      <HoverCardTrigger 
        as="button" 
        style={`--color:${props.color$()}`} 
        {...stylex.attrs(style.colorPreview)}
      />
      <HoverCardContent {...stylex.attrs(style.popoverCard_content)}>
        <HexColorInput {...props} />
      </HoverCardContent>
    </HoverCard>
  )
}