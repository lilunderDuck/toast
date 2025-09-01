import { createForm, required } from "@modular-forms/solid"
import { onMount } from "solid-js"
// ...
import { Button, ButtonRow, FieldInput, type ILazyDialog } from "~/components"
import { type TagData } from "~/features/journal/provider"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./TagInputDialog.module.css"

const style = stylex.create({
  form: {
    paddingInline: 15,
    paddingBlock: 10,
    backgroundColor: "var(--gray2)",
    marginTop: 10,
    borderRadius: 6
  },
  form__nameInput: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  }
})

interface ITagInputDialogProps extends ILazyDialog { }

export default function TagInputDialog(props: ITagInputDialogProps) {
  const [, { Field, Form }] = createForm<TagData>()
  let formRef!: Ref<"form">

  onMount(() => {
    formRef.scrollIntoView()
  })

  return (
    <Form 
      onSubmit={(value) => null}
      ref={formRef}
      {...stylex.attrs(style.form)}
    >
      <label>Name</label>
      <div {...stylex.attrs(style.form__nameInput)} id={__style.tagInput}>
        <Field name="name" validate={[required('Please insert the tag name.')]}>
          {(field, inputProps) => <FieldInput
            {...inputProps}
            placeholder="Tag name"
            error={field.error}
            value={field.value}
          />}
        </Field>
        <Field name="color">
          {(field, inputProps) => <FieldInput
            {...inputProps}
            // @ts-ignore - this should work as expected
            type="color"
            error={field.error}
            value={field.value}
          />}
        </Field>
      </div>

      <Field name="description">
        {(field, inputProps) => <FieldInput
          {...inputProps}
          multiline={true}
          placeholder="What is this tag about?"
          label="Description"
          error={field.error}
          value={field.value}
        />}
      </Field>

      <ButtonRow>
        <Button
          size$={ButtonSize.SMALL}
          variant$={ButtonVariant.DANGER}
          onClick={props.close$}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size$={ButtonSize.SMALL}
        >
          Create
        </Button>
      </ButtonRow>
    </Form>
  )
}