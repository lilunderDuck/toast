import { createSignal, For, onCleanup, onMount, Show } from "solid-js";
import { RiMediaGalleryFill, RiMediaPlayList2Fill } from "solid-icons/ri";
// ...
import stylex from "@stylexjs/stylex"
// ...
import { Playlist_getAll, Playlist_init, Playlist_resyncAll } from "~/wailsjs/go/playlist/Exports";
import type { playlist } from "~/wailsjs/go/models";
import { playlistIconUrl } from "~/features/playlist/api";
// ...
import { CollectionItem, CollectionSection, type ICollectionSectionProps } from "../components";

interface ICollections {
  playlist$: playlist.PlaylistData[]
}

const style = stylex.create({
  collection: {
    width: "100%",
    height: '100%',
    userSelect: "none"
  },
  collection__list: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    minHeight: "10rem"
  }
})

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
      case "resync_collection$":
        const updatedPlaylist = await Playlist_resyncAll()
        setCollections(prev => ({ ...prev, playlist$: updatedPlaylist }))
      break;
    
      default:
        break;
    }
  }
  
  return (
    <main {...stylex.attrs(style.collection)} id="journalHome__mainContent">
      <h1>Collection</h1>
      <CollectionSection icon$={RiMediaPlayList2Fill} label$="Playlist" action$={playlistActionHandler}>
        <div {...stylex.attrs(style.collection__list)}>
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
        </div>
      </CollectionSection>

      <CollectionSection icon$={RiMediaGalleryFill} label$="Gallery">
        <div {...stylex.attrs(style.collection__list)}>
          <Show when={collections()}>
            <></>
          </Show>
        </div>
      </CollectionSection>
    </main>
  )
}