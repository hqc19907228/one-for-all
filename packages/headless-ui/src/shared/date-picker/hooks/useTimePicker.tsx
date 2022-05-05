import React, { useMemo, useRef, useEffect, useCallback } from 'react';
import cs from 'classnames';
import dayjs, { Dayjs } from 'dayjs';

import { PickScope } from '../components/datePickerPanel';
import { getDate, scrollTo } from '../utils';

interface UseTimePicker {
  mode: PickScope;
  timeScope?: DatePickerTimeScopeType;
  format?: string;
  pickedDate?: Dayjs;
  onChange?: (date: Dayjs) => void;
};

type PickerTimeColumnProps = {
  data: number[];
  pickedTime?: number;
  onChange: (curTime: number) => void;
};

const HOURS = new Array(24).fill(1).map((val, index) => index);
const MINUTES = new Array(60).fill(1).map((val, index) => index);
const SECONDS = [...MINUTES];

export default function useTimePicker({ pickedDate, mode, timeScope, format, onChange }: UseTimePicker) {
  const { pickedHour, pickedMinute, pickedSecond } = useMemo(() => {
    return {
      pickedHour: pickedDate?.hour() || 0,
      pickedMinute: pickedDate?.minute() || 0,
      pickedSecond: pickedDate?.second() || 0,
    };
  }, [pickedDate]);

  const formatTime = useMemo(() => {
    if (format) return format;
    if (!timeScope) return 'HH:mm:ss';
    return {
      'hour': 'HH',
      'minute': 'HH:mm',
      'second': 'HH:mm:ss',
    }[timeScope]
  }, [timeScope, format]);

  function handleChange(type: DatePickerTimeScopeType, num: number) {
    onChange?.((pickedDate || dayjs()).set(type, num));
  }

  function formatPickedTime(): string {
    const formatDate = pickedDate || getDate();
    return formatDate.format(formatTime);
  }

  function showHeader(): boolean {
    return !!timeScope && mode === 'date';
  };

  function showPicker(): boolean {
    return (!!timeScope && mode === 'date') || mode === 'time';
  };

  const Header = showHeader() ?
    <div className="ofa-pick-time-header">{formatPickedTime()}</div>
    : <></>;

  const Picker = showPicker() ?
    (<div className={cs('ofa-pick-time-container', mode === 'time' && 'left-border-none')}>
      <PickerTimeColumn
        data={HOURS}
        pickedTime={pickedHour}
        onChange={(time) => handleChange('hour', time)}
      />
      {['minute', 'second'].includes(timeScope || '') && (
        <PickerTimeColumn
          data={MINUTES}
          pickedTime={pickedMinute}
          onChange={(time) => handleChange('minute', time)}
        />
      )}
      {timeScope === 'second' && (
        <PickerTimeColumn
          data={SECONDS}
          pickedTime={pickedSecond}
          onChange={(time) => handleChange('second', time)}
        />
      )}
    </div>)
    : <></>;

  return { Header, Picker };
}

function PickerTimeColumn({ data, pickedTime, onChange }: PickerTimeColumnProps) {
  const timeColumnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pickedTime && timeColumnRef.current) {
      scrollTo(timeColumnRef.current, 32 * pickedTime);
    }
  }, [pickedTime]);

  return (
    <div className="ofa-pick-time-column" ref={timeColumnRef}>
      {data.map(item => (
        <span
          key={item}
          className={cs(pickedTime === item && 'is-selected')}
          onClick={() => onChange(item)}
        >{item}</span>
      ))}
    </div>
  );
};
