import React, { useMemo } from 'react';
import cs from 'classnames';
import dayjs, { Dayjs } from 'dayjs';

import { getDatesOfMonth, getQuarterByMonth, DateType, QuarterType } from '../utils';

type PickDateProps = {
  date: Dayjs;
  pickedDate?: Dayjs;
  onChange?: (date: DateType) => void;
};

type PickMonthProps = {
  pickedMonth?: number;
  onChange?: (month: number) => void;
};

type PickQuarterProps = {
  pickedMonth?: number;
  onChange?: (quarter: QuarterType) => void;
};

type PickYearProps = {
  year: number;
  pickedYear?: number;
  onChange?: (year: number) => void;
};

type PickCenturyProps = {
  year: number;
  pickedYear?: number;
  onChange?: (startYear: number, endYear: number) => void;
};

const WEEK_HEAD = ['日', '一', '二', '三', '四', '五', '六'];
const MONTH = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const QUARTER: QuarterType[] = ['Q1', 'Q2', 'Q3', 'Q4'];

export function RenderPickDate({ date, pickedDate, onChange }: PickDateProps): JSX.Element {
  const dates = useMemo(() => {
    return getDatesOfMonth(date);
  }, [date]);
  
  function isSameDate(baseDate: Dayjs | undefined, { relativeMonth, value }: DateType): boolean {
    return !!baseDate?.isSame(date.add(relativeMonth, 'month').set('date', value), 'date');
  }
  
  return (
    <div className="ofa-pick-date">
      {WEEK_HEAD.map(value => (
        <span key={value}>{value}</span>
      ))}
      {dates.map((curDate) => {
        const { value, relativeMonth } = curDate;
        return (
          <span
            className={cs(
              'ofa-pick-item',
              isSameDate(dayjs(), curDate) && 'is-today',
              isSameDate(pickedDate, curDate) && 'is-selected',
              relativeMonth !== 0 && 'is-disabled',
            )}
            key={`${value}${relativeMonth}`}
            onClick={() => onChange?.(curDate)}
          >{ value }</span>
        )
      })}
    </div>
  );
}

export function RenderPickMonth({ pickedMonth, onChange }: PickMonthProps): JSX.Element {
  return (
    <div className="ofa-pick-month">
      {MONTH.map(curMonth => (
        <span
          className={cs(
            'ofa-pick-item',
            dayjs().month() === curMonth && 'is-today',
            pickedMonth === curMonth && 'is-selected',
          )}
          key={curMonth}
          onClick={() => onChange?.(curMonth)}
        >{curMonth + 1}月</span>
      ))}
    </div>
  );
}

export function RenderPickQuarter({ pickedMonth, onChange }: PickQuarterProps): JSX.Element {
  return (
    <div className="ofa-pick-quarter">
      {QUARTER.map(curQuarter => (
        <span
          className={cs(
            'ofa-pick-item',
            getQuarterByMonth(dayjs().month()) === curQuarter && 'is-today',
            pickedMonth && getQuarterByMonth(pickedMonth) === curQuarter && 'is-selected',
          )}
          key={curQuarter}
          onClick={() => onChange?.(curQuarter)}
        >{curQuarter}</span>
      ))}
    </div>
  );
}

export function RenderPickYear({ year, pickedYear, onChange }: PickYearProps): JSX.Element {
  const years = useMemo(() => {
    const startYear = year - year % 10;
    return (new Array(12).fill(1)).map((val, index) => startYear + index - 1);
  }, [year]);

  return (
    <div className="ofa-pick-year">
      {years.map((curYear, index) => (
        <span
          className={cs(
            'ofa-pick-item',
            dayjs().year() === curYear && 'is-today',
            pickedYear === curYear && 'is-selected',
            [0, years.length - 1].includes(index) && 'is-disabled',
          )}
          key={curYear}
          onClick={() => onChange?.(curYear)}
        >{curYear}年</span>
      ))}
    </div>
  );
}

export function RenderPickCentury({ year, pickedYear, onChange }: PickCenturyProps): JSX.Element {
  const years = useMemo(() => {
    const startYear = year - year % 100;
    return (new Array(12).fill(1)).map((val, index) => startYear + (index - 1) * 10);
  }, [year]);

  function toFloorTen(num: number | undefined): number {
    if (!num) return 0;
    return Math.floor(num / 10) * 10;
  }

  return (
    <div className="ofa-pick-century">
      {years.map((startYear, index) => (
        <span
          className={cs(
            'ofa-pick-item',
            toFloorTen(dayjs().year()) === startYear && 'is-today',
            toFloorTen(pickedYear) === startYear && 'is-selected',
            [0, years.length - 1].includes(index) && 'is-disabled',
          )}
          key={startYear}
          onClick={() => onChange?.(startYear, startYear + 9)}
        >{startYear}-{startYear + 9}</span>
      ))}
    </div>
  );
}
