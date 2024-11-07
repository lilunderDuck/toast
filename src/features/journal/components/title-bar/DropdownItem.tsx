import { IconProps } from "solid-icons"
import { Component, JSX, Show, splitProps } from "solid-js"
import { 
  DropdownMenuItem, 
  type DropdownMenuItemProps, 
  DropdownMenuShortcut, 
  Spacer 
} from "~/components"

interface IDropdownItemProps extends DropdownMenuItemProps {
  $icon: Component<IconProps>
  $name: JSX.Element
  $shortcut?: JSX.Element
}

export default function DropdownItem(props: IDropdownItemProps) {
  const [, theRest] = splitProps(props, ["$icon", "$name", "$shortcut"])

  return (
    <DropdownMenuItem {...theRest}>
      <props.$icon />
      {props.$name}
      <Spacer />
      <Show when={props.$shortcut}>
        <DropdownMenuShortcut>
          {props.$shortcut}
        </DropdownMenuShortcut>
      </Show>
    </DropdownMenuItem>
  )
}