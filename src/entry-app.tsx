/* @refresh reload */
import { render } from 'solid-js/web'
// ...
import './assets/style/index.css'
import './assets/style/scrollbar.css'
import './assets/colors/dark.css'
// ...
import App from './App'
import { logThisVeryHelpfulMessage } from './utils'

const root = document.getElementById('duck')

__devMode && (() => {
  if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error(
      'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
    )
  }
})()

logThisVeryHelpfulMessage()

render(() => <App />, root!)