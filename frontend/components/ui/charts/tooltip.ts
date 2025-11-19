import { Chart, type ChartTypeRegistry, type TooltipModel } from "chart.js"
import stylex from "@stylexjs/stylex"
import { MERGE_CLASS } from "macro-def"

const style = stylex.create({
  chartjsTooltip: {
    padding: "0.5rem",
    borderRadius: "0.5rem",
    borderWidth: "1px",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  },
  title: {
    fontWeight: 600,
    letterSpacing: "-0.025em",
    lineHeight: 1
  },
  whateverThisIs: {
    "marginTop":"0.25rem"
  },
  uhhh: {"display":"flex","alignItems":"center"},
  alsoThis: {"display":"flex","alignItems":"center"}
})

type ChartContext = {
  chart: Chart
  tooltip: TooltipModel<keyof ChartTypeRegistry>
}

export function showTooltip(context: ChartContext) {
  let el = document.getElementById("chartjs-tooltip")
  if (!el) {
    el = document.createElement("div")
    el.id = "chartjs-tooltip"
    document.body.appendChild(el)
  }

  const model = context.tooltip
  if (model.opacity === 0 || !model.body) {
    el.style.opacity = "0"
    return
  }

  el.className = MERGE_CLASS(
    stylex.attrs(style.chartjsTooltip), 
    model.yAlign ? `no-transform` : ''
  )

  let content = ""

  for (const title of model.title) {
    content += /*html*/`<h3 class="${stylex.attrs(style.title).class}">${title}</h3>`
  }

  model.title.forEach((title) => {
    content +=
      /*html*/`<h3 class="${stylex.attrs(style.title).class}">${title}</h3>`
  })

  content += /*html*/`<div class="${stylex.attrs(style.whateverThisIs).class}">`
  const body = model.body.flatMap((body) => body.lines)
  body.forEach((line, i) => {
    const colors = model.labelColors[i]
    content += /*html*/`
        <div class="${stylex.attrs(style.uhhh).class}">
          <span class="${stylex.attrs(style.alsoThis).class}" style="background: ${colors.backgroundColor} border-color: ${colors.borderColor}"></span>
          ${line}
        </div>`
  })
  content += /*html*/`</div>`

  el.innerHTML = content

  const pos = context.chart.canvas.getBoundingClientRect()
  el.style.opacity = "1"
  el.style.position = "absolute"
  el.style.left = `${pos.left + window.scrollX + model.caretX}px`
  el.style.top = `${pos.top + window.scrollY + model.caretY}px`
  el.style.pointerEvents = "none"
}
