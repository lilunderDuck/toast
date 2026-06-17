import { createSignal, For, onMount, Show } from "solid-js"
import { DEBUG_ASSERT, DEBUG_INFO_LABEL } from "macro-def"
import { RiMediaGalleryFill, RiMediaPlayList2Fill } from "solid-icons/ri"
import { FaSolidExternalLinkAlt } from "solid-icons/fa"
import { BsPlus } from "solid-icons/bs"
// ...
import { css } from "molcss"
import "../core/MainPageRoot.css"
// ...
import type { collections } from "~/wailsjs/go/models"
import { playlistIconUrl } from "~/features/playlist/api"
import { Collections_checkExternalAvailability, Collections_getAll } from "~/wailsjs/go/collections/Exports"
import { createLazyLoadedDialog } from "~/hooks"
import { ASSETS_SERVER_URL, COLLECTION_TYPE_MAGIC_MAPPING, COLLECTION_TYPE_NAME_MAPPING } from "~/api"
import type { ActionHandlerFn } from "~/utils"
// ...
import { CollectionCreateButton, CollectionExternalSectionButtonRow, CollectionExternalSectionDescription, CollectionItem, CollectionSection } from "../components"

const collection = css`
  width: 100%;
  height: 100%;
  user-select: none;
`

const collection__extraSpaces = css`
  height: 10rem;
`

export default function Collection() {
  const [collections, setCollections] = createSignal<collections.CollectionsData | null>(null)
  const [collectionAvailableMap, setCollectionAvailableMap] = createSignal<Record<string, boolean> | null>(null)

  onMount(async() => {
    await checkIfAvailable()
    setCollections(await Collections_getAll())
    DEBUG_INFO_LABEL("home", "collection data fetched", collections())
  })

  const checkIfAvailable = async() => {
    setCollectionAvailableMap(await Collections_checkExternalAvailability())
    DEBUG_INFO_LABEL("home", "checked all external collections availability, result:", collectionAvailableMap())
    DEBUG_ASSERT(collectionAvailableMap(), "available map returns an invalid type: null")
  }

  const sectionActionHandler: ActionHandlerFn<CollectionExternalSectionAction> = (type) => {
    switch (type) {
      case CollectionExternalSectionAction.CHECK_FOR_AVAILABILITY:
        checkIfAvailable()
      break;
    }
  }

  const OpenExternalCollectionDialog = createLazyLoadedDialog(
    () => import("../components/dialog/OpenExternalCollectionDialog")
  )

  const externalCollectionUrl = (data: collections.CollectionExternalSourceData) =>
    `/collection/${COLLECTION_TYPE_NAME_MAPPING[data.type as CollectionType]}/${COLLECTION_TYPE_MAGIC_MAPPING[data.type as CollectionType]}?directory=${encodeURI(data.collectionPath)}` as const
  // ...

  const iconUrl = (iconFileName: string) => `${ASSETS_SERVER_URL}/local-assets/cache/${iconFileName}` as const

  return (
    <main class={`${collection} journalHome__mainContent scrollbar scrollbarVertical invsScrollbar`}>
      <h1>Collection</h1>
      <CollectionSection
        icon$={RiMediaPlayList2Fill} 
        label$="Playlist" 
      >
        <Show when={collections()?.playlists}>
          <For each={collections()!.playlists}>
            {it => (
              <CollectionItem 
                href$={`/collection/playlist/${it.id}`}
                iconUrl$={playlistIconUrl(it.id, it.icon ?? "")}
                name$={it.name}
                tooltipLabel$={it.name}
              />
            )}
          </For>
        </Show>
        <CollectionCreateButton icon$={<BsPlus size={30} />} />
      </CollectionSection>

      <CollectionSection
        icon$={RiMediaGalleryFill} 
        label$="Gallery" 
      >
        <Show when={collections()?.galleries}>
          <For each={collections()?.galleries}>
            {it => (
              <CollectionItem 
                href$={`/collection/playlist/${it.id}`}
                iconUrl$={playlistIconUrl(it.id, it.icon ?? "")}
                name$={it.name}
                tooltipLabel$={it.name}
              />
            )}
          </For>
        </Show>
        <CollectionCreateButton icon$={<BsPlus size={30} />} />
      </CollectionSection>

      <CollectionSection
        icon$={FaSolidExternalLinkAlt} 
        label$="External sources" 
        description$={<CollectionExternalSectionDescription />}
        labelTools$={<CollectionExternalSectionButtonRow action$={sectionActionHandler} />}
      >
        <Show when={collections()?.externalSources}>
          <For each={collections()?.externalSources}>
            {it => (
              <CollectionItem 
                href$={externalCollectionUrl(it)}
                iconUrl$={iconUrl(it.icon)}
                name$={it.name}
                tooltipLabel$={it.name}
                isAvailable$={collectionAvailableMap()![it.id]}
              />
            )}
          </For>
        </Show>
        <CollectionCreateButton 
          icon$={<FaSolidExternalLinkAlt />} 
          onClick$={OpenExternalCollectionDialog.show$}
        />
      </CollectionSection>

      <div class={collection__extraSpaces} />

      <OpenExternalCollectionDialog.Dialog$ />
    </main>
  )
}