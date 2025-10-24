import { Node, type Attribute, type NodeConfig } from "@tiptap/core"
import type { VoidComponent } from "solid-js"
import { SolidNodeViewRenderer } from "~/libs/solid-tiptap-renderer"
import { cyrb53 } from "~/utils/hashing"
import { pluginEvent } from "."
import { insertNodeAtCurrentPosition } from "~/features/editor/utils"

const enum EditorNodeType {
  BLOCK,
  INLINE
}

interface IEditorNodeOptions<T extends Record<string, any>, U extends EditorNodeType> {
  name: string
  type: EditorNodeType
  defaultAttributes: T
  inputRules: U extends EditorNodeType.INLINE ? NodeConfig["addInputRules"] : unknown
  attributes(): Record<keyof T, Pick<Attribute, "default" | "isRequired">>
  nodeView: VoidComponent
}

export function registerEditorNode<
  T extends EditorNodeType,
  U extends Record<string, any>
>(type: T, options: IEditorNodeOptions<U, T>) {
  const config: Partial<NodeConfig> = {
    name: `${cyrb53(options.name)}`,
    inline: true,
    atom: true,
    selectable: false,
    addAttributes: options.attributes,
    addNodeView: () => SolidNodeViewRenderer(options.nodeView)
  }

  if (type === EditorNodeType.INLINE) {
    config.content = 'inline*'
  } else {
    config.addCommands = function() {
      return {
        insertVideo$: () => ({ tr }) => {
          return insertNodeAtCurrentPosition(this, tr, options.defaultAttributes)
        },
      }
    }
  }

  const nodeExtension = Node.create(config)

  pluginEvent.emit$(PluginEvent.REGISTER_EDITOR_NODE, nodeExtension)
}