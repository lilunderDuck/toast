import { createSignal, For, onMount, Show } from "solid-js"
import { RiMediaGalleryFill, RiMediaPlayList2Fill } from "solid-icons/ri"
import { FaSolidExternalLinkAlt } from "solid-icons/fa"
import { MdRoundWarning } from "solid-icons/md"
import { BsPlus } from "solid-icons/bs"
// ...
import { css } from "molcss"
import "../core/MainPageRoot.css"
// ...
import type { collections } from "~/wailsjs/go/models"
import { playlistIconUrl } from "~/features/playlist/api"
import { Collections_getAll } from "~/wailsjs/go/collections/Exports"
import { createLazyLoadedDialog } from "~/hooks"
import { COLLECTION_TYPE_MAGIC_MAPPING, COLLECTION_TYPE_NAME_MAPPING, previewUrl } from "~/api"
// ...
import { CollectionCreateButton, CollectionItem, CollectionSection } from "../components"

const collection = css`
  width: 100%;
  height: 100%;
  user-select: none;
`

const collection__extraSpaces = css`
  height: 10rem;
`

const collection__externalSourcesNoteWrap = css`
  padding-top: 15px;
`

const collection__externalSourcesNote = css`
  color: var(--peach);
  display: flex;
  align-items: center;
  gap: 5px;
`

export default function Collection() {
  const [collections, setCollections] = createSignal<collections.CollectionsData | null>(null)
  onMount(async() => {
    setCollections(await Collections_getAll())
  })

  const OpenExternalCollectionDialog = createLazyLoadedDialog(
    () => import("../components/dialog/OpenExternalCollectionDialog")
  )

  const externalCollectionUrl = (data: collections.CollectionExternalSourceData) =>
    `/collection/${COLLECTION_TYPE_NAME_MAPPING[data.type]}/${COLLECTION_TYPE_MAGIC_MAPPING[data.type]}?directory=${encodeURI(data.collectionPath)}` as const
  // ...

  return (
    <main class={`${collection} journalHome__mainContent scrollbar scrollbarVertical invsScrollbar`}>
      <h1>Collection</h1>
      <CollectionSection
        icon$={RiMediaPlayList2Fill} 
        label$="Playlist" 
        action$={() => {}}
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
        action$={() => {}}
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
        description$={<>
          Collections opened outside the app will be saved here. 
          
          <p class={collection__externalSourcesNoteWrap}>
            <span class={collection__externalSourcesNote}>
              <MdRoundWarning />
              Note:
            </span> 
            If a collection is moved or renamed on your drive, 
            <br />
            you have to re-imported it.
          </p>
        </>}
        action$={() => {}}
      >
        <Show when={collections()?.externalSources}>
          <For each={collections()?.externalSources}>
            {it => (
              <CollectionItem 
                href$={externalCollectionUrl(it)}
                iconUrl$={previewUrl(it.icon)}
                name$={it.name}
                tooltipLabel$={it.name}
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