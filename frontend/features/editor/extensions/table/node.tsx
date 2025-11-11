import { createEffect, createResource, createSignal, Show } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { TableFooterCreateRowButton, TableLoading, TableRoot, TableTitle } from "./components"
import { TableProvider, TablesDataProvider, useTablesDataContext, type TableAttribute } from "./provider"
import { useNodeState } from "../../utils"
import { NodeViewWrapper } from "~/libs/solid-tiptap-renderer"
import { GetTableGrid } from "~/wailsjs/go/table/Exports"

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
    const { tabs$ } = useTablesDataContext()
    const { data$ } = useNodeState<TableAttribute>()
    const [resource, { refetch }] = createResource(() => props.tabId$, async(tabId) => {
      tabs$.setDisable$(true)
      const data = await GetTableGrid(data$().id, tabId)
      tabs$.setDisable$(false)
      return data
    })

    createEffect(() => refetch())

    return (
      <Show when={!resource.loading} fallback={
        <TableLoading />
      }>
        <TableProvider 
          tabId$={props.tabId$} 
          columns$={resource()!.columns} 
          rows$={resource()!.rows}
        >
          <TableRoot>
            <TableFooterCreateRowButton />
          </TableRoot>
        </TableProvider>
      </Show>
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