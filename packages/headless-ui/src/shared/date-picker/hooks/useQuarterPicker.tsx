import React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import cs from 'classnames';

import { PickScope } from '../components/datePickerPanel';
import { getQuarterByMonth, QuarterType } from '../utils';

interface UseQuarterPicker {
  date: Dayjs;
  pickedDate?: Dayjs;
  pickScope: PickScope;
  setPickScope: (pickScope: PickScope) => void;
  onChange?: (quarter: QuarterType) => void;
};

const QUARTER: QuarterType[] = ['Q1', 'Q2', 'Q3', 'Q4'];

export default function useQuarterPicker({ pickScope, date, pickedDate, setPickScope, onChange }: UseQuarterPicker) {
  function handleChangeMonth(quarter: QuarterType): void {
    setPickScope('month');
    onChange?.(quarter);
  }

  const Header = () => {
    if (pickScope !== 'quarter') return <></>;
    return (
      <span
        className="ofa-date-picker-text-button"
        onClick={() => setPickScope('year')}
      >{ date.format('YYYY年') }</span>
    );
  };

  const Picker = () => {
    if (pickScope !== 'quarter') return <></>;
    return (
      <div className="ofa-pick-quarter">
        {QUARTER.map(curQuarter => (
          <span
            className={cs(
              'ofa-pick-item',
              getQuarterByMonth(dayjs().month()) === curQuarter && 'is-today',
              pickedDate && getQuarterByMonth(pickedDate.month()) === curQuarter && 'is-selected',
            )}
            key={curQuarter}
            onClick={() => handleChangeMonth(curQuarter)}
          >{curQuarter}</span>
        ))}
      </div>
    );
  };

  return { Header, Picker };
}
