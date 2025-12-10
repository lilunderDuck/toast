import { mkdirSync, writeFileSync } from "node:fs"

type ValidEnum = Record<string, string | number>
type ConstsMapping = (
  { type: "constEnum", name: string, prop: ValidEnum } |
  { type: "const", name: string, value: any, valueType: string }
)[]
const DEFINED_CONST_MAPPING: ConstsMapping = []

/**Define a `const enum`. The enum types will be available in the global scope.
 * 
 * This is a work-around to mimic `const enum` behavior. Because simply, `vite`, or more correctly, 
 * `esbuild`, doesn't support `const enum` to inline the value and stuff.
 * 
 * This is only the solution.
 * @param name the enum name.
 * @param props the enum properties. If the property value is `null`, it will be replaced
 * by a number instead.
 * @see https://github.com/vitest-dev/vitest/discussions/3964
 * @see https://github.com/evanw/esbuild/issues/2298#issuecomment-1146378367
 */
function define(name: string, props: ValidEnum | string[], options?: any): void
/**Define a global constant that will be replaced on build time, just like the C/C++ `#define` preprocessor.
 * @param name the name of the variable
 * @param value the value of the variable
 * @param type type type of the value in typescript
 */
function define(name: string, value: any, type?: string): void
function define(name: string, ...stuff: any[]) {
  const [args_1, args_2] = stuff

  // Check if it's a enum declaration
  if (
    (typeof args_1 === "object" || Array.isArray(args_1))
  ) {
    // Rename for better readability
    const props = args_1
    let propMapping: ValidEnum = {}
    if (Array.isArray(props)) {
      for (let i = 0; i < props.length; i++) {
        const propName = props[i]
        // Each properties of the enum will be assigned by the index
        propMapping[propName] = i
      }
    } else {
      propMapping = JSON.parse(JSON.stringify(props))
    }

    DEFINED_CONST_MAPPING.push({
      name,
      prop: propMapping,
      type: "constEnum"
    })

    return
  }

  let value = args_1, valueType = args_2

  switch (typeof value) {
    case "string":
      value = `"${value}"`
      break
    case "object":
      value = JSON.stringify(value)
      break
  }

  const data = { name, value, valueType: valueType, type: "const" }
  if (!valueType) {
    data.valueType = value
  }

  // @ts-ignore - should work fine
  DEFINED_CONST_MAPPING.push(data)
}

export function generateConstsTypeThenSave() {
  // Track the names and values of all constants that are successfully processed.
  // 
  // This map will be passed to esbuild's `define` option.
  const definedMapping = new Map<string, string | number>()

  let content = "// this file is auto-generated when on dev/build mode\n"
  for (const definedConst of DEFINED_CONST_MAPPING) {
    switch (definedConst.type) {
      case "constEnum": {
        const entries = Object.entries(definedConst.prop)
        const enumName = definedConst.name
        // Constructs the enum from the inside first.
        //   const enum MyEnum {
        //      ... everything inside ...
        //   }
        let enumContent = ''
        for (let [enumPropName, enumPropValue] of entries) {
          // wraps it in quotes to ensure valid TypeScript code.
          if (typeof enumPropValue === "string") {
            enumPropValue = `"${enumPropValue}"`
          }

          // Good enough formatting (instead of one single line)
          enumContent += `\t${enumPropName} = ${enumPropValue},\n`

          const fullName = `${enumName}.${enumPropName}` as const
          definedMapping.set(fullName, enumPropValue)
          console.log(`Define:\t\t${fullName} = ${enumPropValue}`)
        }

        content += `enum ${enumName} {\n${enumContent}\n}`
      } break

      case "const": {
        content += `declare const ${definedConst.name}: ${definedConst.valueType};\n`
        definedMapping.set(definedConst.name, definedConst.value)
        console.log(`Define:\t\t${definedConst.name} = ${definedConst.value}`)
      } break

      default:
        break;
    }
  }

  // Just to make sure the destination folder exists.
  mkdirSync("./build/dist", { recursive: true })
  writeFileSync("./build/dist/consts.d.ts", `declare global {\n\t${content}\n}; export {}`)

  return Object.fromEntries(definedMapping.entries())
}

