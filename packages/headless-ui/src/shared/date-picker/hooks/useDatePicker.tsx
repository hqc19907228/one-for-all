import React, { useMemo } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import cs from 'classnames';

import { PickScope } from '../components/datePickerPanel';
import { getDatesOfMonth, DateType } from '../utils';

interface UseDatePicker {
  date: Dayjs;
  pickedDate?: Dayjs;
  pickScope: PickScope;
  setPickScope: (pickScope: PickScope) => void;
  onChange?: (date: DateType) => void;
};

const WEEK_HEAD = ['日', '一', '二', '三', '四', '五', '六'];

export default function useDatePicker({ pickScope, setPickScope, onChange, date, pickedDate }: UseDatePicker) {
  const dates = useMemo(() => {
    return getDatesOfMonth(date);
  }, [date]);
  
  function isSameDate(baseDate: Dayjs | undefined, { relativeMonth, value }: DateType): boolean {
    return !!baseDate?.isSame(date.add(relativeMonth, 'month').set('date', value), 'date');
  }

  function handleChangeDate(date: DateType): void {
    onChange?.(date);
  }

  const Header = () => {
    if (pickScope !== 'date') return <></>;
    return (<>
      <span
        className="ofa-date-picker-text-button"
        onClick={() => setPickScope('year')}
      >{ date.format('YYYY年') }</span>
      <span
        className="ofa-date-picker-text-button"
        onClick={() => setPickScope('month')}
      >{ date.format('MM月') }</span>
    </>);
  };

  const Picker = () => {
    if (pickScope !== 'date') return <></>;
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
              onClick={() => handleChangeDate(curDate)}
            >{ value }</span>
          )
        })}
      </div>
    );
  };

  return { Header, Picker };
}
