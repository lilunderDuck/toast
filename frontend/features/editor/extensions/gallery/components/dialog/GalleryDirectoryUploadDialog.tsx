import { createSignal, Match, Switch } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./GalleryDirectoryUploadDialog.module.css"
// ...
import { Button, ButtonRow, DialogContent, DialogHeader, type IDialog, RadioGroup, RadioGroupItem, RadioGroupItemLabel, Tooltip } from "~/components"
import { createFileUpload, FileUploadType } from "~/features/native"

const style = stylex.create({
  dialog: {
    maxWidth: "60%"
  },
  dialog__uploadZone: {
    width: "100%",
    minHeight: "3rem",
    backgroundColor: "var(--gray4)",
    border: "2px solid transparent",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    userSelect: "none",
    color: "var(--gray11)",
    ":hover": {
      borderColor: "var(--gray8)",
      backgroundColor: "var(--gray5)",
      color: "var(--gray12)",
    },
    ":focus": {
      outline: "none"
    }
  },
  dialog__selectionDescription: {
    paddingInline: 15,
    paddingBlock: 10,
    fontSize: 15
  },
  dialog__optionDisabled: {
    color: "var(--gray10)",
    cursor: "not-allowed"
  }
})

interface IGalleryDirectoryUploadDialogProps extends IDialog {}

export default function GalleryDirectoryUploadDialog(props: IGalleryDirectoryUploadDialogProps) {
  const [selectedPath, setSelectedPath] = createSignal('')
  const [selectedOption, setSelectedOption] = createSignal('everything$')
  const { open$ } = createFileUpload({
    type$: FileUploadType.directory,
    dialogOptions$: {
      Title: "Select a directory."
    },
    async onFinish$(selectedPath) {
      setSelectedPath(selectedPath)
    }
  })

  const isEmpty = () => selectedPath() === ""

  return (
    <DialogContent {...stylex.attrs(style.dialog)} id={__style.dialog}>
      <DialogHeader>
        Upload a directory to this gallery.
      </DialogHeader>

      <section>
        <label>Directory to upload</label>
        <Tooltip label$="Select directory to upload">
          <button {...stylex.attrs(style.dialog__uploadZone)} onClick={open$}>
            {isEmpty() ? <i>No directory selected</i> : selectedPath()}
          </button>
        </Tooltip>
      </section>

      <section>
        <label>Options</label>
        <div {...stylex.attrs(isEmpty() ? style.dialog__optionDisabled : {})}>
          <RadioGroup disabled={isEmpty()} onChange={setSelectedOption} defaultValue={selectedOption()}>
            <RadioGroupItem value="everything$" disabled={isEmpty()}>
              <RadioGroupItemLabel>
                Copy everything.
              </RadioGroupItemLabel>
            </RadioGroupItem>
            <RadioGroupItem value="metadata$" disabled={isEmpty()}>
              <RadioGroupItemLabel>
                Copy metadata only.
              </RadioGroupItemLabel>
            </RadioGroupItem>
          </RadioGroup>

          <div {...stylex.attrs(style.dialog__selectionDescription)}>
            <Switch>
              <Match when={selectedOption() === "everything$"}>
                <p>This will copy everything from your selected directory to this gallery. </p>
                
                <p>Notes: it does not copy every items <b>in nested folder and stuff</b>.</p>
              </Match>
              <Match when={selectedOption() === "metadata$"}>
                <p>
                  This will not copy everything from your selected directory to this gallery.
                </p>
                <p>
                  However, the app will gather file meta information (like file name, types of file) to make the gallery works.
                </p>
                <p>
                  Just don't move the directory to somewhere else...
                </p>
              </Match>
            </Switch>
          </div>
        </div>
      </section>

      <ButtonRow>
        <Button size$={ButtonSize.sm} variant$={ButtonVariant.danger} onClick={props.close$}>
          Dismiss
        </Button>
        <Button size$={ButtonSize.sm} disabled={isEmpty()}>
          Upload
        </Button>
      </ButtonRow>
    </DialogContent>
  )
}