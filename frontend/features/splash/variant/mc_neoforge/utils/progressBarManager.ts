import { createSignal, type Accessor, type Setter } from "solid-js"
import type { INeoforgeProgressBarProps } from "../components"
import { arrayObjects } from "~/utils"

type WrappedProgressBarOptions = INeoforgeProgressBarProps & {
  id$: string
}

export function createProgressBarManager() {
  const [progressBars, setProgressBars] = createSignal<WrappedProgressBarOptions[]>([])

  const addProgressBarWrap = (id: string, options: INeoforgeProgressBarProps) => {
    return addProgressBar(id, options, progressBars, setProgressBars)
  }

  return {
    progressBars$: progressBars,
    addProgressBar$: addProgressBarWrap
  }
}

function addProgressBar(id: string, options: INeoforgeProgressBarProps, progressBars: Accessor<WrappedProgressBarOptions[]>, setProgressBars: Setter<WrappedProgressBarOptions[]>) {
  (options as WrappedProgressBarOptions).id$ = id
  setProgressBars(prev => [...prev, options as WrappedProgressBarOptions])

  const updateProgress = (progress: number) => {
    if (TOAST_DEBUG) {
      const [targetProgressBar, index] = arrayObjects(progressBars()).find$(it => it.id$ === id)
      const DEBUG_MESSAGE = "(This message will be removed in release build)"
      if (index === -1) {
        return console.warn(`Cannot update progress bar: cannot find progress bar with id "${id}". ${DEBUG_MESSAGE}`)
      }

      if (targetProgressBar.isInfiniteLoading$) {
        return console.warn(`Cannot update progress bar: the progress bar you're targeted is a infinite loading progress bar. ${DEBUG_MESSAGE}`)
      }
    }

    setProgressBars(prev => {
      return [...arrayObjects(prev).replace$(it => it.id$ === id, { currentProgress$: progress })]
    })
  }

  return {
    updateProgress$: updateProgress,
    updateLabel$(label: string) {
      setProgressBars(prev => [...arrayObjects(prev).replace$(it => it.id$ === id, {
        label$: label
      })])
    },
    remove$() {
      setProgressBars(prev => [...arrayObjects(prev).remove$('id$', id)])
    }
  }
}