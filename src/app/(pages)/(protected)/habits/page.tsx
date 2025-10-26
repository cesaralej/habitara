"use client";

import { useState } from "react";
import HabitList from "@/components/habits/HabitsList";
import { PlusIcon } from "lucide-react";
import { useHabits } from "@/contexts/HabitsContext";
import HabitDrawer from "@/components/habits/HabitsDrawer";
import { Habit, HabitData } from "@/types";
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
    <>
      <h2 className="text-2xl font-semibold mb-4 mt-4">Habits</h2>
      {/* buton to add a new habit*/}
      <button
        onClick={handleAdd}
        className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition duration-300 ease-in-out transform hover:scale-110  z-30"
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
    </>
  );
}
export default HabitsPage;
