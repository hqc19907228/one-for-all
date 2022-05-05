import React, { useMemo, useCallback } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import cs from 'classnames';

import { PickScope } from '../components/datePickerPanel';
import { getStartYear } from '../utils';

interface UseCenturyPicker {
  date: Dayjs;
  pickedDate?: Dayjs;
  pickScope: PickScope;
  setPickScope: (pickScope: PickScope) => void;
  onChange?: (startYear: number, endYear: number) => void;
};

export default function useCenturyPicker({ pickScope, date, pickedDate, setPickScope, onChange }: UseCenturyPicker) {
  const years = useMemo(() => {
    const year = date.year();
    const startYear = year - year % 100;
    return (new Array(12).fill(1)).map((val, index) => startYear + (index - 1) * 10);
  }, [date.year()]);

  const pickedYear = useMemo(() => pickedDate?.year(), [pickedDate?.year()]);

  function toFloorTen(num: number | undefined): number {
    if (!num) return 0;
    return Math.floor(num / 10) * 10;
  }
  
  function handleChangeTenYear(startYear: number, endYear: number): void {
    setPickScope('year');
    onChange?.(startYear, endYear);
  }

  const Header = () => {
    if (pickScope !== 'century') return <></>;
    return (
      <span>{getStartYear(date, 'century')}-{getStartYear(date, 'century') + 99}</span>
    );
  };

  const Picker = () => {
    if (pickScope !== 'century') return <></>;
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
            onClick={() => handleChangeTenYear(startYear, startYear + 9)}
          >{startYear}-{startYear + 9}</span>
        ))}
      </div>
    );
  };

  return { Header, Picker };
}
