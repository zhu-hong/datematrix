import { isLeapYear, month30day, month31day } from './util'
import { getLunarInfo } from './get_lunar_info'
import type { IDateItem, MonthDayEnum } from './types'

function getMonthTotalDay(year: number, month: number): MonthDayEnum {
  if (month31day.includes(month)) {
    return 31
  } else if (month30day.includes(month)) {
    return 30
  } else {
    if (isLeapYear(year)) {
      return 29
    } else {
      return 28
    }
  }
}

function getMonthDaysArr(year: number, month: number): IDateItem[][] {
  let totalDay = getMonthTotalDay(year, month)

  let daysArr: IDateItem[][] = [
    // @ts-ignore
    Array.from({ length: 7 }, () => null),
    // @ts-ignore
    Array.from({ length: 7 }, () => null),
    // @ts-ignore
    Array.from({ length: 7 }, () => null),
    // @ts-ignore
    Array.from({ length: 7 }, () => null),
    // @ts-ignore
    Array.from({ length: 7 }, () => null),
    // @ts-ignore
    Array.from({ length: 7 }, () => null),
  ]

  let curDayLevel: number = 0
  for (let day = 0; day < totalDay; day++) {
    const curDateDay = new Date(year, month - 1, day + 1).getDay()

    const date = day + 1

    daysArr[curDayLevel][curDateDay] = {
      year,
      month,
      date,
      inOtherMonth: false,
      dateStr: `${year}-${month}-${date}`,
    }

    if (curDateDay === 6) {
      curDayLevel++
    }
  }

  return daysArr
}

function getPrevMonthFillDays(year: number, month: number, length: number): IDateItem[] {
  let prevMonth = month - 1
  if (prevMonth === 0) {
    prevMonth = 12
    year--
  }

  const prevMonthDaysArr = getMonthDaysArr(year, prevMonth).flat().filter((d) => d !== null)
  return prevMonthDaysArr.map((date) => {
    date.inOtherMonth = true
    return date
  }).slice(prevMonthDaysArr.length - length)
}

function getNextMonthFillDays(year: number, month: number, length: number): IDateItem[] {
  let nextMonth = month + 1
  if (nextMonth > 12) {
    nextMonth = 1
    year++
  }

  const nextMonthDaysArr = getMonthDaysArr(year, nextMonth).flat().filter((d) => d !== null)
  return nextMonthDaysArr.map((date) => {
    date.inOtherMonth = true
    return date
  }).slice(0, length).reverse()
}

export function getMonthDayMatrix(year: number, month: number): IDateItem[][] {
  const daysArr = getMonthDaysArr(year, month)

  let beforeEmptyLength = -1
  daysArr.flat().find((d) => {
    beforeEmptyLength++
    return d !== null
  })

  const prevMonthFillDays = getPrevMonthFillDays(year, month, beforeEmptyLength)
  for (let index = 0; index < beforeEmptyLength; index++) {
    daysArr[0][index] = prevMonthFillDays[index]
  }

  let afterEmptyLength = 0
  daysArr.flat().forEach((d) => {
    if (d !== null) {
      afterEmptyLength = 0
    } else {
      afterEmptyLength++
    }
  })

  const nextMonthFillDays = getNextMonthFillDays(year, month, afterEmptyLength)
  let fillNextMonthDaysLevel = daysArr.length - 1
  let fillNextMonthDaysIndex = 6
  for (let index = 0; index < afterEmptyLength; index++) {
    daysArr[fillNextMonthDaysLevel][fillNextMonthDaysIndex] = nextMonthFillDays[index]
    fillNextMonthDaysIndex--
    if (index === 6) {
      fillNextMonthDaysLevel--
      fillNextMonthDaysIndex = 6
    }
  }

  return daysArr
}
