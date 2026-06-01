import { FaBrandsUnsplash, FaSolidBox } from "solid-icons/fa"
import type { VoidComponent } from "solid-js"
// ...
import type { ISettingSidebarOption } from "../provider"
import { SplashScreenPage } from "../pages/appearance"
import { AdvancePage } from "../pages/advance/AdvancePage"

export const PAGE_SIDEBAR: ISettingSidebarOption[] = [
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

export const PAGE_COMPONENT: [string, VoidComponent][] = [
  ["appearance_splash_screen$",          SplashScreenPage],
  // ...
  ["advance_settings$",                  AdvancePage]
]

if (TOAST_DEBUG) {
  // validate
}