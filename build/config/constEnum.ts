import { writeFileSync } from "node:fs"

const defineMapping: Map<string, string> = new Map()
const typeContent: Record<string, string[]> = {}

/**Simply just define a `const enum`. The enum types will be available in the global scope.
 * 
 * This is a work-around to mimic `const enum` behavior. Because simply, `vite`, or more correctly, 
 * `esbuild`, doesn't support `const enum` to inline the value and stuff.
 * 
 * This is only the solution.
 * @param enumName the enum name.
 * @param props the enum properties. If the property value is `null`, it will be replaced
 * by a number instead.
 * @see https://github.com/vitest-dev/vitest/discussions/3964
 * @see https://github.com/evanw/esbuild/issues/2298#issuecomment-1146378367
 */
function defineEnum(
  enumName: string, 
  props: Record<string, null | number | string>, 
  moduleName: string = "global"
) {
  const entries = Object.entries(props)
  let enumPropContent = ''

  for (let i = 0; i < entries.length; i++) {
    let [name, value] = entries[i]
    if (!value) {
      value = i
    }

    if (typeof value === "string") {
      value = `"${value}"`
    }

    enumPropContent += `${name} = ${value},`
    defineMapping.set(`${enumName}.${name}`, `${value}`)
    console.log(`define: ${enumName}.${name} = `, value)
  }

  if (!typeContent[moduleName]) {
    typeContent[moduleName] = []
  }

  typeContent[moduleName].push(`enum ${enumName} {${enumPropContent}}`)
}

export function defineAllEnum() {
  defineEnum('ToastActionType', {
    ADD_TOAST: null,
    UPDATE_TOAST: null,
    UPSERT_TOAST: null,
    DISMISS_TOAST: null,
    REMOVE_TOAST: null,
    START_PAUSE: null,
    END_PAUSE: null,
  })

  defineEnum('ToastType', {
    SUCCESS: null,
    ERROR: null,
    LOADING: null,
    BLANK: null,
    CUSTOM: null
  })

  defineEnum('ToastPosition', {
    TOP_LEFT: null,
    TOP_CENTER: null,
    TOP_RIGHT: null,
    BOTTOM_LEFT: null,
    BOTTOM_CENTER: null,
    BOTTOM_RIGHT: null
  })

  defineEnum('ButtonVariant', {
    DEFAULT: null,
    DANGER: null,
    OUTLINE: null,
    SECONDARY: null,
    GHOST: null,
    LINK: null,
  })

  defineEnum('ButtonSize', {
    DEFAULT: null,
    SMALL: null,
    LARGE: null,
    ICON: null,
    UNSET: null,
  })

  defineEnum('FormSubmitState', {
    SUCCESS: null,
  })

  defineEnum('SettingType', {
    CUSTOM: null,
    INPUT: null,
    RANGE: null,
    CHECKBOX: null,
  })

  defineEnum('VideoLoadingStatus', {
    START_LOADING: null,
    FINISH_LOADING: null,
    ERROR: null
  })

  defineEnum('ButtonRowDirection', {
    LEFT: null,
    RIGHT: null,
    MIDDLE: null,
    CUSTOM: null,
  })

  defineEnum('FileUploadType', {
    DIRECTORY: null,
    FILE: null,
    MULTI_FILE: null
  })

  // 1 to 1 mapping from ./backend/features/editor/utils.go
  defineEnum('FileType', {
    DEFAULT: 0,
    ERROR: 255,
    IMAGE: 1,
    VIDEO: 2,
    TEXT: 3,
    AUDIO: 4
  })

  defineEnum('BongoCatAnimationFrame', {
    IDLE: "bc",
    RIGHT_HAND_TAPPED: "ba",
    LEFT_HAND_TAPPED: "dc"
  })

  defineEnum('GalleryViewMode', {
    SINGLE_ITEM: null,
    SPLIT_VIEW: null,
  })

  defineEnum('CurrentlyOpenedHeaderAction', {
    TOGGLE_SIDEBAR: null,
    GO_BACK_TO_HOME: null
  })

  defineEnum('EditorEvent', {
    ON_SWITCHING: null,
    ON_UPDATE: null,
    UPDATE_BONGO_CAT_ANIMATION: null
  })

  defineEnum('JournalType', {
    JOURNAL: null,
    FOLDER: null
  })

  defineEnum('PluginEvent', {
    // internals
    REGISTER_EDITOR_NODE: null,
    // loading,
    JOURNAL_LOADED: null
  })

  defineEnum('MediaState', {
    LOADING: null,
    FINISHED_LOADING: null,
    PLAYING: null,
    PAUSED: null,
    ERROR: null,
    COMPLETED: null
  })

  defineEnum('MediaEvent', {
    STATE_UPDATE: null
  })

  defineEnum('PlaylistButtonRowAction', {
    NEXT_TRACK: null,
    PREVIOUS_TRACK: null,
    TOGGLE_PLAY_TRACK: null
  })

  return {
    generateType() {
      let content = "// this file is auto-generated when on dev/build mode\nexport {};"
      for (const [moduleName, moduleContent] of Object.entries(typeContent)) {
        if (moduleName === "global") {
          content += `declare global { ${moduleContent.join('')} }`
          continue
        }

        content += `declare module ${moduleName} { ${moduleContent.join('')} }`
      }

      writeFileSync("./build/dist/enum_generated.d.ts", content)
    },
    getDefineList() {
      return Object.fromEntries(defineMapping.entries())
    }
  }
}

if (import.meta.main) {
  defineAllEnum().generateType()
}