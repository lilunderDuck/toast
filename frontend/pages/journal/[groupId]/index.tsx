import stylex from "@stylexjs/stylex"
import { shorthands } from "~/styles/shorthands"

const style = stylex.create({
  everything: {
    // ...
  },
  content: {
    width: "20rem",
  }
})

export default function JournalWelcomePage() {
  return (
    <div {...stylex.attrs(shorthands.flex_center$, shorthands.wh_full$)}>
      <div {...stylex.attrs(style.content)}>
        <h1>Welcome, home.</h1>
      </div>
    </div>
  )
}