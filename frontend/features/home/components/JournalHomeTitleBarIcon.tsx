import stylex from "@stylexjs/stylex"
import toastIcon from "~/assets/toast.jpg"

const style = stylex.create({
  sidebar: {
    height: "100%",
    flexShrink: 0,
    paddingInline: 5,
  },
  sidebar__withSidebar: {
    width: "35%",
  },
  sidebar__noSidebar: {
    // ...
  },
  sidebar__item: {
    display: "flex",
    alignItems: "center",
    gap: 15,
    width: "100%",
    color: "var(--subtext1)",
    paddingInline: 10,
    paddingBlock: 5,
    userSelect: "none",
    marginBottom: 5
  },
  sidebar__titleBar: {
    width: "100%",
    marginBottom: 10
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

export function JournalHomeTitleBarIcon() {
  return (
    <div
      {...stylex.attrs(style.sidebar__titleBarIcon)}
      style={`--icon:url("${toastIcon}")`}
    />
  )
}