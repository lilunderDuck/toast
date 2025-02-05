// ...
import { 
  JournalRoot,
  JournalEditorContent,
  JournalSidebar
} from "client/features/journal"

export default function JournalPage() {
  return (
    <JournalRoot>
      <JournalSidebar />
      <JournalEditorContent />
      {/* <JournalToolsSidebar /> */}
    </JournalRoot>
  )
}