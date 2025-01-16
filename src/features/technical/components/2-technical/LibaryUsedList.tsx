import { createResource, For } from "solid-js"
// ...
import { mergeClassname } from "~/utils"
// ...
import __scrollbarStyle from '~/assets/style/scrollbar.module.css'
import stylex from "@stylexjs/stylex"
// ...
import { api_getLibariesUsed } from "../../utils"
import { solid_icon } from "../../assets"
import LibaryUsedBox from "./LibaryUsedBox"

const style = stylex.create({
  libList: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr'
  }
})

export function LibaryUsedList() {
  const [libraries] = createResource(api_getLibariesUsed)

  return (
    <div class={mergeClassname(
      __scrollbarStyle.scrollbar, 
      __scrollbarStyle.scrollbarVertical,
      stylex.attrs(style.libList)
    )}>
      <For each={libraries() ?? []}>
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