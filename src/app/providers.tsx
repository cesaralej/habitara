"use client";

import { AuthProvider } from "@/contexts/auth";

const TransactionProviderWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default TransactionProviderWrapper;
