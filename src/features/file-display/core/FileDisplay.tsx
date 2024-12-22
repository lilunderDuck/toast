import { For } from "solid-js"
// ...
import { type JournalApi } from "~/api/journal"
// ...
import { JournalCategory, Journal } from "../components"
import { type ValidNode } from "../utils"
import { useFileDisplayContext } from "./FileDisplayProvider"

interface IRecursivelyRenderingOutStuff {
  stuff: ValidNode[]
}

export function FileDisplay() {
  const fileTree = useFileDisplayContext()

  fileTree.tree = [
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
    '45': {
      created: new Date(),
      id: '1f',
      name: 'Test 5 idk'
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

  setTimeout(() => {
    fileTree.tree = [
      '1f',
      '4d',
      'cf',
      '85',
      {
        id: 'ef',
        child: [
          '45'
        ]
      },
    ]
  }, 2000)

  const RecursivelyRenderingOut = (props: IRecursivelyRenderingOutStuff) => (
    <For each={props.stuff}>
      {it => {
        if (fileTree.$isFolder(it)) {
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
      <RecursivelyRenderingOut stuff={fileTree.$virturalTree()} />
    </div>
  )
}