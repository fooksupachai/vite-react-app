import React, { useState, useMemo, useRef, useEffect } from 'react';

interface CalendarDay {
  date: Date;
  otherMonth: boolean;
}

const DatePicker: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const formattedDate = useMemo(() =>
    selectedDate ? selectedDate.toLocaleDateString() : '', [selectedDate]
  );

  const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const daysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();

  const calendarDays = useMemo(() => {
    const days: CalendarDay[] = [];
    const firstDayOfWeek = new Date(
      currentYear,
      currentMonth,
      1
    ).getDay();
    
    // previous month days
    const prevMonthDays = daysInMonth(
      currentYear,
      currentMonth - 1
    );
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(
          currentYear,
          currentMonth - 1,
          prevMonthDays - i
        ),
        otherMonth: true,
      });
    }
    
    // current month days
    const thisMonthDays = daysInMonth(
      currentYear,
      currentMonth
    );
    for (let i = 1; i <= thisMonthDays; i++) {
      days.push({ 
        date: new Date(currentYear, currentMonth, i), 
        otherMonth: false 
      });
    }
    
    // next month days (fill to 6 weeks grid)
    const nextDays = 42 - days.length;
    for (let i = 1; i <= nextDays; i++) {
      days.push({ 
        date: new Date(currentYear, currentMonth + 1, i), 
        otherMonth: true 
      });
    }
    return days;
  }, [currentMonth, currentYear]);

  const currentMonthName = useMemo(() =>
    new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' }), [currentMonth, currentYear]
  );

  const toggleCalendar = () => setShowCalendar(!showCalendar);
  
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  const selectDate = (day: CalendarDay) => {
    if (day.otherMonth) return;
    setSelectedDate(day.date);
    setShowCalendar(false);
  };
  
  const isSelected = (day: CalendarDay) =>
    selectedDate &&
    day.date.toDateString() === selectedDate.toDateString();

  const isToday = (day: CalendarDay) => {
    const d = day.date;
    return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
  };

  const isWeekend = (day: CalendarDay) => {
    const wd = day.date.getDay();
    return wd === 0 || wd === 6;
  };

  // Close on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!showCalendar) return;
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setShowCalendar(false);
      }
    };
    window.addEventListener('mousedown', onClick);
    return () => window.removeEventListener('mousedown', onClick);
  }, [showCalendar]);

  return (
    <div className="relative inline-block text-left">
      <div className="relative">
        <input
          type="text"
          readOnly
          value={formattedDate}
          onClick={toggleCalendar}
          placeholder="Select date"
          className="w-72 pr-12 pl-4 py-3 rounded-lg border border-gray-300 bg-white text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
          {/* calendar icon */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
            <path d="M6 2a1 1 0 0 1 1 1v1h6V3a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V3a1 1 0 0 1 1-1Zm10 7H4v7a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V9Z" />
          </svg>
        </div>
      </div>

      {showCalendar && (
        <div
          ref={popoverRef}
          className="absolute top-full left-0 mt-3 w-[28rem] rounded-2xl border border-gray-200 bg-white shadow-2xl ring-1 ring-black/5 p-5 z-50"
        >
          {/* header */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={prevMonth}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Previous month"
            >
              <span className="sr-only">Previous month</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
                <path fillRule="evenodd" d="M12.78 15.28a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 0 1 0-1.06l4-4a.75.75 0 1 1 1.06 1.06L9.56 10l3.22 3.22a.75.75 0 0 1 0 1.06Z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="text-lg font-semibold text-gray-900">
              {currentMonthName} {currentYear}
            </div>
            <button
              onClick={nextMonth}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Next month"
            >
              <span className="sr-only">Next month</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
                <path fillRule="evenodd" d="M7.22 4.72a.75.75 0 0 1 1.06 0l4 4a.75.75 0 0 1 0 1.06l-4 4a.75.75 0 0 1-1.06-1.06L10.44 10 7.22 6.78a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* weekdays */}
          <div className="grid grid-cols-7 text-center mb-2 text-sm md:text-base font-semibold text-gray-500">
            {weekdays.map((day) => (
              <span key={day} className="py-1">
                {day}
              </span>
            ))}
          </div>
          
          {/* days */}
          <div className="grid grid-cols-7 gap-2 text-center">
            {calendarDays.map((day, index) => {
              const selected = Boolean(isSelected(day));
              const weekend = isWeekend(day);
              const todayMark = isToday(day);
              const base = 'flex items-center justify-center h-12 w-12 rounded-full text-base transition-colors';
              const muted = day.otherMonth ? 'text-gray-300' : weekend ? 'text-gray-700' : 'text-gray-800';
              const hoverable = !day.otherMonth && !selected ? 'hover:bg-blue-50' : '';
              const selectedCls = selected ? 'bg-blue-600 text-white shadow' : '';
              const todayRing = todayMark && !selected ? 'ring-2 ring-blue-400' : '';

              return (
                <button
                  type="button"
                  key={`${day.date.toISOString()}-${index}`}
                  onClick={() => selectDate(day)}
                  className={[base, muted, hoverable, selectedCls, todayRing].join(' ').trim()}
                  disabled={day.otherMonth}
                >
                  {day.date.getDate()}
                </button>
              );
            })}
          </div>

          {/* footer */}
          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setSelectedDate(null);
                setShowCalendar(false);
              }}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setShowCalendar(false)}
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
