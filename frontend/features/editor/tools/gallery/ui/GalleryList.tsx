import stylex from "@stylexjs/stylex"
import { For, Match, Switch } from "solid-js"
import { useGalleryDataContext } from "../data"
import { 
  getGalleryItemUrl, 
  MEDIA_TYPE__IMAGE 
} from "~/api/journal"
import { useJournalContext } from "~/features/journal"

const style = stylex.create({
  gallery: {
    backgroundColor: 'var(--gray3)',
    borderRadius: 10,
    minHeight: '10rem',
    marginBottom: 10,
    paddingBlock: 10,
    paddingInline: 15
  },
  galleryItem: {
    width: 50,
    height: 50,
  }
})

export function GalleryList() {
  const { images$, galleryId$ } = useGalleryDataContext()
  const { getCurrentGroup$ } = useJournalContext()
  
  return (
    <div {...stylex.attrs(style.gallery)}>
      <For each={images$()}>
        {it => (
          <Switch>
            <Match when={it.type === MEDIA_TYPE__IMAGE}>
              <img 
                {...stylex.attrs(style.galleryItem)} 
                src={getGalleryItemUrl(getCurrentGroup$().id, galleryId$, it.name)} 
              />
            </Match>
          </Switch>
        )}
      </For>
    </div>
  )
}