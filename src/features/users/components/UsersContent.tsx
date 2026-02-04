import { Plus } from "lucide-react";
import UserStatsCard from "./UserStatsCard";
import UsersTable from "./UsersTable";
import { useUsers } from "../hook/useUsers";

export default function UsersContent() {
  const { totalElements, users = [] } = useUsers();

  const adminCount = (users || []).filter(
    (u) => u.role.toUpperCase() === "ADMIN",
  ).length;

  const stats = [
    {
      title: "Total Users",
      value: totalElements.toString(),
    },
    {
      title: "Active Users",
      value: (users || []).length.toString(),
    },
    {
      title: "Admin Users",
      value: adminCount.toString(),
    },
  ];

  return (
    <main className="flex-1 overflow-auto">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-3xl font-bold">Users</h1>
            <p className="text-slate-400 mt-1">
              Manage user accounts and permissions
            </p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium">
            <Plus className="w-5 h-5" />
            Add User
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <UserStatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Users Table */}
        <UsersTable />
      </div>
    </main>
  );
}
