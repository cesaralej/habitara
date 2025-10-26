"use client";

import { FC } from "react";
import { useHabits } from "@/contexts/HabitsContext";
import { Habit } from "@/types";
import { Button } from "@/components/ui/button";

interface HabitListProps {
  onEdit: (habit: Habit) => void;
}

const HabitList: FC<HabitListProps> = ({ onEdit }) => {
  const { habits } = useHabits();

  if (!habits || habits.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">
        No habits found. Add one using the "+" button.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {habits.map((habit) => (
        <div
          key={habit.id}
          className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm border"
        >
          <div className="flex flex-col">
            <span className="font-semibold">{habit.name}</span>
            <span className="text-sm text-gray-500 capitalize">
              {habit.frequency}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Active / Inactive indicator */}
            <span
              className={`px-2 py-1 text-xs rounded-full font-medium ${
                habit.active
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {habit.active ? "Active" : "Inactive"}
            </span>

            {/* Edit button */}
            <Button size="sm" variant="outline" onClick={() => onEdit(habit)}>
              Edit
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HabitList;
