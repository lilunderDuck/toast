export interface IPreviewable {
  preview$?: boolean
}

export interface ISettingSectionProps<T> {
  name$: string
  description$?: string
  settingKey$?: string
  disabled$?: boolean
  onChange$?: (value: T) => any
}

export type SettingSectionOptions = Pick<HTMLAttributes<"input">, "min" | "max" | "step" | "type">