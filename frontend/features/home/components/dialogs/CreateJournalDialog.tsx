import { createSignal } from "solid-js"
import { createForm, required } from "@modular-forms/solid"
// ...
import { shorthands } from "~/styles/shorthands"
import stylex from "@stylexjs/stylex"
import __style from "./CreateJournalDialog.module.css"
// ...
import { Button, DialogContent, DialogHeader, FieldInput, type IDialog } from "~/components"
import { createSubmitForm } from "~/hooks"
import { createFileUpload, FileUploadType } from "~/features/native"
import { CreateGroup } from "~/wailsjs/go/journal/GroupExport"
// ...
import IconUploadInput from "./IconUploadInput"
import { journal } from "~/wailsjs/go/models"

const style = stylex.create({
  inputWrap: {
    marginTop: 10,
    gap: 10
  },
  imageInput: {
    width: '15rem',
    height: '15rem',
  },
  buttonRow: {
    gap: 10,
  },
  uploadZone: {
    backgroundColor: "var(--gray3)",
    cursor: "pointer",
    borderRadius: 6,
    ":hover": {
      border: "2px solid var(--gray7)"
    }
  }
})

interface ICreateJournalDialogProps extends IDialog {
  prevData$?: journal.JournalGroupData
  onSubmit$(data: journal.JournalGroupData): any
}

export default function CreateJournalDialog(props: ICreateJournalDialogProps) {
  const [, { Field, Form }] = createForm<journal.JournalGroupData>()
  const [iconPath, setIconPath] = createSignal(props.prevData$?.icon ?? "")

  const { Form$ } = createSubmitForm<journal.JournalGroupData>(Form, {
    async onSubmit$(data) {
      data.icon = iconPath()
      const newData = await CreateGroup(data)
      props.onSubmit$(newData)
      props.close$()
    },
    submitButtonText$: "Create",
    buttonRow$: (
      <Button
        size$={ButtonSize.sm}
        variant$={ButtonVariant.danger}
        onClick={props.close$}
      >
        Dismiss
      </Button>
    )
  })

  const { FileUploadZone$, isUploading$ } = createFileUpload({
    type$: FileUploadType.file,
    dialogOptions$: {
      Title: "Choose an image file for your journal group cover.",
      Filters: [
        { DisplayName: "Images file", Pattern: "*.png;*.jpg;*.svg;*.gif;*.bmp;*.webp", }
      ]
    },
    onFinish$(filePath) {
      setIconPath(filePath)
    }
  })

  return (
    <DialogContent>
      <DialogHeader>
        Create new journal group
      </DialogHeader>
      <Form$>
        <div {...stylex.attrs(style.inputWrap, shorthands.flex$)}>
          <div {...stylex.attrs(style.imageInput)} id={__style.imageInput}>
            <IconUploadInput 
              isUploading$={isUploading$}
              uploadComponent$={FileUploadZone$}
              iconPath$={iconPath}
            />
          </div>
          <div>
            <Field name="name" validate={[required("This field is required.")]}>
              {(field, inputProps) => <FieldInput
                {...inputProps}
                placeholder="The quick brown fox"
                label="Name"
                error={field.error}
                value={props.prevData$?.name ?? field.value}
              />}
            </Field>

            <Field name="description">
              {(field, inputProps) => <FieldInput
                {...inputProps}
                placeholder="Insert wonderful description here"
                multiline={true}
                label="Description"
                error={field.error}
                value={props.prevData$?.description ?? field.value}
              />}
            </Field>
          </div>
        </div>
      </Form$>
    </DialogContent>
  )
}