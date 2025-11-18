import { useSolidNodeView } from "~/libs/solid-tiptap-renderer"

export async function createOrGetData<T extends { id: string }>(
  conditionToCreate: boolean,
  createFn: AnyNoArgsAsyncFunction,
  getFn: AnyNoArgsAsyncFunction
): Promise<T> {
  const { updateAttribute$ } = useSolidNodeView()

  if (conditionToCreate) {
    const returnType = await createFn()
    updateAttribute$('id', returnType.id)
    return returnType
  }

  return await getFn()
}