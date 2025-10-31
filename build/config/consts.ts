import { mkdirSync, writeFileSync } from "node:fs"

type ValidEnum = Record<string, string | number>
type ConstsMapping = { type: string, name: string, prop: ValidEnum }[]

function makeConst() {
  const mapping: ConstsMapping = []

  const defineEnum = (name: string, prop: ValidEnum | string[]) => {
    let propMapping: ValidEnum = {}
    if (Array.isArray(prop)) {
      for (let i = 0; i < prop.length; i++) {
        const propName = prop[i]
        propMapping[propName] = i
      }
    } else {
      propMapping = prop
    }

    mapping.push({
      name,
      prop: propMapping,
      type: "constEnum"
    })
  }

  const defineConst = (name: string, value: any, type: string) => {
    switch (typeof value) {
      case "string":
        value = `"${value}"`
        break
      case "object":
        value = JSON.stringify(value)
        break
    }

    mapping.push({
      name,
      value,
      valueType: type,
      type: "const"
    })
  }

  return {
    mapping: mapping,
    /**Simply just define all `const enum`s. The enum types will be available in the global scope.
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
    defineEnum,
    defineConst
  }
}

export function generateConstsTypeThenSave(mapping: ConstsMapping) {
  const definedMapping = new Map<string, string | number>()

  let content = "// this file is auto-generated when on dev/build mode\n"
  for (const definedConst of mapping) {
    if (definedConst.type === "constEnum") {
      const entries = Object.entries(definedConst.prop)
      let enumContent = ''
      for (let [enumPropName, enumPropValue] of entries) {
        enumContent += `${enumPropName} = ${enumPropValue},`
        if (typeof enumPropValue === "string") {
          enumPropValue = `"${enumPropValue}"`
        }

        const fullName = `${definedConst.name}.${enumPropName}` as const
        definedMapping.set(fullName, enumPropValue)
        console.log(`Define:\t\t${fullName} = ${enumPropValue}`)
      }

      content += `enum ${definedConst.name} {${enumContent}}`
    } else {
      content += `declare const ${definedConst.name}: ${definedConst.valueType};`
      definedMapping.set(definedConst.name, definedConst.value)
      console.log(`Define:\t\t${definedConst.name} = ${definedConst.value}`)
    }
  }

  mkdirSync("./build/dist", { recursive: true })
  writeFileSync("./build/dist/consts.d.ts", `declare global {${content}}; export {}`)

  return Object.fromEntries(definedMapping.entries())
}

export function defineAllConstants(isDevMode: boolean = false) {
  const { defineEnum, mapping, defineConst } = makeConst()

  defineConst('isDevMode', isDevMode, 'boolean')

  defineEnum('ToastActionType', [
    'ADD_TOAST',
    'UPDATE_TOAST',
    'UPSERT_TOAST',
    'DISMISS_TOAST',
    'REMOVE_TOAST',
    'START_PAUSE',
    'END_PAUSE',
  ])

  defineEnum('ToastType', [
    'SUCCESS',
    'ERROR',
    'LOADING',
    'BLANK',
    'CUSTOM',
  ])

  defineEnum('ToastPosition', [
    'TOP_LEFT',
    'TOP_CENTER',
    'TOP_RIGHT',
    'BOTTOM_LEFT',
    'BOTTOM_CENTER',
    'BOTTOM_RIGHT',
  ])

  defineEnum('ButtonVariant', [
    'DEFAULT',
    'DANGER',
    'OUTLINE',
    'SECONDARY',
    'GHOST',
    'LINK',
  ])

  defineEnum('ButtonSize', [
    'DEFAULT',
    'SMALL',
    'LARGE',
    'ICON',
    'UNSET',
  ])

  defineEnum('FormSubmitState', [
    'SUCCESS',
  ])

  defineEnum('SettingType', [
    'CUSTOM',
    'INPUT',
    'RANGE',
    'CHECKBOX',
  ])

  defineEnum('VideoLoadingStatus', [
    'START_LOADING',
    'FINISH_LOADING',
    'ERROR',
  ])

  defineEnum('ButtonRowDirection', [
    'LEFT',
    'RIGHT',
    'MIDDLE',
    'CUSTOM',
  ])

  defineEnum('FileUploadType', [
    'DIRECTORY',
    'FILE',
    'MULTI_FILE',
  ])

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

  defineEnum('GalleryViewMode', [
    'SINGLE_ITEM',
    'SPLIT_VIEW',
  ])

  defineEnum('CurrentlyOpenedHeaderAction', [
    'TOGGLE_SIDEBAR',
    'GO_BACK_TO_HOME',
  ])

  defineEnum('EditorEvent', [
    'ON_SWITCHING',
    'ON_UPDATE',
    'UPDATE_BONGO_CAT_ANIMATION',
  ])

  defineEnum('JournalType', [
    'JOURNAL',
    'FOLDER',
  ])

  defineEnum('PluginEvent', [
    'REGISTER_EDITOR_NODE',
    'JOURNAL_LOADED',
  ])

  defineEnum('MediaState', [
    'LOADING',
    'FINISHED_LOADING',
    'PLAYING',
    'PAUSED',
    'ERROR',
    'COMPLETED',
  ])

  defineEnum('MediaEvent', [
    'STATE_UPDATE',
  ])

  defineEnum('PlaylistButtonRowAction', [
    'NEXT_TRACK',
    'PREVIOUS_TRACK',
    'TOGGLE_PLAY_TRACK',
  ])

  defineEnum('EditorNodeType', [
    'INLINE',
    'BLOCK'
  ])

  return mapping
}

if (import.meta.main) {
  const mapping = defineAllConstants()
  generateConstsTypeThenSave(mapping)
}