import { For } from "solid-js"
import { JournalApi } from "~/api/journal"
import { useJournalContext, type VirturalFileTree } from "~/features/journal"
import { JournalCategory } from "./JournalCategory"
import { Journal } from "./Journal"

interface IRecursivelyRenderingOutStuff {
  stuff: VirturalFileTree.ValidNode[]
}

export default function FileDislay() {
  const { $fileTree } = useJournalContext()

  $fileTree.tree = [
    '1f',
    '4d',
    'cf',
    '85',
    {
      id: 'ef',
      child: []
    },
    {
      id: 'f5',
      child: []
    }
  ]

  const lookup: Record<string, JournalApi.ICategoryData | JournalApi.IJournalData> = {
    '1f': {
      created: new Date(),
      id: '1f',
      name: 'Test'
    } as JournalApi.IJournalData,
    '4d': {
      created: new Date(),
      id: '1f',
      name: 'Test 2'
    } as JournalApi.IJournalData,
    'cf': {
      created: new Date(),
      id: '1f',
      name: 'Test 3'
    } as JournalApi.IJournalData,
    '85': {
      created: new Date(),
      id: '1f',
      name: 'Test 4'
    } as JournalApi.IJournalData,
    // ...
    'ef': {
      created: new Date(),
      id: '1f',
      name: 'Test 4'
    } as JournalApi.ICategoryData,
    'f5': {
      created: new Date(),
      id: '1f',
      name: 'Test 4'
    } as JournalApi.ICategoryData,
  }

  $fileTree.$event.$on('node__update', () => void 0)

  const RecursivelyRenderingOut = (props: IRecursivelyRenderingOutStuff) => (
    <For each={props.stuff}>
      {it => {
        if ($fileTree.$isFolder(it)) {
          const data = lookup[it.id]
          return (
            <JournalCategory {...data}>
              <RecursivelyRenderingOut stuff={it.child} />
            </JournalCategory>
          )
        }

        const data = lookup[it]
        return (
          <Journal {...data} />
        )
      }}
    </For>
  )

  return (
    <div>
      <RecursivelyRenderingOut stuff={$fileTree.tree} />
    </div>
  )
}