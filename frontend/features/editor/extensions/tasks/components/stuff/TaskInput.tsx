import { required } from "@modular-forms/solid"
// ...
import { createInputShortcutHandler, createSubmitForm } from "~/hooks"
import { Button, FieldInput } from "~/components"
import { type TreeViewComponentProps } from "~/features/tree-view"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { useTaskDataContext, type TaskData, type TaskInputSchema } from "../../provider"

const style = stylex.create({
  input: {
    paddingInline: 10,
    paddingBlock: 5,
    borderRadius: 6,
    backgroundColor: "var(--gray2)",
  }
})

interface ITaskInputProps {
  value$?: TreeViewComponentProps<TaskData>
  hideOnSubmit$: boolean
  onSubmit$(value: TaskInputSchema): any
}

export default function TaskInput(props: ITaskInputProps) {
  const { setCurrentEditedTask$ } = useTaskDataContext()
  
  const dismiss = () => setCurrentEditedTask$(undefined)
  const { Form$, Field$, clearFields$ } = createSubmitForm<TaskInputSchema>({
    onSubmit$(data) {
      if (data.name === '') {
        return
      }

      props.onSubmit$(data)
      if (props.hideOnSubmit$) {
        setCurrentEditedTask$(undefined)
        return
      }

      // Clear everything in the input
      clearFields$()
    },
    submitButtonText$: props.value$ ? "Edit" : "Create",
    buttonRow$: (
      <Button 
        variant$={ButtonVariant.DANGER} 
        size$={ButtonSize.SMALL} 
        onClick={dismiss}
      >
        Dismiss
      </Button>
    )
  })

  const keyInputHandler = createInputShortcutHandler({
    onDiscard$() {
      dismiss()
    }
  })

  return (
    <Form$ {...stylex.attrs(style.input)} onKeyDown={keyInputHandler}>
      <Field$ name="name" validate={[required('')]}>
        {(field, inputProps) => (
          <FieldInput
            {...inputProps}
            placeholder="Task name"
            required={true}
            error={field.error}
            value={field.value || props.value$?.data$?.name}
          />
        )}
      </Field$>
      <Field$ name="description">
        {(field, inputProps) => (
          <FieldInput
            {...inputProps}
            placeholder="Task description"
            multiline={true}
            error={field.error}
            value={field.value || props.value$?.data$?.description}
          />
        )}
      </Field$>
    </Form$>
  )
}