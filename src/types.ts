export type MonthDayEnum = 31 | 30 | 28 | 29

export interface ILunarInfo {
  /**
   * 农历时间
   */
  lunarDateStr: string,

  /**
   * 干支年
   */
  ganziYear: string,

  /**
   * 干支月
   */
  ganzhiMonth: string,

  /**
   * 干支日
   */
  ganzhiDay: string,

  /**
   * '正','一','二','三','四','五','六','七','八','九','十','冬','腊'
   */
  chinese_month: string,

  /**
   * '初','十','廿','卅'
   * '日','一','二','三','四','五','六','七','八','九','十'
   */
  chinese_day: string,

  /**
   * 节气
   */
  term: string,

  /**
   * 节日
   */
  festivals: string[],

  /**
   * 生肖
   */
  zodiac: string,

  /**
   * 星座
   */
  astro: string,
}

export interface IDateItem {
  year: number
  month: number
  date: number
  inOtherMonth: boolean
  dateStr: string
  lunarInfo: ILunarInfo,
}

