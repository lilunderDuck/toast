// my brain refused to understand this code
// the original code are coming from 
// - https://github.com/Hebmor/tiptap-extension-code-block-prism/blob/master/src/prism-plugin.ts
// - https://github.com/Hebmor/tiptap-extension-code-block-prism/blob/master/src/code-block-prism.ts
// go check that out!

import { findChildren } from '@tiptap/core'
// ...
import { Node as ProsemirrorNode } from 'prosemirror-model'
import { Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'
import Prism from 'prismjs'
// ...
import CodeBlock, { CodeBlockOptions } from '@tiptap/extension-code-block'
import type { EditorState, Transaction } from '@tiptap/pm/state'
import { fromHtml } from 'hast-util-from-html'
// ...
import 'prismjs/components/prism-jsx'
import 'prismjs/themes/prism-dark.css'

function parseNodes(
  nodes: any[],
  className: string[] = []
): { text: string; classes: string[] }[] {
  return nodes
    .map((node) => {
      const classes = [
        ...className,
        ...(node.properties ? node.properties.className : []),
      ];

      if (node.children) {
        return parseNodes(node.children, classes);
      }

      return {
        text: node.value,
        classes,
      }
    })
    .flat()
  // 
}

function getHighlightNodes(html: string) {
  return fromHtml(html, { fragment: true }).children;
}

function registeredLang(aliasOrLanguage: string) {
  const allSupportLang = Object.keys(Prism.languages).filter(
    (id) => typeof Prism.languages[id] === 'object'
  );
  return Boolean(allSupportLang.find((x) => x === aliasOrLanguage));
}

function getDecorations(doc: ProsemirrorNode, name: string, defaultLanguage: string) {
  const decorations: Decoration[] = [];
  const children = findChildren(doc, (node) => node.type.name === name)

  for (const block of children) {
    let from = block.pos + 1
    const language = block.node.attrs.language || defaultLanguage
    let html: string = ''

    try {
      if (!registeredLang(language)) {
        import(`prismjs/components/prism-${language}.js`);
      }
      html = Prism.highlight(block.node.textContent, Prism.languages[language], language);
    }
    catch (err: any) {
      console.error(err.message + ": \"" + language + "\"");
      html = Prism.highlight(block.node.textContent, Prism.languages.javascript, 'js');
    }

    const nodes = parseNodes(
      getHighlightNodes(html)
    )

    for (const node of nodes) {
      const to = from + node.text.length

      if (node.classes.length) {
        const decoration = Decoration.inline(from, to, {
          class: node.classes.join(' ')
        })

        decorations.push(decoration)
      }

      from = to
    }
  }

  return DecorationSet.create(doc, decorations);
}

const computeTransaction = (
  name: string,
  defaultLanguage: string,
) => (
  transaction: Transaction, 
  decorationSet: DecorationSet, 
  oldState: EditorState, 
  newState: EditorState
) => {
  const oldNodeName = oldState.selection.$head.parent.type.name;
  const newNodeName = newState.selection.$head.parent.type.name;
  const oldNodes = findChildren(
    oldState.doc,
    (node) => node.type.name === name
  );
  const newNodes = findChildren(
    newState.doc,
    (node) => node.type.name === name
  )

  const isSelectionIncludedNode = [oldNodeName, newNodeName].includes(name)
  const isAddingOrRemovingNode = newNodes.length !== oldNodes.length
  const someConfusingCalculation = transaction.steps.some((step) => {
    return (
      // @ts-ignore
      step.from !== undefined &&
      // @ts-ignore
      step.to !== undefined &&
      oldNodes.some((node) => (
        // @ts-ignore
        node.pos >= step.from &&
        // @ts-ignore
        node.pos + node.node.nodeSize <= step.to
      ))
    )
  })

  const passed = transaction.docChanged && (
    isSelectionIncludedNode ||
    isAddingOrRemovingNode ||
    someConfusingCalculation
  )

  if (passed) return getDecorations(
    transaction.doc,
    name,
    defaultLanguage,
  )

  return decorationSet.map(transaction.mapping, transaction.doc)
}

function prismPlugin(name: string, defaultLanguage: string) {
  const prismjsPlugin: Plugin<any> = new Plugin({
    key: new PluginKey('prism'),

    state: {
      init: (_, { doc }) => getDecorations(
        doc,
        name,
        defaultLanguage,
      ),
      apply: computeTransaction(name, defaultLanguage),
    },

    props: {
      decorations(state) {
        return prismjsPlugin.getState(state);
      },
    },
  })

  return prismjsPlugin
}

export interface CodeBlockPrismOptions extends CodeBlockOptions {
  defaultLanguage: string 
}

export const CodeBlockPrism = CodeBlock.extend<CodeBlockPrismOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      defaultLanguage: 'plain-text',
    }
  },

  addProseMirrorPlugins() {
    return [
      ...this.parent?.() || [],
      prismPlugin(
        this.name,
        this.options.defaultLanguage,
      ),
    ]
  },
})