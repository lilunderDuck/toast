import { createSignal, For, Match, Switch } from "solid-js"
import { CLS } from "macro-def"
// ...
import { DialogContent } from "~/components"
import type { IBaseLazyDialog } from "~/hooks"
// ...
import stylex from "@stylexjs/stylex"
import "./MainSettingDialog.css"
import "~/styles/scrollbar.css"
// ...
import { SettingSidebarItem } from "../components/SettingSidebarItem"
import { type ISettingProviderProps, type ISettingSidebarOption, SettingProvider, useSettingContext } from "../provider"
import { PAGE_COMPONENT, PAGE_SIDEBAR } from "./pages"

const style = stylex.create({
  dialog: {
    width: "90%",
    height: "calc(100% - 10rem)",
    padding: "0 !important"
  },
  dialog__content: {
    width: "100%",
    height: "100%",
    display: "flex"
  },
  dialog__sidebar: {
    width: "15em",
    flexShrink: 0,
    paddingInline: 5,
    paddingBlock: 10
  },
  dialog__mainContent: {
    width: "100%",
    height: "100%",
    backgroundColor: "var(--base)",
    paddingInline: 15,
    paddingTop: 10,
    paddingBottom: "5rem"
  }
})

interface IMainSettingDialog extends ISettingProviderProps<any>, IBaseLazyDialog {}

export default function MainSettingDialog(props: IMainSettingDialog) {
  // a few asserts to make sure the setting doesn't randomly break
  console.assert(PAGE_SIDEBAR.length > 0, "No items on the sidebar.")
  console.assert(PAGE_SIDEBAR[0].items$.length > 0, "Empty sub content.")
  console.assert(PAGE_SIDEBAR[0].items$[0].pageId$ !== "", "The first page id is a empty string")

  const [currentPage, setCurrentPage] = createSignal(
    PAGE_SIDEBAR[0].items$[0].pageId$
  )

  return (
    <DialogContent {...stylex.attrs(style.dialog)}>
      <div {...stylex.attrs(style.dialog__content)}>
        <aside class={`${CLS(style.dialog__sidebar)} scrollbar scrollbarVertical invsScrollbar`}>
          <For each={PAGE_SIDEBAR}>
            {it => (
              <SettingSidebarItem 
                {...it} 
                onClick$={(item) => setCurrentPage(item.pageId$)} 
                isCurrentPage$={(item) => item.pageId$ === currentPage()}
              />
            )}
          </For>
        </aside>
        <main
          class={`${CLS(style.dialog__mainContent)} scrollbar scrollbarVertical invsScrollbar`}
          id="mainContent"
        >
          <Switch>
            <For each={PAGE_COMPONENT}>
              {([pageId, PageComponent]) => (
                <Match when={currentPage() === pageId}>
                  <PageComponent />
                </Match>
              )}
            </For>
          </Switch>
        </main>
      </div>
    </DialogContent>
  )
}