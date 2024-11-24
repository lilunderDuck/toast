import { IconTypes } from "solid-icons"
import { Button, ButtonSizeVariant, type ITooltipOptions, Tooltip } from "~/components"

interface IToolButtonProps extends ITooltipOptions {
  $icon: IconTypes
}

export function ToolButton(props: IToolButtonProps) {
  return (
    <Tooltip $label={props.$label}>
      <Button $size={ButtonSizeVariant.icon}>
        <props.$icon />
      </Button>
    </Tooltip>
  )
}