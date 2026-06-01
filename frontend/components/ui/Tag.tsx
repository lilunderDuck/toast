import { splitProps } from "solid-js"
// ...
import { css } from "molcss"
// ...
import type { HTMLAttributes } from "~/utils"

const tag = css`
  border-radius: 6px;
  text-align: left;
  color: var(--color);
  font-size: 13px;
  user-select: none;
  width: fit-content;
  position: relative;
  display: flex;
  justify-content: center;
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: var(--color);
    filter: opacity(0.7) brightness(0.525);
    border-radius: 6px;
    z-index: 1
  }
`

const tag__content = css`
  padding-block: 1;
  padding-inline: 5;
  // show text after the background, not before the background
  position: relative;
  z-index: 1;
  max-width: 15rem;
  overflow: hidden;
  text-overflow: ellipsis;
`

export interface ITagProps extends HTMLAttributes<"span"> {
  color$: string
}

export function Tag(props: ITagProps) {
  const [, itsProps] = splitProps(props, ["color$"])

  return (
    <span
      {...itsProps}
      class={`${tag} ${props.class ?? ""}`}
      style={{ "--color": props.color$ ?? "var(--subtext0)" }}
      data-tag=""
    >
      <span class={tag__content}>
        {props.children}
      </span>
    </span>
  )
}