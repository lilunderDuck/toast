import { FaBrandsUnsplash } from "solid-icons/fa"
import type { VoidComponent } from "solid-js"
// ...
import type { ISettingSidebarOption } from "../provider"
import { SplashScreenPage } from "../pages/appearance"

export const PAGE_SIDEBAR: ISettingSidebarOption[] = [
  {
    label$: "Appearance",
    items$: [
      { pageId$: "appearance_splash_screen$", name$: "Splash screen", icon$: FaBrandsUnsplash }
    ]
  }
]

export const PAGE_COMPONENT: [string, VoidComponent][] = [
  ["appearance_splash_screen$",          SplashScreenPage]
]

if (TOAST_DEBUG) {
  // validate
}