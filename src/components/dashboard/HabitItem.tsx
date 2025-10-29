// app/dashboard/HabitItem.tsx
"use client";

import { useState } from "react";
import { CheckSquare, Square } from "lucide-react";

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
  const [isCompleted, setIsCompleted] = useState(completed);

  const toggleCompletion = () => {
    setIsCompleted((prev) => !prev);

    // 🚧 TODO: integrate Firebase later
    console.log(
      `Habit ${habit.name} (${habit.id}) for ${currentDate} marked as ${
        !isCompleted ? "complete" : "incomplete"
      }`
    );
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition">
      {/* Habit name */}
      <span
        className={`text-base ${
          isCompleted ? "line-through text-gray-400" : ""
        }`}
      >
        {habit.name}
      </span>

      {/* Checkbox */}
      <button
        onClick={toggleCompletion}
        className="p-2 rounded-lg hover:bg-gray-100"
      >
        {isCompleted ? (
          <CheckSquare className="w-6 h-6 text-green-500" />
        ) : (
          <Square className="w-6 h-6 text-gray-400" />
        )}
      </button>
    </div>
  );
}
