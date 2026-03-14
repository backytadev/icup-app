import { useRef, useState } from 'react';

import { cn } from '@/shared/lib/utils';

export interface TimeSegmentInputProps {
  value: Date | undefined;
  onChange: (date: Date) => void;
  disabled?: boolean;
  defaultHour24?: number;
  defaultMinute?: number;
}

export const TimeSegmentInput = ({
  value,
  onChange,
  disabled = false,
  defaultHour24 = 0,
  defaultMinute = 0,
}: TimeSegmentInputProps): JSX.Element => {
  const [hourBuf, setHourBuf] = useState('');
  const [minBuf, setMinBuf] = useState('');
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);
  const periodRef = useRef<HTMLDivElement>(null);
  const suppressHourBlur = useRef(false);
  const suppressMinBlur = useRef(false);

  const h24raw = value?.getHours() ?? -1;
  const minRaw = value?.getMinutes() ?? -1;
  const hasValue = h24raw >= 0;

  const isPM = hasValue ? h24raw >= 12 : defaultHour24 >= 12;
  const dispH12 = hasValue
    ? h24raw === 0 ? 12 : h24raw > 12 ? h24raw - 12 : h24raw
    : defaultHour24 === 0 ? 12 : defaultHour24 > 12 ? defaultHour24 - 12 : defaultHour24;
  const dispMin = hasValue ? minRaw : defaultMinute;

  const getBase = (): Date => {
    if (value) return new Date(value);
    const d = new Date();
    d.setHours(defaultHour24, defaultMinute, 0, 0);
    return d;
  };

  const applyHour12 = (h12: number): void => {
    const base = getBase();
    const pm = base.getHours() >= 12;
    const h24 = pm ? (h12 === 12 ? 12 : h12 + 12) : (h12 === 12 ? 0 : h12);
    base.setHours(h24, base.getMinutes(), 0, 0);
    onChange(base);
  };

  const applyMinute = (m: number): void => {
    const base = getBase();
    base.setMinutes(m, 0, 0);
    onChange(base);
  };

  const applyPeriod = (pm: boolean): void => {
    const base = getBase();
    const h = base.getHours();
    if (pm && h < 12) base.setHours(h + 12, base.getMinutes(), 0, 0);
    else if (!pm && h >= 12) base.setHours(h - 12, base.getMinutes(), 0, 0);
    onChange(base);
  };

  const handleHourKey = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (disabled) return;
    const { key } = e;
    if (key === 'Tab') return;
    e.preventDefault();
    if (key === 'ArrowRight') { minuteRef.current?.focus(); return; }
    if (key === 'ArrowUp') { applyHour12(dispH12 === 12 ? 1 : dispH12 + 1); return; }
    if (key === 'ArrowDown') { applyHour12(dispH12 === 1 ? 12 : dispH12 - 1); return; }
    if (key === 'Backspace') { setHourBuf(''); return; }
    if (!/^\d$/.test(key)) return;
    const next = hourBuf + key;
    const num = parseInt(next);
    const d = parseInt(key);
    const advanceToMinute = (h12: number): void => {
      suppressHourBlur.current = true;
      setHourBuf('');
      applyHour12(h12);
      minuteRef.current?.focus();
    };
    if (next.length === 1) {
      if (d >= 2 && d <= 9) advanceToMinute(d);
      else setHourBuf(next);
    } else {
      if (num >= 1 && num <= 12) advanceToMinute(num);
      else { if (d >= 2 && d <= 9) advanceToMinute(d); else setHourBuf(key); }
    }
  };

  const handleHourBlur = (): void => {
    if (suppressHourBlur.current) { suppressHourBlur.current = false; return; }
    if (hourBuf) { const n = parseInt(hourBuf); if (n >= 1 && n <= 12) applyHour12(n); setHourBuf(''); }
  };

  const handleMinKey = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (disabled) return;
    const { key } = e;
    if (key === 'Tab') return;
    e.preventDefault();
    if (key === 'ArrowLeft') { hourRef.current?.focus(); return; }
    if (key === 'ArrowRight') { periodRef.current?.focus(); return; }
    if (key === 'ArrowUp') { applyMinute(dispMin === 59 ? 0 : dispMin + 1); return; }
    if (key === 'ArrowDown') { applyMinute(dispMin === 0 ? 59 : dispMin - 1); return; }
    if (key === 'Backspace') { setMinBuf(''); return; }
    if (!/^\d$/.test(key)) return;
    const next = minBuf + key;
    const num = parseInt(next);
    const d = parseInt(key);
    const advanceToPeriod = (m: number): void => {
      suppressMinBlur.current = true;
      setMinBuf('');
      applyMinute(m);
      periodRef.current?.focus();
    };
    if (next.length === 1) {
      if (d >= 6) advanceToPeriod(d);
      else setMinBuf(next);
    } else {
      if (num >= 0 && num <= 59) advanceToPeriod(num);
      else setMinBuf(key);
    }
  };

  const handleMinBlur = (): void => {
    if (suppressMinBlur.current) { suppressMinBlur.current = false; return; }
    if (minBuf) { const n = parseInt(minBuf); if (n >= 0 && n <= 59) applyMinute(n); setMinBuf(''); }
  };

  const handlePeriodKey = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (disabled) return;
    const { key } = e;
    if (key === 'Tab') return;
    e.preventDefault();
    if (key === 'ArrowLeft') { minuteRef.current?.focus(); return; }
    if (key === 'a' || key === 'A') { applyPeriod(false); return; }
    if (key === 'p' || key === 'P') { applyPeriod(true); return; }
    if (key === ' ' || key === 'ArrowUp' || key === 'ArrowDown') applyPeriod(!isPM);
  };

  const segCls = cn(
    'px-1.5 py-0.5 rounded min-w-[2ch] text-center tabular-nums',
    'text-[14px] font-semibold font-mono outline-none select-none',
    'transition-colors cursor-default',
    'hover:bg-slate-100 dark:hover:bg-slate-800',
    'focus:bg-teal-600 focus:text-white',
    disabled && 'opacity-40 pointer-events-none',
  );

  const showHour = hourBuf !== '' ? hourBuf : String(dispH12).padStart(2, '0');
  const showMin = minBuf !== '' ? minBuf : String(dispMin).padStart(2, '0');

  return (
    <div className={cn(
      'inline-flex items-center gap-0.5 px-2.5 py-1.5 rounded-lg',
      'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900',
      disabled && 'opacity-50',
    )}>
      <div ref={hourRef} tabIndex={disabled ? -1 : 0} role='spinbutton'
        aria-label='Hora' aria-valuenow={dispH12} aria-valuemin={1} aria-valuemax={12}
        className={segCls} onKeyDown={handleHourKey} onBlur={handleHourBlur}>
        {showHour}
      </div>
      <span className='text-slate-400 dark:text-slate-500 font-bold select-none leading-none text-[14px]'>:</span>
      <div ref={minuteRef} tabIndex={disabled ? -1 : 0} role='spinbutton'
        aria-label='Minutos' aria-valuenow={dispMin} aria-valuemin={0} aria-valuemax={59}
        className={segCls} onKeyDown={handleMinKey} onBlur={handleMinBlur}>
        {showMin}
      </div>
      <span className='w-2 select-none' />
      <div ref={periodRef} tabIndex={disabled ? -1 : 0} role='spinbutton'
        aria-label='AM o PM'
        className={cn(segCls, 'min-w-[3ch]')}
        onKeyDown={handlePeriodKey}
        onClick={() => { if (!disabled) applyPeriod(!isPM); }}>
        {isPM ? 'PM' : 'AM'}
      </div>
    </div>
  );
};
