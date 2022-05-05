import React, { useState, useEffect, useMemo } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Icon from '@one-for-all/icon';

import useDatePicker from '../hooks/useDatePicker';
import useMonthPicker from '../hooks/useMonthPicker';
import useYearPicker from '../hooks/useYearPicker';
import useCenturyPicker from '../hooks/useCenturyPicker';
import useQuarterPicker from '../hooks/useQuarterPicker';
import useTimePicker from '../hooks/useTimePicker';
import { getStartMonthOfQuarter, getDate } from '../utils';
 
export type PickScope = '' | 'time' | 'date' | 'month' | 'quarter' | 'year' | 'century';

interface Props {
  nextIcon?: React.ReactNode;
  prevIcon?: React.ReactNode;
  superNextIcon?: React.ReactNode;
  superPrevIcon?: React.ReactNode;
  timeScope?: DatePickerTimeScopeType;
  showToday: boolean;
  showNow: boolean;
  mode: PickScope;
  date?: Dayjs;
  onChangePicker?: (date: Dayjs | undefined) => void;
}

const SCOPE_WEIGHT_MAP: {[key in PickScope]: number} = {
  '': 0,
  'time': 0,
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
  timeScope,
  showToday,
  showNow,
  mode,
  date,
  onChangePicker,
}: Props) {
  const [_date, setDate] = useState(date || getDate());
  const [pickedDate, setPickedDate] = useState(date);
  const [pickScope, setPickScope] = useState(mode);

  useEffect(() => {
    if (SCOPE_WEIGHT_MAP[mode] > SCOPE_WEIGHT_MAP[pickScope]) {
      onChangePicker?.(pickedDate);
    }
  }, [pickScope]);

  const commonProps = useMemo(() => ({
    pickScope,
    date: _date,
    pickedDate,
    setPickScope,
  }), [pickScope, setPickScope, _date, pickedDate]);

  const { Header: DateHeader, Picker: DatePicker } = useDatePicker({
    ...commonProps,
    onChange: (date) => {
      if (!hasPickTime()) setPickScope('');
      setPickedDateWithDate(_date.add(date.relativeMonth, 'month').set('date', date.value));
    }
  });

  const { Header: MonthHeader, Picker: MonthPicker } = useMonthPicker({
    ...commonProps,
    onChange: (month) => setPickedDateWithDate(_date.set('month', month))
  });

  const { Header: QuarterHeader, Picker: QuarterPicker } = useQuarterPicker({
    ...commonProps,
    onChange: (quarter) => {
      const startMonth = getStartMonthOfQuarter(quarter);
      setPickedDateWithDate(_date.set('month', startMonth));
    }
  });

  const { Header: YearHeader, Picker: YearPicker } = useYearPicker({
    ...commonProps,
    mode,
    onChange: (year) => setPickedDateWithDate(_date.set('year', year))
  });

  const { Header: CenturyHeader, Picker: CenturyPicker } = useCenturyPicker({
    ...commonProps,
    onChange: (year) => setPickedDateWithDate(_date.set('year', year))
  });

  const { Header: TimeHeader, Picker: TimePicker } = useTimePicker({
    pickedDate,
    mode,
    timeScope,
    onChange: setPickedDateWithDate
  });

  function setPickedDateWithDate(date: Dayjs): void {
    setPickedDate(date.clone());
    setDate(date.clone());
  }

  function changeYearOrCentury(type: 'add' | 'subtract'): void {
    let baseNumber = type === 'add' ? 1 : -1;
    if (pickScope === 'year') baseNumber *= 10;
    if (pickScope === 'century') baseNumber *= 100;
    changeYearOrMonth('year', baseNumber);
  }

  function changeYearOrMonth(type: 'month' | 'year', duration: number): void {
    setDate(_date.add(duration, type));
  }

  function hasPickTime(): boolean {
    return (mode === 'date' && !!timeScope) || mode === 'time';
  }

  return (
    <div className="ofa-date-picker-panel">
      {mode !== 'time' && (
        <>
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
              <DateHeader />
              <MonthHeader />
              <QuarterHeader />
              <YearHeader />
              <CenturyHeader />
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
          <div className="ofa-date-picker-container">
            <DatePicker />
            <MonthPicker />
            <QuarterPicker />
            <YearPicker />
            <CenturyPicker />
          </div>
        </>
      )}
      {TimeHeader}
      {TimePicker}
      <div className="ofa-date-picker-footer">
        {hasPickTime() && (
          <div className="ofa-date-confirm-time">
            <button onClick={() => onChangePicker?.(pickedDate)}>确定</button>
            {showNow && <span className="ofa-date-picker-text-button" onClick={() => onChangePicker?.(dayjs())}>此刻</span>}
          </div>
        )}
        {showToday && pickScope === 'date' && !timeScope && (
          <span className="ofa-date-picker-text-button" onClick={() => onChangePicker?.(dayjs())}>今天</span>
        )}
      </div>
    </div>
  );
}
