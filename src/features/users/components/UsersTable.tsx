import { Mail, Edit } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "User";
  podcastsCreated: number;
  status: "Active" | "Inactive";
}

const users: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
    podcastsCreated: 2,
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "User",
    podcastsCreated: 1,
    status: "Active",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    role: "User",
    podcastsCreated: 0,
    status: "Active",
  },
];

export default function UsersTable() {
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
              Podcasts Created
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
          {users.map((user) => (
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
                    user.role === "Admin"
                      ? "bg-blue-900 text-blue-300"
                      : "bg-slate-700 text-slate-300"
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 text-white text-sm">
                {user.podcastsCreated}
              </td>
              <td className="px-6 py-4">
                <span className="bg-green-900 text-green-300 px-3 py-1 rounded text-sm font-semibold">
                  {user.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <button className="flex items-center gap-2 text-slate-300 hover:text-white px-3 py-2 rounded transition-colors font-medium text-sm">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
