import { sleep } from "~/utils"
// ...
import { SplashScreen } from "../components"
import { SplashScreenProvider } from "../provider"

export function StartupSequence() {
  return (
    <SplashScreenProvider checkList$={[
      {
        msg$: 'Lift off!',
        async run() {
          await sleep(1500)
        }
      }
    ]}>
      <SplashScreen />
    </SplashScreenProvider>
  )
}