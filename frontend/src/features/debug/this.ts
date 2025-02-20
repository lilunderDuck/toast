export function createLog(name: string, nameColor: string, labelColor: string) {
  //@ts-ignore
  const fancyColorLabelStuff = (logType: string) => (label: string, ...something: any[]) => console[logType](
    `%c${name}%c %c${label}%c`,
    `background-color:${nameColor};padding-inline:4px;border-radius:6px;`,
    "",
    `background-color:${labelColor};padding-inline:4px;border-radius:6px;`,
    "",
    ...something
  )

  //@ts-ignore
  const anotherFancyColorLabelStuff = (logType: string) => (...something: any[]) => console[logType](
    `%c${name}%c`,
    `background-color:${nameColor};padding-inline:4px;border-radius:6px;`,
    "",
    ...something
  )

  return {
    log: anotherFancyColorLabelStuff('log'),
    warn: anotherFancyColorLabelStuff('warn'),
    error: anotherFancyColorLabelStuff('error'),
    group: anotherFancyColorLabelStuff('group'),
    groupEnd: () => console.groupEnd(),
    logLabel: fancyColorLabelStuff('log'),
    warnLabel: fancyColorLabelStuff('warn'),
    errorLabel: fancyColorLabelStuff('error'),
    groupLabel: fancyColorLabelStuff('group'),
    groupEndLabel: () => console.groupEnd(),
  }
}