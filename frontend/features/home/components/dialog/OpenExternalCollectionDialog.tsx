import { DEBUG_ASSERT, DEBUG_ERR_LABEL, DEBUG_INFO_LABEL } from "macro-def"
import { createSignal, onCleanup, Show } from "solid-js"
import { useNavigate } from "@solidjs/router"
// ...
import { Button, ButtonRow, DialogContent, DialogHeader, Label } from "~/components"
import { createFileUpload, type IBaseLazyDialog } from "~/hooks"
import { Collections_judgeTypeByPath } from "~/wailsjs/go/collections/Exports"
import { Gallery_getByPath } from "~/wailsjs/go/gallery/Exports"
import { getExternalGalleryIconUrl } from "~/features/gallery"
import type { gallery } from "~/wailsjs/go/models"
import { GALLERY_IN_EXTERNAL_MODE } from "~/features/gallery/provider/constants"
// ...
import { css } from "molcss"
// ...
import { CollectionItem } from "../collection"

const dialog = css`
  width: 55%;
`

const dialog__choosenCollectionWrap = css`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--base);
  width: 100%;
  min-height: 10rem;
  border-radius: 6px;
  margin-top: 10px;
`

const dialog__chooseCollectionButton = css`
  color: var(--subtext0);
  border: 4px solid transparent;
  &:hover {
    border-color: var(--blue);
    color: var(--text);
  }
`

type DisplayedCollection = {
  directoryOpened$: string
  type$: number
  data$: gallery.GalleryData
}

interface IStickyNoteFullViewDialogProps extends IBaseLazyDialog {
}

export default function OpenExternalCollectionDialog(props: IStickyNoteFullViewDialogProps) {
  const [displayedCollection, setDisplayedCollection] = createSignal<DisplayedCollection>()
  const redirect = useNavigate()

  const { open$ } = createFileUpload({
    type$: FileUploadType.DIRECTORY,
    dialogOptions$: {
      Title: "Please choose a directory to open collection."
    },
    async onFinish$(directory) {
      const collectionType = await Collections_judgeTypeByPath(directory)
      if (collectionType === 255) {
        DEBUG_ERR_LABEL("collections", "invalid collection")
        return
      }

      const displayData = {
        type$: collectionType,
        directoryOpened$: directory.replaceAll("\\", "/")
      } as DisplayedCollection

      DEBUG_INFO_LABEL("collections", `Directory opened: \n${directory}`)
      DEBUG_INFO_LABEL("collections", `collection type judged:`, collectionType)

      DEBUG_INFO_LABEL("collections", `fetching metadata...`)
      switch (collectionType) {
        case 1:
          displayData.data$ = await Gallery_getByPath(directory)
          break;
      }

      setDisplayedCollection(displayData)
    },
  })

  const goToCollection = () => {
    DEBUG_ASSERT(displayedCollection() !== undefined, "you're calling redirect too soon!!")
    redirect(`/collection/gallery/${GALLERY_IN_EXTERNAL_MODE}?directory=${displayedCollection()!.directoryOpened$}`)
    props.close$()
  }

  onCleanup(() => setDisplayedCollection(undefined))

  return (
    <DialogContent
      class={dialog}
      showCloseButton$={false}
    >
      <DialogHeader>
        Open external collection.
      </DialogHeader>
      <a>What is this?</a>

      <section>
        <Label>Choosen collection</Label>
        <Show when={displayedCollection()} fallback={
          <button class={`${dialog__choosenCollectionWrap} ${dialog__chooseCollectionButton}`} onClick={open$}>
            No choosen collection. Click here to choose.
          </button>
        }>
          <div class={dialog__choosenCollectionWrap} onClick={open$}>
            <CollectionItem
              href$=""
              name$={displayedCollection()!.data$.name}
              tooltipLabel$={displayedCollection()!.data$.name}
              iconUrl$={getExternalGalleryIconUrl(
                displayedCollection()!.directoryOpened$,
                displayedCollection()!.data$.icon
              )}
            />
          </div>
        </Show>
      </section>

      <ButtonRow>
        <Button size$={ButtonSize.SMALL} onClick={props.close$}>
          Close
        </Button>
        <Button 
          size$={ButtonSize.SMALL} 
          variant$={ButtonVariant.SECONDARY} 
          onClick={goToCollection}
          disabled={!displayedCollection()}
        >
          Open
        </Button>
      </ButtonRow>
    </DialogContent>
  )
}