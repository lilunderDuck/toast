import { MainPageRoot, MainPageSidebar, MainContent } from "~/features/home"
import { Lightbox } from "~/features/lightbox"

export default function Home() {
  return (
    <>
      <MainPageRoot>
        <MainPageSidebar />
        <MainContent />
      </MainPageRoot>
      <Lightbox />
    </>
  )
}
