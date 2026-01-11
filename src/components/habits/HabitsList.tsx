"use client";
import React, { FC, useState } from "react";
import { useHabits } from "@/contexts/HabitsContext";
import { Habit } from "@/types";
import { HabitCard } from "./HabitCard";
import { Button } from "@/components/ui/button";
import { PlusCircle, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Sortable Item Wrapper
interface SortableHabitItemProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
}

const SortableHabitItem: FC<SortableHabitItemProps> = ({ habit, onEdit }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: habit.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2">
      <div {...attributes} {...listeners} className="cursor-grab hover:text-gray-600 text-gray-400 p-1">
        <GripVertical className="h-4 w-4" />
      </div>
      <div className="flex-1">
          <HabitCard habit={habit} onEdit={onEdit} />
      </div>
    </div>
  );
};

interface HabitListProps {
  onEdit: (habit: Habit) => void;
}

const HabitList: FC<HabitListProps> = ({ onEdit }) => {
  const { habits, updateHabit, deleteHabit, reorderHabits } = useHabits();
  const [showArchived, setShowArchived] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  // Helper to handle drag end (generic for any list)
  const handleDragEnd = (event: DragEndEvent, items: Habit[]) => {
      const { active, over } = event;
      
      if (active.id !== over?.id) {
          const oldIndex = items.findIndex(item => item.id === active.id);
          const newIndex = items.findIndex(item => item.id === over?.id);
          
          if (oldIndex !== -1 && newIndex !== -1) {
              const newItems = arrayMove(items, oldIndex, newIndex);
              
              // Recalculate 'order' based on new index
              // We need to be careful: are we reordering globally or locally?
              // The 'items' passed in here are just the subset (e.g. daily habits).
              // So we should re-assign orders for this SUBSET.
              // BUT, global order might need to be preserved relative to other groups?
              // Actually, we can just assign arbitrary increasing numbers.
              // If we only reorder the daily habits, their relative order changes.
              // We should probably update the order of ALL habits to ensure global consistency?
              // Or just update the ones in this list?
              // Let's update just this list.
              // To avoid collisions with other lists (weekly/monthly), we could use spacing logic 
              // or just not worry about cross-list sorting since we separate by frequency.
              // Wait, if I sort "Daily" list, and give them orders 0, 1, 2...
              // And "Weekly" list has orders 0, 1, 2...
              // Then when I sort GLOBAL list by order, they weave together.
              // This is BAD for the dashboard if the dashboard sorts by order purely.
              // Dashboard should ALSO group by frequency?
              // YES, Dashboard groups by frequency.
              // So, order only matters WITHIN the frequency group.
              // So it is safe to just re-index this group from 0 to N.
              
              const updatedHabits = newItems.map((h, index) => ({
                  ...h,
                  order: index // simple 0-based index for this group
              }));
              
              // We need to call reorderHabits, but passing the whole list?
              // reorderHabits takes Habit[]. Logic:
              // It batch updates.
              // We can pass just the modified subset.
              reorderHabits(updatedHabits);
          }
      }
  };

  const dailyHabits = activeHabits.filter(h => h.frequency === 'daily');
  const weeklyHabits = activeHabits.filter(h => h.frequency === 'weekly');
  const monthlyHabits = activeHabits.filter(h => h.frequency === 'monthly');

  return (
    <div className="space-y-8 pb-24">
      {/* Active Habits - Grouped by Frequency */}
      {activeHabits.length > 0 ? (
        <div className="space-y-6">
          {/* Daily Habits */}
          {dailyHabits.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Daily</h3>
              <DndContext 
                sensors={sensors} 
                collisionDetection={closestCenter} 
                onDragEnd={(e) => handleDragEnd(e, dailyHabits)}
              >
                  <SortableContext 
                    items={dailyHabits.map(h => h.id)}
                    strategy={verticalListSortingStrategy}
                  >
                        <div className="space-y-2">
                            {dailyHabits.map((habit) => (
                                <SortableHabitItem
                                    key={habit.id}
                                    habit={habit}
                                    onEdit={onEdit}
                                />
                            ))}
                        </div>
                  </SortableContext>
              </DndContext>
            </div>
          )}

          {/* Weekly Habits */}
          {weeklyHabits.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Weekly</h3>
              <DndContext 
                sensors={sensors} 
                collisionDetection={closestCenter} 
                onDragEnd={(e) => handleDragEnd(e, weeklyHabits)}
              >
                  <SortableContext 
                    items={weeklyHabits.map(h => h.id)}
                    strategy={verticalListSortingStrategy}
                  >
                        <div className="space-y-2">
                            {weeklyHabits.map((habit) => (
                                <SortableHabitItem
                                    key={habit.id}
                                    habit={habit}
                                    onEdit={onEdit}
                                />
                            ))}
                        </div>
                  </SortableContext>
              </DndContext>
            </div>
          )}

          {/* Monthly Habits */}
          {monthlyHabits.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Monthly</h3>
              <DndContext 
                sensors={sensors} 
                collisionDetection={closestCenter} 
                onDragEnd={(e) => handleDragEnd(e, monthlyHabits)}
              >
                  <SortableContext 
                    items={monthlyHabits.map(h => h.id)}
                    strategy={verticalListSortingStrategy}
                  >
                        <div className="space-y-2">
                            {monthlyHabits.map((habit) => (
                                <SortableHabitItem
                                    key={habit.id}
                                    habit={habit}
                                    onEdit={onEdit}
                                />
                            ))}
                        </div>
                  </SortableContext>
              </DndContext>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-4">No active habits.</p>
      )}

      {/* Archived Habits Section - No DnD for now */}
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
