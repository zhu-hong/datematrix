import { ILunarInfo } from './types'
import { isLeapYear, month30day } from './util'

/**
* 年代表
*/
const lunarSet = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,//1900-1909
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,//1910-1919
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,//1920-1929
  0x06566, 0x0d4a0, 0x0ea50, 0x16a95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,//1930-1939
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,//1940-1949
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,//1950-1959
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,//1960-1969
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,//1970-1979
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,//1980-1989
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x05ac0, 0x0ab60, 0x096d5, 0x092e0,//1990-1999
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,//2000-2009
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,//2010-2019
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,//2020-2029
  0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,//2030-2039
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,//2040-2049
  0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,//2050-2059
  0x092e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,//2060-2069
  0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,//2070-2079
  0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,//2080-2089
  0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252,//2090-2099
  0x0d520, // 2100
]

/**
* ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸']
*/
const tianganSet = ['\u7532', '\u4e59', '\u4e19', '\u4e01', '\u620a', '\u5df1', '\u5e9a', '\u8f9b', '\u58ec', '\u7678']

/**
* ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']
*/
const dizhiSet = ['\u5b50', '\u4e11', '\u5bc5', '\u536f', '\u8fb0', '\u5df3', '\u5348', '\u672a', '\u7533', '\u9149', '\u620c', '\u4ea5']

