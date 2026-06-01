import { TextField as Kobalte } from '@kobalte/core'
import { type JSX, Show, splitProps } from 'solid-js'
// ...
import { css } from 'molcss'
import './FieldInput.css'
// ...
import { Label } from './Label'

export type TextFieldInputRef = HTMLInputElement | HTMLTextAreaElement

export type TextFieldProps = {
  name: string
  type?: 'text' | 'email' | 'tel' | 'password' | 'url' | 'date' | undefined
  label?: string | undefined
  placeholder?: string | undefined
  value: string | undefined
  error: string
  autocomplete?: 'off' | 'on'
  multiline?: boolean | undefined
  required?: boolean | undefined
  disabled?: boolean | undefined
  ref: (element: TextFieldInputRef) => void
  onInput: JSX.EventHandler<TextFieldInputRef, InputEvent>
  onChange: JSX.EventHandler<TextFieldInputRef, Event>
  onBlur: JSX.EventHandler<TextFieldInputRef, FocusEvent>
}

const input = css`
  padding-inline: 10px;
  padding-block: 6px;
  border-radius: 6px;
  outline: none;
  background-color: var(--surface0);
  width: 100%;
  resize: none;
  &::placeholder {
    color: var(--subtext1);
  }
`

const input__error = css`
  color: var(--red);
  font-size: 14px;
`

export function FieldInput(props: TextFieldProps) {
  const [rootProps, inputProps] = splitProps(
    props,
    ['name', 'value', 'required', 'disabled'],
    ['placeholder', 'ref', 'onInput', 'onChange', 'onBlur', 'autocomplete']
  )

  return (
    <Kobalte.Root
      {...rootProps}
      validationState={props.error ? 'invalid' : 'valid'}
      id="fieldInput"
    >
      <Show when={props.label}>
        <Label>{props.label}</Label>
      </Show>
      <Show
        when={props.multiline}
        fallback={
          <Kobalte.Input 
            {...inputProps} 
            type={props.type} 
            class={`${input} fieldInput__input`} 
          />
        }
      >
        <Kobalte.TextArea 
          {...inputProps} 
          autoResize 
          class={`${input} fieldInput__input`} 
        />
      </Show>
      <Kobalte.ErrorMessage class={input__error}>
        {props.error}
      </Kobalte.ErrorMessage>
    </Kobalte.Root>
  )
}