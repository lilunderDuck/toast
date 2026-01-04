import { BsThreeDots } from "solid-icons/bs"
// ...
import { Button } from "~/components"
import { createFileUpload, createLazyLoadedDropdownMenu, SUPPORTED_VIDEO_FILTER } from "~/hooks"

import stylex from "@stylexjs/stylex"
import { UploadMedia } from "~/wailsjs/go/editor/Exports"
import { useSolidNodeView } from "~/libs/solid-tiptap-renderer"
import type { VideoAttribute } from "~/features/video"
import { useEditorContext } from "~/features/editor"

const style = stylex.create({
  button: {
    marginTop: 10,
    marginRight: 10,
    position: "absolute",
    right: 0,
    top: 0
  }
})

interface IVideoMoreOptionButtonProps {
  // define your component props here
}

export function VideoMoreOptionButton(props: IVideoMoreOptionButtonProps) {
  const { updateAttribute$ } = useSolidNodeView<VideoAttribute>()
  const { EDITOR_ID$ } = useEditorContext()
  
  const { open$ } = createFileUpload({
    type$: FileUploadType.FILE,
    dialogOptions$: {
      Title: "Please choose a video file",
      Filters: [SUPPORTED_VIDEO_FILTER]
    },
    async onFinish$(file) {
      const fileName = await UploadMedia(EDITOR_ID$, file)

      updateAttribute$('name', fileName)
    },
  })

  const DropdownMenu = createLazyLoadedDropdownMenu(
    () => import("./VideoMoreOptionDropdownMenu"),
    () => ({
      action$(type) {
        switch (type) {
          case VideoMoreOptionAction.PICK_VIDEO:
            open$()
            break
        }
      },
    })
  )

  return (
    <>
      <div {...stylex.attrs(style.button)}>
        <DropdownMenu.DropdownMenu$>
          <Button
            onClick={DropdownMenu.close$}
            variant$={ButtonVariant.NO_BACKGROUND}
            size$={ButtonSize.ICON}
          >
            <BsThreeDots />
          </Button>
        </DropdownMenu.DropdownMenu$>
      </div>
    </>
  )
}