/**
* 二十四节气查询表
*/
const termSet = [
  '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf97c3598082c95f8c965cc920f',
  '97bd0b06bdb0722c965ce1cfcc920f', 'b027097bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e',
  '97bcf97c359801ec95f8c965cc920f', '97bd0b06bdb0722c965ce1cfcc920f', 'b027097bd097c36b0b6fc9274c91aa',
  '97b6b97bd19801ec9210c965cc920e', '97bcf97c359801ec95f8c965cc920f', '97bd0b06bdb0722c965ce1cfcc920f',
  'b027097bd097c36b0b6fc9274c91aa', '9778397bd19801ec9210c965cc920e', '97b6b97bd19801ec95f8c965cc920f',
  '97bd09801d98082c95f8e1cfcc920f', '97bd097bd097c36b0b6fc9210c8dc2', '9778397bd197c36c9210c9274c91aa',
  '97b6b97bd19801ec95f8c965cc920e', '97bd09801d98082c95f8e1cfcc920f', '97bd097bd097c36b0b6fc9210c8dc2',
  '9778397bd097c36c9210c9274c91aa', '97b6b97bd19801ec95f8c965cc920e', '97bcf97c3598082c95f8e1cfcc920f',
  '97bd097bd097c36b0b6fc9210c8dc2', '9778397bd097c36c9210c9274c91aa', '97b6b97bd19801ec9210c965cc920e',
  '97bcf97c3598082c95f8c965cc920f', '97bd097bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
  '97b6b97bd19801ec9210c965cc920e', '97bcf97c3598082c95f8c965cc920f', '97bd097bd097c35b0b6fc920fb0722',
  '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf97c359801ec95f8c965cc920f',
  '97bd097bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e',
  '97bcf97c359801ec95f8c965cc920f', '97bd097bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
  '97b6b97bd19801ec9210c965cc920e', '97bcf97c359801ec95f8c965cc920f', '97bd097bd07f595b0b6fc920fb0722',
  '9778397bd097c36b0b6fc9210c8dc2', '9778397bd19801ec9210c9274c920e', '97b6b97bd19801ec95f8c965cc920f',
  '97bd07f5307f595b0b0bc920fb0722', '7f0e397bd097c36b0b6fc9210c8dc2', '9778397bd097c36c9210c9274c920e',
  '97b6b97bd19801ec95f8c965cc920f', '97bd07f5307f595b0b0bc920fb0722', '7f0e397bd097c36b0b6fc9210c8dc2',
  '9778397bd097c36c9210c9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bd07f1487f595b0b0bc920fb0722',
  '7f0e397bd097c36b0b6fc9210c8dc2', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e',
  '97bcf7f1487f595b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
  '97b6b97bd19801ec9210c965cc920e', '97bcf7f1487f595b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722',
  '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf7f1487f531b0b0bb0b6fb0722',
  '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e',
  '97bcf7f1487f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
  '97b6b97bd19801ec9210c9274c920e', '97bcf7f0e47f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722',
  '9778397bd097c36b0b6fc9210c91aa', '97b6b97bd197c36c9210c9274c920e', '97bcf7f0e47f531b0b0bb0b6fb0722',
  '7f0e397bd07f595b0b0bc920fb0722', '9778397bd097c36b0b6fc9210c8dc2', '9778397bd097c36c9210c9274c920e',
  '97b6b7f0e47f531b0723b0b6fb0722', '7f0e37f5307f595b0b0bc920fb0722', '7f0e397bd097c36b0b6fc9210c8dc2',
  '9778397bd097c36b0b70c9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721', '7f0e37f1487f595b0b0bb0b6fb0722',
  '7f0e397bd097c35b0b6fc9210c8dc2', '9778397bd097c36b0b6fc9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721',
  '7f0e27f1487f595b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
  '97b6b7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722',
  '9778397bd097c36b0b6fc9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722',
  '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721',
  '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
  '97b6b7f0e47f531b0723b0787b0721', '7f0e27f0e47f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722',
  '9778397bd097c36b0b6fc9210c91aa', '97b6b7f0e47f149b0723b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722',
  '7f0e397bd07f595b0b0bc920fb0722', '9778397bd097c36b0b6fc9210c8dc2', '977837f0e37f149b0723b0787b0721',
  '7f07e7f0e47f531b0723b0b6fb0722', '7f0e37f5307f595b0b0bc920fb0722', '7f0e397bd097c35b0b6fc9210c8dc2',
  '977837f0e37f14998082b0787b0721', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e37f1487f595b0b0bb0b6fb0722',
  '7f0e397bd097c35b0b6fc9210c8dc2', '977837f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721',
  '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '977837f0e37f14998082b0787b06bd',
  '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722',
  '977837f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722',
  '7f0e397bd07f595b0b0bc920fb0722', '977837f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721',
  '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722', '977837f0e37f14998082b0787b06bd',
  '7f07e7f0e47f149b0723b0787b0721', '7f0e27f0e47f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722',
  '977837f0e37f14998082b0723b06bd', '7f07e7f0e37f149b0723b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722',
  '7f0e397bd07f595b0b0bc920fb0722', '977837f0e37f14898082b0723b02d5', '7ec967f0e37f14998082b0787b0721',
  '7f07e7f0e47f531b0723b0b6fb0722', '7f0e37f1487f595b0b0bb0b6fb0722', '7f0e37f0e37f14898082b0723b02d5',
  '7ec967f0e37f14998082b0787b0721', '7f07e7f0e47f531b0723b0b6fb0722', '7f0e37f1487f531b0b0bb0b6fb0722',
  '7f0e37f0e37f14898082b0723b02d5', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721',
  '7f0e37f1487f531b0b0bb0b6fb0722', '7f0e37f0e37f14898082b072297c35', '7ec967f0e37f14998082b0787b06bd',
  '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e37f0e37f14898082b072297c35',
  '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722',
  '7f0e37f0e366aa89801eb072297c35', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f149b0723b0787b0721',
  '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e37f0e366aa89801eb072297c35', '7ec967f0e37f14998082b0723b06bd',
  '7f07e7f0e47f149b0723b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722', '7f0e37f0e366aa89801eb072297c35',
  '7ec967f0e37f14998082b0723b06bd', '7f07e7f0e37f14998083b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722',
  '7f0e37f0e366aa89801eb072297c35', '7ec967f0e37f14898082b0723b02d5', '7f07e7f0e37f14998082b0787b0721',
  '7f07e7f0e47f531b0723b0b6fb0722', '7f0e36665b66aa89801e9808297c35', '665f67f0e37f14898082b0723b02d5',
  '7ec967f0e37f14998082b0787b0721', '7f07e7f0e47f531b0723b0b6fb0722', '7f0e36665b66a449801e9808297c35',
  '665f67f0e37f14898082b0723b02d5', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721',
  '7f0e36665b66a449801e9808297c35', '665f67f0e37f14898082b072297c35', '7ec967f0e37f14998082b0787b06bd',
  '7f07e7f0e47f531b0723b0b6fb0721', '7f0e26665b66a449801e9808297c35', '665f67f0e37f1489801eb072297c35',
  '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722',
]

/**
* 二十四节气表
*/
const terms = ['\u5c0f\u5bd2', '\u5927\u5bd2', '\u7acb\u6625', '\u96e8\u6c34', '\u60ca\u86f0', '\u6625\u5206', '\u6e05\u660e', '\u8c37\u96e8', '\u7acb\u590f', '\u5c0f\u6ee1', '\u8292\u79cd', '\u590f\u81f3', '\u5c0f\u6691', '\u5927\u6691', '\u7acb\u79cb', '\u5904\u6691', '\u767d\u9732', '\u79cb\u5206', '\u5bd2\u9732', '\u971c\u964d', '\u7acb\u51ac', '\u5c0f\u96ea', '\u5927\u96ea', '\u51ac\u81f3']

