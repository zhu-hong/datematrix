import { isLeapYear, month30day, month31day } from './util'
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

function getMonthDaysArr(year: number, month: number, week_startday_use_monday: boolean): IDateItem[][] {
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
    let curDateDay = new Date(year, month - 1, day + 1).getDay()

    const date = day + 1

    if(week_startday_use_monday) {
      curDateDay = [6, 0, 1, 2, 3, 4, 5][curDateDay]
    }

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

function getPrevMonthFillDays(year: number, month: number, length: number, week_startday_use_monday: boolean): IDateItem[] {
  let prevMonth = month - 1
  if (prevMonth === 0) {
    prevMonth = 12
    year--
  }

  const prevMonthDaysArr = getMonthDaysArr(year, prevMonth, week_startday_use_monday).flat().filter((d) => d !== null)
  return prevMonthDaysArr.map((date) => {
    date.inOtherMonth = true
    return date
  }).slice(prevMonthDaysArr.length - length)
}

function getNextMonthFillDays(year: number, month: number, length: number, week_startday_use_monday: boolean): IDateItem[] {
  let nextMonth = month + 1
  if (nextMonth > 12) {
    nextMonth = 1
    year++
  }

  const nextMonthDaysArr = getMonthDaysArr(year, nextMonth, week_startday_use_monday).flat().filter((d) => d !== null)
  return nextMonthDaysArr.map((date) => {
    date.inOtherMonth = true
    return date
  }).slice(0, length).reverse()
}

export function getMonthDayMatrix(year: number, month: number, week_startday_use_monday: boolean = false): IDateItem[][] {
  const daysArr = getMonthDaysArr(year, month, week_startday_use_monday)

  let beforeEmptyLength = -1
  daysArr.flat().find((d) => {
    beforeEmptyLength++
    return d !== null
  })

  const prevMonthFillDays = getPrevMonthFillDays(year, month, beforeEmptyLength, week_startday_use_monday)
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

  const nextMonthFillDays = getNextMonthFillDays(year, month, afterEmptyLength, week_startday_use_monday)
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
