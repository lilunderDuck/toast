import stylex from "@stylexjs/stylex"
import { Accessor, For, Setter } from "solid-js"
// ...
import { FlexCenterY, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components"
// ...
import { solid_icon } from "../../assets"
import libraries from "../../data/libraries.json"
import LibaryUsedBox from "./LibaryUsedBox"

const style = stylex.create({
  page: {
    paddingInline: 15,
    paddingTop: 10,
    width: '100%',
    height: '100%'
  },
  libList: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr'
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
      <div {...stylex.attrs(style.libList)} app-scrollbar app-scrollbar-vertical>
        <For each={libraries}>
          {it => (
            <LibaryUsedBox 
              {...it} 
              url={it.homepageUrl}
              iconUrl={it.name.includes('solid') ? solid_icon : ''} 
            />
          )}
        </For>
      </div>
    </>
  )
}