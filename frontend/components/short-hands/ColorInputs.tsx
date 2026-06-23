import type { Accessor, Setter } from "solid-js"
import { HexColorPicker, HexColorInput as _HexColorInput } from 'solid-colorful'
import type { HoverCardRootProps } from "@kobalte/core/hover-card"
// ...
import { css } from "molcss"
import "./ColorInputs.css"
// ...
import { HoverCard, HoverCardTrigger, HoverCardContent } from "../ui"

const colorInput = css`
  margin-top: 10px;
  gap: 15px;
  display: flex;
  align-items: center;
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

const colorInput__popoverCardContent = css`
  width: 15rem;
  padding-inline: 10px;
  padding-block: 15px;
`

interface IHexColorInputProps {
  color$: Accessor<string>
  setColor$: Setter<string>
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
        <div class={colorInput__colorPreview} style={`--color:${props.color$()}`} />
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