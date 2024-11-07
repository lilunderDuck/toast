import stylex from "@stylexjs/stylex"
import { 
  BsLink, 
  BsSubscript, 
  BsSuperscript, 
  BsTypeBold, 
  BsTypeItalic, 
  BsTypeStrikethrough, 
  BsTypeUnderline 
} from "solid-icons/bs"
import { FlexCenterY } from "~/components"
// ...
import BubbleMenuItem from "./BubbleMenuItem"
import BubbleMenuSeperator from "./BubbleMenuSeperator"
import type { ThisEditor } from "../ThisEditor"

const style = stylex.create({
  bubbleMenu: {
    backgroundColor: 'var(--gray3)',
    borderRadius: 6
  },
})

interface IBubbleMenuProps extends ThisEditor.Ref {}

export default function BubbleMenu(props: IBubbleMenuProps) {
  // ...
  const editor: ThisEditor.Ref["$editor"] = props.$editor ?? (() => {})
  const chainedCommand = () => editor().chain().focus()

  const toggleLink = () => {
    const previousUrl = editor().getAttributes('link').href
    if (previousUrl) {
      return toggleUrl(previousUrl)
    }
    
    const url = window.prompt('URL', previousUrl)
    if (url) {
      toggleUrl(url)
    }
  }

  const toggleUrl = (url: string) => editor().chain().toggleLink({
    href: url,
    target: '_blank'
  }).run()
  
  return (
    <FlexCenterY ref={props.ref} {...stylex.attrs(style.bubbleMenu)}>
      <BubbleMenuItem
        $icon={BsTypeBold} 
        $onClick={() => chainedCommand().toggleBold().run()}
        $label='Bold'
        // $active={() => editor()?.isActive('bold')}
      />
      <BubbleMenuItem
        $icon={BsTypeItalic} 
        $onClick={() => chainedCommand().toggleItalic().run()}
        $label='Italic'
        // $active={() => editor()?.isActive('italic')}
      />
      <BubbleMenuItem
        $icon={BsTypeStrikethrough} 
        $onClick={() => chainedCommand().toggleStrike().run()}
        $label='Strikethrough'
        // $active={() => editor()?.isActive('strikethrough')}
      />
      <BubbleMenuItem
        $icon={BsTypeUnderline} 
        $onClick={() => chainedCommand().toggleUnderline().run()}
        $label='Underline'
        // $active={() => editor()?.isActive('underline')}
      />
      <BubbleMenuItem 
        $icon={BsLink} 
        $onClick={toggleLink}
        $label='Link'
        // $active={() => editor()?.isActive('link')}
      />
      <BubbleMenuSeperator />
      <BubbleMenuItem 
        $icon={BsSuperscript} 
        $onClick={() => chainedCommand().toggleSuperscript().run()}
        $label='Super-script'
        // $active={() => editor()?.isActive('superscript')}
      />
      <BubbleMenuItem
        $icon={BsSubscript} 
        $onClick={() => chainedCommand().toggleSubscript().run()}
        $label='Sub-sript'
        // $active={() => editor()?.isActive('subscript')}
      />
    </FlexCenterY>
  )
}