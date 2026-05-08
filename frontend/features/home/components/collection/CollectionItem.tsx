import stylex from "@stylexjs/stylex"
import { A } from "@solidjs/router"

const style = stylex.create({
  item: {
    width: "13rem",
    height: "13rem",
    borderRadius: 6,
    border: "3px solid transparent",
    ":hover": {
      borderColor: "var(--blue)"
    }
  },
  item__name: {
    fontSize: 14
  }
})

interface ICollectionItemProps {
  backgroundUrl$: string
  href$: string
  name$: string
}

export function CollectionItem(props: ICollectionItemProps) {
  return (
    <A href={props.href$}>
      <div {...stylex.attrs(style.item)}>
        <span>{props.name$}</span>
      </div>
    </A>
  )
}