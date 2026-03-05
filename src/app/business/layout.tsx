import BusinessGuard from "./BusinessGuard";

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BusinessGuard>{children}</BusinessGuard>;
}
