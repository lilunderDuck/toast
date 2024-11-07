import { Extension } from '@tiptap/core'
import Suggestion from '@tiptap/suggestion'

/**Currently (unfinished) slash command suggestion.
 * 
 * I have read the example, but it uses vue and reactjs, making my porting-to-solidjs job
 * wonderfully harder!
 * 
 * For now I'm using the floating menu extension, but maybe in the future this will move to
 * slash command solution.
 * 
 * @see https://tiptap.dev/docs/examples/experiments/slash-commands#page-title
 * @see https://tiptap.dev/docs/editor/getting-started/style-editor/custom-menus#slash-commands-work-in-progress
 */
export const slashCommandSuggestion = Extension.create({
  name: 'commands',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        // OKAY what is the type of this???
        command: ({ editor, range, props }) => {
          props.command({ editor, range })
        },
      },
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ]
  },
})