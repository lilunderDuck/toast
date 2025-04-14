import { BsFullscreen } from "solid-icons/bs"
// ...
import { Button, ButtonSizeVariant, Tooltip } from "~/components"
// ...
import { useVideoDataContext } from "../data"

export function FullScreenButton(props: HTMLAttributes<"button">) {
  const { data$ } = useVideoDataContext()
  
  return (
    <Tooltip label$="Enter fullscreen">
      <Button
        {...props}
        disabled={data$.videoUrl === ""}
        size$={ButtonSizeVariant.icon}
      >
        <BsFullscreen size={15} />
      </Button>
    </Tooltip>
  )
}