import { BsPencilFill, BsTrashFill } from "solid-icons/bs";
import { Button, ButtonSizeVariant, ButtonVariant } from "~/components";

export function DeleteButton(props: HTMLAttributes<"button">) {
  return (
    <Button {...props} size$={ButtonSizeVariant.icon} variant$={ButtonVariant.danger}>
      <BsTrashFill />
    </Button>
  )
}

export function EditButton(props: HTMLAttributes<"button">) {
  return (
    <Button {...props} size$={ButtonSizeVariant.icon} variant$={ButtonVariant.danger}>
      <BsPencilFill />
    </Button>
  )
}