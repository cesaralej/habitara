// app/dashboard/HabitList.tsx
"use client";

import HabitItem from "./HabitItem";

//Import habits here or in the dashboard?
import { useHabits } from "@/contexts/HabitsContext";

import { Habit, HabitCompletion } from "@/types";
import { startOfWeek } from "date-fns";

import Link from "next/link";
import { PlusCircle } from "lucide-react";

interface HabitListProps {
  completions: Record<string, HabitCompletion>;
  currentDate: string; // YYYY-MM-DD
}

export default function HabitList({
  completions,
  currentDate,
}: HabitListProps) {
  const { habits, completions: allCompletions } = useHabits();

  if (!habits || habits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-dashed border-gray-300 shadow-sm animate-in fade-in zoom-in duration-300 mt-4">
        <div className="p-3 bg-blue-50 rounded-full mb-4">
          <PlusCircle className="w-8 h-8 text-blue-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No habits yet</h3>
        <p className="text-sm text-gray-500 text-center max-w-[250px] mb-6">
          Start your journey by defining the habits you want to build or avoid.
        </p>
        <Link 
          href="/habits" 
          className="inline-flex items-center justify-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
        >
          Add My First Habit
        </Link>
      </div>
    );
  }

  // Sorting and Grouping
  const dailyHabits = habits.filter(h => h.frequency === 'daily' && h.active);
  const weeklyHabits = habits.filter(h => h.frequency === 'weekly' && h.active);
  const monthlyHabits = habits.filter(h => h.frequency === 'monthly' && h.active);

  // Helper to check period completion
  
  const isPeriodCompleted = (habit: Habit) => {
      // If daily, period completion is irrelevant (or same as daily status)
      if (habit.frequency === 'daily') return false;

      // We need to check if *any* completion exists in the current period
      // allCompletions keys are habitId_YYYY-MM-DD
      
      const targetDate = new Date(currentDate);
      // Construct date strings for the period
      // This is slightly expensive if we iterate all completions. 
      // Better: filter completions by habitId first.
      
      // Optimization: filter completions for this habit once? 
      // Or just iterate. Let's iterate values since we don't have a direct habit index.
      // Wait, `allCompletions` is a Record using composite keys.
      // We can iterate the keys? Or Object.values().
      
      const habitCompletions = Object.values(allCompletions).filter(c => c.habitId === habit.id);
      
      if (habit.frequency === 'weekly') {
          // Check if any completion falls in the same week as currentDate
          // Note: using startOfWeek with Monday start
             // Check if any completion is in the same week
            // We can compare "YYYY-ww" format? Or getWeek?
            // Simple: startOfWeek(completionDate) === startOfWeek(currentDate)
            const currentWeekStart = startOfWeek(targetDate, { weekStartsOn: 1 }).getTime();
            return habitCompletions.some(c => {
                 const cDate = new Date(c.date);
                 const cWeekStart = startOfWeek(cDate, { weekStartsOn: 1 }).getTime();
                 return cWeekStart === currentWeekStart && c.completed;
            });
      }
      
      if (habit.frequency === 'monthly') {
          // Check if same month and year
          return habitCompletions.some(c => {
              const cDate = new Date(c.date);
              return cDate.getMonth() === targetDate.getMonth() && 
                     cDate.getFullYear() === targetDate.getFullYear() && 
                     c.completed;
          });
      }
      
      return false;
  };

  return (
    <div className="space-y-6 pb-24">
      {dailyHabits.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Daily</h3>
            <div className="space-y-2">
                {dailyHabits.map(habit => {
                    const completion = completions[habit.id];
                    return (
                        <HabitItem 
                            key={habit.id}
                            habit={habit}
                            completion={completion}
                            currentDate={currentDate}
                        />
                    );
                })}
            </div>
          </div>
      )}

      {weeklyHabits.length > 0 && (
          <div>
             <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Weekly</h3>
             <div className="space-y-2">
                {weeklyHabits.map(habit => {
                    const completion = completions[habit.id];
                    const periodMet = isPeriodCompleted(habit);
                    return (
                        <HabitItem 
                            key={habit.id}
                            habit={habit}
                            completion={completion}
                            currentDate={currentDate}
                            periodCompleted={periodMet}
                        />
                    );
                })}
            </div>
          </div>
      )}

      {monthlyHabits.length > 0 && (
          <div>
             <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Monthly</h3>
             <div className="space-y-2">
                {monthlyHabits.map(habit => {
                    const completion = completions[habit.id];
                    const periodMet = isPeriodCompleted(habit);
                    return (
                        <HabitItem 
                            key={habit.id}
                            habit={habit}
                            completion={completion}
                            currentDate={currentDate}
                            periodCompleted={periodMet}
                        />
                    );
                })}
             </div>
          </div>
      )}
      
    </div>
  );
}
