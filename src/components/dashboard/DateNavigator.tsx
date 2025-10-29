// app/dashboard/DateNavigator.tsx
"use client";

import { format, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface DateNavigatorProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export default function DateNavigator({
  currentDate,
  onDateChange,
}: DateNavigatorProps) {
  const isToday = isSameDay(currentDate, new Date());

  const goPrev = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    onDateChange(newDate);
  };

  const goNext = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    onDateChange(newDate);
  };

  const goToday = () => {
    onDateChange(new Date());
  };

  return (
    <div className="flex items-center justify-between rounded-2xl bg-gray-100 p-2 shadow-sm">
      {/* Left button */}
      <button onClick={goPrev} className="p-2 rounded-xl hover:bg-gray-200">
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Current Date */}
      <div className="flex items-center space-x-2">
        <Calendar className="w-5 h-5 text-gray-600" />
        <span className="font-medium">
          {format(currentDate, "EEE, MMM d, yyyy")}
        </span>
      </div>

      {/* Right + Today */}
      <div className="flex items-center space-x-2">
        <button
          onClick={goToday}
          className={`px-2 py-1 text-sm rounded-lg ${
            isToday
              ? "bg-green-500 text-white"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {isToday ? "Today" : "Go to Today"}
        </button>
        <button onClick={goNext} className="p-2 rounded-xl hover:bg-gray-200">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
