import { createSignal, For, onCleanup, onMount, Show } from "solid-js"
import { RiMediaGalleryFill, RiMediaPlayList2Fill } from "solid-icons/ri"
// ...
import { css } from "molcss"
import "../core/MainPageRoot.css"
// ...
import { Playlist_getAll, Playlist_init, Playlist_resyncAll } from "~/wailsjs/go/playlist/Exports"
import type { playlist } from "~/wailsjs/go/models"
import { playlistIconUrl } from "~/features/playlist/api"
// ...
import { CollectionItem, CollectionSection, type ICollectionSectionProps } from "../components"

const collection = css`
  width: 100%;
  height: 100%;
  user-select: none;
`

interface ICollections {
  playlist$: playlist.PlaylistData[]
}

export default function Collection() {
  const [collections, setCollections] = createSignal<ICollections | null>(null)
  onMount(async() => {
    await Playlist_init()
    setCollections({
      playlist$: await Playlist_getAll()
    })
  })

  onCleanup(Playlist_init)

  const playlistActionHandler: ICollectionSectionProps["action$"] = async(type) => {
    switch (type) {
      case CollectionSectionAction.RESYNC_COLLECTION:
        const updatedPlaylist = await Playlist_resyncAll()
        setCollections(prev => ({ ...prev, playlist$: updatedPlaylist }))
      break;
    
      default:
        break;
    }
  }
  
  return (
    <main class={`${collection} journalHome__mainContent`}>
      <h1>Collection</h1>
      <CollectionSection 
        icon$={RiMediaPlayList2Fill} 
        label$="Playlist" 
        action$={playlistActionHandler}
      >
        <Show when={collections()}>
          <For each={collections()?.playlist$ ?? []}>
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
      </CollectionSection>

      <CollectionSection 
        icon$={RiMediaGalleryFill} 
        label$="Gallery" 
        action$={() => {}}
      >
        <Show when={collections()}>
          <></>
        </Show>
      </CollectionSection>
    </main>
  )
}