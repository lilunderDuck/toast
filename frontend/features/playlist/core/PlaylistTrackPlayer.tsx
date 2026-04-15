import stylex from "@stylexjs/stylex"
import { usePlaylistContext } from "../provider"

const style = stylex.create({
  player: {
    width: "100%",
    height: "6rem",
    paddingInline: 10,
    paddingBlock: 5,
    backgroundColor: "var(--base)",
    marginTop: 10
  }
})

interface IPlaylistTrackPlayerProps {
  // define your component props here
}

export function PlaylistTrackPlayer(props: IPlaylistTrackPlayerProps) {
  const { player$ } = usePlaylistContext()

  return (
    <div {...stylex.attrs(style.player)}>
      {/*  */}
    </div>
  )
}