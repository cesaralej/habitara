// app/dashboard/HabitList.tsx
"use client";

import HabitItem from "./HabitItem";

//Import habits here or in the dashboard?
import { useHabits } from "@/contexts/HabitsContext";

import { Habit, HabitCompletion } from "@/types";

interface HabitListProps {
  completions: Record<string, HabitCompletion>;
  currentDate: string; // YYYY-MM-DD
}

export default function HabitList({
  completions,
  currentDate,
}: HabitListProps) {
  const { habits } = useHabits();

  if (!habits || habits.length === 0) {
    return (
      <div className="text-center text-gray-500 p-6">
        No habits yet. Add one to get started!
      </div>
    );
  }

  // Sorting and Grouping
  const dailyHabits = habits.filter(h => h.frequency === 'daily' && h.active);
  const weeklyHabits = habits.filter(h => h.frequency === 'weekly' && h.active);
  const monthlyHabits = habits.filter(h => h.frequency === 'monthly' && h.active);

  const renderHabitGroup = (title: string, groupHabits: Habit[]) => {
      if (groupHabits.length === 0) return null;
      return (
          <div className="space-y-2">
            {/* Optional Header for clarity, maybe small text? User asked for filtering "Daily first then weekly..." 
                User didn't explicitly ask for headers, but "Separated" implies visual separation. 
                Let's add a small label if multiple types exist, or just space them out. 
                "The daily habits can go first, then the weekly and then the monthly." 
                I'll render them in order. */}
             
             {/* Let's just render the list. If separation is needed we can add a divider? 
                 "Separated" usually invites headers. Let's add small headers. */}
             <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-4">{title}</h3>
             
             <div className="space-y-2">
                {groupHabits.map(habit => {
                    const completed = completions[habit.id]?.completed ?? false;
                    return (
                        <HabitItem 
                            key={habit.id}
                            habit={habit}
                            completed={completed}
                            currentDate={currentDate}
                        />
                    );
                })}
             </div>
          </div>
      );
  };

  return (
    <div className="space-y-6 pb-24">
      {dailyHabits.length > 0 && (
          <div>
            {/* Daily usually top, maybe no header needed if it's the main thing? 
                User said "Separated". Let's use headers to be safe and clear. */}
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Daily</h3>
            <div className="space-y-2">
                {dailyHabits.map(habit => (
                    <HabitItem 
                        key={habit.id}
                        habit={habit}
                        completed={completions[habit.id]?.completed ?? false}
                        currentDate={currentDate}
                    />
                ))}
            </div>
          </div>
      )}

      {weeklyHabits.length > 0 && (
          <div>
             <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Weekly</h3>
             <div className="space-y-2">
                {weeklyHabits.map(habit => (
                    <HabitItem 
                        key={habit.id}
                        habit={habit}
                        completed={completions[habit.id]?.completed ?? false}
                        currentDate={currentDate}
                    />
                ))}
             </div>
          </div>
      )}

      {monthlyHabits.length > 0 && (
          <div>
             <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Monthly</h3>
             <div className="space-y-2">
                {monthlyHabits.map(habit => (
                    <HabitItem 
                        key={habit.id}
                        habit={habit}
                        completed={completions[habit.id]?.completed ?? false}
                        currentDate={currentDate}
                    />
                ))}
             </div>
          </div>
      )}
      
      {/* Fallback if all empty but habits exist (e.g. all inactive?) - handled by initial check? 
          Initial check handles empty habits array. If filtered arrays correspond to active, we are good. */}
    
    </div>
  );
}
