import React, { Ref, useState, useEffect, useMemo } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import cs from 'classnames';

import './index.scss';

import usePopper from '../popper';
import DatePickerInput from './components/datePickerInput';
import DatePickerPanel from './components/datePickerPanel';
import { transformDate } from './utils';

function DatePicker({
  defaultValue,
  value,
  mode = 'date',
  placeholder,
  disabled,
  inputReadOnly,
  className,
  style,
  popupClassName,
  popupStyle,
  placement = 'bottom-start',
  suffixIcon,
  nextIcon,
  prevIcon,
  superNextIcon,
  superPrevIcon,
  showToday = true,
  showNow = true,
  timeScope,
  format,
}: DatePickerProps,
ref?: Ref<HTMLDivElement>): JSX.Element {
  const [date, setDate] = useState<Dayjs | undefined>(defaultValue ? initDate(defaultValue) : undefined);

  const { referenceRef, Popper, handleClick, close, handleBlur } = usePopper();

  const _timeScope = useMemo(() => {
    if (mode === 'time' && !timeScope) return 'second';
    return timeScope;
  }, [mode, timeScope]);

  useEffect(() => {
    if (!value) return;
    setDate(initDate(value));
  }, [value]);

  function handleChange(date: Dayjs | undefined) {
    setDate(date);
    close();
  };

  function initDate(value: DatePickerValueType) {
    if (value instanceof Date) return dayjs(value);
    return dayjs(transformDate(value, mode));
  }

  return (
    <div ref={ref} className={cs('ofa-date-picker', className)} style={style}>
      <DatePickerInput
        ref={referenceRef as any}
        date={date}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={inputReadOnly}
        suffixIcon={suffixIcon}
        mode={mode}
        format={format}
        timeScope={_timeScope}
        onClick={(e) => !disabled && handleClick()(e)}
        onBlur={handleBlur}
        onChangeInput={handleChange}
        onClear={() => setDate(undefined)}
      />
      <Popper placement={placement} className={popupClassName} style={popupStyle}>
        <DatePickerPanel
          nextIcon={nextIcon}
          prevIcon={prevIcon}
          superNextIcon={superNextIcon}
          superPrevIcon={superPrevIcon}
          timeScope={_timeScope}
          showToday={showToday}
          showNow={showNow}
          mode={mode}
          date={date}
          onChangePicker={handleChange}
        />
      </Popper>
    </div>
  );
}

export default React.forwardRef(DatePicker);
