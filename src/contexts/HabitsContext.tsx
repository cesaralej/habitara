"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  setDoc,
  doc,
  FirestoreError,
} from "firebase/firestore";
import { format, startOfWeek, startOfMonth } from "date-fns";
import { db } from "../lib/firebase";
import { useAuth } from "@/contexts/auth";
import { Habit, HabitData, HabitCompletion } from "@/types";

export interface HabitsContextType {
  habits: Habit[] | null;
  completions: Record<string, HabitCompletion>; 
  loading: boolean;
  error: FirestoreError | null;
  addHabit: (habitData: HabitData) => Promise<void>;
  updateHabit: (
    habitId: string,
    updatedHabitData: Partial<HabitData>
  ) => Promise<void>;
  deleteHabit: (habitId: string) => Promise<void>;
  totalActiveHabits: number;
  toggleHabitCompletion: (
    habitId: string,
    date: string,
    isCompleted: boolean
  ) => Promise<void>;
  updateHabitCompletionDetails: (
    habitId: string,
    date: string,
    details: string
  ) => Promise<void>;
}

const HabitsContext = createContext<HabitsContextType | null>(null);

export const HabitsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isLoading } = useAuth();
  const [habits, setHabits] = useState<Habit[] | null>(null);
  const [completions, setCompletions] = useState<Record<string, HabitCompletion>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (isLoading || !user) {
      setLoading(false);
      setHabits(null);
      setCompletions({});
      return;
    }

    // Reset loading state and local trackers when fetching begins for a user
    setLoading(true);

    // Track initial load state
    let habitsLoaded = false;
    let completionsLoaded = false;

    const checkLoading = () => {
      if (habitsLoaded && completionsLoaded) {
        setLoading(false);
      }
    };

    // 1. Fetch Habits
    const habitsCollectionRef = collection(db, "users", user.uid, "habits");
    const qHabits = query(habitsCollectionRef);

    const unsubscribeHabits = onSnapshot(
      qHabits,
      (snapshot) => {
        const habitsData: Habit[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            emoji: data.emoji,
            frequency: data.frequency ?? data.type,
            goal: data.goal ?? "achieve",
            active: data.active ?? true,
            details: data.details,
            askDetails: data.askDetails,
            createdAt: data.createdAt ?? Date.now(),
          };
        });

        // Optional: sort by creation date
        const sortedHabits = habitsData.sort(
          (a, b) => a.createdAt - b.createdAt
        );

        setHabits(sortedHabits);
        habitsLoaded = true;
        checkLoading();
      },
      (err) => {
        console.error("Error fetching habits:", err);
        setError(err);
        habitsLoaded = true; // Still mark as loaded to avoid stuck spinner
        checkLoading();
      }
    );

    // 2. Fetch Completions (All of them)
    // Optimization: In a real large app, you might only fetch recents, 
    // but for streak calc we pretty much need history or a stored 'streak' field.
    // Fetching all for now is fine for MVP.
    const completionsCollectionRef = collection(db, "users", user.uid, "completions");
    const qCompletions = query(completionsCollectionRef);

    const unsubscribeCompletions = onSnapshot(
      qCompletions,
      (snapshot) => {
        const completionsMap: Record<string, HabitCompletion> = {};
        snapshot.docs.forEach((doc) => {
            // ID format: habitId_date (usually)
            const data = doc.data();
            completionsMap[doc.id] = {
                id: doc.id,
                habitId: data.habitId,
                date: data.date,
                completed: data.completed,
                frequency: data.frequency,
                completedAt: data.completedAt,
                details: data.details
            };
        });
        setCompletions(completionsMap);
        completionsLoaded = true;
        checkLoading();
      },
      (err) => {
         console.error("Error fetching completions:", err);
         setError(err);
         completionsLoaded = true; // Still mark as loaded
         checkLoading();
      }
    );

    return () => {
        unsubscribeHabits();
        unsubscribeCompletions();
    };
  }, [user, isLoading]);

  
  // Re-writing the subscription correctly in next steps or assuming I will add `where`.
  // Let's stick to the plan:
  // Add `toggleHabitCompletion` implementation.

  const addHabit = async (habitData: HabitData) => {
    if (!user) {
      console.error("User not logged in. Cannot add habit.");
      return;
    }

    const newHabit = {
      ...habitData,
      active: habitData.active ?? true,
      createdAt: Date.now(),
    };

    try {
      await addDoc(collection(db, "users", user.uid, "habits"), newHabit);
      console.log("Habit added successfully");
    } catch (err) {
      console.error("Error adding habit:", err);
    }
  };

  const updateHabit = async (
    habitId: string,
    updatedHabitData: Partial<HabitData>
  ) => {
    if (!user) {
      console.error("User not logged in. Cannot update habit.");
      return;
    }

    try {
      const habitDocRef = doc(db, "users", user.uid, "habits", habitId);
      await updateDoc(habitDocRef, updatedHabitData);
      console.log("Habit updated successfully");
    } catch (err) {
      console.error("Error updating habit:", err);
    }
  };

  const deleteHabit = async (habitId: string) => {
    if (!user) {
      console.error("User not logged in. Cannot delete habit.");
      return;
    }

    try {
      const habitDocRef = doc(db, "users", user.uid, "habits", habitId);
      await deleteDoc(habitDocRef);
      console.log("Habit deleted successfully");
    } catch (err) {
      console.error("Error deleting habit:", err);
    }
  };

  const toggleHabitCompletion = async (
    habitId: string,
    date: string,
    isCompleted: boolean
  ) => {
    if (!user || !habits) return;

    // Find the habit (validation only)
    const habit = habits.find(h => h.id === habitId);
    if (!habit) {
        console.error("Habit not found");
        return;
    }

    // Always use the specific date provided (daily granularity)
    const completionDateKey = date;
    
    // Key format: habitId_dateKey
    const completionId = `${habitId}_${completionDateKey}`;
    const completionRef = doc(db, "users", user.uid, "completions", completionId);

    try {
      if (isCompleted) {
        // Create/Set
        const completionData: HabitCompletion = {
          id: completionId,
          habitId,
          date: completionDateKey,
          completed: true,
          frequency: habit.frequency,
          completedAt: Date.now(),
        };
        await setDoc(completionRef, completionData);
      } else {
        // Delete
        await deleteDoc(completionRef);
      }
    } catch (err) {
      console.error("Error toggling completion:", err);
    }
  };

  const updateHabitCompletionDetails = async (
    habitId: string,
    date: string,
    details: string
  ) => {
    if (!user || !habits) return;

    // Always use the specific date provided
    const completionDateKey = date;
    
    const completionId = `${habitId}_${completionDateKey}`;
    const completionRef = doc(db, "users", user.uid, "completions", completionId);

    try {
        await updateDoc(completionRef, {
            details: details
        });
    } catch (err) {
        console.error("Error updating completion details:", err);
    }
  };

  const totalActiveHabits = (habits ?? []).filter((h) => h.active).length;

  return (
    <HabitsContext.Provider
      value={{
        habits,
        completions,
        loading,
        error,
        addHabit,
        updateHabit,
        deleteHabit,
        totalActiveHabits,
        toggleHabitCompletion,
        updateHabitCompletionDetails,
      }}
    >
      {children}
    </HabitsContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitsContext);
  if (!context) {
    throw new Error("useHabits must be used within a HabitsProvider");
  }
  return context;
};
