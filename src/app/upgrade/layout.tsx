import UpgradeGuard from "./UpgradeGuard";

export default function UpgradeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UpgradeGuard>{children}</UpgradeGuard>;
}
