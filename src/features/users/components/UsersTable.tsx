import { Mail, Edit, ChevronLeft, ChevronRight } from "lucide-react";
import { useUsers } from "../hook/useUsers";

export default function UsersTable() {
  const {
    users = [],
    isLoading,
    error,
    page,
    totalPages,
    setPage,
  } = useUsers();

  if (isLoading) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden p-6">
        <div className="text-center text-slate-400">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden p-6">
        <div className="text-center text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-700">
        <h2 className="text-white font-semibold text-lg">User Accounts</h2>
      </div>
      <table className="w-full">
        <thead>
          <tr className="bg-slate-700 border-b border-slate-600">
            <th className="px-6 py-4 text-left text-slate-300 font-semibold text-sm">
              Name
            </th>
            <th className="px-6 py-4 text-left text-slate-300 font-semibold text-sm">
              Email
            </th>
            <th className="px-6 py-4 text-left text-slate-300 font-semibold text-sm">
              Role
            </th>
            <th className="px-6 py-4 text-left text-slate-300 font-semibold text-sm">
              Status
            </th>
            <th className="px-6 py-4 text-left text-slate-300 font-semibold text-sm">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-slate-400">
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-slate-700 hover:bg-slate-700 transition-colors"
              >
                <td className="px-6 py-4 text-white font-semibold text-sm">
                  {user.name}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-slate-300 text-sm">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded text-sm font-semibold ${
                      user.role.toUpperCase() === "ADMIN"
                        ? "bg-blue-900 text-blue-300"
                        : "bg-slate-700 text-slate-300"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-green-900 text-green-300 px-3 py-1 rounded text-sm font-semibold">
                    {user.status || "Active"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-400 hover:text-blue-300 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-slate-700 flex items-center justify-between bg-slate-700">
        <div className="text-slate-300 text-sm">
          Page {page + 1} of {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="p-2 hover:bg-slate-600 rounded disabled:opacity-50 disabled:cursor-not-allowed text-slate-300"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
            className="p-2 hover:bg-slate-600 rounded disabled:opacity-50 disabled:cursor-not-allowed text-slate-300"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
