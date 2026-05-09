import { Icon } from "@kobalte/core/select"
import { playlistIconUrl } from "../api"
import { usePlaylistContext } from "../provider"

import stylex from "@stylexjs/stylex"
import { PlaylistHeaderDropdownButton } from "../components"

const style = stylex.create({
  header: {
    width: "100%",
    height: "14rem",
    display: "flex",
    gap: 15,
    paddingTop: 35,
    paddingBottom: 10,
    marginBottom: 10,
    backgroundColor: "var(--mantle)",
    userSelect: "none",
    position: "relative",
    background: "center top no-repeat var(--cover-icon-url)",
    backgroundSize: "cover"
  },
  header__titleWrap: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    background: "linear-gradient(to top, var(--crust) 0%, transparent 100%)",
    paddingInline: 15,
    paddingTop: "2.75rem"
  },
  header__info: {
    fontSize: 14
  },
  header__moreOptionButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    paddingRight: 20,
    paddingBottom: 15
  }
})

interface IPlaylistJeaderProps {
  // define your component props here
}

export function PlaylistHeader(props: IPlaylistJeaderProps) {
  const { data$, tracks$ } = usePlaylistContext()
  const coverIconUrl = () => data$()?.coverIcon ? 
    `--cover-icon-url:url("${playlistIconUrl(data$()!.id, data$()!.coverIcon!)}")` as const :
    ""
  // ...

  return (  
    <header {...stylex.attrs(style.header)} style={coverIconUrl()}>
      <div {...stylex.attrs(style.header__titleWrap)}>
        <h1>{data$()?.name}</h1>
        <span {...stylex.attrs(style.header__info)}>
          {tracks$().length} tracks • Runtime: {data$()?.totalDuration}
        </span>
      </div>
      <div {...stylex.attrs(style.header__moreOptionButton)}>
        <PlaylistHeaderDropdownButton />
      </div>
    </header>
  )
}