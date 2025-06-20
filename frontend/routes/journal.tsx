import { useParams } from "@solidjs/router"
import { Editor, EditorProvider } from "~/features/editor"
// ...
import { 
  JournalRoot,
  JournalEditorContent,
  JournalSidebar,
} from "~/features/journal"

export default function JournalPage() {
  const param = useParams()

  return (
    <EditorProvider id$={param.id as number}>
      <JournalRoot>
        <JournalSidebar />
        <JournalEditorContent>
          <Editor />
        </JournalEditorContent>
      </JournalRoot>
    </EditorProvider>
  )
}