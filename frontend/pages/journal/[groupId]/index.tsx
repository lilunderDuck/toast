import stylex from "@stylexjs/stylex"

const style = stylex.create({
  everything: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
      height: "100%",
  },
  content: {
    width: "20rem",
  }
})

export default function JournalWelcomePage() {
  return (
    <div {...stylex.attrs(style.everything)}>
      <div {...stylex.attrs(style.content)}>
        <h1>Welcome, home.</h1>
      </div>
    </div>
  )
}