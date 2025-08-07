import { For, Match, Switch } from "solid-js"
// ...
import { DialogContent, IDialog } from "~/components"
import { mergeClassname } from "~/utils"
// ...
import stylex from "@stylexjs/stylex"
import { shorthands } from "~/styles/shorthands"
import __style from "./SettingDialog.module.css"
import __scrollbarStyle from "~/styles/scrollbar.module.css"
// ...
import { SettingSidebarItem } from "./SettingSidebarItem"
import { ISettingProviderProps, SettingProvider, useSettingContext } from "./SettingProvider"

const style = stylex.create({
  root: {
    width: "90%",
    height: "calc(100% - 10rem)",
    padding: "0 !important"
  },
  sidebar: {
    width: "15em",
    flexShrink: 0,
    paddingInline: 5,
    paddingBlock: 10
  },
  mainContent: {
    backgroundColor: "var(--gray3)",
    paddingInline: 15,
    paddingTop: 10,
    paddingBottom: "5rem"
  }
})

interface ISettingDialog extends ISettingProviderProps, IDialog {}

export default function SettingDialog(props: ISettingDialog) {
  const Sidebar = () => {
    const { config$ } = useSettingContext()
    return (
      <aside class={mergeClassname(
        stylex.attrs(style.sidebar),
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
    <DialogContent {...stylex.attrs(style.root)}>
      <SettingProvider {...props}>
        <div {...stylex.attrs(shorthands.wh_full$, shorthands.flex$)}>
          <Sidebar />
          <main
            class={mergeClassname(
              stylex.attrs(style.mainContent, shorthands.wh_full$),
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