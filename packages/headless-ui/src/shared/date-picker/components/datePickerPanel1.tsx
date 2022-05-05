import React, { useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Icon from '@one-for-all/icon';

import { RenderPickDate, RenderPickMonth, RenderPickQuarter, RenderPickYear, RenderPickCentury } from './renderPicker';
import { getStartYear, getStartMonthOfQuarter, DateType, QuarterType } from '../utils';
 
export type PickScope = '' | 'date' | 'month' | 'quarter' | 'year' | 'century';

interface Props {
  nextIcon?: React.ReactNode;
  prevIcon?: React.ReactNode;
  superNextIcon?: React.ReactNode;
  superPrevIcon?: React.ReactNode;
  mode: PickScope;
  date?: Dayjs;
  onChangePicker?: (date: Dayjs) => void;
}

const SCOPE_WEIGHT_MAP = {
  '': 0,
  'date': 1,
  'month': 2,
  'quarter': 3,
  'year': 4,
  'century': 5,
}

export default function DatePickerPanel({
  nextIcon,
  prevIcon,
  superNextIcon,
  superPrevIcon,
  mode,
  date,
  onChangePicker,
}: Props) {
  const [_date, setDate] = useState(date || dayjs());
  const [pickScope, setPickScope] = useState<PickScope>(mode);

  useEffect(() => {
    if (SCOPE_WEIGHT_MAP[mode] > SCOPE_WEIGHT_MAP[pickScope]) {
      onChangePicker?.(_date);
    }
  }, [pickScope]);

  function changeYearOrCentury(type: 'add' | 'subtract'): void {
    let baseNumber = type === 'add' ? 1 : -1;
    if (pickScope === 'year') baseNumber *= 10;
    if (pickScope === 'century') baseNumber *= 100;
    changeYearOrMonth('year', baseNumber);
  }

  function changeYearOrMonth(type: 'month' | 'year', duration: number): void {
    setDate(_date.add(duration, type));
  }

  function handleChangeDate(date: DateType): void {
    setDate(_date.add(date.relativeMonth, 'month').set('date', date.value));
    setPickScope('');
  }

  function handleChangeMonth(month: number): void {
    setDate(_date.set('month', month));
    setPickScope('date');
  }

  function handleChangeQuarter(quarter: QuarterType): void {
    const startMonth = getStartMonthOfQuarter(quarter);
    setDate(_date.set('month', startMonth));
    setPickScope('month');
  }

  function handleChangeYear(year: number): void {
    setDate(_date.set('year', year));
    setPickScope(mode === 'quarter' ? 'quarter' : 'month');
  }

  function handleChangeCentury(startYear: number): void {
    setDate(_date.set('year', startYear));
    setPickScope('year');
  }

  function renderPicker(): JSX.Element {
    if (pickScope === 'date') {
      return <RenderPickDate date={_date} pickedDate={date} onChange={handleChangeDate} />;
    }
    if (pickScope === 'month') {
      return <RenderPickMonth pickedMonth={date?.get('month')} onChange={handleChangeMonth} />;
    }
    if (pickScope === 'quarter') {
      return <RenderPickQuarter pickedMonth={date?.get('month')} onChange={handleChangeQuarter}/>
    }
    if (pickScope === 'year') {
      return <RenderPickYear year={_date.get('year')} pickedYear={date?.get('year')} onChange={handleChangeYear} />
    }
    if (pickScope === 'century') {
      return <RenderPickCentury year={_date.get('year')} pickedYear={date?.get('year')} onChange={handleChangeCentury} />
    }
    return <></>;
  }

  return (
    <div className="ofa-date-picker-panel">
      <div className="ofa-date-picker-header">
        <span className="ofa-date-picker-icon-box" onClick={() => changeYearOrCentury('subtract')}>
          {superPrevIcon || <Icon name="arrow_left" size={20} />}
        </span>
        {pickScope === 'date' && (
          <span className="ofa-date-picker-icon-box" onClick={() => changeYearOrMonth('month', -1)}>
            {prevIcon || <Icon name="keyboard_arrow_left" size={20} />}
          </span>
        )}
        <span className="ofa-date-picker-time">
          {pickScope === 'century' && (
            <span>{getStartYear(_date, 'century')}-{getStartYear(_date, 'century') + 99}</span>
          )}
          {pickScope === 'year' && (
            <span
              className="ofa-date-picker-text-button"
              onClick={() => setPickScope('century')}
            >{getStartYear(_date, 'ten_years')}-{getStartYear(_date, 'ten_years') + 9}</span>
          )}
          {['date', 'month', 'quarter'].includes(pickScope) && (
            <span
              className="ofa-date-picker-text-button"
              onClick={() => setPickScope('year')}
            >{ _date.format('YYYY年') }</span>
          )}
          {pickScope === 'date' && (
            <span
              className="ofa-date-picker-text-button"
              onClick={() => setPickScope('month')}
            >{ _date.format('MM月') }</span>
          )}
        </span>
        {pickScope === 'date' && (
          <span className="ofa-date-picker-icon-box" onClick={() => changeYearOrMonth('month', 1)}>
            {nextIcon || <Icon name="keyboard_arrow_right" size={20} />}
          </span>
        )}
        <span className="ofa-date-picker-icon-box" onClick={() => changeYearOrCentury('add')}>
          {superNextIcon || <Icon name="arrow_right" size={20} />}
        </span>
      </div>
      {renderPicker()}
      {pickScope === 'date' && (
        <div className="ofa-date-picker-footer">
          <span className="ofa-date-picker-text-button" onClick={() => onChangePicker?.(dayjs())}>今天</span>
        </div>
      )}
    </div>
  );
}
