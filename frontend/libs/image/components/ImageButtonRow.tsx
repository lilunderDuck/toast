import { BsFullscreen, BsPencilFill } from "solid-icons/bs";
import { Button, ButtonRow } from "~/components";
import __style from "../ImageInput.module.css"
import stylex from "@stylexjs/stylex";

const style = stylex.create({
  input: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "var(--gray3)",
    borderRadius: 6,
    position: "relative"
  },
  input__layer: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  input__uploadZone: {
    borderRadius: 6,
    border: "2px solid var(--gray6)",
    flexFlow: "column",
    gap: 10
  },
  input__editButton: {
    position: "absolute",
    top: 0,
    right: 0,
    marginRight: 10
  }
})

interface IImageButtonRowProps {
  openFileDialog$: () => void
  openImageFullview$: () => void
}

export function ImageButtonRow(props: IImageButtonRowProps) {
  return (
    <ButtonRow direction$={ButtonRowDirection.CUSTOM} id={__style.buttonRow} {...stylex.attrs(style.input__editButton)}>
      <Button size$={ButtonSize.ICON} onClick={props.openFileDialog$}>
        <BsPencilFill />
      </Button>
      <Button size$={ButtonSize.ICON} onClick={props.openImageFullview$}>
        <BsFullscreen />
      </Button>
    </ButtonRow>
  )
}