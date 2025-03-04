import { createResource } from "solid-js"
// ...
import { SplashScreen } from "../components"
import { fetchStuffFromServer } from "../utils"

export function StartupSequence() {
  const [resource] = createResource(fetchStuffFromServer)

  return (
    <>
      {void SplashScreen.setIsVisible$(resource.loading)}
      <SplashScreen.Screen$ />
    </>
  )
}