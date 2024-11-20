// ...
import { 
  JournalRoot,
  JournalEditorContent,
  JournalEditor,
  JournalSidebar,
  JournalToolsSidebar
} from "~/features/journal"

export default function JournalPage() {
  return (
    <JournalRoot>
      <JournalSidebar />
      <JournalEditorContent>
        <JournalEditor />
      </JournalEditorContent>
      <JournalToolsSidebar />
    </JournalRoot>
  )
}