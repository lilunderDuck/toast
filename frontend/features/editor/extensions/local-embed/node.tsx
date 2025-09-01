import { createFileUpload } from "~/features/native"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { NodeViewWrapper } from "~/libs/solid-tiptap-renderer"
import { useLocalEmbedContext } from "./provider"
import { Show } from "solid-js"
import { SpinningCube } from "~/components"

const style = stylex.create({
  embed: {
    width: "100%",
    height: "20rem",
    overflow: "hidden",
    userSelect: "none",
    position: "relative"
  },
  embed__fullscreen: {
    paddingBlock: "2rem",
  },
  embed__empty: {
    backgroundColor: "var(--gray3)",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    border: "2px solid transparent",
    borderRadius: 6,
    ":hover": {
      borderColor: "var(--gray7)"
    }
  },
  embed__iframe: {
    width: "100%",
    height: "-webkit-fill-available"
  },
  embed__loadingLayer: {
    width: "100%",
    height: "100%",
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
})

export default function LocalEmbedNode() {
  const { isEmpty$, isFullscreen$, setRootRef$, upload$, getEmbedUrl$ } = useLocalEmbedContext()

  const { open$, isUploading$ } = createFileUpload({
    type$: FileUploadType.FILE,
    dialogOptions$: {
      Title: "Choose a html file to embed into your journal.",
      Filters: [
        { DisplayName: "Html files", Pattern: "*.html;*.htm", }
      ]
    },
    async onFinish$(path) {
      upload$(path)
    }
  })

  return (
    <NodeViewWrapper>
      <div
        {...stylex.attrs(style.embed, isFullscreen$() ? style.embed__fullscreen : {})} 
        ref={setRootRef$}
        onClick={open$}
      >
        <Show when={isUploading$()}>
          <div {...stylex.attrs(style.embed__loadingLayer)}>
            <SpinningCube cubeSize$={30} />
          </div>
        </Show>
        <Show when={!isEmpty$()} fallback={
          <div {...stylex.attrs(style.embed__empty)}>
            Click here to upload your embed.
          </div>
        }>
          <iframe
            src={getEmbedUrl$()}
            sandbox="allow-scripts allow-same-origin allow-modals allow-popups"
            referrerPolicy="origin"
            {...stylex.attrs(style.embed__iframe)}
            onError={() => console.log('error fired')}
          />
        </Show>
      </div>
    </NodeViewWrapper>
  )
}