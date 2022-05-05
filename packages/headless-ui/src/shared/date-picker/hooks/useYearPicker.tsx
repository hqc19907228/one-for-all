import React, { useMemo } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import cs from 'classnames';

import { PickScope } from '../components/datePickerPanel';
import { getStartYear } from '../utils';

interface UseYearPicker {
  date: Dayjs;
  mode?: PickScope;
  pickedDate?: Dayjs;
  pickScope: PickScope;
  setPickScope: (pickScope: PickScope) => void;
  onChange?: (month: number) => void;
};

export default function useYearPicker({ pickScope, date, mode, pickedDate, setPickScope, onChange }: UseYearPicker) {
  const years = useMemo(() => {
    const year = date.get('year');
    const startYear = year - year % 10;
    return (new Array(12).fill(1)).map((val, index) => startYear + index - 1);
  }, [date]);
  
  function handleChangeYear(year: number): void {
    setPickScope(mode === 'quarter' ? 'quarter' : 'month');
    onChange?.(year);
  }

  const Header = () => {
    if (pickScope !== 'year') return <></>;
    return (
      <span
        className="ofa-date-picker-text-button"
        onClick={() => setPickScope('century')}
      >{getStartYear(date, 'ten_years')}-{getStartYear(date, 'ten_years') + 9}</span>
    );
  };

  const Picker = () => {
    if (pickScope !== 'year') return <></>;
    return (
      <div className="ofa-pick-year">
        {years.map((curYear, index) => (
          <span
            className={cs(
              'ofa-pick-item',
              dayjs().year() === curYear && 'is-today',
              pickedDate?.year() === curYear && 'is-selected',
              [0, years.length - 1].includes(index) && 'is-disabled',
            )}
            key={curYear}
            onClick={() => handleChangeYear(curYear)}
          >{curYear}年</span>
        ))}
      </div>
    );
  };

  return { Header, Picker };
}
