import { type VoidComponent } from "solid-js"
import { render } from "solid-js/web"

type RootProps = {
  class: string
}

type DisposeFn = () => void

/**Render any solid-js component into a pure DOM, because sometime you use a pure javascript
 * libary and you just want the convenience of using `solid-js`.
 * @param RandomComponent any solid component
 * @returns a `div` element, you can use it to mount somewhere and a dispose function
 * to remove `RandomComponent` completely
 */
export function createSolidRenderer(RandomComponent: VoidComponent, rootProps?: RootProps): [HTMLDivElement, DisposeFn] {
  let element = document.createElement('div')
  render(() => <RandomComponent />, element)

  __devMode && element.setAttribute('this-is-solid-renderer', crypto.randomUUID())

  if (rootProps) {
    element.className = rootProps.class
  }

  const dispose = () => {
    console.log('[solid renderer] destroyed', element)
    element.remove()
    element = null as unknown as HTMLDivElement
  }

  console.log('[solid renderer] created', element)
  return [element, dispose]
}