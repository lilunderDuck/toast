import { DEBUG_ASSERT, DEBUG_ERR_LABEL, DEBUG_INFO_LABEL } from "macro-def"
import { createSignal, onCleanup, Show } from "solid-js"
import { useNavigate } from "@solidjs/router"
// ...
import { Gallery_getByPath } from "~/wailsjs/go/gallery/Exports"
import { Collections_createExternal, Collections_judgeTypeByPath } from "~/wailsjs/go/collections/Exports"
import type { collections, gallery } from "~/wailsjs/go/models"
import { getExternalGalleryIconUrl } from "~/features/gallery"
import { Button, DialogContent, Label } from "~/components"
import { createFileUpload, type IBaseLazyComponent } from "~/hooks"
import type { IContextBridge } from "~/utils"
import { COLLECTION_TYPE_MAGIC_ROUTE_NAME_REGISTRY } from "~/api"
// ...
import { css } from "molcss"
// ...
import { CollectionItem } from "../CollectionItem"
import type { ICollectionPageContext } from "../../provider/CollectionPageProvider"

const dialog = css`
  width: 65%;
  user-select: none;
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
  padding-block: 10px;
`

const dialog__chooseCollectionButton = css`
  color: var(--subtext0);
  border: 4px solid transparent;
  &:hover {
    border-color: var(--blue);
    color: var(--text);
  }
`

const dialog__section = css`
  padding-bottom: 15px;
`

const dialog__descriptionText = css`
  padding-bottom: 5px;
`

type DisplayedCollection = {
  directoryOpened$: string
  type$: number
  data$: gallery.GalleryData
}

interface IStickyNoteFullViewDialogProps extends IBaseLazyComponent, IContextBridge<ICollectionPageContext> {
}

export default function OpenExternalCollectionDialog(props: IStickyNoteFullViewDialogProps) {
  const [displayedCollection, setDisplayedCollection] = createSignal<DisplayedCollection>()
  const redirect = useNavigate()

  DEBUG_ASSERT(props.context$, "context is undefined")
  const { updateCollections$ } = props.context$!

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

      DEBUG_INFO_LABEL("collections", `Directory opened: "${directory}", with type:`, collectionType)
      DEBUG_INFO_LABEL("collections", `fetching metadata...`)

      switch (collectionType) {
        case 1:
          displayData.data$ = await Gallery_getByPath(directory)
          break;
      }

      setDisplayedCollection(displayData)
    },
  })

  const goToCollection = async () => {
    DEBUG_ASSERT(displayedCollection() !== undefined, "you're calling redirect too soon!!")

    const externalSourceData = await Collections_createExternal(displayedCollection()!.directoryOpened$)
    updateCollections$(prev => {
      prev.externalSources.push(externalSourceData)
      return {
        ...prev,
        externalSources: prev.externalSources
      } as collections.CollectionsData
    })

    redirect(`/collection/gallery/${COLLECTION_TYPE_MAGIC_ROUTE_NAME_REGISTRY[CollectionType.GALLERY]}?directory=${displayedCollection()!.directoryOpened$}`)
    props.close$()
  }

  onCleanup(() => setDisplayedCollection(undefined))

  return (
    <DialogContent
      class={dialog}
      showCloseButton$={false}
    >
      <h2>
        Open external collection.
      </h2>
      <section class={dialog__section}>
        <p class={dialog__descriptionText}>
          Open collections stored outside the default app directory (e.g., on an external drive).
        </p>
        <p><b>Warning:</b> Moving or renaming the collection on your drive will break the connection, requiring a reimport/update.</p>
      </section>

      <section class={dialog__section}>
        <Label>Choosen collection</Label>
        <Show when={displayedCollection()} fallback={
          <button class={`${dialog__choosenCollectionWrap} ${dialog__chooseCollectionButton}`} onClick={open$}>
            No choosen collection. Click here to choose.
          </button>
        }>
          <div class={dialog__choosenCollectionWrap} onClick={open$}>
            <CollectionItem
              href$=""
              isAvailable$={true}
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

      <div class={css`display: flex; justify-content: flex-end; gap: 10px;`}>
        <Button onClick={props.close$}>
          Close
        </Button>
        <Button
          variant$={ButtonVariant.SECONDARY}
          onClick={goToCollection}
          disabled={!displayedCollection()}
        >
          Open
        </Button>
      </div>
    </DialogContent>
  )
}