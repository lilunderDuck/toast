import { 
  JournalHomeRoot, 
  JournalInfoSidebar, 
  JournalList 
} from "~/features/home"

export default function HomePage() {
  return (
    <JournalHomeRoot sidebarComponent$={
      <JournalInfoSidebar />
    }>
      <h1>Home</h1>
      <br />
      <h2>Your stuff</h2>
      {/* <Show when={!resource.loading}> */}
      <JournalList />
      {/* </Show> */}
    </JournalHomeRoot>
  )
}