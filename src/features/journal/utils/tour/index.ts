import { TourGuideClient } from "@sjmc11/tourguidejs/src/Tour"
import "./index.css"

const tourGuide = new TourGuideClient({
  debug: true,
})

tourGuide.addSteps([
  {
    title: "Welcome aboard 👋",
    content: "This is a short guide to get you set up and show you where things are",
    target: document.getElementById('root'),
  },
  {
    title: "The sidebar",
    content: "This is where all of your stuff will be shown",
    target: select('editor-tour-sidebar'),
  },
  {
    title: "Create journal button",
    content: "You can click this button to create a new journal",
    target: select('editor-tour-create-journal-button')
  },
  {
    title: "Create journal category button",
    content: "Same with this button, but it will create a category instead, so you can group many similar thing into one",
    target: select('editor-tour-create-journal-category-button')
  },
  {
    title: "What's this button here...?",
    content: "It's a button to toggle to readonly or edit mode. However, if this button is gray-ed out, select a journal on the sidebar.",
    target: select('editor-tour-toggle-edit-or-readonly-button')
  },
  {
    title: "Customize layout button",
    content: "You can change the layout of the editor via clicking this small and tiny button here",
    target: select('editor-tour-customize-layout-button')
  },
  {
    title: "\"I can't go home!\"",
    content: "Just click this button here, it will transfer you back to home. No needs to panic.",
    target: select('editor-tour-home-button')
  },
  {
    title: "You're all set!",
    content: "Looks like you're ready to go! Click anywhere outside to close this.",
    target: document.getElementById('root'),
  },
])

export default function showTour() {
  tourGuide.start()
}

function select(target: string) {
  const targetElement = document.querySelector<HTMLElement>(`[${target}]`)
  console.assert(target.startsWith('editor-tour-'), `${target}: the attribute does not start with editor-tour-`)
  console.assert(targetElement, 'element does not exist')

  return targetElement
}