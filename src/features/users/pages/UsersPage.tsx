import Sidebar from "../../dashboard/components/Sidebar";
import UsersContent from "../components/UsersContent";

export default function UsersPage() {
  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar />
      <UsersContent />
    </div>
  );
}
