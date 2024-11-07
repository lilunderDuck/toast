import stylex from "@stylexjs/stylex";
import { mergeClassname } from "~/utils";
import { FlexCenterY } from "./Flex";

const style = stylex.create({
  tag: {
    height: '1.35rem',
    paddingInline: '0.5rem',
    fontSize: 13,
    backgroundColor: 'var(--gray4)',
    borderRadius: 7,
    userSelect: 'none'
  }
})

export function Tag(props: HTMLAttributes<"span">) {
  return (
    <FlexCenterY $as="span" class={mergeClassname(props, stylex.attrs(style.tag))} {...props} />
  )
}