import { ParentProps } from "solid-js"
// ...
import { mergeClassname } from "~/utils"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./TooTechnicalPageRoot.module.css"
import __scrollbarStyle from '~/assets/style/scrollbar.module.css'

const style = stylex.create({
  page: {
    paddingInline: 15,
    paddingTop: 10,
    width: '100%',
    height: '100%',
    paddingBottom: '4rem',
  },
  libList: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr'
  }
})

export function TooTechnicalPageRoot(props: ParentProps) {
  return (
    <div 
      class={mergeClassname(
        __scrollbarStyle.scrollbar,
        __scrollbarStyle.scrollbarVertical,
        stylex.attrs(style.page)
      )} 
      id={__style.thisPage}
    >
      {props.children}
    </div>
  )
}