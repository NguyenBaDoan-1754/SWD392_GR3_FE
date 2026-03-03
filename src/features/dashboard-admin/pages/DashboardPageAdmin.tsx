import Sidebar from "../components/Sidebar";
import MainContent from "../components/MainContent";

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar />
      <MainContent />
    </div>
  );
}
