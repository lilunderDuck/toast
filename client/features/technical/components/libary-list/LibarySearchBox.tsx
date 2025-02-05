import stylex from "@stylexjs/stylex"
import __scrollbarStyle from '~/assets/style/scrollbar.module.css'
// ...
import { FlexCenterY, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "client/components"
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

interface ISelectBoxOptions {
  onSelect$(value: string | null): any
  placeholder$: string
  options$: string[]
}

interface ILibarySearchBoxProps {
  title$: string
  selectBox$: ISelectBoxOptions
}

export function LibarySearchBox(props: ILibarySearchBoxProps) {
  const callEvent = props.selectBox$.onSelect$

  const onSomethingSelected = (value: string | null) => {
    if (value === props.selectBox$.placeholder$) {
      return callEvent(null)
    }

    callEvent(value)
  }
  
  return (
    <>
      <FlexCenterY as$="h1" {...stylex.attrs(style.heading)}>
        {props.title$}
        <Select<string>
          onChange={onSomethingSelected}
          options={[props.selectBox$.placeholder$, ...props.selectBox$.options$]}
          placeholder={props.selectBox$.placeholder$}
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