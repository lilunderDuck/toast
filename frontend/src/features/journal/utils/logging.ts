export function journal_logGroup(...something: any[]) {
  return console.group("%cjournal%c ", "background-color:#bf117f;padding-inline:4px;border-radius:6px;", "", ...something)
}

export function journal_logGroupEnd() {
  return console.groupEnd()
}

export function journal_log(...something: any[]) {
  return console.log("%cjournal%c ", "background-color:#bf117f;padding-inline:4px;border-radius:6px;", "", ...something)
}

export function journal_warn(...something: any[]) {
  return console.warn("%cjournal%c ", "background-color:#bf117f;padding-inline:4px;border-radius:6px;", "", ...something)
}

export function journalFileDisplay_log(...something: any[]) {
  return console.log(
    "%cjournal%c %cfile display%c ", 
    "background-color:#bf117f;padding-inline:4px;border-radius:6px;", 
    "", 
    "background-color:#119fbf;padding-inline:4px;border-radius:6px;", 
    "", 
    ...something
  )
}

export function journalFileDisplay_error(...something: any[]) {
  return console.error(
    "%cjournal%c %cfile display%c ", 
    "background-color:#bf117f;padding-inline:4px;border-radius:6px;", 
    "", 
    "background-color:#119fbf;padding-inline:4px;border-radius:6px;", 
    "", 
    ...something
  )
}