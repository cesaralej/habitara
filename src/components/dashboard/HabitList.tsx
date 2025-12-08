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


  return (
    <div className="space-y-6 pb-24">
      {dailyHabits.length > 0 && (
          <div>
            {/* Daily usually top, maybe no header needed if it's the main thing? 
                User said "Separated". Let's use headers to be safe and clear. */}
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

      {monthlyHabits.length > 0 && (
          <div>
             <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Monthly</h3>
             <div className="space-y-2">
                {monthlyHabits.map(habit => {
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
      
      {/* Fallback if all empty but habits exist (e.g. all inactive?) - handled by initial check? 
          Initial check handles empty habits array. If filtered arrays correspond to active, we are good. */}
    
    </div>
  );
}
