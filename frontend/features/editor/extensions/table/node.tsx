import { createEffect, createResource, Show } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { GetTableGrid } from "~/wailsjs/go/editor/Exports"
import { NodeViewWrapper, useSolidNodeView } from "~/libs/solid-tiptap-renderer"
import type { ITabComponentProps } from "~/hooks"
// ...
import { TableFooterCreateRowButton, TableLoading, TableRoot, TableTitle } from "./components"
import { TableProvider, TablesDataProvider, useTablesDataContext, type TableAttribute } from "./provider"

const style = stylex.create({
  table: {
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

  const TableTabContent = (props: ITabComponentProps) => {
    const { tabs$ } = useTablesDataContext()
    const { attrs$ } = useSolidNodeView<TableAttribute>()
    const [resource, { refetch }] = createResource(() => props.tabId$, async (tabId) => {
      console.log("[table] start fetching table grid id:", attrs$().id, "->", tabId)
      tabs$.setDisable$(true)
      const data = await GetTableGrid(attrs$().id, tabId)
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