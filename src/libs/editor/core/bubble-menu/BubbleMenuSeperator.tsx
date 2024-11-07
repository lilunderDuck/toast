import stylex from "@stylexjs/stylex"

const style = stylex.create({
  seperator: {
    paddingInline: 5
  }
})

export default function BubbleMenuSeperator() {
  return (
    <div {...stylex.attrs(style.seperator)} />
  )
}