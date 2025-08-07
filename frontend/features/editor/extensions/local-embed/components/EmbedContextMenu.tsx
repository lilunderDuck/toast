import { BsArrowClockwise, BsBoxArrowUpRight, BsFullscreen } from "solid-icons/bs";
import { ContextMenuContent, ContextMenuItem } from "~/components";

export default function EmbedContextMenu() {
  return (
    <ContextMenuContent>
      <ContextMenuItem>
        <BsArrowClockwise />
        Reload
      </ContextMenuItem>
      <ContextMenuItem>
        <BsBoxArrowUpRight />
        Open in your browser
      </ContextMenuItem>
      <ContextMenuItem>
        <BsFullscreen />
        Open in full view
      </ContextMenuItem>
    </ContextMenuContent>
  )
}