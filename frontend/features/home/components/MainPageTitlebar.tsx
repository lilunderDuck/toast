import { Show } from "solid-js"
import { BsGearFill, BsLayoutSidebar, BsLayoutSidebarInset } from "solid-icons/bs"
// ...
import { css } from "molcss"
import toastIcon from "~/assets/toast.jpg"
// ...
import { AppTitleBarDraggable, Button } from "~/components"
import { useSettingContext } from "~/features/settings"
// ...
import { useMainPageContext } from "../provider/MainPageProvider"

const sidebar__titleBar = css`
  gap: 10px;
`

const sidebar__titleBarIcon = css`
  width: calc(var(--title-bar-thiccness) - 6px);
  height: calc(var(--title-bar-thiccness) - 6px);
  background: center center no-repeat var(--icon);
  background-size: cover;
  border-radius: 50%;
  margin-left: 10px;
`

interface IMainPageTitlebarProps {
  class?: string
}

export function MainPageTitlebar(props: IMainPageTitlebarProps) {
  const { isShowingSidebar$, _setIsShowingSidebar$ } = useMainPageContext()
  const { showSettingDialog$ } = useSettingContext()
  
  return (
    <AppTitleBarDraggable class={`${sidebar__titleBar} ${props.class ?? ""}`}>
      <div
        class={sidebar__titleBarIcon}
        style={`--icon:url("${toastIcon}")`}
      />
      <Button 
        size$={ButtonSize.ICON}
        variant$={ButtonVariant.NO_BACKGROUND}
        onClick={() => _setIsShowingSidebar$(prev => !prev)}
      >
        <Show when={isShowingSidebar$()} fallback={
          <BsLayoutSidebar />
        }>
          <BsLayoutSidebarInset />
        </Show>
      </Button>
      <Button
        size$={ButtonSize.ICON}
        variant$={ButtonVariant.NO_BACKGROUND}
        onClick={showSettingDialog$}
      >
        <BsGearFill />
      </Button>
    </AppTitleBarDraggable>
  )
}