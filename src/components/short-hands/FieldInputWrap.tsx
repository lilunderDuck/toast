import { Component, Show, splitProps, type JSX } from "solid-js"
import { Dynamic } from "solid-js/web"
import { FieldPath, FieldStore, FieldValues } from "@modular-forms/solid"
// ...
import stylex from "@stylexjs/stylex"
import __style from './FieldInput.module.css'

export interface IFieldInput {
  type: 'text' | 'email' | 'tel' | 'password' | 'url' | 'date';
  label?: string;
  required?: boolean;
  placeholder?: string;
}

interface IFieldInputProps<T extends FieldValues = FieldValues> extends IFieldInput {
  field: FieldStore<T, FieldPath<T>>
  ref: (element: HTMLInputElement) => void;
  onInput: JSX.EventHandler<HTMLInputElement, InputEvent>;
  onChange: JSX.EventHandler<HTMLInputElement, Event>;
  onBlur: JSX.EventHandler<HTMLInputElement, FocusEvent>;
  $InputComponent: Component
}

const style = stylex.create({
  error: {
    color: 'var(--red9)'
  }
})

export function FieldInputWrap<T extends FieldValues>(props: IFieldInputProps<T>) {
  const [, inputProps] = splitProps(props, ['field', 'label', '$InputComponent'])

  return (
    <div id={__style.fieldInput}>
      <label>{props.label}</label>
      <Dynamic component={props.$InputComponent} {...inputProps} />
      
      <Show when={props.field.error}>
        <span {...stylex.attrs(style.error)}>
          {props.field.error}
        </span>
      </Show>
    </div>
  )
}