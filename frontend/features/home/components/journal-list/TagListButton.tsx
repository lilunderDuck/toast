import stylex from "@stylexjs/stylex";
import { BsTagsFill } from "solid-icons/bs";
import { Button, Tooltip } from "~/components";

const style = stylex.create({
  button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
})

interface ITagListButtonProps {
  // define your component props here
}

export function TagListButton(props: ITagListButtonProps) {
  return (
    <Tooltip label$="See list of tags or create tag">
      <Button 
        {...stylex.attrs(style.button)} 
        size$={ButtonSize.ICON}
        variant$={ButtonVariant.NO_BACKGROUND}
      >
        <BsTagsFill size={20} />
      </Button>
    </Tooltip>
  )
}