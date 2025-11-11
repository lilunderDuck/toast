import stylex from "@stylexjs/stylex"
import { Button } from "~/components"
import { useTableContext } from "../../provider"

const style = stylex.create({
  button: {
    width: "100%",
    justifyContent: "flex-start"
  }
})

export function TableFooterCreateRowButton() {
  const { createRow$ } = useTableContext()

  return (
    <Button 
      {...stylex.attrs(style.button)} 
      variant$={ButtonVariant.NO_BACKGROUND} 
      size$={ButtonSize.SMALL}
      onClick={createRow$}
    >
      Create row
    </Button>
  )
}