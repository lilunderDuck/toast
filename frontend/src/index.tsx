/* @refresh reload */
import { render } from 'solid-js/web'
// ...
import './assets/style/index.css'
import './assets/colors/dark.css'
// ...
import App from './App'
import { logThisVeryHelpfulMessage } from './utils'

const root = document.getElementById('duck')

window.onerror = function(error) {
  console.log(error)
  if (window.location.href.includes('/journal')) {
    window.location.href = 'wails.localhost:34115'
    window.location.reload()
  }
}

__devMode && (() => {
  if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error(
      'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
    )
  }
})()

logThisVeryHelpfulMessage()

render(() => <App />, root!)