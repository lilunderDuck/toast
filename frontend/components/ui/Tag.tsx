import stylex from "@stylexjs/stylex";
import { macro_mergeClassnames } from "macro-def";
import { splitProps } from "solid-js";

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
      zIndex: 1
    }
  },
  tag__content: {
    paddingBlock: 1,
    paddingInline: 5,
    // show text after the background, not before the background
    position: "relative",
    zIndex: 1,
    maxWidth: "15rem",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
})

export interface ITagProps extends HTMLAttributes<"span"> {
  color$: string
}

export function Tag(props: ITagProps) {
  const [, itsProps] = splitProps(props, ["color$"])

  return (
    <span
      {...itsProps}
      class={macro_mergeClassnames(props, stylex.attrs(style.tag))}
      style={{ "--color": props.color$ ?? "var(--gray11)" }}
      data-tag=""
    >
      <span {...stylex.attrs(style.tag__content)}>
        {props.children}
      </span>
    </span>
  )
}