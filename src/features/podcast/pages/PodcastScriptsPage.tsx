import Sidebar from "../../dashboard/components/Sidebar";
import PodcastScriptsContent from "../components/PodcastScriptsContent";

export default function PodcastScriptsPage() {
  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar />
      <PodcastScriptsContent />
    </div>
  );
}
