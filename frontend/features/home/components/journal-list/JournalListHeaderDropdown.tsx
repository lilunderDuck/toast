import { A } from "@solidjs/router";
import { BsLink45deg } from "solid-icons/bs";
import { DropdownMenuContent, DropdownMenuItem, type IDropdownMenu } from "~/components";

interface IJournalListHeaderDropdownProps extends IDropdownMenu {}

export default function JournalListHeaderDropdown(props: IJournalListHeaderDropdownProps) {
  return (
    <DropdownMenuContent>
      <DropdownMenuItem>
        <BsLink45deg />
        <A href="/technical">
          Nerdy stuff
        </A>
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}