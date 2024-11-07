/* @refresh reload */
import { render } from 'solid-js/web'

import './assets/style/index.css'
import './assets/style/scrollbar.css'
import './assets/colors/dark.css'
import App from './App'

const root = document.getElementById('duck')

__devMode && (() => {
  if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error(
      'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
    )
  }
})()


render(() => <App />, root!)
