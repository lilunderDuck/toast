import { A, useNavigate } from "@solidjs/router"
import { CLS } from "macro-def"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { Tooltip } from "~/components"

const style = stylex.create({
  item: {
    width: "9rem",
    borderRadius: 6,
    outline: "4px solid transparent",
    textAlign: "left",
    padding: 0,
    margin: 0,
    backgroundColor: "var(--surface0)",
    ":hover": {
      outlineColor: "var(--sapphire)"
    }
  },
  item__name: {
    fontSize: 14,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    paddingInline: 5,
    paddingBlock: 8
  },
  item__backgroundWrap: {
    width: "9rem",
    height: "9rem",
    background: "center center no-repeat var(--icon-url)",
    backgroundSize: "cover",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6
  }
})

interface ICollectionItemProps {
  iconUrl$: string
  href$: string
  tooltipLabel$: string
  name$: string
}

export function CollectionItem(props: ICollectionItemProps) {
  const redirect = useNavigate()

  return (
    <Tooltip label$={props.tooltipLabel$}>
      <button
        {...stylex.attrs(style.item)}
        style={`--icon-url:url("${`${props.iconUrl$}`}")`}
        onClick={() => redirect(props.href$)}
      >
        <div {...stylex.attrs(style.item__backgroundWrap)} />
        <div {...stylex.attrs(style.item__name)}>
          {props.name$}
        </div>
      </button>
    </Tooltip>
  )
}