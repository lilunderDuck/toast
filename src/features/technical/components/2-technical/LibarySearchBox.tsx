import { Accessor, Setter } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import __scrollbarStyle from '~/assets/style/scrollbar.module.css'
// ...
import { FlexCenterY, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components"
// ...

const style = stylex.create({
  page: {
    paddingInline: 15,
    paddingTop: 10,
    width: '100%',
    height: '100%'
  },
  heading: {
    gap: 15
  }
})

interface ILibarySearchBoxProps {
  $title: string
  $onSelect: Setter<string | undefined>
  $placeholder: string
  $value: Accessor<string | undefined>
  $options: string[]
}

export function LibarySearchBox(props: ILibarySearchBoxProps) {
  return (
    <>
      <FlexCenterY $as="h1" {...stylex.attrs(style.heading)}>
        {props.$title}
        <Select<string>
          value={props.$value()}
          onChange={props.$onSelect}
          options={props.$options}
          placeholder={props.$placeholder}
          // @ts-ignore
          itemComponent={(props) => (
            <SelectItem item={props.item}>
              {props.item.rawValue}
            </SelectItem>
          )}
        >
          <SelectTrigger>
            <SelectValue<string>>
              {(state) => state.selectedOption()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent />
        </Select>
      </FlexCenterY>
    </>
  )
}