"use client";

import { AuthProvider } from "@/contexts/auth";
import { HabitsProvider } from "@/contexts/HabitsContext";

const TransactionProviderWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <AuthProvider>
      <HabitsProvider>{children}</HabitsProvider>
    </AuthProvider>
  );
};

export default TransactionProviderWrapper;
