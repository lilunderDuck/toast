import type { JSX } from 'solid-js'

export const genSVGCubicBezier: (
  keySplines: string
) => Pick<JSX.AnimateSVGAttributes<SVGAnimateElement>, 'calcMode' | 'keyTimes' | 'keySplines'> = (keySplines) => ({
  calcMode: 'spline',
  keyTimes: '0; 1',
  keySplines: keySplines,
})