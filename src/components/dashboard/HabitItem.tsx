// app/dashboard/HabitItem.tsx
"use client";

import { CheckSquare, Square } from "lucide-react";
import { useState } from "react";

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
  const { toggleHabitCompletion } = useHabits();
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleCompletion = async () => {
    // Trigger animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 400);

    try {
      await toggleHabitCompletion(habit.id, currentDate, !completed);
    } catch (e) {
      console.error("Failed to toggle", e);
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Habit name */}
      <span
        className={`text-base transition-all duration-300 ${
          completed ? "line-through text-gray-400" : "text-gray-900"
        }`}
      >
        {habit.name}
      </span>

      {/* Checkbox */}
      <button
        onClick={toggleCompletion}
        className={`p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 ${
          isAnimating ? "scale-110" : "scale-100"
        }`}
        style={{
          transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease",
          boxShadow: isAnimating 
            ? "0 0 20px rgba(34, 197, 94, 0.4), 0 0 10px rgba(34, 197, 94, 0.2)" 
            : "none",
        }}
      >
        {completed ? (
          <CheckSquare 
            className={`w-6 h-6 text-green-500 transition-all duration-300 ${
              isAnimating ? "rotate-12" : "rotate-0"
            }`}
            style={{
              filter: isAnimating ? "drop-shadow(0 0 8px rgba(34, 197, 94, 0.5))" : "none",
            }}
          />
        ) : (
          <Square className="w-6 h-6 text-gray-400 transition-colors duration-200 hover:text-gray-600" />
        )}
      </button>
    </div>
  );
}
