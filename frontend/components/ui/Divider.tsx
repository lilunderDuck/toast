import stylex from "@stylexjs/stylex"

const style = stylex.create({
  divider: {
    paddingBlock: 5,
    width: '100%'
  },
  dividerLine: {
    backgroundColor: 'var(--divider-color)',
    width: '100%',
    height: 'var(--divider-thickness)'
  }
})

interface IDividerProps {
  color$?: string
  thicknessInPx$?: number
}

export function Divider(props: IDividerProps) {
  return (
    <div 
      {...stylex.attrs(style.divider)} 
      style={`--divider-color:${props.color$ ?? "var(--surface1)"};--divider-thickness:${props.thicknessInPx$ ?? 2}px`}
    >
      <div {...stylex.attrs(style.dividerLine)} />
    </div>
  )
}