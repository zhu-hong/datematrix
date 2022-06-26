export const month31day = [1, 3, 5, 7, 8, 10, 12]
export const month30day = [4, 6, 9, 11]

export function isLeapYear(year: number): boolean {
  if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) return true
  return false
}