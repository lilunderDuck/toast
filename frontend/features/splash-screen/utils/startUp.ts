export const enum TaskResult {
  RETRY
}

type TaskRunResult = void | TaskResult

export interface ITaskOptions {
  msg$: string
  run(): Promise<TaskRunResult>
}