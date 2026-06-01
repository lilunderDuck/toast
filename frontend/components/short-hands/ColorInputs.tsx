import type { Accessor, Setter } from "solid-js"
import { HexColorPicker, HexColorInput as _HexColorInput } from 'solid-colorful'
import { BsX } from "solid-icons/bs"
// ...
import { css } from "molcss"
import "./ColorInputs.css"
// ...
import { Tooltip, HoverCard, HoverCardTrigger, HoverCardContent } from "../ui"
import type { HoverCardRootProps } from "@kobalte/core/hover-card"

const colorInput = css`
  margin-top: 10px;
  gap: 15px;
  display: "flex";
  align-items: 'center';
`

const colorInput__input = css`
  width: 100%;
  font-size: 15px;
  padding-inline: 10px;
  padding-block: 5px;
  border-radius: 6px;
  background-color: var(--surface0);
  &:focus {
    outline: none
  }
`

const colorInput__colorPreview = css`
  width: 25px;
  height: 25px;
  background-color: var(--color);
  border-radius: 50%;
  flex-shrink: 0;
  transition: outline-color 0.25s ease-out;
  outline: 2px solid transparent;
  &:hover {
    outline-color: var(--overlay1);
  }
`

const colorInput__resetButton = css`
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  background-color: var(--surface0);
  color: var(--subtext0);
  &:hover {
    background-color: var(--surface1);
    color: var(--text);
  }
`

const colorInput__popoverCardContent = css`
  width: 15rem;
`

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
      <div class={colorInput}>
        <_HexColorInput 
          color={props.color$()} 
          onChange={props.setColor$}
          class={colorInput__input}
        />
        <div>
          <Tooltip label$="Reset color">
            <button 
              class={colorInput__resetButton}
              onClick={() => {
                props.setColor$("#000000")
                props.onReset$?.()
              }} 
            >
              <BsX size={20} />
            </button>
          </Tooltip>
        </div>
        <div class={colorInput__colorPreview} style={{
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
        class={colorInput__colorPreview}
      />
      <HoverCardContent class={colorInput__popoverCardContent}>
        <HexColorInput {...props} />
      </HoverCardContent>
    </HoverCard>
  )
}