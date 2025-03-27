import type { RouteSectionProps } from "@solidjs/router"
// ...
import { 
  JournalRoot,
  JournalEditorContent,
  JournalSidebar,
} from "~/features/journal"

export default function JournalPage(props: RouteSectionProps) {
  return (
    <JournalRoot>
      <JournalSidebar />
      <JournalEditorContent>
        {props.children}
      </JournalEditorContent>
    </JournalRoot>
  )
}