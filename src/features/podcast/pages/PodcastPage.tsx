import MainLayout from "../../../components/layout/MainLayout";
import { useAuth } from "../../auth/hook/useAuth";
import AdminSidebar from "../../dashboard-admin/components/Sidebar";
import { useUserProfile } from "../../dashboard-admin/hook/useUserProfile";
import PodcastLibraryContent from "../components/PodcastLibraryContent";

function hasAdminRole(role?: string | null) {
  return role?.toUpperCase() === "ADMIN";
}

export default function PodcastPage() {
  const { userProfile } = useUserProfile();
  const { user } = useAuth();

  const tokenRoles = Array.isArray(user?.roles)
    ? user.roles
    : user?.role
      ? [user.role]
      : [];

  const isAdmin =
    hasAdminRole(userProfile?.role) ||
    tokenRoles.some((role) => hasAdminRole(role));

  if (isAdmin) {
    return (
      <div className="flex h-screen bg-slate-950">
        <AdminSidebar />
        <main className="min-w-0 flex-1 overflow-y-auto">
          <PodcastLibraryContent audience="admin" />
        </main>
      </div>
    );
  }

  return (
    <MainLayout>
      <PodcastLibraryContent audience="user" />
    </MainLayout>
  );
}
