import { For } from "solid-js"
// ...
import { bodyClasslist, mergeClassname } from "~/utils"
import type { LibaryData } from "~/api/misc"
// ...
import __scrollbarStyle from '~/assets/style/scrollbar.module.css'
import stylex from "@stylexjs/stylex"
// ...
import { solid_icon } from "../../assets"
import LibaryUsedBox from "./LibaryUsedBox"

const style = stylex.create({
  libList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
    minWidth: '100%',
    paddingLeft: 10,
    paddingRight: 20
  },
  noOverflowX: {
    overflowX: 'hidden'
  }
})

interface ILibaryUsedListProps {
  libaries: LibaryData[]
}

export function LibaryUsedList(props: ILibaryUsedListProps) {
  bodyClasslist().add(
    ...mergeClassname(stylex.attrs(style.noOverflowX))
      .split(' ')
    // 
  )

  return (
    <div class={mergeClassname(
      __scrollbarStyle.scrollbar, 
      __scrollbarStyle.scrollbarVertical,
      stylex.attrs(style.libList)
    )}>
      <For each={props.libaries}>
        {it => (
          <LibaryUsedBox 
            {...it} 
            url={it.homepageUrl}
            iconUrl={it.name.includes('solid') ? solid_icon : ''} 
          />
        )}
      </For>
    </div>
  )
}