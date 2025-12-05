// app/dashboard/HabitItem.tsx
"use client";

import { CheckSquare, Square } from "lucide-react";

import { useHabits } from "@/contexts/HabitsContext";
import { Habit } from "@/types";

interface HabitItemProps {
  habit: Habit;
  completed: boolean;
  currentDate: string; // YYYY-MM-DD
}

export default function HabitItem({
  habit,
  completed,
  currentDate,
}: HabitItemProps) {
  // Use optimistic UI or wait for parent re-render?
  // We receive `completed` from parent (from context), so let's rely on that.
  // However, for immediate feedback we might want local state or just optimistic update.
  // `useHabits` context update should be fast enough for local dev?
  // Let's use the prop `completed` directly and just call the toggle function.
  const { toggleHabitCompletion } = useHabits();

  const toggleCompletion = async () => {
    // Optimistic toggle? 
    // If we rely on props, we wait for Firestore roundtrip.
    try {
        await toggleHabitCompletion(habit.id, currentDate, !completed);
    } catch (e) {
        console.error("Failed to toggle", e);
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition">
      {/* Habit name */}
      <span
        className={`text-base ${
          completed ? "line-through text-gray-400" : ""
        }`}
      >
        {habit.name}
      </span>

      {/* Checkbox */}
      <button
        onClick={toggleCompletion}
        className="p-2 rounded-lg hover:bg-gray-100"
      >
        {completed ? (
          <CheckSquare className="w-6 h-6 text-green-500" />
        ) : (
          <Square className="w-6 h-6 text-gray-400" />
        )}
      </button>
    </div>
  );
}
