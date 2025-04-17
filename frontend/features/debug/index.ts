import { createLog } from "./this"

export * from "./this"

export const journalLog = createLog('journal', '#bf117f', '#119fbf')
export const homeLog = createLog('home', '#ab5318', '#185dab')
export const appLog = createLog('duck', '#a17c0e', '#99720f')

export const editorLog = createLog('editor', '#1262c4', '#0f2999')
export const imgZoomPanLog = createLog('Image pan/zoom', '#088a54', '#06663e')

export const fileDialog = createLog('file dialog', '#ff3721', '#b52919')
export const lazyLoadComponent = createLog('lazy', '#131862', '#172a87')
export const apiCallLog = createLog('api call', '#131862', '#172a87')
