import stylex from "@stylexjs/stylex"
import { CLS } from "macro-def"

const style = stylex.create({
  header__seperator: {
    height: 14,
    width: 1,
    backgroundColor: "var(--overlay1)",
    marginInline: 2
  }
})

interface IPlaylistItemListHeaderSeperatorProps {
  class: string
}

export function PlaylistItemListHeaderSeperator(props: IPlaylistItemListHeaderSeperatorProps) {
  return (
    <div 
      class={`${CLS(style.header__seperator)} ${props.class}`} 
    />
  )
}