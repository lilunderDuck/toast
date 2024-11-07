import stylex from "@stylexjs/stylex"

const style = stylex.create({
  divider: {
    paddingBlock: 5,
    width: '100%'
  },
  dividerLine: {
    backgroundColor: 'var(--gray3)',
    width: '100%',
    height: 1
  }
})

export function Divider() {
  return (
    <div {...stylex.attrs(style.divider)}>
      <div {...stylex.attrs(style.dividerLine)} />
    </div>
  )
}