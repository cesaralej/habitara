// app/dashboard/HabitList.tsx
"use client";

import HabitItem from "./HabitItem";

//Import habits here or in the dashboard?
import { useHabits } from "@/contexts/HabitsContext";

import { Habit } from "@/types";

interface HabitListProps {
  completions: Record<string, any>;
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

  return (
    <div className="space-y-2">
      {habits.map((habit) => {
        // Check if habit should be visible for this date
        const created = new Date(habit.createdAt);
        const current = new Date(currentDate);

        // const isVisible = habit.active && created <= current;
        const isVisible = habit.active;

        if (!isVisible) return null;

        // Grab completion state
        const completed = completions[habit.id]?.done ?? false;

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
  );
}
