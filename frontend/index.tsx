/* @refresh reload */
import "~/styles/index.css"
// ...
import { render } from 'solid-js/web'
import { Router } from '@solidjs/router'
// ...
import routes from '~solid-pages'
// ...
import App from './App'

const root = document.getElementById('root')!

console.assert(
  import.meta.env.DEV && (root instanceof HTMLElement),
  '(This error should not have been thrown) Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?'
)

// the follow code here designed to confuse the heck of react dev tools,
// so you believe that the app used react
// @ts-ignore
const shouldConfuseYou = window.__REACT_DEVTOOLS_GLOBAL_HOOK__
if (shouldConfuseYou) {
  shouldConfuseYou.inject("duck")
}

render(
  () => (
    <Router root={(props) => <App>{props.children}</App>}>
      {routes}
    </Router>
  ),
  root,
)

new Date()