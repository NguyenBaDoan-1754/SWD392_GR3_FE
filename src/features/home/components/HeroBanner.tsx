import { motion } from "motion/react";

export default function HeroBanner() {
  return (
    <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-2xl group">
      {/* Background Image/Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-black overflow-hidden">
        <div className="absolute inset-0 opacity-50 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-700 via-transparent to-transparent"></div>
        <img 
          src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop" 
          alt="Stock Market Data"
          className="w-full h-full object-cover opacity-40 mix-blend-overlay group-hover:scale-105 transition-transform duration-1000 ease-out"
        />
      </div>

      {/* Content wrapper */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-slate-950/90 via-slate-900/50 to-transparent">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/50 backdrop-blur-md mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span className="text-blue-300 text-xs font-semibold tracking-wider uppercase">Breaking News</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
            Thị trường chứng khoán<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Đang phục hồi mạnh mẽ</span>
          </h1>
          
          <p className="text-slate-300 max-w-2xl text-lg mb-6 line-clamp-2">
            Theo các chuyên gia tài chính hàng đầu, các chỉ số chứng khoán chính đang có dấu hiệu bứt phá trong tuần này nhờ dữ liệu việc làm tích cực. Mức tăng trưởng trung bình đạt 2.5% trên toàn ngành công nghệ.
          </p>
          
          <div className="flex gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
            >
              Đọc tiếp
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 bg-slate-800/80 hover:bg-slate-700 backdrop-blur-md text-white border border-slate-700 font-medium rounded-lg transition-all"
            >
              Lưu bài báo
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
