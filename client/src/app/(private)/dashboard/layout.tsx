import { ProtectedLayout } from "@/components/dashboard/protected-layout";
import DashboardLayout from "@/components/dashboard/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedLayout>
      <DashboardLayout>
        <main className="flex-1 overflow-x-hidden bg-white overflow-y-auto p-6 m-3 rounded-md border border-gray-200/80 shadow-sm">
          {children}
        </main>
      </DashboardLayout>
    </ProtectedLayout>
  );
}
