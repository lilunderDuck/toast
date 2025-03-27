import { Route, RoutePreloadFuncArgs, Router } from '@solidjs/router'
import { lazy, ParentProps } from 'solid-js'
// ...
import { ColorAndStuff, /*Titlebar,*/ TitlebarProvider } from '~/components'
import { Toaster } from '~/features/toast'
import { StartupSequence } from'~/features/splash-screen'

export default function App() {
  const HomePage = lazy(() => import('~/routes/index'))
  const ThisPageIsNotFound = lazy(() => import('~/routes/[...404]'))
  const TooTechnicalPage = lazy(() => import('~/routes/too-technical'))

  const JournalPage = lazy(() => import('~/routes/journal/index'))
  const JournalContentPage = lazy(() => import('~/routes/journal/content'))

  return (
    <AppProvider>
      {/* <Titlebar /> */}
      <StartupSequence />
      <Toaster />

      <Router>
        <Route path='/' component={HomePage} />
        <Route path='/journal/:id' component={JournalPage}>
          <Route path="/" component={() => <div>hello 1</div>} />
          <Route path="/:journalId" component={JournalContentPage} />
        </Route>
        <Route path='/too-technical' component={TooTechnicalPage} />
        <Route path="*404" component={ThisPageIsNotFound} />
      </Router>
    </AppProvider>
  )
}

function AppProvider(props: ParentProps) {
  return (
    <ColorAndStuff>
      <TitlebarProvider>
        {props.children}
      </TitlebarProvider>
    </ColorAndStuff>
  )
}