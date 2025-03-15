import { createSignal, onCleanup, onMount } from "solid-js"
// ...
import type { IServerResourceUsage } from "~/api/misc"
// ...
import stylex from "@stylexjs/stylex"
// ...
import MemorySlider from "./MemorySlider"

const style = stylex.create({
  percentage: {
    color: 'var(--gray11)',
    paddingLeft: 5
  }
})

export function MemoryUsage() {
  const [usage, setUsage] = createSignal<IServerResourceUsage>()

  let timer = -1 as unknown as NodeJS.Timeout
  //                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  // conflicting type between browser and node, that's why we have this

  const getHeapUsedPercentage = (usage?: IServerResourceUsage) => {
    if (!usage) return 0

    return usage.heapUsed / usage.totalHeap * 100
  }

  const getUnusedHeapMemory = (usage?: IServerResourceUsage) => {
    if (!usage) return 0

    return (usage.totalHeap - usage.heapUsed).toFixed(2)
  }

  onCleanup(() => {
    clearInterval(timer)
  })

  return (
    <div>
      <MemorySlider 
        label$={
          <>
            Heap usage
            <span {...stylex.attrs(style.percentage)}>{getHeapUsedPercentage(usage()).toFixed(2)}%</span>
          </>
        }
        $progress={getHeapUsedPercentage(usage())}
        $progressColor="#1b9490"
        $progressText={`${usage()?.heapUsed ?? 0} MB`}
        $otherProgressText={`${getUnusedHeapMemory(usage())} MB`}
        $otherProgressColor="#94821b"
      />
    </div>
  )
}