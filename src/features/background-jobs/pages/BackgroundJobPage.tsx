import Sidebar from "../../dashboard-admin/components/Sidebar";
import JobManagementPanel from "../components/JobManagementPanel";

export default function BackgroundJobPage() {
  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {/* Content */}
        <div className="p-8">
          <div className="max-w-7xl">
            <JobManagementPanel />
          </div>
        </div>
      </main>
    </div>
  );
}
