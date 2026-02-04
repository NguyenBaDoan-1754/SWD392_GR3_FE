import Sidebar from "../../dashboard/components/Sidebar";
import ArticlesContent from "../components/ArticlesContent";

export default function ArticlesPage() {
  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar />
      <ArticlesContent />
    </div>
  );
}
