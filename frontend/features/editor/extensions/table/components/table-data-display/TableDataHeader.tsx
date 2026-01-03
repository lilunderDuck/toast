import stylex from "@stylexjs/stylex"
// ...
import { Input } from "~/components"
import { createToggableInput } from "~/hooks"
// ...
import { useTableContext, type ColumnData } from "../../provider"
import { TABLE_DATA_TYPE_MAPPING } from "../../constants"

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
  const Icon = TABLE_DATA_TYPE_MAPPING[props.type]
  console.assert(Icon, `Missing icon or invalid data type in the mapping for type: ${props.type}`)

  const { columns$ } = useTableContext()

  const { Input$ } = createToggableInput({
    label$: () => props.label,
    component$: {
      // @ts-ignore
      Input$: (props) => <Input {...props} />,
      Readonly$: (props) => <span {...props} />,
    },
    onFinalize$(newName) {
      columns$.updateData$(props.key, () => ({
        label: newName
      }))
    },
    onDiscard$() {
    }
  })

  return (
    <div
      {...stylex.attrs(style.header)}
      data-column-header-key={props.key}
    >
      <Icon.icon$ />
      <Input$ />
    </div>
  )
}