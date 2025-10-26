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
import { useHabits } from "@/contexts/HabitsContext";
import { Habit, HabitData } from "@/types";

interface HabitDrawerProps {
  isEdit?: boolean;
  showSheet: boolean;
  setShowSheet: (show: boolean) => void;
  initialData?: Partial<Habit> | null;
  // onAddHabit: (habit: HabitData) => Promise<void>;
  // onEditHabit: (habitId: string, habit: HabitData) => Promise<void>;
  onSubmit: (habitData: HabitData, habitId?: string) => Promise<void>;
}

function HabitsDrawer({
  isEdit = false,
  showSheet,
  setShowSheet,
  initialData,
  // onAddHabit,
  // onEditHabit,
  onSubmit,
}: HabitDrawerProps) {
  const { deleteHabit } = useHabits();

  // State to manage the mode within the drawer when isEdit is true
  const [mode, setMode] = useState<"view" | "edit">("view");

  // Reset mode to 'view' when the drawer is opened for editing an existing item
  useEffect(() => {
    if (showSheet && isEdit) {
      setMode("view");
    }
    // If opening for 'Add', mode doesn't matter
  }, [showSheet, isEdit]);

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
    if (!isEdit) return "Add Habit Item";
    switch (mode) {
      case "view":
        return `Details for ${description}`;
      case "edit":
        return "Edit Habit Item";
      default:
        return "";
    }
  };

  return (
    <Drawer open={showSheet} onOpenChange={setShowSheet}>
      <DrawerContent className="max-h-[90vh]">
        {" "}
        <DrawerHeader className="text-left">
          <DrawerTitle>{getDrawerTitle(initialData?.name || "")}</DrawerTitle>
        </DrawerHeader>
        {/* Scrollable content area */}
        <ScrollArea className="overflow-y-auto px-4">
          {" "}
          {/* Add padding here */}
          <div className="py-4">
            {" "}
            {/* Inner padding */}
            {/* --- Mode 1: Add New Habit Item --- */}
            {!isEdit && (
              <HabitForm
                setShowSheet={setShowSheet}
                initialData={null} // Add mode
                onSubmit={async (data) => {
                  await onSubmit(data, initialData?.id);
                }}
              />
            )}
            {/* --- Mode 2: View Existing Habit Item Details --- */}
            {isEdit && mode === "view" && initialData && (
              <div className="space-y-6">
                {/* Display basic info (customize as needed) 
                <div>
                  <h3 className="font-semibold mb-1">Description</h3>
                  <p className="text-gray-700">{initialData.description}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Amount</h3>
                  <p className="text-gray-700">{initialData.amount}€</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Due Day</h3>
                  <p className="text-gray-700">{initialData.dueDate}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Account</h3>
                  <p className="text-gray-700 capitalize">
                    {initialData.account}
                  </p>
                </div>*/}
                {/* --- Habit History Placeholder --- */}
                <div className="">
                  <h3 className="font-semibold mb-2 text-lg border-b pb-1">
                    Habit History
                  </h3>
                  <div className="space-y-2 text-sm">
                    {/* {habitHistory.length > 0 ? (
                      habitHistory.map((habit) => (
                        <div
                          key={habit.id}
                          className="flex justify-between items-center p-2 rounded bg-gray-50"
                        >
                          <span>
                            {habit.date
                              ? habit.date.toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                })
                              : "No Date"}
                          </span>
                          <span className="font-medium">{habit.amount}€</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-4">
                        No recent habit history found.
                      </p>
                    )} */}
                    <p className="text-center text-gray-500 py-4">
                      No recent habit history found.
                    </p>
                  </div>
                </div>

                {/* --- Action Buttons --- */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    onClick={() => setMode("edit")}
                    variant="outline"
                    className="flex-1"
                  >
                    Edit Details
                  </Button>

                  <Button
                    variant="destructive" // Use destructive variant
                    onClick={handleDelete}
                    className="w-full" // Make it full width
                  >
                    Delete Habit
                  </Button>
                </div>

                {/* --- Delete Button --- */}
                <div className=""></div>
              </div>
            )}
            {/* --- Mode 3: Edit Existing Habit Item --- */}
            {isEdit && mode === "edit" && (
              <HabitForm
                setShowSheet={setShowSheet}
                initialData={initialData}
                onSubmit={async (data) => {
                  if (initialData?.id) {
                    await onSubmit(data, initialData?.id);
                  }
                }}
              />

              // Optionally add a "Cancel Edit" button here or rely on drawer close
            )}
            {/* --- Mode 4: Pay Existing Habit Item (Show Transaction Form) --- */}
          </div>
        </ScrollArea>
        {/* Footer can be used for general actions like Close, or removed if actions are inline */}
        {/* Example: Add a close button if needed, especially for edit/pay modes */}
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
export default HabitsDrawer;
