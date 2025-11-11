import { createSignal, Show } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { TableFooterCreateRowButton, TableRoot, TableTitle } from "./components"
import { TableProvider, TablesDataProvider, useTablesDataContext, type TableAttribute, type TableGridData } from "./provider"
import { useNodeState } from "../../utils"
import { NodeViewWrapper } from "~/libs/solid-tiptap-renderer"

const style = stylex.create({
  table: {
    paddingInline: 15,
    width: "100%"
  }
})

export default function TableNodeView() {
  const TableTabContentWrap = () => {
    const { tabs$ } = useTablesDataContext()

    return (
      <tabs$.TabContent$ tabComponent$={TableTabContent} />
    )
  }

  const TableTabContent = (props: { tabId$: string }) => {
    const { data$ } = useNodeState<TableAttribute>()
    const [currentGridData, setCurrentGridData] = createSignal<TableGridData>(data$().grid[props.tabId$])
    const [isUpdating, setIsUpdating] = createSignal(false)

    return (
      <>
        <Show when={!isUpdating()}>
          <TableProvider 
            tabId$={props.tabId$} 
            columns$={currentGridData()!.columns} 
            rows$={currentGridData()!.rows}
          >
            <TableRoot>
              <TableFooterCreateRowButton />
            </TableRoot>
          </TableProvider>
        </Show>
      </>
    )
  }

  return (
    <NodeViewWrapper {...stylex.attrs(style.table)}>
      <TablesDataProvider>
        <TableTitle />
        <TableTabContentWrap />
      </TablesDataProvider>
    </NodeViewWrapper>
  )
}