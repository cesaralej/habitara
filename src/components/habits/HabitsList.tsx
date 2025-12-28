"use client";

import { FC, useState } from "react";
import { useHabits } from "@/contexts/HabitsContext";
import { Habit } from "@/types";
import { HabitCard } from "./HabitCard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface HabitListProps {
  onEdit: (habit: Habit) => void;
}

const HabitList: FC<HabitListProps> = ({ onEdit }) => {
  const { habits, updateHabit, deleteHabit } = useHabits();
  const [showArchived, setShowArchived] = useState(false);

  if (!habits || habits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-gray-300 shadow-sm animate-in fade-in zoom-in duration-300">
        <div className="p-4 bg-zinc-50 rounded-full mb-4">
          <PlusCircle className="w-10 h-10 text-zinc-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Build your first habit</h3>
        <p className="text-gray-500 text-center max-w-sm">
          You don't have any habits yet. Use the <strong className="text-blue-600">Add Habit</strong> button above (or the "+" button on mobile) to get started on your journey.
        </p>
      </div>
    );
  }

  const activeHabits = habits.filter((h) => h.active);
  const archivedHabits = habits.filter((h) => !h.active);

  // Group active habits by frequency
  const dailyHabits = activeHabits.filter(h => h.frequency === 'daily');
  const weeklyHabits = activeHabits.filter(h => h.frequency === 'weekly');
  const monthlyHabits = activeHabits.filter(h => h.frequency === 'monthly');

  const handleArchive = async (habit: Habit) => {
    await updateHabit(habit.id, { active: !habit.active });
  };

  const handleDelete = async (habit: Habit) => {
    if (confirm("Are you sure you want to delete this habit? This action cannot be undone.")) {
        await deleteHabit(habit.id);
    }
  };

  return (
    <div className="space-y-8 pb-24">
      {/* Active Habits - Grouped by Frequency */}
      {activeHabits.length > 0 ? (
        <div className="space-y-6">
          {/* Daily Habits */}
          {dailyHabits.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Daily</h3>
              {dailyHabits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onEdit={onEdit}
                />
              ))}
            </div>
          )}

          {/* Weekly Habits */}
          {weeklyHabits.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Weekly</h3>
              {weeklyHabits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onEdit={onEdit}
                />
              ))}
            </div>
          )}

          {/* Monthly Habits */}
          {monthlyHabits.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Monthly</h3>
              {monthlyHabits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onEdit={onEdit}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-4">No active habits.</p>
      )}

      {/* Archived Habits Section */}
      {archivedHabits.length > 0 && (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-700">Archived</h3>
                <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowArchived(!showArchived)}
                >
                    {showArchived ? "Hide" : "Show"}
                </Button>
            </div>
            
            {showArchived && (
                <div className="space-y-2 opacity-75">
                    {archivedHabits.map((habit) => (
                        <HabitCard
                        key={habit.id}
                        habit={habit}
                        onEdit={onEdit}
                        />
                    ))}
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default HabitList;
