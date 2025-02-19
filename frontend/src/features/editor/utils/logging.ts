export function editor_log(...something: any[]) {
  return console.log("%ceditor%c ", "background-color:#1262c4;padding-inline:4px;border-radius:6px;", "", ...something)
}

export function editor_warn(...something: any[]) {
  return console.warn("%ceditor%c ", "background-color:#1262c4;padding-inline:4px;border-radius:6px;", "", ...something)
}

export function editor_logWithLabel(label: string, ...something: any[]) {
  console.log(
    `%ceditor%c %c${name}%c`, 
    "background-color:#1262c4;padding-inline:4px;border-radius:6px;", 
    "", 
    `background-color:#09ab49;padding-inline:4px;border-radius:6px;`, 
    "", 
    ...something
  )
}

export function editor_createLog(name: string, color: string) {
  return {
    log(...something: any[]) {
      console.log(
        `%ceditor%c %c${name}%c`, 
        "background-color:#1262c4;padding-inline:4px;border-radius:6px;", 
        "", 
        `background-color:${color};padding-inline:4px;border-radius:6px;`, 
        "", 
        ...something
      )
    }
  }
}