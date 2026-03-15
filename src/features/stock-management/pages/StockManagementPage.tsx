import StockManagementContent from "../components/StockManagementContent";
import Sidebar from "../../dashboard-admin/components/Sidebar";

export default function StockManagementPage() {
  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar />
      <StockManagementContent />
    </div>
  );
}
