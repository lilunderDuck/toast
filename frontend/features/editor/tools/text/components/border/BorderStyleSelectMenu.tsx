import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "~/components"

import stylex from "@stylexjs/stylex"

const style = stylex.create({
  content: {
    textTransform: 'capitalize'
  },
  input: {
    minWidth: '5rem'
  }
})

interface IBorderStyleSelectMenuProps {
  // define your component props here
  onChange$(value: string | null): void
  placeholder$: string
  defaultValue$: string
}

export default function BorderStyleSelectMenu(props: IBorderStyleSelectMenuProps) {
  return (
    <Select<string>
      onChange={props.onChange$}
      options={[
        props.placeholder$,
        "solid", "dashed", "dotted"
      ]}
      defaultValue={props.defaultValue$}
      placeholder={props.placeholder$}
      // @ts-ignore
      itemComponent={(props) => (
        <SelectItem item={props.item}>
          {props.item.rawValue}
        </SelectItem>
      )}
    >
      <SelectTrigger {...stylex.attrs(style.input)}>
        <SelectValue<string>>
          {(state) => state.selectedOption()}
        </SelectValue>
      </SelectTrigger>
      <SelectContent {...stylex.attrs(style.content)} />
    </Select>
  )
}