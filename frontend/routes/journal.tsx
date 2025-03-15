import type { RouteSectionProps } from "@solidjs/router"
// ...
import { 
  JournalRoot,
  JournalEditorContent,
  JournalSidebar,
  // JournalRightSidebar
} from "~/features/journal"

export default function JournalPage(props: RouteSectionProps) {
  return (
    <JournalRoot>
      <JournalSidebar />
      <JournalEditorContent />
      {/* <JournalRightSidebar /> */}
    </JournalRoot>
  )
}