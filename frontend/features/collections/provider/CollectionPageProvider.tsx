import { DEBUG_ASSERT, DEBUG_INFO_LABEL } from "macro-def"
import { createContext, createSignal, onMount, ParentProps, useContext, type Accessor } from "solid-js"
import { createStore, type SetStoreFunction } from "solid-js/store"
import { wrapFn } from "~/utils"
import { Collections_checkExternalAvailability, Collections_getAll, Collections_update } from "~/wailsjs/go/collections/Exports"
import type { collections } from "~/wailsjs/go/models"

export interface ICollectionPageContext {
  collections$: collections.CollectionsData | null
  setCollections$: SetStoreFunction<collections.CollectionsData>
  collectionAvailableMap$: Accessor<Record<string, boolean> | null>
  checkIfExternalCollectionAvailable$(): Promise<void>
}

const Context = createContext<ICollectionPageContext>()

interface ICollectionPageProviderProps {
  // insert your context props here
}

export function CollectionPageProvider(props: ParentProps<ICollectionPageProviderProps>) {
  // @ts-ignore - initilize store with a null value
  const [collections, setCollections] = createStore<collections.CollectionsData>(null)
  const [collectionAvailableMap, setCollectionAvailableMap] = createSignal<Record<string, boolean> | null>(null)

  onMount(async() => {
    await checkIfAvailable()
    setCollections(await Collections_getAll())
    DEBUG_INFO_LABEL("home", "collection data fetched", collections)
  })

  const checkIfAvailable = async() => {
    setCollectionAvailableMap(await Collections_checkExternalAvailability())
    DEBUG_INFO_LABEL("home", "checked all external collections availability, result:", collectionAvailableMap())
    DEBUG_ASSERT(collectionAvailableMap(), "available map returns an invalid type: null")
  }

  const setCollectionsWrap: SetStoreFunction<collections.CollectionsData> = wrapFn(setCollections, () => {
    Collections_update(collections)
  })
  
  // (...args: any[]) => {
  //   setCollections(...args)
  //   Collections_update(collections)
  // }

  return (
    <Context.Provider value={{
      collections$: collections,
      setCollections$: setCollectionsWrap,
      collectionAvailableMap$: collectionAvailableMap,
      checkIfExternalCollectionAvailable$: checkIfAvailable
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useCollectionPageContext() {
  return useContext(Context)!
}