import React from "react";
import { useHabits } from "@/contexts/HabitsContext";
import { format, subDays, eachDayOfInterval, isSameDay, getDay } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"

interface HabitHistoryGraphProps {
  habitId: string;
  goal: "achieve" | "avoid";
}

export default function HabitHistoryGraph({ habitId, goal }: HabitHistoryGraphProps) {
  const { completions } = useHabits();
  
  // Configuration
  const daysToShow = 120; // Show approx 4 months to fit nicely
  const today = new Date();
  const startDate = subDays(today, daysToShow);

  // Generate dates
  const dates = eachDayOfInterval({
    start: startDate,
    end: today,
  });

  // Filter completions for this habit
  // Optimization: Pre-calculate a Set of completion date strings for O(1) lookup
  const habitCompletionsSet = new Set(
    Object.values(completions)
      .filter((c) => c.habitId === habitId && c.completed)
      .map((c) => c.date)
  );
  
  // Helper to determine color intensity
  // For daily booleans, it's just on/off. 
  // For 'avoid', on (completed) is bad (Red). Off is good (Gray/Empty? Or should we inverse logic?)
  // Standard logic: 
  // - Achieve: Checked = Green (Good), Unchecked = Gray (Missed)
  // - Avoid: Checked = Red (Bad - you did the habit), Unchecked = Gray (Good - you avoided it)

  const getColor = (dateStr: string) => {
      const isCompleted = habitCompletionsSet.has(dateStr);
      
      if (!isCompleted) return "bg-gray-100 dark:bg-zinc-800";
      
      if (goal === 'avoid') {
          return "bg-red-500";
      }
      return "bg-green-500";
  };

  // Group by weeks for the grid layout
  // We need to align efficiently. A simple flex wrap with fixed items works, 
  // but a true calendar grid is column-major (weeks are columns).
  
  // Let's use a simple CSS Grid with 7 rows (days of week)
  // The 'dates' array is linear. We can map it directly to a grid if we set flow to column.
  
  return (
    <div className="space-y-4">
        <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">History</h4>
            <span className="text-xs text-gray-400">Last 4 months</span>
        </div>
        
        <TooltipProvider>
            <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-none">
                <div 
                    className="grid grid-rows-7 grid-flow-col gap-1"
                >
                    {dates.map((date) => {
                        const dateStr = format(date, "yyyy-MM-dd");
                        const statusColor = getColor(dateStr);
                        const humanDate = format(date, "MMM d, yyyy");
                        const dayOfWeek = getDay(date); // 0 = Sun, 6 = Sat
                        
                        // We might want to hide days before start if we want perfectly aligned weeks, 
                        // but subDays usually gives a raw cut.
                        
                        return (
                            <Tooltip key={dateStr}>
                                <TooltipTrigger asChild>
                                    <div 
                                        className={`w-3 h-3 rounded-sm ${statusColor} transition-colors hover:ring-2 ring-offset-1 ring-offset-white dark:ring-offset-black ring-gray-400`}
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="text-xs">{humanDate}</p>
                                    <p className="text-xs font-semibold capitalize">
                                        {habitCompletionsSet.has(dateStr) 
                                            ? (goal === 'avoid' ? 'Failed' : 'Completed') 
                                            : 'No activity'}
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </div>
            </div>
        </TooltipProvider>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-gray-500 justify-end">
            <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-zinc-800" />
                <span>N/A</span>
            </div>
            <div className="flex items-center gap-1">
                <div className={`w-3 h-3 rounded-sm ${goal === 'avoid' ? 'bg-red-500' : 'bg-green-500'}`} />
                <span>{goal === 'avoid' ? 'Failed' : 'Completed'}</span>
            </div>
        </div>
    </div>
  );
}
