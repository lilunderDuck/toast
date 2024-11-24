/**
 * @param month The month number
 * @param year The year, not zero based, required to account for leap years
 * @return A list with date objects for each day of the month
 */
export function getDaysInMonth(month: number, year: number) {
  console.assert(month > 1, 'Month should not be less than 1')

  month -= 1

  var date = new Date(year, month, 1)
  var days = []
  while (date.getMonth() === month) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }
  return days
}

export function getCurrentMonthAndYear() {
  const currentDate = new Date()
  return {
    day: currentDate.getDate(),
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear()
  }
}

export type ThisYearsCurrentTime = ReturnType<typeof getCurrentMonthAndYear>

export function getMonthName(month: number) {
  console.assert(month > 1 || month <= 12, 'Invalid month.')

  const lookUp: Record<number, string> = {
    1: 'January', 
    2: 'February', 
    3: 'March', 
    4: 'April', 
    5: 'May', 
    6: 'June', 
    7: 'July', 
    8: 'August', 
    9: 'September', 
    10: 'October', 
    11: 'November',
    12: 'December'
  }

  return lookUp[month]
}