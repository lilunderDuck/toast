import { createContext, onMount, type ParentProps, useContext } from "solid-js"
import { createStore } from "solid-js/store"
// ...
import { useNodeState } from "~/features/editor/utils"
import { CreatePlaylist, UpdatePlaylistData, CreatePlaylistItem, GetPlaylist } from "~/wailsjs/go/editor/EditorExport"
import type { editor } from "~/wailsjs/go/models"
// ...
import type { PlaylistAttribute } from "../extension"

export interface IPlaylistContext {
  data$: () => editor.PlaylistMetadata | undefined
  createPlaylist$(options: editor.PlaylistOptions): Promise<void>
  editPlaylist$(options: editor.PlaylistOptions): Promise<void>
  addTrack$(options: editor.PlaylistItemOptions): Promise<void>
  updateTrack$(id: number, options: editor.PlaylistItemOptions): Promise<editor.PlaylistItemData>
  deleteTrack$(id: number): Promise<void>
}

const Context = createContext<IPlaylistContext>()

export function PlaylistProvider(props: ParentProps) {
  const [data, setData] = createStore() as SolidStore<editor.PlaylistMetadata | undefined>

  const { updateAttribute$, data$ } = useNodeState<PlaylistAttribute>()
  const playlistId = () => data$().id

  const createPlaylist: IPlaylistContext["createPlaylist$"] = async(options) => {
    const newData = await CreatePlaylist(options)
    updateAttribute$('id', newData.id!)
    setData(newData)
  }

  const editPlaylist: IPlaylistContext["editPlaylist$"] = async(options) => {
    const updatedData = await UpdatePlaylistData(playlistId(), options)
    setData(updatedData)
  }

  const addTrack: IPlaylistContext["addTrack$"] = async(options) => {
    const itemData = await CreatePlaylistItem(playlistId(), options)
    setData("items", prev => [...prev!, itemData])
    await UpdatePlaylistData(playlistId(), {
      items: data!.items
    } as editor.PlaylistOptions)
  }

  onMount(async() => {
    let playlistData: editor.PlaylistMetadata 
    if (playlistId() === -1) {
      playlistData = await CreatePlaylist({
        title: "",
        description: ""
      } as editor.PlaylistOptions)
      updateAttribute$('id', playlistData.id!)
    } else {
      playlistData = await GetPlaylist(playlistId())
    }
    
    setData(playlistData)
  })

  return (
    <Context.Provider value={{
      createPlaylist$: createPlaylist,
      editPlaylist$: editPlaylist,
      data$: () => data,
      addTrack$: addTrack,
      deleteTrack$: null,
      updateTrack$: null
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function usePlaylistContext() {
  return useContext(Context)!
}