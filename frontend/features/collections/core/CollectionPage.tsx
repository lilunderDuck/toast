import { For, Show } from "solid-js"
import { RiMediaGalleryFill, RiMediaPlayList2Fill } from "solid-icons/ri"
import { FaSolidExternalLinkAlt } from "solid-icons/fa"
import { BsPlus } from "solid-icons/bs"
// ...
import { css } from "molcss"
// ...
import type { collections } from "~/wailsjs/go/models"
import { playlistIconUrl } from "~/features/playlist/api"
import { createLazyComponent } from "~/hooks"
import { ASSETS_SERVER_URL, COLLECTION_TYPE_MAGIC_ROUTE_NAME_REGISTRY, COLLECTION_TYPE_NAME_REGISTRY } from "~/api"
import type { ActionHandlerFn, EventHandler } from "~/utils"
import { Input } from "~/components"
import { scrollbar, scrollbar__invs, scrollbar__vertical } from "~/styles"
// ...
import { CollectionCreateButton, CollectionExternalSectionButtonRow, CollectionItem, CollectionSection } from "../components"
import { useCollectionPageContext } from "../provider/CollectionPageProvider"

const collection__extraSpaces = css`
  height: 10rem;
`

export default function CollectionPage() {
  const context = useCollectionPageContext()
  const { collections$, collectionAvailableMap$, checkIfExternalCollectionAvailable$, searchByName$ } = context

  const sectionActionHandler: ActionHandlerFn<CollectionExternalSectionAction> = (type) => {
    switch (type) {
      case CollectionExternalSectionAction.CHECK_FOR_AVAILABILITY:
        checkIfExternalCollectionAvailable$()
      break;
    }
  }

  const OpenExternalCollectionDialog = createLazyComponent(
    LazyComponentType.DIALOG,
    () => import("../components/dialog/OpenExternalCollectionDialog"),
    () => ({
      context$: context
    })
  )

  const externalCollectionUrl = (data: collections.CollectionExternalSourceData) => {
    const typeName = COLLECTION_TYPE_NAME_REGISTRY[data.type as CollectionType]
    const magicRoute = COLLECTION_TYPE_MAGIC_ROUTE_NAME_REGISTRY[data.type as CollectionType]
    return `/collection/${typeName}/${magicRoute}?directory=${encodeURI(data.collectionPath)}` as const
  }
  // ...

  const iconUrl = (iconFileName: string) => `${ASSETS_SERVER_URL}/local-assets/cache/${iconFileName}` as const

  const searchHandler: EventHandler<"input", "onInput"> = (inputEvent) => {
    searchByName$(inputEvent.currentTarget.value)
  }

  const CreatePlaylistDialog = createLazyComponent(
    LazyComponentType.DIALOG,
    () => import("../components/dialog/CreatePlaylistDialog"),
    () => ({})
  )

  const CreateGalleryDialog = createLazyComponent(
    LazyComponentType.DIALOG,
    () => import("../components/dialog/CreatePlaylistDialog"),
    () => ({})
  )

  return (
    <main class={`journalHome__mainContent ${scrollbar} ${scrollbar__vertical} ${scrollbar__invs}`}>
      <h1>Collection</h1>

      <Input 
        placeholder="Search collection"
        onInput={searchHandler}
      />

      <CollectionSection
        icon$={RiMediaPlayList2Fill} 
        label$="Playlist" 
      >
        <Show when={collections$()?.playlists}>
          <For each={collections$()!.playlists}>
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
        <CollectionCreateButton 
          icon$={<BsPlus size={30} />} 
          onClick$={CreatePlaylistDialog.show$}
        />
      </CollectionSection>

      <CollectionSection
        icon$={RiMediaGalleryFill} 
        label$="Gallery" 
      >
        <Show when={collections$()?.galleries}>
          <For each={collections$()?.galleries}>
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
        <CollectionCreateButton 
          icon$={<BsPlus size={30} />} 
          onClick$={CreateGalleryDialog.show$}
        />
      </CollectionSection>

      <CollectionSection
        icon$={FaSolidExternalLinkAlt} 
        label$="External sources" 
        labelTools$={<CollectionExternalSectionButtonRow action$={sectionActionHandler} />}
      >
        <Show when={collections$()?.externalSources}>
          <For each={collections$()?.externalSources}>
            {it => (
              <CollectionItem 
                href$={externalCollectionUrl(it)}
                iconUrl$={iconUrl(it.icon)}
                name$={it.name}
                tooltipLabel$={it.name}
                isAvailable$={collectionAvailableMap$()![it.id]}
              />
            )}
          </For>
        </Show>
        <CollectionCreateButton 
          icon$={<FaSolidExternalLinkAlt />} 
          onClick$={OpenExternalCollectionDialog.show$}
          tooltipLabel$="Import collections"
        />
      </CollectionSection>

      <div class={collection__extraSpaces} />

      <OpenExternalCollectionDialog.Component$ />
      <CreatePlaylistDialog.Component$ />
    </main>
  )
}