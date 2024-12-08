// ...
import { 
  JournalRoot,
  JournalEditorContent,
  JournalSidebar
} from "~/features/journal"

export default function JournalPage() {
  return (
    <JournalRoot>
      <JournalSidebar />
      <JournalEditorContent />
      {/* <JournalToolsSidebar /> */}
    </JournalRoot>
  )
}