import { 
  TooTechnicalPageRoot, 
  MemoryUsage, 
  Versions, 
  LibaryUsedSection
} from "client/features/technical"

export default function TooTechnicalPage() {
  return (
    <TooTechnicalPageRoot>
      <h1>Hello world!</h1>
      <p>
        This is where you can explore the *technical part* of this app, a bunch of stuff smash into one place.

        <a href="/">Go back to home</a>
      </p>
      <section>
        <h2>App versions</h2>
        <Versions />
      </section>
      <LibaryUsedSection />
      <section>
        <h2>Resource usage</h2>
        {/* <MemoryUsage /> */}
      </section>
    </TooTechnicalPageRoot>
  )
}