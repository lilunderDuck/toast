import { BsThreeDots } from "solid-icons/bs"
// ...
import { Button, Tooltip } from "~/components"
import { EditorEditModeOnly } from "~/features/editor/components"
// ...
import { useTableContext } from "../../provider"

import stylex from "@stylexjs/stylex"

const style = stylex.create({
  button: {
    width: "100%"
  }
})

export default function CreateTableRowButton() {
  const { createRow$ } = useTableContext()

  return (
    <EditorEditModeOnly>
      <Tooltip label$="Create row">
        <Button
          variant$={ButtonVariant.NO_BACKGROUND}
          size$={ButtonSize.SMALL}
          onClick={createRow$}
          {...stylex.attrs(style.button)}
        >
          <BsThreeDots />
        </Button>
      </Tooltip>
    </EditorEditModeOnly>
  )
}