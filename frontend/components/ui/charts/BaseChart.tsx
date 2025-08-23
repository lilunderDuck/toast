import { mergeRefs } from "@solid-primitives/refs"
import type {
  ChartComponent,
  ChartData,
  ChartItem,
  ChartOptions,
  Plugin as ChartPlugin,
  ChartType,
} from "chart.js"
import {
  Chart,
  Colors,
  Filler,
  Legend,
  Tooltip
} from "chart.js"
import { type Component, createEffect, createSignal, mergeProps, on, onCleanup, onMount, type Ref } from "solid-js"
import { unwrap } from "solid-js/store"
import { showTooltip } from "./tooltip"

type TypedChartProps = {
  data: ChartData
  options?: ChartOptions
  plugins?: ChartPlugin[]
  ref?: Ref<HTMLCanvasElement | null>
  width?: number | undefined
  height?: number | undefined
}
 
type ChartProps = TypedChartProps & {
  type: ChartType
}

const BaseChart: Component<ChartProps> = (rawProps) => {
  const [canvasRef, setCanvasRef] = createSignal<HTMLCanvasElement | null>()
  const [chart, setChart] = createSignal<Chart>()
 
  const props = mergeProps(
    {
      width: 512,
      height: 512,
      options: { responsive: true } as ChartOptions,
      plugins: [] as ChartPlugin[]
    },
    rawProps
  )
 
  const init = () => {
    const ctx = canvasRef()?.getContext("2d") as ChartItem
    const config = unwrap(props)
    const chart = new Chart(ctx, {
      type: config.type,
      data: config.data,
      options: config.options,
      plugins: config.plugins
    })
    setChart(chart)
  }
 
  onMount(() => init())
 
  createEffect(
    on(
      () => props.data,
      () => {
        chart()!.data = props.data
        chart()!.update()
      },
      { defer: true }
    )
  )
 
  createEffect(
    on(
      () => props.options,
      () => {
        chart()!.options = props.options
        chart()!.update()
      },
      { defer: true }
    )
  )
 
  createEffect(
    on(
      [() => props.width, () => props.height],
      () => {
        chart()!.resize(props.width, props.height)
      },
      { defer: true }
    )
  )
 
  createEffect(
    on(
      () => props.type,
      () => {
        const dimensions = [chart()!.width, chart()!.height]
        chart()!.destroy()
        init()
        chart()!.resize(...dimensions)
      },
      { defer: true }
    )
  )
 
  onCleanup(() => {
    chart()?.destroy()
    mergeRefs(props.ref, null)
  })
 
  Chart.register(Colors, Filler, Legend, Tooltip)
  return (
    <canvas
      ref={mergeRefs(props.ref, (el) => setCanvasRef(el))}
      height={props.height}
      width={props.width}
    />
  )
}

export function createTypedChart(
  type: ChartType,
  components: ChartComponent[]
): Component<TypedChartProps> {
  const chartsWithScales: ChartType[] = ["bar", "line", "scatter"]
  const chartsWithLegends: ChartType[] = ["bar", "line"]
 
  const options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: chartsWithScales.includes(type)
      ? {
          x: {
            border: { display: false },
            grid: { display: false }
          },
          y: {
            border: {
              dash: [3],
              dashOffset: 3,
              display: false
            },
            grid: {
              color: "hsla(240, 3.8%, 46.1%, 0.4)"
            }
          }
        }
      : {},
    plugins: {
      legend: chartsWithLegends.includes(type)
        ? {
            display: true,
            align: "end",
            labels: {
              usePointStyle: true,
              boxWidth: 6,
              boxHeight: 6,
              color: "hsl(240, 3.8%, 46.1%)",
              font: { size: 14 }
            }
          }
        : { display: false },
      tooltip: {
        enabled: false,
        external: (context) => showTooltip(context)
      }
    }
  }
 
  Chart.register(...components)
  return (props) => <BaseChart type={type} options={options} {...props} />
}
