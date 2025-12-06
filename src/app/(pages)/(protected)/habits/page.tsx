"use client";

import { useState } from "react";
import HabitList from "@/components/habits/HabitsList";
import { PlusIcon } from "lucide-react";
import { useHabits } from "@/contexts/HabitsContext";
import HabitDrawer from "@/components/habits/HabitsDrawer";
import { Habit, HabitData } from "@/types";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
// import { toast } from "sonner";

function HabitsPage() {
  const { addHabit, updateHabit } = useHabits();
  const [showSheet, setShowSheet] = useState(false);
  const [editData, setEditData] = useState<Partial<Habit> | null>(null);

  const handleAdd = () => {
    setEditData(null);
    setShowSheet(true);
  };

  const handleEdit = (habit: Habit) => {
    setEditData(habit);
    // console.log(habit);
    setShowSheet(true);
  };

  const handleSubmit = async (habitData: Parameters<typeof addHabit>[0]) => {
    try {
      if (editData?.id) {
        // Editing
        await updateHabit(editData.id, habitData);
        // toast("Habit updated");
      } else {
        // Adding
        await addHabit(habitData);
        // toast("Habit added");
      }
      setShowSheet(false);
    } catch (error) {
      console.error("Error saving habit:", error);
      // toast.error("Uh oh! Something went wrong.");
    }
  };

  const handleDrawerClose = () => {
    setShowSheet(false);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-4">
      <PageHeader
        title="My Habits"
        description="Manage your daily routines and track your progress."
        action={
          <Button onClick={handleAdd} className="hidden md:flex">
            <PlusIcon className="mr-2 h-4 w-4" /> Add Habit
          </Button>
        }
      />

      {/* FAB for mobile only */}
      <button
        onClick={handleAdd}
        className="md:hidden fixed bottom-20 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-transform hover:scale-110 z-30"
      >
        <PlusIcon size={24} />
      </button>
      <HabitDrawer
        showSheet={showSheet}
        setShowSheet={handleDrawerClose}
        initialData={editData}
        onSubmit={handleSubmit}
      />

      <HabitList onEdit={handleEdit} />
    </div>
  );
}
export default HabitsPage;
