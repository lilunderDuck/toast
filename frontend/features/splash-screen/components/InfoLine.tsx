import stylex from "@stylexjs/stylex"

const style = stylex.create({
  infoLine: {
    display: "flex",
    alignItems: "center",
    paddingInline: 5,
    paddingBlock: 2,
    marginLeft: 10,
    marginTop: 5,
    backgroundColor: "var(--gray1)",
    borderRadius: 6,
    width: "fit-content",
    fontSize: 13
  }
})

export function InfoLine() {
  return (
    <div {...stylex.attrs(style.infoLine)}>
      App starting up
    </div>
  )
}