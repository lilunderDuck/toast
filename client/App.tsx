import { Route, Router } from '@solidjs/router'
import { lazy } from 'solid-js'
// ...
import { ColorAndStuff } from '~/components'
import { Toaster } from '~/features/toast'
import { StartupSequence } from '~/features/splash-screen'

export default function App() {
  const HomePage = lazy(() => import('~/routes/index'))
  const ThisPageIsNotFound = lazy(() => import('~/routes/[...404]'))
  const TooTechnicalPage = lazy(() => import('~/routes/too-technical'))
  const JournalPage = lazy(() => import('~/routes/journal'))

  return (
    <ColorAndStuff>
      <StartupSequence />
      <Toaster />

      <Router>
        <Route path='/' component={HomePage} />
        <Route path='/journal/:id' component={JournalPage}/>
        <Route path='/too-technical' component={TooTechnicalPage} />
        <Route path="*404" component={ThisPageIsNotFound} />
      </Router>
    </ColorAndStuff>
  )
}