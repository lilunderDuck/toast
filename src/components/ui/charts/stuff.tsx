import {
  ArcElement,
  BarController,
  BarElement,
  BubbleController,
  CategoryScale,
  DoughnutController,
  LinearScale,
  LineController,
  LineElement,
  PieController,
  PointElement,
  PolarAreaController,
  RadarController,
  RadialLinearScale,
  ScatterController,
} from "chart.js"
import { createTypedChart } from "./BaseChart"

export const BarChart = createTypedChart("bar", [
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
])

export const BubbleChart = createTypedChart("bubble", [
  BubbleController,
  PointElement,
  LinearScale,
])

export const DonutChart = createTypedChart("doughnut", [
  DoughnutController,
  ArcElement,
])

export const LineChart = createTypedChart("line", [
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
])

export const PieChart = createTypedChart("pie", [
  PieController,
  ArcElement,
])

export const PolarAreaChart = createTypedChart("polarArea", [
  PolarAreaController,
  ArcElement,
  RadialLinearScale,
])

export const RadarChart = createTypedChart("radar", [
  RadarController,
  LineElement,
  PointElement,
  RadialLinearScale,
])

export const ScatterChart = createTypedChart("scatter", [
  ScatterController,
  PointElement,
  LinearScale,
])
