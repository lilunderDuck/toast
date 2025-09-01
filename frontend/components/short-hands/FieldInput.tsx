import { TextField as Kobalte } from '@kobalte/core'
import stylex from '@stylexjs/stylex'
import { type JSX, Show, splitProps } from 'solid-js'
import __style from './FieldInput.module.css'

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

const style = stylex.create({
  input: {
    paddingInline: 10,
    paddingBlock: 6,
    borderRadius: 6,
    outline: 'none',
    backgroundColor: 'var(--gray4)',
    width: '100%',
    resize: 'none'
  },
  error: {
    color: 'var(--red10)',
    fontSize: 14
  }
})

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
      id={__style.fieldInput}
    >
      <Show when={props.label}>
        <Kobalte.Label>{props.label}</Kobalte.Label>
      </Show>
      <Show
        when={props.multiline}
        fallback={
          <Kobalte.Input {...inputProps} type={props.type} {...stylex.attrs(style.input)} />
        }
      >
        <Kobalte.TextArea {...inputProps} autoResize {...stylex.attrs(style.input)} />
      </Show>
      <Kobalte.ErrorMessage {...stylex.attrs(style.error)}>
        {props.error}
      </Kobalte.ErrorMessage>
    </Kobalte.Root>
  )
}