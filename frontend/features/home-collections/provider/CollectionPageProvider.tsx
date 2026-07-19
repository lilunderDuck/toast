import { DEBUG_ASSERT, DEBUG_INFO_LABEL } from "macro-def"
import { createContext, createSignal, onMount, ParentProps, useContext, type Accessor, type Setter } from "solid-js"
// ...
import { type SetStoreFunction } from "solid-js/store"
import { createToastRegistry, type IToastRegistry } from "~/hooks"
// ...
import { wrapFn } from "~/utils"
import { Collections_checkExternalAvailability, Collections_getAll, Collections_update } from "~/wailsjs/go/collections/Exports"
import type { collections } from "~/wailsjs/go/models"

export type CollectionExternalAvailabilityMap = Record<string, boolean>

type CollectionPageToastRegistry = {
  InvalidPlaylistToast$: Promise<typeof import("../components/toast/InvalidPlaylistToast")>
  CollectionNotAvaliableToast$: Promise<typeof import("../components/toast/CollectionNotAvaliableToast")>
}

export interface ICollectionPageContext {
  collections$: Accessor<collections.CollectionsData | null>
  updateCollections$: Setter<collections.CollectionsData>
  collectionAvailableMap$: Accessor<CollectionExternalAvailabilityMap | null>
  checkIfExternalCollectionAvailable$(): Promise<void>
  searchByName$(name: string): void
  readonly toastRegistry$: IToastRegistry<CollectionPageToastRegistry>
}

const Context = createContext<ICollectionPageContext>()

interface ICollectionPageProviderProps {
  // insert your context props here
}

export function CollectionPageProvider(props: ParentProps<ICollectionPageProviderProps>) {
  // @ts-ignore - initilize store with a null value
  const [collections, setCollections] = createSignal<collections.CollectionsData>(null)
  const [collectionAvailableMap, setCollectionAvailableMap] = createSignal<CollectionExternalAvailabilityMap | null>(null)

  onMount(async() => {
    await checkIfAvailable()
    const collectionsData = await Collections_getAll()

    DEBUG_ASSERT(Array.isArray(collectionsData.galleries), "collectionsData.galleries is not an array, thing might break!")
    DEBUG_ASSERT(Array.isArray(collectionsData.playlists), "collectionsData.playlists is not an array, thing might break!")
    DEBUG_ASSERT(Array.isArray(collectionsData.externalSources), "collectionsData.externalSources is not an array, thing might break!")

    setCollections(collectionsData)
    DEBUG_INFO_LABEL("home", "collection data fetched", collections())
  })

  const checkIfAvailable = async() => {
    setCollectionAvailableMap(await Collections_checkExternalAvailability())
    DEBUG_INFO_LABEL("home", "checked all external collections availability, result:", collectionAvailableMap())
    DEBUG_ASSERT(collectionAvailableMap(), "available map returns an invalid type: null")
  }

  const setCollectionsWrap: SetStoreFunction<collections.CollectionsData> = wrapFn(setCollections, () => {
    Collections_update(collections())
  })

  let cachedCollections!: collections.CollectionsData | undefined
  const searchByName = (name: string) => {
    if (!cachedCollections) {
      cachedCollections = collections()
    }

    if (name === "") {
      setCollections(cachedCollections)
      cachedCollections = undefined
      return
    }

    DEBUG_INFO_LABEL("collection", "data", collections())

    setCollections(it => ({
      galleries: it.galleries.filter(it => it.name.toLowerCase().includes(name.toLowerCase())),
      playlists: it.playlists.filter(it => it.name.toLowerCase().includes(name.toLowerCase())),
      externalSources: it.externalSources.filter(it => it.name.toLowerCase().includes(name.toLowerCase())),
    } as collections.CollectionsData))
    DEBUG_INFO_LABEL("collection", "search result:", collections())
  }

  const toastRegistry = createToastRegistry({
    InvalidPlaylistToast$: import("../components/toast/InvalidPlaylistToast"),
    CollectionNotAvaliableToast$: import("../components/toast/CollectionNotAvaliableToast")
  })
  
  return (
    <Context.Provider value={{
      collections$: collections,
      updateCollections$: setCollectionsWrap,
      collectionAvailableMap$: collectionAvailableMap,
      checkIfExternalCollectionAvailable$: checkIfAvailable,
      searchByName$: searchByName,
      toastRegistry$: toastRegistry
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useCollectionPageContext() {
  return useContext(Context)!
}