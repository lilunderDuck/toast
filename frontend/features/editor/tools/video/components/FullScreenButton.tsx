import { BsFullscreen } from "solid-icons/bs"
import { Button, ButtonSizeVariant, Tooltip } from "~/components"

export default function FullScreenButton(props: HTMLAttributes<"button">) {
  return (
    <Tooltip label$="Enter fullscreen">
      <Button
        {...props}
        size$={ButtonSizeVariant.icon}
      >
        <BsFullscreen size={15} />
      </Button>
    </Tooltip>
  )
}