import { createSignal } from "solid-js"
import { required } from "@modular-forms/solid"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./CreateOrEditJournalDialog.module.css"
// ...
import { Button, DialogContent, DialogHeader, FieldInput } from "~/components"
import { createSubmitForm, createFileUpload, SUPPORTED_IMAGE_PATTERN, type IBaseLazyDialog } from "~/hooks"
import type { group } from "~/wailsjs/go/models"
// ...
import IconUploadInput from "./IconUploadInput"

const style = stylex.create({
  inputWrap: {
    marginTop: 10,
    gap: 10,
    display: "flex"
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

interface ICreateJournalDialogProps extends IBaseLazyDialog {
  prevData$?: group.GroupData
  onSubmit$?: (data: group.GroupOptions) => any
  onUpdate$?: (data: group.GroupOptions & {
    id: string
  }) => any
}

type JournalGroupOptionSchema = {
  name: string
  description?: string
  icon?: string
}

export default function CreateJournalDialog(props: ICreateJournalDialogProps) {
  const [iconPath, setIconPath] = createSignal(props.prevData$?.icon ?? "")

  const getText = () => props.prevData$ ? "Edit" : "Create"

  const { Form$, Field$ } = createSubmitForm<JournalGroupOptionSchema>({
    async onSubmit$(data) {
      if (props.prevData$) {
        const newData = { ...props.prevData$, ...data as group.GroupOptions }
        // @ts-ignore - we don't care about "convertValue" prop
        props.onUpdate$?.(newData)
      } else {
        data.icon = iconPath()
        props.onSubmit$?.(data as group.GroupOptions)
      }

      props.close$()
    },
    submitButtonText$: getText(),
    buttonRow$: (
      <Button
        size$={ButtonSize.SMALL}
        variant$={ButtonVariant.DANGER}
        onClick={props.close$}
      >
        Dismiss
      </Button>
    )
  })

  const { open$, isUploading$ } = createFileUpload({
    type$: FileUploadType.FILE,
    dialogOptions$: {
      Title: "Choose an image file for your journal group cover.",
      Filters: [
        { DisplayName: "Images file", Pattern: SUPPORTED_IMAGE_PATTERN }
      ]
    },
    onFinish$(filePath) {
      setIconPath(filePath)
    }
  })

  return (
    <DialogContent>
      <DialogHeader>
        {getText()} journal group
      </DialogHeader>
      <Form$>
        <div {...stylex.attrs(style.inputWrap)}>
          <div {...stylex.attrs(style.imageInput)} id={__style.imageInput}>
            <IconUploadInput 
              isUploading$={isUploading$}
              uploadComponent$={(props) => <div {...props} onClick={open$} />}
              iconPath$={iconPath}
            />
          </div>
          <div>
            <Field$ name="name" validate={[required("This field is required.")]}>
              {(field, inputProps) => <FieldInput
                {...inputProps}
                placeholder="The quick brown fox"
                label="Name"
                error={field.error}
                value={field.value || props.prevData$?.name}
              />}
            </Field$>

            <Field$ name="description">
              {(field, inputProps) => <FieldInput
                {...inputProps}
                placeholder="Insert wonderful description here"
                multiline={true}
                label="Description"
                error={field.error}
                value={field.value || props.prevData$?.description}
              />}
            </Field$>
          </div>
        </div>
      </Form$>
    </DialogContent>
  )
}