import ArticlesContent from "../components/ArticlesContent";
import Sidebar from "../../dashboard-admin/components/Sidebar";

export default function ArticlesPage() {
  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar />
      <ArticlesContent />
    </div>
  );
}
