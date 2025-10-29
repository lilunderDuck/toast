import { Tooltip } from "~/components";
import { useJournalContext } from "../../provider";
import { Show } from "solid-js";
import { BsLayoutSidebarInset, BsWindowFullscreen } from "solid-icons/bs";

interface IHideSidebarButtonProps {
  // define your component props here
}

export function HideSidebarButton(props: IHideSidebarButtonProps) {
  const { sidebar$ } = useJournalContext()
  
  return (
    <Tooltip label$={`${sidebar$.isHidden$() ? "Show" : "Hide"} sidebar`}>
      <button onClick={sidebar$.toggle$}>
        <Show when={sidebar$.isHidden$()} fallback={
          <BsLayoutSidebarInset />
        }>
          <BsWindowFullscreen />
        </Show>
      </button>
    </Tooltip>
  )
}