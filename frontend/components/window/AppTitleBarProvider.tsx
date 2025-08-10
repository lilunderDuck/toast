import { type Accessor, createContext, type ParentProps, useContext } from "solid-js"
// ...
import { WindowFullscreen, WindowUnfullscreen, WindowMinimise } from "~/wailsjs/runtime/runtime"
import { WindowClose } from "~/wailsjs/go/backend/App"
import { useToggle } from "~/hooks"

interface IAppTitleBarContext {
  isFullscreen$: Accessor<boolean>
  toggleMaximizeWindow$(): void
  hideWindow$(): void
  close$(): void
}

const Context = createContext<IAppTitleBarContext>()

export function AppTitleBarProvider(props: ParentProps) {
  const [isFullscreen, toggleFullscreen] = useToggle()

  return (
    <Context.Provider value={{
      isFullscreen$: isFullscreen,
      toggleMaximizeWindow$() {
        toggleFullscreen()
        isFullscreen() ? WindowFullscreen() : WindowUnfullscreen()
      },
      hideWindow$() {
        WindowMinimise()
      },
      close$() {
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