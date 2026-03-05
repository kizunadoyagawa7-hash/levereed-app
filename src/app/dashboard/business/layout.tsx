import BusinessDashboardGuard from "./BusinessDashboardGuard";

export default function DashboardBusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BusinessDashboardGuard>{children}</BusinessDashboardGuard>;
}
