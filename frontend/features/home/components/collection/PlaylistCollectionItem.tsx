import { A } from "@solidjs/router"
import { CLS } from "macro-def"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { Tooltip } from "~/components"
import { playlistIconUrl } from "~/features/playlist/api"
import type { playlist } from "~/wailsjs/go/models"

const style = stylex.create({
  item: {
    width: "9rem",
    borderRadius: 6,
    outline: "4px solid transparent",
    textAlign: "left",
    padding: 0,
    margin: 0,
    backgroundColor: "var(--surface0)",
    ":hover": {
      outlineColor: "var(--sapphire)"
    }
  },
  item__name: {
    fontSize: 14,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    paddingInline: 5,
    marginBottom: 8
  },
  item__backgroundWrap: {
    width: "9rem",
    height: "9rem",
    background: "center center no-repeat var(--icon-url)",
    backgroundSize: "cover",
    marginBottom: 8,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6
  }
})

interface IPlaylistCollectionItemProps extends playlist.PlaylistData {
  // define your component props here
}

export function PlaylistCollectionItem(props: IPlaylistCollectionItemProps) {

  return (
    <A href={`/collection/playlist/${props.id}`}>
      <Tooltip label$={props.name}>
        <button
          {...stylex.attrs(style.item)}
          style={`--icon-url:url("${`${playlistIconUrl(props.id, props.icon)}`}")`}
        >
          <div {...stylex.attrs(style.item__backgroundWrap)} />
          <div {...stylex.attrs(style.item__name)}>
            {props.name}
          </div>
        </button>
      </Tooltip>
    </A>
  )
}