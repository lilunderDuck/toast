import { Show } from "solid-js"
import { BsGearFill, BsLayoutSidebar, BsLayoutSidebarInset } from "solid-icons/bs"
import { CLS } from "macro-def"
// ...
import stylex from "@stylexjs/stylex"
import toastIcon from "~/assets/toast.jpg"
// ...
import { AppTitleBarDraggable, Button } from "~/components"
// ...
import { useJournalHomeRootContext } from "../provider/JournalHomeRootProvider"
import { useSettingContext } from "~/features/settings"

const style = stylex.create({
  sidebar__titleBar: {
    gap: 10
  },
  sidebar__titleBarIcon: {
    width: "calc(var(--title-bar-thiccness) - 6px)",
    height: "calc(var(--title-bar-thiccness) - 6px)",
    background: "center center no-repeat var(--icon)",
    backgroundSize: "cover",
    borderRadius: "50%",
    marginLeft: 10
  }
})

interface IJournalHomeTitleBarProps {
  class?: string
}

export function JournalHomeTitleBar(props: IJournalHomeTitleBarProps) {
  const { isShowingSidebar$, _setIsShowingSidebar$ } = useJournalHomeRootContext()
  const { showSettingDialog$ } = useSettingContext()
  
  return (
    <AppTitleBarDraggable class={`${CLS(style.sidebar__titleBar)} ${props.class ?? ""}`}>
      <div
        {...stylex.attrs(style.sidebar__titleBarIcon)}
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