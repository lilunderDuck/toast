import { Route, Router } from '@solidjs/router'
import { lazy } from 'solid-js'
// ...
import { ColorAndStuff } from 'client/components'
import { Toaster } from 'client/features/toast'
import { StartupSequence } from 'client/features/splash-screen'

const HomePage = lazy(() => import('client/routes/index'))
const JournalPage = lazy(() => import('client/routes/journal'))
const ThisPageIsNotFound = lazy(() => import('client/routes/[...404]'))
const TooTechnicalPage = lazy(() => import('client/routes/too-technical'))

export default function App() {
  return (
    <ColorAndStuff>
      <StartupSequence />
      <Toaster />

      <Router>
        <Route path='/' component={HomePage} />
        <Route path='/journal/:id' component={JournalPage} />
        <Route path='/too-technical' component={TooTechnicalPage} />
        <Route path="*404" component={ThisPageIsNotFound} />
      </Router>
    </ColorAndStuff>
  )
}