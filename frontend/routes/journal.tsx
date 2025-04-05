import { Editor, EditorProvider } from "~/features/editor"
// ...
import { 
  JournalRoot,
  JournalEditorContent,
  JournalSidebar,
} from "~/features/journal"

export default function JournalPage() {
  return (
    <EditorProvider>
      <JournalRoot>
        <JournalSidebar />
        <JournalEditorContent>
          <Editor />
        </JournalEditorContent>
      </JournalRoot>
    </EditorProvider>
  )
}