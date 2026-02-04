import Sidebar from "../../dashboard/components/Sidebar";
import StockManagementContent from "../components/StockManagementContent";

export default function StockManagementPage() {
  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar />
      <StockManagementContent />
    </div>
  );
}
