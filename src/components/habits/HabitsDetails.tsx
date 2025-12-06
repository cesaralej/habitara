import React from "react";
import { Button } from "@/components/ui/button";
import { Habit } from "@/types";

interface HabitsDetailsProps {
  habit: Habit;
  onEdit: () => void;
  onDelete: () => void;
  onArchive: (habit: Habit) => void;
}

export default function HabitsDetails({
  habit,
  onEdit,
  onDelete,
  onArchive,
}: HabitsDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{habit.name}</h3>
        <p className="text-sm text-gray-500 capitalize">{habit.frequency}</p>
        <p className="text-sm text-gray-500">
          Status: {habit.active ? "Active" : "Archived"}
        </p>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Description</h4>
        <p className="text-sm text-gray-700">
          {habit.details || "No details provided."}
        </p>
      </div>

      <div className="flex flex-col gap-3 pt-4">
        <Button onClick={onEdit} className="w-full">
          Edit Habit
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => onArchive(habit)}
          className="w-full"
        >
          {habit.active ? "Archive Habit" : "Activate Habit"}
        </Button>

        <Button 
          variant="destructive" 
          onClick={onDelete}
          className="w-full"
        >
          Delete Habit
        </Button>
      </div>
    </div>
  );
}
