import "./SplashScreen.css"
// ...
import { Match, Switch } from "solid-js"
import DefaultSplashScreen from "../variant/default"

interface ISplashScreenProps {
  // ...
}

export function SplashScreen(props: ISplashScreenProps) {
  return (
    <Switch fallback={<DefaultSplashScreen />}>
      <Match when={true}>
        <></>
      </Match>
    </Switch>
  )
}