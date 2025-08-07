export function createElement<T extends HTMLTags>(name: T, attributes: Partial<HTMLElementTagNameMap[T]> = {}) {
  const element = document.createElement(name)
  for (const [key, value] of attributes) {
    element[key] = value
  }

  return element
}