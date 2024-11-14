// ...
import { 
  JournalRoot,
  JournalEditorContent,
  JournalEditor,
  JournalSidebar
} from "~/features/journal"

export default function JournalPage() {
  return (
    <JournalRoot>
      <JournalSidebar />
      <JournalEditorContent>
        <JournalEditor />
      </JournalEditorContent>
    </JournalRoot>
  )
}