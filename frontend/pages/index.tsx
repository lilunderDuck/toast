import { JournalHomeMainContent, JournalHomeRoot, JournalHomeSidebar } from "~/features/home"

export default function Home() {
  return (
    <JournalHomeRoot>
      <JournalHomeSidebar />
      <JournalHomeMainContent />
    </JournalHomeRoot>
  )
}
