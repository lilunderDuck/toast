import stylex from "@stylexjs/stylex";
import { JournalHomeRootProvider } from "../provider/JournalHomeRootProvider";
import type { ParentProps } from "solid-js";

const style = stylex.create({
  home: {
    width: "100%",
    height: "100%",
    display: "flex"
  },
  home__titleBar: {
    position: "fixed",
    width: 0,
    top: 0
  }
})

export function JournalHomeRoot(props: ParentProps) {
  return (
    <>
      <JournalHomeRootProvider>
        <div {...stylex.attrs(style.home)}>
          {props.children}
        </div>
      </JournalHomeRootProvider>
    </>
  )
}