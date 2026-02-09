import { For, Match, Switch } from "solid-js"
import { MERGE_CLASS } from "macro-def"
// ...
import { DialogContent } from "~/components"
import type { IBaseLazyDialog } from "~/hooks"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./SettingDialog.module.css"
import __scrollbarStyle from "~/styles/scrollbar.module.css"
// ...
import { SettingSidebarItem } from "./SettingSidebarItem"
import { type ISettingProviderProps, SettingProvider, useSettingContext } from "./SettingProvider"

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
    backgroundColor: "var(--gray3)",
    paddingInline: 15,
    paddingTop: 10,
    paddingBottom: "5rem"
  }
})

interface ISettingDialog extends ISettingProviderProps<any>, IBaseLazyDialog {}

export default function SettingDialog(props: ISettingDialog) {
  const Sidebar = () => {
    const { config$ } = useSettingContext()
    return (
      <aside class={MERGE_CLASS(
        stylex.attrs(style.dialog__sidebar),
        __scrollbarStyle.scrollbar,
        __scrollbarStyle.scrollbarVertical,
        __scrollbarStyle.invsScrollbar
      )}>
        <For each={config$}>
          {it => <SettingSidebarItem {...it} />}
        </For>
      </aside>
    )
  }

  const MainContent = () => {
    const { pages$, currentPage$ } = useSettingContext()

    return (
      <Switch>
        <For each={Object.entries(pages$)}>
          {([pageId, PageComponent]) => (
            <Match when={currentPage$() === pageId}>
              <PageComponent />
            </Match>
          )}
        </For>
      </Switch>
    )
  }

  return (
    <DialogContent {...stylex.attrs(style.dialog)} showCloseButton$={false}>
      <SettingProvider {...props}>
        <div {...stylex.attrs(style.dialog__content)}>
          <Sidebar />
          <main
            class={MERGE_CLASS(
              stylex.attrs(style.dialog__mainContent),
              __scrollbarStyle.scrollbar,
              __scrollbarStyle.scrollbarVertical,
              __scrollbarStyle.invsScrollbar
            )}
            id={__style.mainContent}
          >
            <MainContent />
          </main>
        </div>
      </SettingProvider>
    </DialogContent>
  )
}