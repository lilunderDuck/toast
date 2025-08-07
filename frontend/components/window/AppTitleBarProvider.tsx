import { type Accessor, createContext, createSignal, type ParentProps, useContext } from "solid-js"
// ...
import { WindowFullscreen, WindowIsFullscreen, WindowUnfullscreen, WindowMinimise } from "~/wailsjs/runtime/runtime"
import { WindowClose } from "~/wailsjs/go/backend/App"

interface IAppTitleBarContext {
  isFullscreen$: Accessor<boolean>
  toggleMaximizeWindow$(): void
  hideWindow$(): void
  close$(): void
}

const Context = createContext<IAppTitleBarContext>()

export function AppTitleBarProvider(props: ParentProps) {
  const [isFullscreen, setIsFullscreen] = createSignal(false)

  WindowIsFullscreen().then(state => setIsFullscreen(state))

  return (
    <Context.Provider value={{
      isFullscreen$: isFullscreen,
      toggleMaximizeWindow$() {
        setIsFullscreen(prev => !prev)
        isFullscreen() ? WindowUnfullscreen() : WindowFullscreen()
      },
      hideWindow$() {
        WindowMinimise()
      },
      close$() {
        console.log("window should close")
        WindowClose()
      }
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useAppTitleBarContext() {
  return useContext(Context)!
}