export function defineAllConstants(isDevMode: boolean = false) {
  define('isDevMode', isDevMode, 'boolean')

  define('ToastActionType', [
    'ADD_TOAST',
    'UPDATE_TOAST',
    'UPSERT_TOAST',
    'DISMISS_TOAST',
    'REMOVE_TOAST',
    'START_PAUSE',
    'END_PAUSE',
  ])

  define('ToastType', [
    'SUCCESS',
    'ERROR',
    'LOADING',
    'BLANK',
    'CUSTOM',
  ])

  define('ToastPosition', [
    'TOP_LEFT',
    'TOP_CENTER',
    'TOP_RIGHT',
    'BOTTOM_LEFT',
    'BOTTOM_CENTER',
    'BOTTOM_RIGHT',
  ])

  define('ButtonVariant', [
    'DEFAULT',
    'DANGER',
    'OUTLINE',
    'SECONDARY',
    'GHOST',
    'LINK',
    'NO_BACKGROUND',
    'UNSET'
  ])

  define('ButtonSize', [
    'DEFAULT',
    'SMALL',
    'LARGE',
    'ICON',
    'UNSET',
  ])

  define('FormSubmitState', [
    'SUCCESS',
  ])

  define('SettingType', [
    'CUSTOM',
    'INPUT',
    'RANGE',
    'CHECKBOX',
  ])

  define('VideoLoadingStatus', [
    'START_LOADING',
    'FINISH_LOADING',
    'ERROR',
  ])

  define('ButtonRowDirection', [
    'LEFT',
    'RIGHT',
    'MIDDLE',
    'CUSTOM',
  ])

  define('FileUploadType', [
    'DIRECTORY',
    'FILE',
    'MULTI_FILE',
  ])

  // 1 to 1 mapping from ./backend/features/editor/utils.go
  define('FileType', {
    DEFAULT: 0,
    ERROR: 255,
    IMAGE: 1,
    VIDEO: 2,
    TEXT: 3,
    AUDIO: 4
  }) // do not reorder

  define('BongoCatAnimationFrame', {
    IDLE: "bc",
    RIGHT_HAND_TAPPED: "ba",
    LEFT_HAND_TAPPED: "dc"
  })

  define('GalleryViewMode', [
    'SINGLE_ITEM',
    'SPLIT_VIEW',
  ])

  define('GALLERY_DEFAULT_ID', '')

  define('CurrentlyOpenedHeaderAction', [
    'TOGGLE_SIDEBAR',
    'GO_BACK_TO_HOME',
  ])

  define('EditorEvent', [
    'ON_SWITCHING',
    'ON_UPDATE',
    'UPDATE_BONGO_CAT_ANIMATION',
  ])

  define('JournalType', [
    'JOURNAL',
    'FOLDER',
  ])

  define('PluginEvent', [
    'REGISTER_EDITOR_NODE',
    'JOURNAL_LOADED',
  ])

  define('MediaState', [
    'LOADING',
    'FINISHED_LOADING',
    'PLAYING',
    'PAUSED',
    'ERROR',
    'COMPLETED',
  ])

  define('MediaEvent', [
    'STATE_UPDATE',
  ])

  define('PlaylistButtonRowAction', [
    'NEXT_TRACK',
    'PREVIOUS_TRACK',
    'TOGGLE_PLAY_TRACK',
  ])

  define('PLAYLIST_DEFAULT_ID', '')

  define('EditorNodeType', [
    'INLINE',
    'BLOCK'
  ])

  define('EditorTextColor', {
    'RED': '#c92222',
    'ORANGE': '#d34f0b',
    'YELLOW': '#b67c04',
    'GREEN': '#149343',
    'TEAL': '#0782a0',
    'BLUE': '#2159d3',
    'PURPLE': '#842ed3',
    'GREY': '#444d59',
    'HIGHLIGHT_RED': '#ffcece',
    'HIGHLIGHT_ORANGE': '#fed5d5',
    'HIGHLIGHT_YELLOW': '#fedfbb',
    'HIGHLIGHT_GREEN': '#fef3a1',
    'HIGHLIGHT_TEAL': '#e1fab1',
    'HIGHLIGHT_BLUE': '#adf8e9',
    'HIGHLIGHT_PURPLE': '#cce2fe',
    'HIGHLIGHT_GREY': '#edddff',
    'RESET': 0,
    'CUSTOM': 1
  })

  define('TabEvent', [
    'CREATE',
    'UPDATE'
  ])

  define('TableDataType', [
    'NUMBER',
    'PROGRESS',
    'TEXT',
    'CHECKBOX',
    'LINK',
    'TAG',
    'DATE'
  ]) // do not reorder

  define('TableDataEvent', [
    'UPDATE',
  ])

  define('TableViewType', [
    'TABLE',
    'KANBAN'
  ]) // do not reorder

  define('TABLE_DEFAULT_ID', '')

  define('FloatingMenuType', [
    'SEPERATOR',
    'ITEM',
    'LABEL'
  ])

  define('TreeViewEvent', {
    'UPDATE': 'af'
  })

  define('TreeViewUpdateType', [
    'CREATE_NODE',
    'UPDATE_NODE',
    'REMOVE_NODE',
  ])

  define('TreeViewNodeType', [
    'LEAF',
    'PARENT',
  ]) // do not reorder

  define('TREE_VIEW_ROOT_NODE_ID', 0)

  define('TaskType', [
    'SECTION',
    'TASK',
  ]) // do not reorder
}

if (import.meta.main) {
  defineAllConstants()
  generateConstsTypeThenSave()
}