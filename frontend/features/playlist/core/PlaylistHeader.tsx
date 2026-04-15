import { PlaylistIcon } from "../components"
import { usePlaylistContext } from "../provider"

import stylex from "@stylexjs/stylex"

const style = stylex.create({
  header: {
    width: "100%",
    display: "flex",
    gap: 15,
    paddingInline: 15,
    marginBottom: 10
  },
})

interface IPlaylistJeaderProps {
  // define your component props here
}

export function PlaylistHeader(props: IPlaylistJeaderProps) {
  const { data$ } = usePlaylistContext()
  return (
    <header {...stylex.attrs(style.header)}>
      <PlaylistIcon size$="9.75rem" icon$={data$()?.icon} />
      <div>
        <h1>{data$()?.name}</h1>
        <span>Total runtime: {data$()?.totalDuration}</span>
      </div>
    </header>
  )
}