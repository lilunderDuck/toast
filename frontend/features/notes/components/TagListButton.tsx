import { BsTagsFill } from "solid-icons/bs"
// ...
import { css } from "molcss"
// ...
import { Button, Tooltip } from "~/components"

const button = css`
  display: flex;
  justify-content: center;
  align-items: center;
`

export function TagListButton() {
  return (
    <Tooltip label$="See list of tags or create tag">
      <Button 
        class={button}
        size$={ButtonSize.ICON}
        variant$={ButtonVariant.NO_BACKGROUND}
      >
        <BsTagsFill size={20} />
      </Button>
    </Tooltip>
  )
}