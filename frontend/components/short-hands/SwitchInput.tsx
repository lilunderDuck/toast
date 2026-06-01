import { createSignal } from "solid-js"
// ...
import "./SwitchInput.css"
import { css } from "molcss"

const switch__this = css`
  position: relative;
  display: inline-block;
  width: var(--switch-width);
  height: var(--switch-height);
`

const switch__input = css`
  opacity: 0;
  width: 0;
  height: 0;
`

const switch__slider = css`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--switch-inactive-color);
  -webkit-transition: .4s;
  transition: .4s;
  border-radius: var(--switch-height);
`

interface ISwitchInputProps {
  value$?: boolean
  onChange$(value: boolean): any
}

export function SwitchInput(props: ISwitchInputProps) {
  console.log("initial switch state:", props.value$)
  const [state, setState] = createSignal(props.value$ ?? false)

  return (
    <label class={switch__this} data-switch>
      <input 
        class={switch__input} 
        type="checkbox"
        id="switch__input"
        checked={state()}
        onChange={() => {
          setState(prev => !prev)
          props.onChange$(state())
        }}
      />
      <span 
        class={switch__slider}
        id="switch__slider"
      />
    </label>
  )
}