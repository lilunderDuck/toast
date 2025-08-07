import { BsArrowClockwise, BsBoxArrowUpRight, BsFullscreen } from "solid-icons/bs";
import { DropdownMenuContent, DropdownMenuItem } from "~/components";

export default function EmbedDropdownMenu() {
  return (
    <DropdownMenuContent>
      <DropdownMenuItem>
        <BsArrowClockwise />
        Reload
      </DropdownMenuItem>
      <DropdownMenuItem>
        <BsBoxArrowUpRight />
        Open in your browser
      </DropdownMenuItem>
      <DropdownMenuItem>
        <BsFullscreen />
        Open in full view
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}