import { DialogContent, DialogTitle } from "~/components"

import stylex from "@stylexjs/stylex"

const style = stylex.create({
  dialog: {
    width: "45%"
  }
})

export default function TableCreateRowDialog() {
  return (
    <DialogContent {...stylex.attrs(style.dialog)} showCloseButton$={false}>
      <DialogTitle>Create new row</DialogTitle>
      {/*  */}
    </DialogContent>
  )
}