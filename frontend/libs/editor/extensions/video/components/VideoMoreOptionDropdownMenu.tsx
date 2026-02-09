import { DropdownMenuContent, DropdownMenuItem } from "~/components";
import type { IBaseDropdownMenu } from "~/hooks";

interface IVideoMoreOptionDropdownMenuProps extends IActionHandler<VideoMoreOptionAction>, IBaseDropdownMenu {
  // define your component props here
}

export default function VideoMoreOptionDropdownMenu(props: IVideoMoreOptionDropdownMenuProps) {
  return (
    <DropdownMenuContent>
      <DropdownMenuItem onClick={() => props.action$(VideoMoreOptionAction.PICK_VIDEO)}>
        Select a video
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}