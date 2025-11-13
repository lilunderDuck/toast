import { useNodeState } from "./nodeState";

export async function createOrGetData<T extends { id: string }>(
  conditionToCreate: boolean,
  createFn: AnyNoArgsAsyncFunction,
  getFn: AnyNoArgsAsyncFunction
): Promise<T> {
  const { updateAttribute$ } = useNodeState()

  if (conditionToCreate) {
    const returnType = await createFn()
    updateAttribute$('id', returnType.id)
    return returnType
  }

  return await getFn()
}