"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bell, Moon, Smartphone } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";

export default function SettingsPage() {
  return (
    <div className="space-y-6 pb-20 md:pb-4">
      <PageHeader
        title="Settings"
        description="Manage your app preferences and notifications."
      />

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5" /> Appearance
          </CardTitle>
          <CardDescription>
            Customize how the app looks on your device.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
              <span>Dark Mode</span>
              <span className="text-xs font-normal text-gray-500">
                Switch between light and dark themes.
              </span>
            </Label>
            <Switch id="dark-mode" />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" /> Notifications
          </CardTitle>
          <CardDescription>
            Configure how you want to be notified.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="daily-reminders" className="flex flex-col space-y-1">
              <span>Daily Reminders</span>
              <span className="text-xs font-normal text-gray-500">
                Receive a push notification to log your habits.
              </span>
            </Label>
            <Switch id="daily-reminders" defaultChecked />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="weekly-summary" className="flex flex-col space-y-1">
              <span>Weekly Summary</span>
              <span className="text-xs font-normal text-gray-500">
                Get a weekly email report of your progress.
              </span>
            </Label>
            <Switch id="weekly-summary" />
          </div>
        </CardContent>
      </Card>

      {/* App Info */}
       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" /> About
          </CardTitle>
          <CardDescription>
            App information and support.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
           <div className="flex justify-between py-2 border-b">
               <span className="text-gray-500">Version</span>
               <span className="font-medium">1.0.0</span>
           </div>
           <div className="flex justify-between py-2 border-b">
               <span className="text-gray-500">Support</span>
               <Link href="/contact" className="text-blue-600 hover:underline">Contact Us</Link>
           </div>
           <div className="flex justify-between py-2">
               <span className="text-gray-500">Legal</span>
               <Link href="/terms" className="text-blue-600 hover:underline">Terms & Privacy</Link>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
