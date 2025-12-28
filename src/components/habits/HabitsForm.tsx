"use client";

import { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormLabel,
  FormMessage,
  FormControl,
  FormItem,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { HABIT_FREQUENCIES, Habit } from "@/types";

const habitSchema = z.object({
  name: z
    .string()
    .min(3, { message: "The habit name must be at least 3 characters long." })
    .max(50, { message: "The habit name cannot exceed 50 characters." })
    .trim(),
  frequency: z.enum(HABIT_FREQUENCIES, {
    message: "You must select how often you plan to do this habit.",
  }),
  goal: z.enum(["achieve", "avoid"], {
    message: "You must select a goal type.",
  }),
  emoji: z.string().max(4).optional(),
  details: z
    .string()
    .max(500, {
      message: "The details section cannot exceed 500 characters.",
    })
    .trim()
    .optional(),
  active: z.boolean(),
  askDetails: z.boolean(),
});

export type HabitFormValues = z.infer<typeof habitSchema>;

interface HabitFormProps {
  setShowSheet: (show: boolean) => void;
  initialData?: Partial<Habit> | null;
  onSubmit: (habit: HabitFormValues, habitId?: string) => Promise<void>;
}

export default function HabitForm({
  setShowSheet,
  initialData = null,
  onSubmit,
}: HabitFormProps) {
  const isEdit = Boolean(initialData?.id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<HabitFormValues>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      emoji: initialData?.emoji ?? "",
      frequency: initialData?.frequency ?? "daily",
      goal: initialData?.goal ?? "achieve",
      details: initialData?.details ?? "",
      active: initialData?.active ?? true,
      askDetails: initialData?.askDetails ?? (isEdit ? true : false),
    },
  });

  const handleSubmit = async (values: HabitFormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(values, initialData?.id);
      setShowSheet(false);
    } catch (err) {
      console.error("Error submitting habit:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 p-4 md:p-6"
      >
        <div className="flex gap-4">
          {/* Emoji Field */}
          <FormField
            control={form.control}
            name="emoji"
            render={({ field }) => (
              <FormItem className="w-20 flex-shrink-0">
                <FormLabel>Icon</FormLabel>
                <FormControl>
                  <Input
                    placeholder="📝"
                    className="text-center text-lg"
                    maxLength={2}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Habit Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Habit Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Read for 30 minutes"
                    aria-label="Habit Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Goal Type Field */}
        <FormField
          control={form.control}
          name="goal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Goal</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select goal type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="achieve">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span>Build a habit (Achieve)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="avoid">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                      <span>Break a habit (Avoid)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription className="text-xs">
                {field.value === "avoid" 
                  ? "Checking this habit effectively resets your streak. The goal is to maximize days WITHOUT checking it."
                  : "Checking this habit builds your streak. The goal is to check it consistently."}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Frequency Field (Button Group) */}
        <FormField
          control={form.control}
          name="frequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Frequency</FormLabel>
              <FormControl>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => field.onChange("daily")}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                      field.value === "daily"
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <svg
                      className={`w-6 h-6 mb-2 ${
                        field.value === "daily" ? "text-primary" : "text-gray-500"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    <span className={`text-sm font-medium ${
                      field.value === "daily" ? "text-primary" : "text-gray-700"
                    }`}>
                      Daily
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => field.onChange("weekly")}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                      field.value === "weekly"
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <svg
                      className={`w-6 h-6 mb-2 ${
                        field.value === "weekly" ? "text-primary" : "text-gray-500"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className={`text-sm font-medium ${
                      field.value === "weekly" ? "text-primary" : "text-gray-700"
                    }`}>
                      Weekly
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => field.onChange("monthly")}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                      field.value === "monthly"
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <svg
                      className={`w-6 h-6 mb-2 ${
                        field.value === "monthly" ? "text-primary" : "text-gray-500"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <span className={`text-sm font-medium ${
                      field.value === "monthly" ? "text-primary" : "text-gray-700"
                    }`}>
                      Monthly
                    </span>
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Details Field (Textarea) */}
        <FormField
          control={form.control}
          name="details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Details (Optional)</FormLabel>
              <FormControl>
                {/* Use a spread to handle the optionality of the field for Textarea */}
                <Textarea
                  placeholder="The 'why' or 'how' for this habit, e.g., 'to reduce stress before bed'."
                  aria-label="Habit Details"
                  rows={4}
                  {...field}
                  // react-hook-form gives undefined for optional empty fields, but Textarea expects string
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Ask for details Switch */}
        <FormField
          control={form.control}
          name="askDetails"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Ask for details?</FormLabel>
                <FormDescription>
                  If enabled, you'll be prompted to add details when completing this habit.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {isEdit && (
          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Habit Status</FormLabel>
                  <FormDescription>
                    Deactivate this habit if you no longer want to track it.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value ?? true}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting
            ? isEdit
              ? "Updating Habit..."
              : "Saving Habit..."
            : isEdit
            ? "Update Habit"
            : "Create Habit"}
        </Button>
      </form>
    </Form>
  );
}
