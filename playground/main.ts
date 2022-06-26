import { getMonthDayMatrix } from '../src'

getMonthDayMatrix(2022, 6).forEach((w) => {
  const week = document.createElement('div')
  week.classList.add('week')
  w.forEach((d) => {
    const day = document.createElement('pre')
    day.classList.add('day')
    day.textContent = JSON.stringify(d.lunarInfo, null, 2)
    week.append(day)
  })
  document.querySelector('#app')?.append(week)
})
