import { insertNodeAtCurrentPosition, NodeViewWrapper, useSolidNodeView } from '~/libs/solid-tiptap-renderer'
import { Video, type VideoAttribute } from '~/features/video'
// ...
import { createEditorNode } from '../../utils'

import stylex from "@stylexjs/stylex"
import { VideoMoreOptionButton } from './components'
import { EditorEditModeOnly } from '../../components'
import { ASSETS_SERVER_URL } from '~/api'
import { useEditorContext } from '../..'

const style = stylex.create({
  nodeView: {
    marginBottom: 20,
    position: "relative"
  }
})

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    video: {
      insertVideo$: () => ReturnType
    }
  }
}

export const VideoNode = createEditorNode<
  VideoAttribute, EditorNodeType.BLOCK
>(EditorNodeType.BLOCK, {
  name$: 'video',
  attributes$: () => ({
    name: {
      default: null,
    }
  }),
  commands$() {
    return {
      insertVideo$: () => ({ tr }) => {
        return insertNodeAtCurrentPosition<VideoAttribute>(this, tr, { name: '' })
      },
    }
  },
  View$() {
    const { attrs$ } = useSolidNodeView<VideoAttribute>()
    const { EDITOR_ID$ } = useEditorContext()

    return (
      <NodeViewWrapper {...stylex.attrs(style.nodeView)}>
        <Video src$={`${ASSETS_SERVER_URL}/local-assets/data/media/${EDITOR_ID$}/${attrs$().name}`} />
        <EditorEditModeOnly>
          <VideoMoreOptionButton />
        </EditorEditModeOnly>
      </NodeViewWrapper>
    )
  }
})