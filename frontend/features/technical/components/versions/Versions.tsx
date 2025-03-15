import { For } from "solid-js"
// ...
import { API_VERSION, APP_BACKEND_VERSION, APP_VERSION } from "~/utils/macros" 
// ...
import stylex from "@stylexjs/stylex"
import __style from "./Versions.module.css"

const style = stylex.create({
  versions: {
    fontSize: 14
  },
  table: {
    width: '100%'
  }
})

export function Versions() {
  const stuff = [
    { name$: 'App version', $version: APP_VERSION },
    { name$: 'Api version', $version: API_VERSION },
    { name$: 'Backend', $version: APP_BACKEND_VERSION },
    { name$: 'You', $version: navigator.userAgent.split('(')[1].split(')')[0] },
  ]

  return (
    <div {...stylex.attrs(style.versions)}>
      <table {...stylex.attrs(style.table)} id={__style.table}>
        <For each={stuff}>
          {it => (
            <tr>
              <td>{it.name$}</td>
              <td>{it.$version}</td>
            </tr>
          )}
        </For>
      </table>
    </div>
  )
}