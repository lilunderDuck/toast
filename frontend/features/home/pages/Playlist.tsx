import { AppTitleBarDraggable } from "~/components";

import stylex from "@stylexjs/stylex"

const style = stylex.create({
  playlist: {
    //
  },
  playlist__titleBar: {}
})

export default function Playlist() {
  return (
    <main {...stylex.attrs(style.playlist)}>
      <AppTitleBarDraggable {...stylex.attrs(style.playlist__titleBar)} />
      
    </main>
  )
}