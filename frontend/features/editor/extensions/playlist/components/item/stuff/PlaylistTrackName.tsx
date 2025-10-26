import stylex from "@stylexjs/stylex"
import __style from "../PlaylistTrackItem.module.css"
import { macro_mergeClassnames } from "macro-def"

const style = stylex.create({
  item__nameWrap: {
    marginLeft: "1rem",
    fontSize: 12,
  },
  item__authorName: {
    fontSize: 14,
  },
})

interface IPlaylistTrackNameProps {
  name$: string
  author$?: string
}

export function PlaylistTrackName(props: IPlaylistTrackNameProps) {
  return (
    <div {...stylex.attrs(style.item__nameWrap)}>
      <h3 class={__style.item__textPrimary}>
        {props.name$}
      </h3>
      <span class={macro_mergeClassnames(stylex.attrs(style.item__authorName), __style.item__textSecondary)}>
        {props.author$}
      </span>
    </div>
  )
}