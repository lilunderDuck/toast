import type { Accessor, Setter } from "solid-js"

export type StickyNoteAction = 
  "delete_sticky_note$" | 
  "open_sticky_note_in_fullview$"
// ...

export interface IStickyNoteState {
  color$: Accessor<string>
  setColor$: Setter<string>
  setButtonRowShouldAlwaysShow$: Setter<boolean>
}