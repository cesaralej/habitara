import React, { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import HabitForm from "@/components/habits/HabitsForm";
import HabitsDetails from "./HabitsDetails";
import { useHabits } from "@/contexts/HabitsContext";
import { Habit, HabitData } from "@/types";

interface HabitsDrawerProps {
  showSheet: boolean;
  setShowSheet: (show: boolean) => void;
  initialData?: Partial<Habit> | null;
  // onAddHabit: (habit: HabitData) => Promise<void>;
  // onEditHabit: (habitId: string, habit: HabitData) => Promise<void>;
  onSubmit: (habitData: HabitData, habitId?: string) => Promise<void>;
}

export default function HabitsDrawer({
  showSheet,
  setShowSheet,
  initialData,
  // onAddHabit,
  // onEditHabit,
  onSubmit,
}: HabitsDrawerProps) {
  const { deleteHabit } = useHabits();

  // State to manage the mode within the drawer when isEdit is true
  const [mode, setMode] = useState<"view" | "edit">("view");

  // Reset mode to 'view' when the drawer is opened for editing an existing item
  useEffect(() => {
    if (showSheet && initialData) {
      setMode("view");
    }
    // If opening for 'Add', mode doesn't matter
  }, [showSheet, initialData]);

  const handleDelete = async () => {
    if (
      initialData?.id &&
      window.confirm("Are you sure you want to delete this habit item?")
    ) {
      try {
        await deleteHabit(initialData.id);
        setShowSheet(false);
        // Add success feedback (e.g., toast) if desired
      } catch (error) {
        console.error("Failed to delete habit item:", error);
        // Add error feedback (e.g., toast)
      }
    }
  };

  // Determine Drawer Title based on state
  const getDrawerTitle = (description: string) => {
    if (!initialData) return "Add Habit Item";
    switch (mode) {
      case "view":
        return `Details for ${description}`;
      case "edit":
        return "Edit Habit Item";
      default:
        return "";
    }
  };

  const isNew = !initialData;

  const handleArchive = async (habit: Habit) => {
    if (onSubmit) {
         // Reusing onSubmit to handle updates, including active status/archiving
         // We need to pass the updated data.
         await onSubmit({ ...habit, active: !habit.active }, habit.id);
         // Keep drawer open or close? Probably keep open to show updated status or close?
         // Let's close it for now as it's a major action.
         setShowSheet(false);
    }
  };

  return (
    <Drawer open={showSheet} onOpenChange={setShowSheet}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle>
            {getDrawerTitle(initialData?.name || "Habit")}
          </DrawerTitle>
        </DrawerHeader>

        <ScrollArea className="overflow-y-auto px-4">
          <div className="py-4">
            {isNew ? (
              <HabitForm
                setShowSheet={setShowSheet}
                initialData={null}
                onSubmit={(data) => onSubmit(data)}
              />
            ) : mode === "view" ? (
              <HabitsDetails
                habit={initialData as Habit}
                onEdit={() => setMode("edit")}
                onDelete={handleDelete}
                onArchive={handleArchive}
              />
            ) : (
              <HabitForm
                setShowSheet={setShowSheet}
                initialData={initialData}
                onSubmit={(data) => onSubmit(data, initialData.id)}
              />
            )}
          </div>
        </ScrollArea>

        {mode === "edit" && (
          <DrawerFooter className="border-t pt-4">
            <Button variant="outline" onClick={() => setMode("view")}>
              Back to Details
            </Button>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}
