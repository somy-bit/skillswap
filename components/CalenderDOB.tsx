"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

type CalendarWithYearPickerProps = {
  onSelectDate?: (date: Date | undefined) => void;
};

export default function CalendarDOB({
  onSelectDate,
}: CalendarWithYearPickerProps) {
  const [month, setMonth] = useState(new Date());
  const [selected, setSelected] = useState<Date | undefined>();

  const years = Array.from({ length: 100 }, (_, i) => 1930 + i); // 2000–2049
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value, 10);
    const newDate = new Date(month);
    newDate.setFullYear(newYear);
    setMonth(newDate);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value, 10);
    const newDate = new Date(month);
    newDate.setMonth(newMonth);
    setMonth(newDate);
  };

  const handleSelect = (date: Date | undefined) => {
    setSelected(date);
    onSelectDate?.(date); // 🔑 trigger callback to parent
  };

  return (
    <div className="space-y-2">
      {/* Controls */}
      <div className="flex justify-center gap-2">
        <select
          value={month.getMonth()}
          onChange={handleMonthChange}
          className="border px-2 py-1 rounded"
        >
          {months.map((m, idx) => (
            <option key={m} value={idx}>
              {m}
            </option>
          ))}
        </select>

        <select
          value={month.getFullYear()}
          onChange={handleYearChange}
          className="border px-2 py-1 rounded"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* DayPicker */}
      <DayPicker
        mode="single"
        month={month}
        onMonthChange={setMonth}
        selected={selected}
        onSelect={handleSelect}
         footer={month
                            ? (<div
                                className='text-center mt-4 font-semibold shadow-md p-2 bg-white dark:bg-gray-900 rounded-lg'
                            >You picked {month.toLocaleDateString()}</div>) :
                            (<div className='text-center mt-4 font-semibold shadow-md p-2 bg-white dark:bg-gray-900 rounded-lg'>Please pick a day</div>)}
                    
      />
    </div>
  );
}
