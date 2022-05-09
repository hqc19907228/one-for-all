import React, { useMemo, useRef, useEffect } from 'react';
import cs from 'classnames';
import dayjs, { Dayjs } from 'dayjs';

import { scrollTo } from '../../utils';

interface Props {
  timeAccuracy?: DatePickerTimeAccuracyType;
  pickedDate?: Dayjs;
  hasLeftBorder?: boolean;
  onChange?: (date: Dayjs) => void;
  disabledTime?: (type: DatePickerTimeAccuracyType, time: number) => boolean;
};

type PickerTimeColumnProps = {
  data: number[];
  pickedTime?: number;
  onChange: (curTime: number) => void;
  disabledTime: (curTime: number) => boolean;
};

const HOURS = new Array(24).fill(1).map((val, index) => index);
const MINUTES = new Array(60).fill(1).map((val, index) => index);
const SECONDS = [...MINUTES];

export default function RenderTimePicker({
  timeAccuracy,
  pickedDate,
  hasLeftBorder,
  onChange,
  disabledTime,
}: Props): JSX.Element {
  const { pickedHour, pickedMinute, pickedSecond } = useMemo(() => {
    return {
      pickedHour: pickedDate?.hour() || 0,
      pickedMinute: pickedDate?.minute() || 0,
      pickedSecond: pickedDate?.second() || 0,
    };
  }, [pickedDate]);

  function handleChange(type: DatePickerTimeAccuracyType, num: number) {
    onChange?.((pickedDate || dayjs().startOf('date')).set(type, num));
  }

  return (
    <div className={cs('ofa-pick-time-container', !hasLeftBorder && 'left-border-none')}>
      <PickerTimeColumn
        data={HOURS}
        pickedTime={pickedHour}
        onChange={(time) => handleChange('hour', time)}
        disabledTime={(time) => !!disabledTime?.('hour', time)}
      />
      {['minute', 'second'].includes(timeAccuracy || '') && (
        <PickerTimeColumn
          data={MINUTES}
          pickedTime={pickedMinute}
          onChange={(time) => handleChange('minute', time)}
          disabledTime={(time) => !!disabledTime?.('minute', time)}
        />
      )}
      {timeAccuracy === 'second' && (
        <PickerTimeColumn
          data={SECONDS}
          pickedTime={pickedSecond}
          onChange={(time) => handleChange('second', time)}
          disabledTime={(time) => !!disabledTime?.('second', time)}
        />
      )}
    </div>
  );
}

function PickerTimeColumn({ data, pickedTime, onChange, disabledTime }: PickerTimeColumnProps) {
  const timeColumnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pickedTime && timeColumnRef.current) {
      const itemHeight = timeColumnRef.current.scrollHeight / data.length;
      scrollTo(timeColumnRef.current, itemHeight * pickedTime);
    }
  }, [pickedTime]);

  return (
    <div className="ofa-pick-time-column" ref={timeColumnRef}>
      {data.map(item => {
        if (disabledTime(item)) {
          return (
            <span key={item} className="is-disabled">
              {item}
            </span>
          );
        }
        return (
          <span
            key={item}
            className={cs(pickedTime === item && 'is-selected')}
            onClick={() => onChange(item)}
          >{item}</span>
        )
      })}
    </div>
  );
};
