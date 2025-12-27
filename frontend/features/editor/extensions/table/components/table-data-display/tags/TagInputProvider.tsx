import { createContext, createSignal, ParentProps, useContext, type Accessor } from "solid-js"
// ...
import { arrayObjects } from "~/utils"
// ...
import { useTableContext, type TagColumnData, type TagData } from "../../../provider"

interface ITagHint {
  name$: string
}

interface ITagInputContext {
  /**Stores all currently selected tags. */
  selectedOptions$: Accessor<TagData[]>
  /**Stores all available options. 
   * This list is automatically filtered based on the current search query. 
   */
  allOptions$: Accessor<TagData[]>
  /**Provides a hint if the user has typed a query that is 
   * not yet an available tag. 
   */
  tagHint$: Accessor<ITagHint | undefined>
  /**Adds or removes a tag, basically */
  toggleSelect$(tagData: TagData): void
  /**Checks if a tag name is currently selected.
   * @param tagName the tag name to be searched
   */
  isInSelectedOptions$(tagName: string): boolean
  /**Clears the current search query */
  cleanSearchResult$(): void
  /**Searches all available tag(s) */
  startSearching$(query: string): void
  createNewTag$(name: string, color: string): void
}

const Context = createContext<ITagInputContext>()

interface ITagInputProviderProps {
  value$: TagData[]
  options$: TagData[]
  columnId$: string
  onChange$(tags: TagData[]): void
}

export function TagInputProvider(props: ParentProps<ITagInputProviderProps>) {
  if (isDevMode) {
    if (!Array.isArray(props.options$)) {
      console.warn(
        '[table - TagInputProvider] Tag props.options$ prop should be an array.\n',
        'Current props.options$ value is:', props.options$, "\n",
        'It will be reset back to empty array ->', []
      )
    }
  }

  const [selectedOptions, setSelectedOptions] = createSignal(props.value$ ?? [])
  const [allOptions, setAllOptions] = createSignal<TagData[]>(props.options$ ?? [])
  const [tagHint, setTagHint] = createSignal<ITagHint>()

  const { columns$ } = useTableContext()

  // FIXME: really inefficient look-ups
  const findTag = (tags: TagData[], name: string) => tags.find(it => it.name === name)
  const isInSelectedOptions = (tagName: string) => !!findTag(selectedOptions(), tagName)
  const isInAllOptions = (tagName: string) => !!findTag(allOptions(), tagName)

  const toggleSelect = (tagData: TagData) => {
    isInSelectedOptions(tagData.name) ? removeTag(tagData) : addTag(tagData)
    console.log("[table - TagInputProvider] toggle select tag", tagData)
  }

  const addTag = (tagData: TagData) => {
    setSelectedOptions(prev => [...prev, tagData])
    props.onChange$(selectedOptions())
  }

  const removeTag = (tagData: TagData) => {
    setSelectedOptions(prev => arrayObjects(prev).remove$('name', tagData.name))
    props.onChange$(selectedOptions())
  }

  const createNewTag = (name: string, color: string) => {
    const tagData = { name, color }
    columns$.updateData$<TagColumnData>(props.columnId$, (prev) => {
      if (isDevMode) {
        if (!prev.additionalData?.tags) {
          console.warn(
            '[table - TagInputProvider] Missing additional data: \"tags\" for this tag column.',
            'It could be because the column is incorrectly created.',
            'It will be reset back to ->', []
          )
        }
      }

      const tagsData: TagData[] = prev.additionalData?.tags ?? []
      tagsData.push(tagData)
      console.log('[table - TagInputProvider] all tags data:', tagsData)
      return {
        additionalData: {
          tags: tagsData
        }
      }
    })

    addTag(tagData)
    setAllOptions(prev => [...prev, tagData])
    console.log("[table - TagInputProvider] new tag created:", tagData)
  }

  // Store all options to this variable when searching.
  // Because I don't want to use another signal just for the search results,
  // I'm gonna reuse the allOptions state instead.
  let cachedAllOptions: TagData[] | undefined
  const startSearching = (query: string) => {
    if (query === "") {
      return cleanSearchResult()
    }

    // Storing all of the tag options somewhere so we can restore it later.
    if (!cachedAllOptions) {
      cachedAllOptions = allOptions()
    }

    // Show hint if there's no tags exist with that name.
    if (!isInAllOptions(query)) {
      setTagHint({ name$: query })
    } else {
      setTagHint(undefined)
    }

    // Do some basic filtering stuff.
    const searchResult = cachedAllOptions.filter(it => it.name.includes(query))

    setAllOptions(searchResult)
    console.log("[table - TagInputProvider] search query:", query, "result:", searchResult)
  }

  const cleanSearchResult = () => {
    // Avoid getting zero result when opening the select tag option menu.
    // This can be done by not searching anything and then clicking outside
    // to close the popover
    if (!cachedAllOptions) return console.log("[table - TagInputProvider] no need to clean search result")

    setAllOptions(cachedAllOptions!)
    setTagHint(undefined)
    cachedAllOptions = undefined
    console.log("[table - TagInputProvider] search result cleaned")
  }

  return (
    <Context.Provider value={{
      isInSelectedOptions$: isInSelectedOptions,
      toggleSelect$: toggleSelect,
      cleanSearchResult$: cleanSearchResult,
      selectedOptions$: selectedOptions,
      allOptions$: allOptions,
      startSearching$: startSearching,
      tagHint$: tagHint,
      createNewTag$: createNewTag
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useTagInputContext() {
  return useContext(Context)!
}