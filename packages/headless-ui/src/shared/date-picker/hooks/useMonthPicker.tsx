import React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import cs from 'classnames';

import { PickScope } from '../components/datePickerPanel';

interface UseMonthPicker {
  date: Dayjs;
  pickedDate?: Dayjs;
  pickScope: PickScope;
  setPickScope: (pickScope: PickScope) => void;
  onChange?: (month: number) => void;
};

const MONTH = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

export default function useMonthPicker({ pickScope, date, pickedDate, setPickScope, onChange }: UseMonthPicker) {
  function handleChangeMonth(month: number): void {
    setPickScope('date');
    onChange?.(month);
  }

  const Header = () => {
    if (pickScope !== 'month') return <></>;
    return (
      <span
        className="ofa-date-picker-text-button"
        onClick={() => setPickScope('year')}
      >{ date.format('YYYY年') }</span>
    );
  };

  const Picker = () => {
    if (pickScope !== 'month') return <></>;
    return (
      <div className="ofa-pick-month">
        {MONTH.map(curMonth => (
          <span
            className={cs(
              'ofa-pick-item',
              dayjs().month() === curMonth && 'is-today',
              pickedDate?.month() === curMonth && 'is-selected',
            )}
            key={curMonth}
            onClick={() => handleChangeMonth(curMonth)}
          >{curMonth + 1}月</span>
        ))}
      </div>
    );
  };

  return { Header, Picker };
}
