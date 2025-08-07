import { Match, Switch } from "solid-js"
// ...
import { IGalleryContext, useGalleryContext } from "../provider"
import { Video } from "../../video"

interface IGalleryContentProps {
  context$?: IGalleryContext
}

export function GalleryContent(props: IGalleryContentProps) {
  const { getDisplayUrl$, currentItem$ } = useGalleryContext() ?? props.context$

  return (
    <Switch>
      <Match when={currentItem$()?.type === 1}>
        <Video path={getDisplayUrl$(currentItem$().name)} />
      </Match>
    </Switch>
  )
}