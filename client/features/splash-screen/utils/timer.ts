import { createSignal } from "solid-js";

export function createTimer(mode: 'increase' | 'decrease', initalTimeInSeconds: number, stepInSeconds: number, displayDigit?: number) {
  const [timer, setTimer] = createSignal(initalTimeInSeconds)

  let timerInterval = 0
  let update = (_currentTime: number) => {}

  const stepInMiliseconds = stepInSeconds * 1000

  const finish = () => {
    clearInterval(timerInterval)
    // @ts-ignore
    update = undefined
  }

  return {
    start$() {
      timerInterval = setInterval(() => setTimer(prev => {
        let roundedTime
        if (mode === 'increase') {
          roundedTime = prev + stepInSeconds
        }
        else {
          roundedTime = prev - stepInSeconds
        }

        let newTime = parseFloat(roundedTime.toFixed(displayDigit ?? 1))
        update(newTime)
        return newTime
      }), stepInMiliseconds) as unknown as number
    },
    finish$: finish,
    timer$: timer,
    onUpdate(fn: (currentTime: number) => void) {
      update = fn
    }
  }
}