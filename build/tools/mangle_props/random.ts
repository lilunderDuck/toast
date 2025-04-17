function generateCombinations(chars: string, length: number, startIndex: number): string[] {
  if (length === 0) return ['']
  const combinations = []
  const smallerCombinations = generateCombinations(chars, length - 1, 0)
  for (let i = startIndex; i < chars.length; i++) {
    for (const smallerCombination of smallerCombinations) {
      combinations.push(chars[i] + smallerCombination)
    }
  }
  return combinations
}

export function* getRandomChar() {
  for (const char of generateCombinations("_qwertyuiopasdfghjklzxcvbnm", 2, 0)) {
    yield char
  }
}