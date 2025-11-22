import stylex from "@stylexjs/stylex"
import { DATA_TYPE_ICON_MAPPING, useTableContext, type ColumnData } from "../../provider"
import { Input } from "~/components"
import { createToggableInput } from "~/hooks"

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

  const { columns$ } = useTableContext()

  const { Input$ } = createToggableInput({
    label$: () => props.label,
    component$: {
      Input$: (props) => (
        <Input {...props} />
      ),
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
      <Icon />
      <Input$ />
    </div>
  )
}