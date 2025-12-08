import { useMemo } from "react";
import { useHabits } from "@/contexts/HabitsContext";
import { HabitCompletion } from "@/types";
import { format, startOfWeek, startOfMonth } from "date-fns";

export const useDateCompletions = (date: string) => {
  const { habits, completions, loading } = useHabits();

  const dateCompletions = useMemo(() => {
    if (!habits || loading) return {};

    const targetDate = new Date(date);
    // Calculate keys once
    const dailyKey = date;
    const weeklyKey = format(startOfWeek(targetDate, { weekStartsOn: 1 }), "yyyy-MM-dd");
    const monthlyKey = format(startOfMonth(targetDate), "yyyy-MM-dd");

    const result: Record<string, HabitCompletion> = {};

    habits.forEach((habit) => {
      let key = dailyKey;
      if (habit.frequency === "weekly") key = weeklyKey;
      if (habit.frequency === "monthly") key = monthlyKey;

      // Construct ID: habitId_dateKey
      const completionId = `${habit.id}_${key}`;
      
      // Check if it exists in the global completions map
      if (completions[completionId]) {
        result[habit.id] = completions[completionId];
      }
    });

    return result;
  }, [date, habits, completions, loading]);

  return { completions: dateCompletions, loading };
};
