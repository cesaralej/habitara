import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Habit } from "@/types";

interface HabitDetailsProps {
  habit: Habit;
  onEdit: () => void;
  onDelete: () => void;
}

export default function HabitsDetails({
  habit,
  onEdit,
  onDelete,
}: HabitDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-lg">{habit.name}</h3>
          <p className="text-sm text-gray-600">
            {habit.details || "No description provided."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="capitalize">
            {habit.frequency}
          </Badge>
          <Badge variant={habit.active ? "default" : "destructive"}>
            {habit.active ? "Active" : "Inactive"}
          </Badge>
        </div>

        <div className="text-sm text-gray-500">
          Created on{" "}
          {new Date(habit.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Habit History Placeholder */}
      <div>
        <h4 className="font-semibold mb-2 text-base border-b pb-1">
          Habit History
        </h4>
        <p className="text-center text-gray-500 py-4 text-sm">
          No recent habit history found.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button onClick={onEdit} variant="outline" className="flex-1">
          Edit Details
        </Button>
        <Button
          onClick={onDelete}
          variant="destructive"
          className="w-full sm:w-auto"
        >
          Delete Habit
        </Button>
      </div>
    </div>
  );
}
