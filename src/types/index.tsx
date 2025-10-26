// types.ts
export type HabitFrequency = "daily" | "weekly" | "monthly";

export interface Habit {
  id: string;
  name: string;
  frequency: HabitFrequency;
  details?: string;
  active: boolean;
  createdAt: number;
}

export interface HabitData {
  name: string;
  frequency: HabitFrequency;
  details?: string;
  active?: boolean;
}

export const HABIT_FREQUENCIES = ["daily", "weekly", "monthly"] as const;
