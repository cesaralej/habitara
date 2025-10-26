"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  FirestoreError,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { Habit, HabitData } from "@/types";

export interface HabitsContextType {
  habits: Habit[] | null;
  loading: boolean;
  error: FirestoreError | null;
  addHabit: (habitData: HabitData) => Promise<void>;
  updateHabit: (
    habitId: string,
    updatedHabitData: Partial<HabitData>
  ) => Promise<void>;
  deleteHabit: (habitId: string) => Promise<void>;
  totalActiveHabits: number;
}

const HabitsContext = createContext<HabitsContextType | null>(null);

export const HabitsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isLoading } = useFirebaseAuth();
  const [habits, setHabits] = useState<Habit[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (isLoading || !user) {
      setLoading(false);
      setHabits(null);
      return;
    }

    const habitsCollectionRef = collection(db, "users", user.uid, "habits");
    const q = query(habitsCollectionRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const habitsData: Habit[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            frequency: data.type,
            active: data.active ?? true,
            details: data.details,
            createdAt: data.createdAt ?? Date.now(),
          };
        });

        // Optional: sort by creation date
        const sortedHabits = habitsData.sort(
          (a, b) => a.createdAt - b.createdAt
        );

        setHabits(sortedHabits);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, isLoading]);

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

  const totalActiveHabits = (habits ?? []).filter((h) => h.active).length;

  return (
    <HabitsContext.Provider
      value={{
        habits,
        loading,
        error,
        addHabit,
        updateHabit,
        deleteHabit,
        totalActiveHabits,
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
