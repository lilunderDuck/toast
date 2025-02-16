export function editor_log(...something: any[]) {
  return console.log("%ceditor%c ", "background-color:#1262c4;padding-inline:4px;border-radius:6px;", "", ...something)
}

export function editor_warn(...something: any[]) {
  return console.warn("%ceditor%c ", "background-color:#1262c4;padding-inline:4px;border-radius:6px;", "", ...something)
}