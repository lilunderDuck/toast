import { BsCodeSquare } from "solid-icons/bs"
import { 
  JournalHomeRoot, 
  JournalInfoSidebar, 
  JournalList, 
  JournalOtherPlace
} from "~/features/home"

export default function HomePage() {
  return (
    <JournalHomeRoot sidebarComponent$={
      <JournalInfoSidebar />
    }>
      <h1>Home</h1>
      <h2>Other places</h2>
      <div>
        <JournalOtherPlace 
          href$="/too-technical"
          icon$={BsCodeSquare}
          name$="Technical details"
          description$="Technical stuff about this app"
          iconColor$=""
        />
      </div>

      <h2>Your stuff</h2>
      <JournalList />

    </JournalHomeRoot>
  )
}