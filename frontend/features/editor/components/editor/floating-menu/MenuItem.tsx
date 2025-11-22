import type { IFloatingMenuItem } from "~/features/editor/provider"
import { Button } from "~/components"
// ...
import stylex from "@stylexjs/stylex"

const style = stylex.create({
  menu: {
    width: "100%",
    gap: 10,
    justifyContent: "flex-start"
  }
})

interface IMenuItemProps extends IFloatingMenuItem {
  // ...
}

export function MenuItem(props: IMenuItemProps) {
  return (
    <Button 
      size$={ButtonSize.SMALL} 
      variant$={ButtonVariant.NO_BACKGROUND} 
      {...stylex.attrs(style.menu)} 
      onClick={() => props.command$().run()}
    >
      <props.icon$ />
      {props.name$}
    </Button>
  )
}