/**
* 公历节日
*/
const festival: Record<string, string> = {
  '1-1': '元旦节',
  '5-1': '劳动节',
  '6-1': '儿童节',
  '9-10': '教师节',
  '10-1': '国庆节',

  '3-8': '妇女节',
  '3-12': '植树节',
  '4-1': '愚人节',
  '7-1': '建党节',
  '8-1': '建军节',
}

/**
* 农历节日表 - 排除清明较特殊
*/
const traditional_festival: Record<string, string> = {
  '12-30': '除夕',
  '1-1': '春节',
  '1-15': '元宵节',
  '2-2': '龙抬头',
  '5-5': '端午节',
  '7-7': '七夕节',
  '7-15': '中元节',
  '8-15': '中秋节',
  '9-9': '重阳节',
  '10-1': '寒衣节',
  '10-15': '下元节',
  '12-8': '腊八节',
  '12-23': '北方小年',
  '12-24': '南方小年',
}

/**
* 验证日期
*/
function verifyDate(year: number, month: number, date: number): boolean {
  if (year < 1990 || year > 2100) return false
  if (month < 1 || month > 12) return false
  if (date < 1 || date > 31) return false
  if (month30day.includes(month) && date > 30) return false
  if (month === 2) {
    if (isLeapYear(year) && date > 29) return false
    if (!isLeapYear(year) && date > 28) return false
  }
  if (year === 1990 && month === 1 && date < 31) return false

  return true
}

/**
* 获取农历年对应的总天数
*/
function getLunarYearDays(year: number): number {
  let sum = 348

  for (let i = 0x8000; i > 0x8; i >>= 1) {
    sum += (lunarSet[year - 1900] & i) ? 1 : 0
  }

  return sum + getLeapMonthDay(year)
}

/**
* 判断是否有闰月 - 第13个月
*/
function hasLeapMonth(year: number): number {
  return lunarSet[year - 1900] & 0xf
}

/**
* 获取农历对应年的闰月天数
*/
function getLeapMonthDay(year: number): number {
  if (hasLeapMonth(year)) {
    return (lunarSet[year - 1900] & 0x10000) ? 30 : 29
  }
  return 0
}

/**
* 农历普通月天数
*/
function getBasicMonthDay(year: number, month: number): number {
  return (lunarSet[year - 1900] & (0x10000 >> month)) ? 30 : 29
}

/**
* 农历年转换为干支纪年
*/
function parseGanZhiYear(year: number): string {
  let ganKey = (year - 3) % 10
  let zhiKey = (year - 3) % 12
  if (ganKey === 0) ganKey = 10 // 余数为0则为最后一个天干
  if (zhiKey === 0) zhiKey = 12 // 余数为0则为最后一个地支

  return tianganSet[ganKey - 1] + dizhiSet[zhiKey - 1]
}

/**
* 解析为干支名称
*/
function parseGanZhi(offset: number): string {
  return `${tianganSet[offset % 10]}${dizhiSet[offset % 12]}`
}

/**
* 获取节气名称
*/
function getTerm(year: number, term_index: number): number {
  const _term = termSet[year - 1900]
  const _calcDay: string[] = []
  for (let index = 0; index < _term.length; index += 5) {
    const chunk = parseInt(`0x${_term.slice(index, index + 5)}`).toString()
    _calcDay.push(
      chunk[0],
      chunk.slice(1, 3),
      chunk[3],
      chunk.slice(4, 6)
    )
  }

  return parseInt(_calcDay[term_index - 1])
}

/**
* 中国月
*/
function parseChineseMonth(isLeapYear: boolean, month: number): string {
  /**
   * '正','一','二','三','四','五','六','七','八','九','十','冬','腊'
  */
  const chinese_month = ['\u6b63', '\u4e8c', '\u4e09', '\u56db', '\u4e94', '\u516d', '\u4e03', '\u516b', '\u4e5d', '\u5341', '\u51ac', '\u814a']

  return `${isLeapYear ? '\u95f0' : ''}${chinese_month[month - 1]}\u6708`
}

/**
* 转为中文日期
*/
function parseChineseDate(date: number): string {
  /**
   * '初','十','廿','卅'
  */
  const chinese_day_prefix = ['\u521d', '\u5341', '\u5eff', '\u5345']

  /**
   * '日','一','二','三','四','五','六','七','八','九','十'
  */
  const chinese_day = ['\u65e5', '\u4e00', '\u4e8c', '\u4e09', '\u56db', '\u4e94', '\u516d', '\u4e03', '\u516b', '\u4e5d', '\u5341']

  switch (date) {
    case 10:
      return '\u521d\u5341';
    case 20:
      return '\u4e8c\u5341';
    case 30:
      return '\u4e09\u5341';
    default:
      return chinese_day_prefix[Math.floor(date / 10)] + chinese_day[date % 10]
  }
}

