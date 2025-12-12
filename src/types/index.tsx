// types.ts
export type HabitFrequency = "daily" | "weekly" | "monthly";
export type HabitGoal = "achieve" | "avoid";

export interface Habit {
  id: string;
  name: string;
  frequency: HabitFrequency;
  goal: HabitGoal;
  details?: string;
  active: boolean;
  createdAt: number;
}

export interface HabitData {
  name: string;
  frequency: HabitFrequency;
  goal: HabitGoal;
  details?: string;
  active?: boolean;
}

export const HABIT_FREQUENCIES = ["daily", "weekly", "monthly"] as const;
export const HABIT_GOALS = ["achieve", "avoid"] as const;

export interface HabitCompletion {
  id: string; // composite key: habitId_dateString
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  frequency: HabitFrequency;
  completedAt: number;
  details?: string;
}
