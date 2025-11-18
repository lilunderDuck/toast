import { A } from "@solidjs/router"
import { BiRegularTestTube } from "solid-icons/bi"
import { BsLink45deg } from "solid-icons/bs"
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "~/components"
import type { IDropdownMenu } from "~/hooks"

interface IJournalListHeaderDropdownProps extends IDropdownMenu {}

export default function JournalListHeaderDropdown(props: IJournalListHeaderDropdownProps) {
  return (
    <DropdownMenuContent>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <BsLink45deg />
        <A href="/technical" data-link-no-color>
          Nerdy stuff
        </A>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <BiRegularTestTube />
        <A href="/test" data-link-no-color>
          Testing place
        </A>
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}