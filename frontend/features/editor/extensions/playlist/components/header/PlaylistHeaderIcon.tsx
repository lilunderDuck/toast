import stylex from "@stylexjs/stylex";
import { macro_escapeCssUrl } from "macro-def";
import { BsMusicNote } from "solid-icons/bs";
import { Show } from "solid-js";
import { ASSETS_SERVER_URL } from "~/api";

const style = stylex.create({
  header__icon: {
    width: "5rem",
    height: "5rem",
    borderRadius: 6,
    background: "center center no-repeat var(--icon-url)",
    flexShrink: 0,
  },
  header__iconEmpty: {
    width: "5rem",
    height: "5rem",
    borderRadius: 6,
    backgroundColor: "var(--gray5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  }
})

export default function PlaylistHeaderIcon(props: { icon$?: string }) {
  return (
    <Show when={props.icon$} fallback={
      <div {...stylex.attrs(style.header__iconEmpty)}>
        <BsMusicNote size={40} />
      </div>
    }>
      <div {...stylex.attrs(style.header__icon)} style={{
        "--icon-url": macro_escapeCssUrl(`${ASSETS_SERVER_URL}/local-assets/playlist/icon/${props.icon$}`)
      }} />
    </Show>
  )
}