import { macro_mergeClassnames } from "macro-def"
import { A } from "@solidjs/router"
import { BsClockHistory, BsHouseDoorFill, BsPlusSquareDotted } from "solid-icons/bs"
import { For, type ParentProps } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./index.module.css"
// ...
import { createLazyLoadedDialog, FieldInputLabel } from "~/components"
import { useJournalContext } from "~/features/journal"

const style = stylex.create({
  welcomePage: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    userSelect: "none"
  },
  welcomePage__content: {
    flexShrink: 0,
    width: "70%"
  },
  welcomePage__heading: {
    width: "100%",
    textAlign: "center"
  },
  welcomePage__section: {
    marginTop: 10
  },
  welcomePage__itemWrap: {
    display: "flex",
    alignItems: "center",
    textAlign: "left",
    outline: "none",
    gap: 15,
    paddingInline: 20,
    paddingBlock: 15,
    width: "100%",
    ":first-child": {
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
    ":last-child": {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      borderBottomLeftRadius: 6,
      borderBottomRightRadius: 6,
    }
  },
  welcomePage__itemName: {
    fontSize: 14
  }
})

export default function JournalWelcomePage() {
  const CreateJournalDialog = createLazyLoadedDialog(
    () => import("~/features/journal/components/side-bar/dialog/CreateJournalDialog"),
    () => ({
      context$: useJournalContext()
    })
  )

  const items = [
    { 
      iconHoverColor$: "var(--green11)", 
      icon$: BsPlusSquareDotted, 
      name$: "Create new journal.", 
      onClick$: CreateJournalDialog.show$ 
    },
    { 
      iconHoverColor$: "var(--tomato9)", 
      icon$: BsClockHistory, 
      name$: "Open last closed journal.",
      disabled$: true
    },
    { 
      iconHoverColor$: "var(--blue9)", 
      icon$: BsHouseDoorFill, 
      name$: "Go back to home.", href: "/" 
    },
  ]

  return (
    <div {...stylex.attrs(style.welcomePage)}>
      <div {...stylex.attrs(style.welcomePage__content)}>
        <h1 {...stylex.attrs(style.welcomePage__heading)}>Welcome, home.</h1>
        <section {...stylex.attrs(style.welcomePage__section)}>
          <FieldInputLabel>Not sure what to do next?</FieldInputLabel>
          <div id={__style.hint}>
            <For each={items}>
              {it => {
                const Wrapper = (props: ParentProps) => it.href ?
                  <A href={it.href} data-link-no-color>
                    {props.children}
                  </A> :
                  props.children
                // 

                return (
                  <Wrapper>
                    <button
                      onClick={it.onClick$}
                      disabled={it.disabled$}
                      class={macro_mergeClassnames(
                        stylex.attrs(style.welcomePage__itemWrap),
                        __style.hintItem
                      )}
                      style={`--hint-hover-color: ${it.iconHoverColor$}`}
                    >
                      <it.icon$ size={20} class={__style.hintIcon} />
                      <span {...stylex.attrs(style.welcomePage__itemName)}>
                        {it.name$}
                      </span>
                    </button>
                  </Wrapper>
                )
              }}
            </For>
          </div>
        </section>
      </div>

      <CreateJournalDialog.Dialog$ />
    </div>
  )
}