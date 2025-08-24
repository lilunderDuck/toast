import stylex from "@stylexjs/stylex";
import { mergeClassname } from "~/utils";

const style = stylex.create({
  tag: {
    borderRadius: 6,
    textAlign: "left",
    color: "var(--color)",
    fontSize: 13,
    userSelect: "none",
    width: "fit-content",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    "::before": {
      content: '',
      position: "absolute",
      width: "100%",
      height: "100%",
      backgroundColor: "var(--color)",
      filter: "opacity(0.7) brightness(0.525)",
      borderRadius: 6,
      zIndex: -1
    }
  },
  tag__content: {
    paddingBlock: 1,
    paddingInline: 5,
  },
})

export function Tag(props: HTMLAttributes<"span">) {
  return (
    <span
      {...props}
      class={mergeClassname(props, stylex.attrs(style.tag))}
      style={{ "--color": props.color ?? "var(--gray11)" }}
    >
      <span {...stylex.attrs(style.tag__content)}>
        {props.children}
      </span>
    </span>
  )
}