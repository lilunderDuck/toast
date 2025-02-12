import { splitProps } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import __todoStyle from '../TodoBlockRoot.module.css'
// ...
import { BsPencilFill, BsTrashFill } from "solid-icons/bs"
import { Button, ButtonSizeVariant, ButtonVariant, Flex, FlexCenterY, Spacer } from "~/components"
import { mergeClassname } from "~/utils"

const style = stylex.create({
  buttonRow: {
    width: '100%',
    fontSize: 14,
  },
  button: {
    flexShrink: 0,
    gap: 10
  }
})

interface IEditAndDeleteButtonRowProps extends HTMLAttributes<"div"> {
  onClickingEdit$(): void
  onClickingDelete$(): void
}

export function EditAndDeleteButtonRow(props: IEditAndDeleteButtonRowProps) {
  const [, others] = splitProps(props, ["onClickingEdit$", "onClickingDelete$"])

  return (
    <Flex {...others} class={mergeClassname(
      stylex.attrs(style.buttonRow), 
      others,
      __todoStyle.editAndDeleteButtonRow
    )}>
      <Spacer />
      <FlexCenterY {...stylex.attrs(style.button)}>
        <Button 
          onClick={props.onClickingEdit$} 
          size$={ButtonSizeVariant.icon} 
        >
          <BsPencilFill />
        </Button>

        <Button 
          onClick={() => props.onClickingDelete$} 
          size$={ButtonSizeVariant.icon} 
          variant$={ButtonVariant.danger}
        >
          <BsTrashFill />
        </Button>
      </FlexCenterY>
    </Flex>
  )
}