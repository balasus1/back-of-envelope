'use client';

import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';

interface NumberInputProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function NumberInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  placeholder = '0',
  className,
  disabled = false,
}: NumberInputProps) {
  const [localVal, setLocalVal] = useState<string>(
    value === 0 ? '' : String(value)
  );
  const isFocused = useRef(false);

  useEffect(() => {
    if (!isFocused.current) {
      setLocalVal(value === 0 ? '' : String(value));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setLocalVal(raw);
    if (raw === '' || raw === '-') {
      onChange(0);
    } else {
      const parsed = parseFloat(raw);
      if (!Number.isNaN(parsed)) {
        onChange(parsed);
      }
    }
  };

  const handleBlur = () => {
    isFocused.current = false;
    if (localVal === '' || localVal === '-') {
      setLocalVal('');
      onChange(0);
    } else {
      const parsed = parseFloat(localVal);
      if (!Number.isNaN(parsed)) {
        setLocalVal(parsed === 0 ? '' : String(parsed));
        onChange(parsed);
      }
    }
  };

  return (
    <input
      type="number"
      min={min}
      max={max}
      step={step}
      placeholder={placeholder}
      value={localVal}
      disabled={disabled}
      onFocus={() => {
        isFocused.current = true;
      }}
      onBlur={handleBlur}
      onChange={handleChange}
      className={clsx(
        'w-full rounded border border-white/[0.08] bg-black/40 px-2 py-1 font-mono text-xs text-white placeholder-zinc-600 focus:border-indigo-500/60 focus:outline-none disabled:opacity-50',
        className
      )}
    />
  );
}
