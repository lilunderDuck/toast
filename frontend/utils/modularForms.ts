import { createForm, FieldValues, FormStore, PartialValues, ResponseData, setValues } from "@modular-forms/solid"

// intentionally hacking the types, totally worth it

export namespace ModularForm {
  export type CreateForm<T extends {}> = ReturnType<typeof createForm<T>>
  export type FormStore<T extends {}> = CreateForm<T>[0]
  export type FormComponent<T extends {}> = CreateForm<T>[1]
  export type FieldComponent<T extends {}> = FormComponent<T>["Field"]
  // export type FieldComponent<T extends {}> = FormComponent<T>["Field"]
}

export function resetFieldInputs<
  TFieldValues extends FieldValues, 
  TResponseData extends ResponseData
>(
  form: FormStore<TFieldValues, TResponseData>, 
  values: PartialValues<TFieldValues>
) {
  setValues(form, values)
  form.element?.reset()
}