import { css } from "molcss"
import type { JSX } from "solid-js"

const button = css`
  width: 9rem;
  height: 182px; // pretty hacky I know
  border-radius: 6px;
  outline: 4px solid transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
  background-color: var(--mantle);
  color: var(--subtext0);
  &:hover {
    outline-color: var(--sapphire);
    color: var(--text);
  }
`

interface ICollectionCreateButtonProps {
  onClick$?: () => void
  icon$: JSX.Element
}

export function CollectionCreateButton(props: ICollectionCreateButtonProps) {
  return (
    <button class={button} onClick={props.onClick$}>
      {props.icon$}
    </button>
  )
}