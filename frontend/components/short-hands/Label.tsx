import stylex from "@stylexjs/stylex"

const style = stylex.create({
  label: {
    fontSize: 13.5, // sub-pixel perfect 👍
    fontWeight: "bold",
    userSelect: "none"
  }
})

export function Label(props: HTMLAttributes<"label">) {
  return <label {...props} class={`${stylex.attrs(style.label).class} ${props.class ?? ""}`} />
}