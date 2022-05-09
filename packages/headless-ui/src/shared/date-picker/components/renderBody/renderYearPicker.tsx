import React, { useMemo } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import cs from 'classnames';

interface Props {
  date: Dayjs;
  pickedDate?: Dayjs;
  onChange?: (date: Dayjs) => void;
  disabledDate?: (date: Date) => boolean;
};

export default function RenderYearPicker({
  date,
  pickedDate,
  onChange,
  disabledDate,
}: Props): JSX.Element {
  const years = useMemo(() => {
    const year = date.get('year');
    const startYear = year - year % 10;
    return (new Array(12).fill(1)).map((val, index) => startYear + index - 1);
  }, [date]);
  
  function handleChangeYear(year: number): void {
    onChange?.(date.year(year));
  }

  return (
    <div className="ofa-pick-year">
      {years.map((curYear, index) => {
        if (disabledDate?.(date.clone().set('year', curYear).toDate())) {
          return (
            <span
              className="ofa-pick-item is-disabled"
              key={curYear}
            >{curYear}年</span>
          );
        }
        return (
          <span
            className={cs(
              'ofa-pick-item',
              dayjs().year() === curYear && 'is-today',
              pickedDate?.year() === curYear && 'is-selected',
              [0, years.length - 1].includes(index) && 'is-other-panel',
            )}
            key={curYear}
            onClick={() => handleChangeYear(curYear)}
          >{curYear}年</span>
        )
      })}
    </div>
  );
}
