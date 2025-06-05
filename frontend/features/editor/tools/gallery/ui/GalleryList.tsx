import { For, Match, Switch } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { 
  getGalleryItemUrl, 
  MEDIA_TYPE__IMAGE 
} from "~/api/journal"
import { useJournalContext } from "~/features/journal"
import { FlexCenterY } from "~/components"
// ...
import { useGalleryDataContext } from "../data"

const style = stylex.create({
  gallery: {
    backgroundColor: 'var(--gray3)',
    borderRadius: 10,
    minHeight: 60,
    marginBottom: 10,
    paddingBlock: 10,
    paddingInline: 15,
    gap: 10,
    flexWrap: "wrap"
  },
  galleryItem: {
    width: 60,
    height: 60,
    borderRadius: 6,
    flexShrink: 0
  }
})

export function GalleryList() {
  const { galleryItem$, galleryId$ } = useGalleryDataContext()
  const { getCurrentGroup$ } = useJournalContext()
  
  return (
    <FlexCenterY {...stylex.attrs(style.gallery)}>
      <For each={galleryItem$()}>
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
    </FlexCenterY>
  )
}