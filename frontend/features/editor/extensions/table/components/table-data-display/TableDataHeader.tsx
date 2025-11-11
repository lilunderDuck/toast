import stylex from "@stylexjs/stylex"
import { DATA_TYPE_ICON_MAPPING, type ColumnData } from "../../provider"

const style = stylex.create({
  header: {
    display: "flex",
    alignItems: "center",
    gap: 15
  }
})

interface ITableDataHeaderProps {
}

export function TableDataHeader(props: ITableDataHeaderProps & ColumnData) {
  const Icon = DATA_TYPE_ICON_MAPPING[props.type]
  console.assert(Icon, `Missing icon or invalid data type in the mapping for type: ${props.type}`)

  return (
    <div 
      {...stylex.attrs(style.header)} 
      data-column-header-key={props.key}
    >
      <Icon />
      <span>
        {props.label}
      </span>
    </div>
  )
}