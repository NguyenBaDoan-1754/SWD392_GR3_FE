import { motion } from "motion/react";
import HeroBanner from "../components/HeroBanner";
import TrendingStocks from "../components/TrendingStocks";
import StockListSidebar from "../components/StockListSidebar";
import LatestArticles from "../components/LatestArticles";
import MainLayout from "../../../components/layout/MainLayout";

export default function HomePage() {
  return (
    <MainLayout>
      <div className="flex h-full bg-slate-950">
        {/* Main Content (Banner + Trending) */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto pb-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <HeroBanner />
            </motion.div>
            
            <TrendingStocks />
            
            <LatestArticles />
          </div>
        </div>

        {/* Right Sidebar (Stock List) */}
        <div className="hidden xl:block w-96 flex-shrink-0 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/10 to-transparent pointer-events-none z-10"></div>
          <StockListSidebar />
        </div>
      </div>
    </MainLayout>
  );
}
