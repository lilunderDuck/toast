export function useBodyToggableClass<const T extends string>(className: T) {
  return (state: boolean) => {
    if (state) {
      document.body.classList.add(className)
    } else {
      document.body.classList.remove(className)
    }
  }
}