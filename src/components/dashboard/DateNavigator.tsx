"use client";

import * as React from "react";
import { format, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight, ChevronsRight, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div className="mb-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
       <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
          {/* Left Arrow */}
          <button 
            onClick={goPrev} 
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            aria-label="Previous Day"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          {/* Center: Date Display */}
          <div className="flex items-center justify-center gap-3">
             <div 
                className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg",
                    isToday ? "text-green-600 bg-green-50" : "text-blue-600 bg-blue-50"
                )}
             >
                <CalendarIcon className="w-4 h-4" />
                <div className="flex flex-col items-start">
                  <span className="text-base font-semibold leading-tight">
                     {format(currentDate, "MMM d")}
                  </span>
                  <span className="text-[10px] font-normal text-gray-500 leading-tight">
                    {format(currentDate, "EEE")}
                  </span>
                </div>
             </div>

             {isToday ? (
                 <button 
                    className="px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors active:scale-95"
                    disabled
                 >
                     Today
                 </button>
             ) : (
                 <button 
                    onClick={goToday}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors active:scale-95"
                 >
                     <span>Today</span>
                     <ChevronsRight className="w-4 h-4" />
                 </button>
             )}
          </div>

          {/* Right Arrow */}
          <button 
            onClick={goNext} 
            className={cn(
                "p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors",
                isToday && "opacity-30 cursor-not-allowed hover:bg-transparent"
            )}
            disabled={isToday}
            aria-label="Next Day"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
       </div>
      </div>
    </div>
  );
}
