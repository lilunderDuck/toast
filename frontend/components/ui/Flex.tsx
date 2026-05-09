import stylex from "@stylexjs/stylex"

const style = stylex.create({
  spacer: {
    flex: '1 1 0%',
    placeSelf: 'stretch'
  }
})

export function Spacer(props: HTMLAttributes<"div">) {
  return (
    <div {...props} class={`${stylex.attrs(style.spacer).class} ${props.class ?? ""}`} />
  )
}