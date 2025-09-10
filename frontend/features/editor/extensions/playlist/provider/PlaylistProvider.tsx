import { type Accessor, createContext, createSignal, type ParentProps, useContext } from "solid-js"
import { createStore } from "solid-js/store"
import { useNodeState } from "~/features/editor/utils"
import { CreatePlaylist, UpdatePlaylistData } from "~/wailsjs/go/editor/EditorExport"
import type { editor } from "~/wailsjs/go/models"
import type { PlaylistAttribute } from "../extension"

interface IPlaylistContext {
  data$: () => editor.PlaylistMetadata | undefined
  create$(options: editor.PlaylistOptions): Promise<void>
  edit$(options: editor.PlaylistOptions): Promise<editor.PlaylistMetadata>
  addTrack$(options: editor.PlaylistItemOptions): Promise<editor.PlaylistItemData>
  updateTrack$(id: number, options: editor.PlaylistItemOptions): Promise<editor.PlaylistItemData>
  deleteTrack$(id: number): Promise<void>
  isEmpty$: Accessor<boolean>
}

const Context = createContext<IPlaylistContext>()

export function PlaylistProvider(props: ParentProps) {
  const [data, setData] = createStore() as SolidStore<editor.PlaylistMetadata | undefined>

  const { updateAttribute$, data$ } = useNodeState<PlaylistAttribute>()
  const [isEmpty, setIsEmpty] = createSignal(data$().id === -1)

  const createPlaylist: IPlaylistContext["create$"] = async(options) => {
    const newData = await CreatePlaylist(options)
    updateAttribute$('id', newData.id!)
    setData(newData)
    setIsEmpty(true)
  }

  const editPlaylist: IPlaylistContext["edit$"] = async(options) => {
    const updatedData = await UpdatePlaylistData(data$().id, options)
    setData(updatedData)
  }

  const addTrack

  return (
    <Context.Provider value={{
      create$: createPlaylist,
      data$: () => data,

    }}>
      {props.children}
    </Context.Provider>
  )
}

export function usePlaylistContext() {
  return useContext(Context)!
}