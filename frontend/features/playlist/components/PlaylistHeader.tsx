import { usePlaylistContext } from "../provider"

import stylex from "@stylexjs/stylex"

const style = stylex.create({
  header: {
    width: "100%",
    display: "flex",
    gap: 15,
  },
  header__icon: {
    width: "13rem",
    height: "13rem",
    flexShrink: 0,
    borderRadius: 6,
  }
})

interface IPlaylistJeaderProps {
  // define your component props here
}

export function PlaylistHeader(props: IPlaylistJeaderProps) {
  const { data$ } = usePlaylistContext()
  return (
    <header {...stylex.attrs(style.header)}>
      <div {...stylex.attrs(style.header__icon)} />
      <div>
        <h2>{data$()?.name}</h2>
        <span>Total runtime: {data$()?.totalDuration}</span>
      </div>
    </header>
  )
}