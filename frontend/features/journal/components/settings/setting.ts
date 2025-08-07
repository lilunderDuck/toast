import { BsCameraVideoFill, BsTagsFill } from "solid-icons/bs"
import { lazy } from "solid-js"
import { createLazyLoadedDialog } from "~/components"

export function createJournalSettingPage() {
  return createLazyLoadedDialog(
    () => import("~/features/setting"),
    () => ({
      config$: [
        {
          label$: "General", items$: [
            { name$: "Tags", icon$: BsTagsFill, pageId$: "general_tags$" },
          ]
        },
        {
          label$: "Block", items$: [
            { name$: "Video", icon$: BsCameraVideoFill, pageId$: "block_video$" },
          ]
        },
      ],
      pages$: {
        general_tags$: lazy(() => import("./page/GeneralTags")),
        block_video$: lazy(() => import("./page/EditorVideo"))
      }
    })
  )
}