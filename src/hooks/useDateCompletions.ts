import { useMemo } from "react";
import { useHabits } from "@/contexts/HabitsContext";
import { HabitCompletion } from "@/types";
import { format, startOfWeek, startOfMonth } from "date-fns";

export const useDateCompletions = (date: string) => {
  const { habits, completions, loading } = useHabits();

  const dateCompletions = useMemo(() => {
    if (!habits || loading) return {};

    const targetDate = new Date(date);
    // Always use daily key now
    const dailyKey = date;

    const result: Record<string, HabitCompletion> = {};

    habits.forEach((habit) => {
      // Construct ID: habitId_dateKey
      const completionId = `${habit.id}_${dailyKey}`;
      
      // Check if it exists in the global completions map
      if (completions[completionId]) {
        result[habit.id] = completions[completionId];
      }
    });

    return result;
  }, [date, habits, completions, loading]);

  return { completions: dateCompletions, loading };
};
