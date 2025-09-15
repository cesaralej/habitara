interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function layout({ children }: DashboardLayoutProps) {
  return <div>{children}</div>;
}
