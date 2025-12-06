import { useHabits } from "@/contexts/HabitsContext";
import { subDays, format } from "date-fns";
import { HabitCompletion } from "@/types";

interface HabitStats {
  streak: number;
  totalCompletions: number;
  loading: boolean;
}

export function useHabitStats(habitId: string) {
  const { completions } = useHabits();
  
  // Filter completions for this habit from the context
  const habitCompletions = (Object.values(completions) as HabitCompletion[]).filter(
    (c) => c.habitId === habitId && c.completed
  );

  // Sort by date desc
  habitCompletions.sort((a, b) => b.date.localeCompare(a.date));

  // 1. Calculate Streak
  let currentStreak = 0;
  const today = new Date();
  const yesterday = subDays(today, 1);
  const todayStr = format(today, "yyyy-MM-dd");
  const yesterdayStr = format(yesterday, "yyyy-MM-dd");

  const hasCompletedToday = habitCompletions.some((c) => c.date === todayStr);
  const hasCompletedYesterday = habitCompletions.some(
    (c) => c.date === yesterdayStr
  );

  if (hasCompletedToday || hasCompletedYesterday) {
    let checkDate = hasCompletedToday ? today : yesterday;
    while (true) {
      const dateStr = format(checkDate, "yyyy-MM-dd");
      const hasCompletion = habitCompletions.some((c) => c.date === dateStr);

      if (hasCompletion) {
        currentStreak++;
        checkDate = subDays(checkDate, 1);
      } else {
        break;
      }
    }
  }

  // 2. Total Completions
  const totalCompletions = habitCompletions.length;

  return {
    streak: currentStreak,
    totalCompletions,
    loading: false, // Instant calculation from context
  };
}
