import { getMonthDayMatrix, getLunarInfo } from '../src'

getMonthDayMatrix(2022, 2, true).forEach((w) => {
  const week = document.createElement('div')
  week.classList.add('week')
  w.forEach((d) => {

    d.lunarInfo = getLunarInfo(d.year, d.month, d.date)

    const day = document.createElement('pre')
    day.classList.add('day')
    day.textContent = JSON.stringify(d.lunarInfo, null, 2)
    week.append(day)
  })
  document.querySelector('#app')?.append(week)
})
