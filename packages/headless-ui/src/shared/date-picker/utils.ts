import dayjs, { Dayjs } from "dayjs";

export type DateType = {
  value: number;
  relativeMonth: -1 | 0 | 1;
  disabled?: boolean;
  checked?: boolean;
  isToDay?: boolean;
};

export type QuarterType = 'Q1' | 'Q2' | 'Q3' | 'Q4';

export const defaultFormatMap: {[key in DatePickerModeType]: string} = {
  'time': 'HH:mm:ss',
  'date': 'YYYY-MM-DD',
  'month': 'YYYY-MM',
  'quarter': 'YYYY-Q',
  'year': 'YYYY',
};

export function isLegalDate(dateStr: string, mode: DatePickerModeType): boolean {
  return dayjs(transformDate(dateStr, mode)).isValid();
};

export function transformDate(dateStr: string, mode: DatePickerModeType): string {
  let transformDate = dateStr;
  const matchStr = dateStr.match(/Q\d/)?.[0];
  if (matchStr) {
    transformDate = transformDate.replace(matchStr, '' + getStartMonthOfQuarter(matchStr as QuarterType));
  }
  if (mode === 'time') {
    transformDate = dayjs().format('YYYY-MM-DD') + ' ' + transformDate;
  }
  return transformDate;
}

export function getDatesOfMonth(date: Dayjs): DateType[] {
  const startDate = date.startOf('month').date();
  const endDate = date.endOf('month').date();
  const beforeMonthLastDate = date.subtract(1, 'month').endOf('month').date();

  const startDay = date.startOf('month').day();
  const endDay = date.endOf('month').day();
  
  const dates: DateType[] = [];
  for (let i = startDay; i > 0; i--) {
    dates.push({
      value: beforeMonthLastDate - i + 1,
      relativeMonth: -1,
      disabled: true,
    });
  }
  
  for (let i = startDate; i <= endDate; i++) {
    dates.push({
      value: i,
      relativeMonth: 0,
    });
  }

  for (let i = endDay; i < 6; i++) {
    dates.push({
      value: i - endDay + 1,
      relativeMonth: 1,
      disabled: true,
    });
  }
  return dates;
}

export function getStartYear(date: Dayjs, type: 'ten_years' | 'century'): number {
  const curYear = date.get('year');
  if (type === 'ten_years') return curYear - curYear % 10;
  return curYear - curYear % 100;
}

export function getQuarterByMonth(month: number): QuarterType {
  if (month < 3) return 'Q1';
  if (month < 6) return 'Q2';
  if (month < 9) return 'Q3';
  return 'Q4';
}

export function getStartMonthOfQuarter(quarter: QuarterType): number {
  return {
    'Q1': 1,
    'Q2': 4,
    'Q3': 7,
    'Q4': 10
  }[quarter];
}

export function getDate(): Dayjs {
  return dayjs().set('hour', 0).set('minute', 0).set('second', 0);
}

export function scrollTo(dom: HTMLElement, location: number, delay?: number): void {
  if (!window.requestAnimationFrame) {
    dom.scrollTop = location;
    return;
  }

  const times = Math.ceil((delay || 600) / 60);
  const speed = (location - dom.scrollTop) / times;
  function scrollTimes(dom: HTMLElement, location: number, speed: number, times: number): void {
    if (times <= 0) {
      dom.scrollTop = location;
      return;
    }
    dom.scrollTop += speed;
    requestAnimationFrame(() => scrollTimes(dom, location, speed, times - 1));
  }
  requestAnimationFrame(() => scrollTimes(dom, location, speed, times));
}
