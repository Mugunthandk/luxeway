import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Sparkles, RefreshCw } from 'lucide-react';

interface DateRangePickerProps {
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  onChange: (checkIn: string, checkOut: string) => void;
  minDate?: string; // YYYY-MM-DD
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  checkIn,
  checkOut,
  onChange,
  minDate = new Date().toISOString().split('T')[0],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial dates or fallback to today/tomorrow
  const parseDate = (str: string) => {
    if (!str) return new Date();
    const [y, m, d] = str.split('-').map(Number);
    return new Date(y, m - 1, d);
  };

  const formatDateStr = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const startDate = checkIn ? parseDate(checkIn) : null;
  const endDate = checkOut ? parseDate(checkOut) : null;

  // View month state (0-indexed month)
  const [currentViewDate, setCurrentViewDate] = useState<Date>(() => {
    return startDate ? new Date(startDate.getFullYear(), startDate.getMonth(), 1) : new Date();
  });

  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [selectingStep, setSelectingStep] = useState<'start' | 'end'>('start');

  // Close popup on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentViewDate(new Date(currentViewDate.getFullYear(), currentViewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentViewDate(new Date(currentViewDate.getFullYear(), currentViewDate.getMonth() + 1, 1));
  };

  const isSameDay = (d1: Date | null, d2: Date | null) => {
    if (!d1 || !d2) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const isBeforeDay = (d1: Date, d2: Date) => {
    const time1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate()).getTime();
    const time2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate()).getTime();
    return time1 < time2;
  };

  const isBetweenDays = (day: Date, start: Date | null, end: Date | null) => {
    if (!start || !end) return false;
    const time = new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime();
    const startTime = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
    const endTime = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
    return time > startTime && time < endTime;
  };

  const handleDateClick = (day: Date) => {
    const minD = parseDate(minDate);
    if (isBeforeDay(day, minD)) return;

    if (selectingStep === 'start' || !startDate || (startDate && isBeforeDay(day, startDate))) {
      // Set Check-In and automatically shift to pick end date
      const newCheckInStr = formatDateStr(day);
      // Default checkOut to +3 days if not set or invalid
      const defaultCheckOut = new Date(day);
      defaultCheckOut.setDate(defaultCheckOut.getDate() + 3);
      onChange(newCheckInStr, formatDateStr(defaultCheckOut));
      setSelectingStep('end');
    } else {
      // Setting Check-Out
      if (isSameDay(day, startDate)) return;
      onChange(formatDateStr(startDate), formatDateStr(day));
      setSelectingStep('start');
      setIsOpen(false);
    }
  };

  const handlePreset = (nights: number) => {
    const base = startDate && !isBeforeDay(startDate, parseDate(minDate)) ? startDate : new Date();
    const newEnd = new Date(base);
    newEnd.setDate(newEnd.getDate() + nights);
    onChange(formatDateStr(base), formatDateStr(newEnd));
    setSelectingStep('start');
  };

  const handleClear = () => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 5);
    onChange(formatDateStr(today), formatDateStr(nextWeek));
    setSelectingStep('start');
  };

  // Generate calendar grid for a given month
  const generateMonthGrid = (year: number, month: number) => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sun
    const totalDays = lastDayOfMonth.getDate();

    const days: (Date | null)[] = [];

    // Empty slots before 1st
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Days 1 to N
    for (let day = 1; day <= totalDays; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  // Calculate nights
  const nightsCount =
    startDate && endDate
      ? Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)))
      : 0;

  const displayCheckIn = startDate
    ? startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Select Check-In';

  const displayCheckOut = endDate
    ? endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Select Check-Out';

  const renderMonthCalendar = (year: number, month: number) => {
    const monthName = new Date(year, month, 1).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
    const grid = generateMonthGrid(year, month);
    const minD = parseDate(minDate);

    return (
      <div className="space-y-3">
        <div className="text-xs font-serif font-bold text-[#1b1c1c] text-center tracking-wide">
          {monthName}
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, i) => (
            <span key={i} className="text-[10px] font-bold uppercase text-[#8a8075]">
              {d}
            </span>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {grid.map((day, idx) => {
            if (!day) {
              return <div key={idx} className="h-8" />;
            }

            const isDisabled = isBeforeDay(day, minD);
            const isStart = isSameDay(day, startDate);
            const isEnd = isSameDay(day, endDate);

            // Active range range calculation considering hover preview when selecting end date
            const effectiveEnd =
              selectingStep === 'end' && hoverDate && !isBeforeDay(hoverDate, startDate!)
                ? hoverDate
                : endDate;

            const inRange = isBetweenDays(day, startDate, effectiveEnd);

            return (
              <button
                key={idx}
                type="button"
                disabled={isDisabled}
                onClick={() => handleDateClick(day)}
                onMouseEnter={() => !isDisabled && setHoverDate(day)}
                onMouseLeave={() => setHoverDate(null)}
                className={`h-8 w-full rounded-lg text-xs font-semibold transition-all relative flex items-center justify-center cursor-pointer ${
                  isDisabled
                    ? 'text-[#d3ccc2] cursor-not-allowed opacity-40'
                    : isStart || isEnd
                    ? 'bg-[#1c1815] text-[#ffdea5] font-bold shadow-sm z-10'
                    : inRange
                    ? 'bg-[#f4ebe0] text-[#1c1815] rounded-none hover:bg-[#ebdcc8]'
                    : 'text-[#2e2823] hover:bg-[#f6f0e6]'
                }`}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const nextMonthDate = new Date(currentViewDate.getFullYear(), currentViewDate.getMonth() + 1, 1);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* TRIGGER DISPLAY CARD */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3.5 bg-[#fcfaf6] border rounded-2xl cursor-pointer transition-all duration-300 shadow-xs hover:border-[#b8860b] ${
          isOpen ? 'border-[#9e7208] ring-2 ring-[#9e7208]/20 bg-white' : 'border-[#ebdcc8]'
        }`}
      >
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#8a6314] mb-2">
          <span className="flex items-center gap-1.5">
            <CalendarIcon className="w-3.5 h-3.5 text-[#9e7208]" />
            Select Stay Dates
          </span>
          {nightsCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#f2e8d8] text-[#8a6314] border border-[#e2d0b5]">
              {nightsCount} {nightsCount === 1 ? 'Night' : 'Nights'}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-left">
          <div className="p-2 bg-white rounded-xl border border-[#ebdcc8]/80">
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#7a6f63] block mb-0.5">
              Check-In
            </span>
            <span className="text-xs font-bold text-[#1c1815] block truncate">
              {displayCheckIn}
            </span>
          </div>

          <div className="p-2 bg-white rounded-xl border border-[#ebdcc8]/80">
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#7a6f63] block mb-0.5">
              Check-Out
            </span>
            <span className="text-xs font-bold text-[#1c1815] block truncate">
              {displayCheckOut}
            </span>
          </div>
        </div>
      </div>

      {/* MINIMALIST POPUP CALENDAR */}
      {isOpen && (
        <div className="absolute right-0 lg:right-0 top-full mt-2 z-50 w-full sm:w-[580px] bg-white border border-[#ebdcc8] rounded-3xl shadow-2xl p-5 space-y-5 animate-fadeIn">
          {/* Header Controls */}
          <div className="flex items-center justify-between border-b border-[#f0e6d8] pb-3">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#9e7208]" />
              <span className="font-serif font-bold text-sm text-[#1c1815]">
                {selectingStep === 'start' ? 'Select Check-In Date' : 'Select Check-Out Date'}
              </span>
              <span className="text-[11px] text-[#7a6f63] font-light hidden sm:inline">
                ({nightsCount} {nightsCount === 1 ? 'night' : 'nights'} selected)
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg border border-[#ebdcc8] hover:bg-[#f6f0e6] text-[#1c1815] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg border border-[#ebdcc8] hover:bg-[#f6f0e6] text-[#1c1815] transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-[#f6f0e6] text-[#7a6f63] transition-colors cursor-pointer ml-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Presets Bar */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
            <span className="text-[10px] uppercase font-bold text-[#8a6314] mr-1">Quick Stays:</span>
            <button
              type="button"
              onClick={() => handlePreset(3)}
              className="px-2.5 py-1 rounded-full bg-[#f6f0e6] border border-[#ebdcc8] text-[#1c1815] hover:bg-[#1c1815] hover:text-[#ffdea5] transition-all cursor-pointer"
            >
              3 Nights
            </button>
            <button
              type="button"
              onClick={() => handlePreset(5)}
              className="px-2.5 py-1 rounded-full bg-[#f6f0e6] border border-[#ebdcc8] text-[#1c1815] hover:bg-[#1c1815] hover:text-[#ffdea5] transition-all cursor-pointer"
            >
              5 Nights
            </button>
            <button
              type="button"
              onClick={() => handlePreset(7)}
              className="px-2.5 py-1 rounded-full bg-[#f6f0e6] border border-[#ebdcc8] text-[#1c1815] hover:bg-[#1c1815] hover:text-[#ffdea5] transition-all cursor-pointer"
            >
              1 Week (7 Nights)
            </button>
            <button
              type="button"
              onClick={() => handlePreset(14)}
              className="px-2.5 py-1 rounded-full bg-[#f6f0e6] border border-[#ebdcc8] text-[#1c1815] hover:bg-[#1c1815] hover:text-[#ffdea5] transition-all cursor-pointer"
            >
              2 Weeks (14 Nights)
            </button>
          </div>

          {/* Dual Month Calendar View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-1">
            {renderMonthCalendar(currentViewDate.getFullYear(), currentViewDate.getMonth())}
            <div className="hidden sm:block">
              {renderMonthCalendar(nextMonthDate.getFullYear(), nextMonthDate.getMonth())}
            </div>
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between border-t border-[#f0e6d8] pt-3 text-xs">
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center space-x-1 text-[#7a6f63] hover:text-[#1c1815] font-semibold transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Dates</span>
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-5 py-2 rounded-xl bg-[#1c1815] text-[#ffdea5] font-bold hover:bg-[#2e2924] transition-all cursor-pointer shadow-md"
            >
              Confirm Stay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
