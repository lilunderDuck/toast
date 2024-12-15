import { For } from "solid-js"
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
    { $name: 'App version', $version: __version },
    { $name: 'Api version', $version: __apiVersion },
    { $name: 'Backend', $version: __backendVersion },
    { $name: 'You', $version: navigator.userAgent.split('(')[1].split(')')[0] },
  ]

  return (
    <div {...stylex.attrs(style.versions)}>
      <table {...stylex.attrs(style.table)} id={__style.table}>
        <For each={stuff}>
          {it => (
            <tr>
              <td>{it.$name}</td>
              <td>{it.$version}</td>
            </tr>
          )}
        </For>
      </table>
    </div>
  )
}