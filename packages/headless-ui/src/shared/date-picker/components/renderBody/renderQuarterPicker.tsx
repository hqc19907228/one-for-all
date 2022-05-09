import React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import cs from 'classnames';

import { getQuarterByMonth, getStartMonthOfQuarter, QuarterType } from '../../utils';

interface Props {
  date: Dayjs;
  pickedDate?: Dayjs;
  onChange?: (date: Dayjs) => void;
  disabledDate?: (date: Date) => boolean;
};

const QUARTER: QuarterType[] = ['Q1', 'Q2', 'Q3', 'Q4'];

export default function RenderQuarterPicker({
  date,
  pickedDate,
  onChange,
  disabledDate,
}: Props): JSX.Element {
  function handleChangeMonth(quarter: QuarterType): void {
    const startMonth = getStartMonthOfQuarter(quarter);
    onChange?.(date.month(startMonth));
  }

  return (
    <div className="ofa-pick-quarter">
      {QUARTER.map(curQuarter => {
        if (disabledDate?.(date.clone().set('month', getStartMonthOfQuarter(curQuarter)).toDate())) {
          return (
            <span
              className="ofa-pick-item is-disabled"
              key={curQuarter}
            >{curQuarter}</span>
          );
        }
        return (
          <span
            className={cs(
              'ofa-pick-item',
              getQuarterByMonth(dayjs().month()) === curQuarter && 'is-today',
              pickedDate && getQuarterByMonth(pickedDate.month()) === curQuarter && 'is-selected',
            )}
            key={curQuarter}
            onClick={() => handleChangeMonth(curQuarter)}
          >{curQuarter}</span>
        );
      })}
    </div>
  );
}
