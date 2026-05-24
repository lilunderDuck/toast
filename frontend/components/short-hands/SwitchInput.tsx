import stylex from "@stylexjs/stylex"
import "./SwitchInput.css"
import { createSignal } from "solid-js"

const style = stylex.create({
  switch: {
    position: 'relative',
    display: 'inline-block',
    width: 'var(--switch-width)',
    height: 'var(--switch-height)',
  },
  switch__input: {
    opacity: 0,
    width: 0,
    height: 0,
  },
  switch__slider: {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'var(--switch-inactive-color)',
    WebkitTransition: '.4s',
    transition: '.4s',
    borderRadius: 'var(--switch-height)'
  }
})

interface ISwitchInputProps {
  value$?: boolean
  onChange$(value: boolean): any
}

export function SwitchInput(props: ISwitchInputProps) {
  console.log("initial switch state:", props.value$)
  const [state, setState] = createSignal(props.value$ ?? false)

  return (
    <label {...stylex.attrs(style.switch)} data-switch>
      <input 
        {...stylex.attrs(style.switch__input)} 
        type="checkbox"
        id="switch__input"
        checked={state()}
        onChange={() => {
          setState(prev => !prev)
          props.onChange$(state())
        }}
      />
      <span 
        {...stylex.attrs(style.switch__slider)}
        id="switch__slider"
      />
    </label>
  )
}