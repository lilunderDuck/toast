import { createSignal, For, Match, Switch, type VoidComponent } from "solid-js"
import { FaBrandsUnsplash, FaSolidBox } from "solid-icons/fa"
// ...
import { DialogContent } from "~/components"
import type { IBaseLazyComponent } from "~/hooks"
import { scrollbar, scrollbar__invs, scrollbar__vertical } from "~/styles"
// ...
import { css } from "molcss"
import "./MainSettingDialog.css"
// ...
import type { ISettingSidebarOption } from "../provider"
import { SettingSidebarItem } from "../components"
// ...
import { SplashScreenPage } from "../pages/appearance"
import { AdvancePage } from "../pages/advance"

const dialog = css`
  width: 80%;
  height: calc(100% - 10rem);
  padding: 0 !important;
`

const dialog__content = css`
  width: 100%;
  height: 100%;
  display: flex;
`

const dialog__sidebar = css`
  width: 15em;
  flex-shrink: 0;
  padding-inline: 5px;
  padding-block: 10px;
`

const dialog__mainContent = css`
  width: 100%;
  height: 100%;
  background-color: var(--base);
  padding-inline: 15px;
  padding-top: 10px;
  padding-bottom: 5rem;
`

interface IMainSettingDialog extends IBaseLazyComponent {}

export default function MainSettingDialog(_: IMainSettingDialog) {
  const PAGE_SIDEBAR: ISettingSidebarOption[] = [
    {
      label$: "Appearance",
      items$: [
        { pageId$: "appearance_splash_screen$", name$: "Splash screen", icon$: FaBrandsUnsplash },
      ]
    },
    {
      label$: "Advance",
      items$: [
        { pageId$: "advance_settings$", name$: "Advance settings", icon$: FaSolidBox },
      ]
    }
  ]
  
  const PAGE_COMPONENT: [string, VoidComponent][] = [
    ["appearance_splash_screen$",          SplashScreenPage],
    // ...
    ["advance_settings$",                  AdvancePage]
  ]

  // a few asserts to make sure the setting doesn't randomly break
  console.assert(PAGE_SIDEBAR.length > 0, "No items on the sidebar.")
  console.assert(PAGE_SIDEBAR[0].items$.length > 0, "Empty sub content.")
  console.assert(PAGE_SIDEBAR[0].items$[0].pageId$ !== "", "The first page id is a empty string")

  const [currentPage, setCurrentPage] = createSignal(
    PAGE_SIDEBAR[0].items$[0].pageId$
  )

  return (
    <DialogContent class={dialog}>
      <div class={dialog__content}>
        <aside class={`${dialog__sidebar} ${scrollbar} ${scrollbar__vertical} ${scrollbar__invs}`}>
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
          class={`${dialog__mainContent} ${scrollbar} ${scrollbar__vertical} ${scrollbar__invs}`}
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