/**
* 星座
*/
function parseAstro(month: number, date: number): string {
  const astros = '\u9b54\u7faf\u6c34\u74f6\u53cc\u9c7c\u767d\u7f8a\u91d1\u725b\u53cc\u5b50\u5de8\u87f9\u72ee\u5b50\u5904\u5973\u5929\u79e4\u5929\u874e\u5c04\u624b\u9b54\u7faf'
  const flags = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22]
  const start_index = month * 2 - (date < flags[month - 1] ? 2 : 0)
  return astros.slice(start_index, start_index + 2)
}

/**
* 生肖
*/
function parseZodiac(year: number): string {
  const zodiacSet: string[] = ['\u9f20', '\u725b', '\u864e', '\u5154', '\u9f99', '\u86c7', '\u9a6c', '\u7f8a', '\u7334', '\u9e21', '\u72d7', '\u732a']
  return zodiacSet[(year - 4) % 12]
}

export function getLunarInfo(year: number, month: number, date: number): ILunarInfo {
  /**
   * 验证时间
  */
  if (!verifyDate(year, month, date)) throw Error('this date is not validate')

  /**
   * 矫正时区时间差
  */
  let offset: number = (Date.UTC(year, month - 1, date) - Date.UTC(1900, 0, 31)) / 86400000

  let i: number
  let temp = 0

  for (i = 1900; i < 2101 && offset > 0; i++) {
    temp = getLunarYearDays(i)
    offset -= temp
  }
  if (offset < 0) {
    offset += temp
    i--
  }

  const lunarYear = i
  let leap = hasLeapMonth(lunarYear)
  let isLeapYear: boolean = false

  for (i = 1; i < 13 && offset > 0; i++) {
    //闰月
    if (leap > 0 && i === (leap + 1) && isLeapYear === false) {
      --i
      isLeapYear = true
      temp = getLeapMonthDay(year) // 闰月天数
    } else {
      temp = getBasicMonthDay(year, i) // 非闰月天数
    }
    //解除闰月
    if (isLeapYear === true && i === (leap + 1)) {
      isLeapYear = false
    }
    offset -= temp
  }

  // 闰月导致数组下标重叠取反
  if (offset === 0 && leap > 0 && i === leap + 1) {
    if (isLeapYear) {
      isLeapYear = false
    } else {
      isLeapYear = true
      --i
    }
  }
  if (offset < 0) {
    offset += temp
    --i
  }

  const lunarMonth = i
  const lunarDay = offset + 1

  // 节气
  const firstTerm = getTerm(year, month * 2 - 1)
  const lastTerm = getTerm(year, month * 2)

  // 当日节气
  let term: string = ''
  if (firstTerm === date) {
    term = terms[month * 2 - 2]
  }
  if (lastTerm === date) {
    term = terms[month * 2 - 1]
  }

  // 干支年
  const ganziYear = parseGanZhiYear(lunarYear)

  // 根据十二节气修正干支月
  let ganzhiMonth = parseGanZhi((year - 1900) * 12 + month + 11)
  if (date >= firstTerm) {
    ganzhiMonth = parseGanZhi((year - 1900) * 12 + month + 12)
  }

  // 干支日 日柱 当月一日与 1900/1/1 相差天数
  const dayCyclical = Date.UTC(year, month - 1, 1, 0, 0, 0, 0) / 86400000 + 25567 + 10
  const ganzhiDay = parseGanZhi(dayCyclical + date - 1)

  // 星座
  const astro = parseAstro(month, date)

  // 农历年月日
  const lunarDateStr = `${lunarYear}-${lunarMonth}-${lunarDay}`

  const chinese_month = parseChineseMonth(isLeapYear, lunarMonth)
  const chinese_day = parseChineseDate(lunarDay)

  // 节日
  let solarDate = `${month}-${date}`
  let lunarDate = `${lunarMonth}-${lunarDay}`
  if (lunarMonth === 12 && lunarDay === 29 && getBasicMonthDay(lunarYear, lunarMonth) === 29) {
    lunarDate = '12-30';
  }
  const festivals: string[] = []
  Object.keys(festival).forEach((key) => {
    if (key === solarDate) {
      festivals.push(festival[key])
    }
  })
  Object.keys(traditional_festival).forEach((key) => {
    if (key === lunarDate) {
      festivals.push(traditional_festival[key])
    }
  })

  // 生肖
  const zodiac = parseZodiac(lunarYear)

  return {
    lunarDateStr,
    ganziYear,
    ganzhiMonth,
    ganzhiDay,
    chinese_month,
    chinese_day,
    term,
    festivals,
    zodiac,
    astro,
  }
}
