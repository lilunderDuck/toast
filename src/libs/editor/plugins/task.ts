import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import __style from "./task.module.css"

export const Task = [
  TaskItem.configure({
    HTMLAttributes: {
      class: __style.taskItem
    }
  }),
  TaskList.configure({
    HTMLAttributes: {
      class: __style.taskList
    }
  })
]