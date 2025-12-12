import { useHabits } from "@/contexts/HabitsContext";
import { subDays, format, differenceInCalendarDays } from "date-fns";
import { HabitCompletion, Habit } from "@/types";

interface HabitStats {
  streak: number;
  totalCompletions: number;
  loading: boolean;
}

export function useHabitStats(habitId: string) {
  const { habits, completions } = useHabits();
  
  const habit = habits?.find((h) => h.id === habitId);

  // Filter completions for this habit from the context
  const habitCompletions = (Object.values(completions) as HabitCompletion[]).filter(
    (c) => c.habitId === habitId && c.completed
  );

  // Sort by date desc (newest first)
  habitCompletions.sort((a, b) => b.date.localeCompare(a.date));

  let currentStreak = 0;
  const today = new Date();

  // If habit not found or loading, return 0
  if (!habit) {
      return { streak: 0, totalCompletions: habitCompletions.length, loading: false };
  }

  if (habit.goal === 'avoid') {
      // Logic for "Avoid" habits: Streak = Days since last completion (relapse)
      // If never completed, Days since creation.
      
      const lastCompletion = habitCompletions[0]; // Newest due to sort
      
      if (lastCompletion) {
          const lastDate = new Date(lastCompletion.date);
          currentStreak = differenceInCalendarDays(today, lastDate);
          // If the difference is negative (future date check?), clamp to 0. 
          // If completed today, diff is 0. Correct.
          if (currentStreak < 0) currentStreak = 0;
      } else {
          // Never completed (relapsed) since creation
          // Streak is days since creation
          const createdDate = new Date(habit.createdAt); // createdAt is number (timestamp)
          currentStreak = differenceInCalendarDays(today, createdDate);
          if (currentStreak < 0) currentStreak = 0;
      }

  } else {
      // Default "Achieve" logic (Consecutive days)
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
  }

  // 2. Total Completions
  const totalCompletions = habitCompletions.length;

  return {
    streak: currentStreak,
    totalCompletions,
    loading: false, // Instant calculation from context
  };
}
