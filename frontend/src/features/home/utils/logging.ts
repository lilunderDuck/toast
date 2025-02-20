export function home_logWithLabel(label: string, ...something: any[]) {
  console.log(
    `%chome%c %c${label}%c`, 
    "background-color:#ab5318;padding-inline:4px;border-radius:6px;", 
    "", 
    `background-color:#185dab;padding-inline:4px;border-radius:6px;`, 
    "", 
    ...something
  )
}