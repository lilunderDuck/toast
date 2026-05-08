import { usePlaylistContext } from "../provider"

import stylex from "@stylexjs/stylex"

const style = stylex.create({
  header: {
    width: "100%",
    height: "14rem",
    display: "flex",
    gap: 15,
    paddingInline: 15,
    paddingTop: 35,
    paddingBottom: 10,
    marginBottom: 10,
    backgroundColor: "var(--mantle)",
    userSelect: "none",
    position: "relative"
  },
  header__titleWrap: {
    width: "100%",
    position: "absolute",
    bottom: 0
  },
  header__info: {
    fontSize: 14
  }
})

interface IPlaylistJeaderProps {
  // define your component props here
}

export function PlaylistHeader(props: IPlaylistJeaderProps) {
  const { data$, tracks$ } = usePlaylistContext()
  return (  
    <header {...stylex.attrs(style.header)}>
      <div {...stylex.attrs(style.header__titleWrap)}>
        <h1>{data$()?.name}</h1>
        <span {...stylex.attrs(style.header__info)}>
          {tracks$().length} tracks • Runtime: {data$()?.totalDuration}
        </span>
      </div>
    </header>
  )
}