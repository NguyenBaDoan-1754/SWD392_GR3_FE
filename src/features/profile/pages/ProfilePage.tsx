import { useState, useEffect } from "react";
import { useUserProfile } from "../../dashboard-admin/hook/useUserProfile";
import MainLayout from "../../../components/layout/MainLayout";
import { User, Mail, Save, AlertCircle, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ProfilePage() {
  const { userProfile, isLoading, error, updateProfile } = useUserProfile();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name);
      setEmail(userProfile.email);
    }
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Tên không được để trống");
      return;
    }

    try {
      setIsUpdating(true);
      await updateProfile({ name });
      toast.success("Cập nhật thông tin thành công!");
    } catch (err) {
      toast.error("Cập nhật thất bại, vui lòng thử lại sau");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading && !userProfile) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Quay lại
            </button>
            <h1 className="text-3xl font-bold text-white tracking-tight">Hồ sơ cá nhân</h1>
            <p className="text-slate-400 mt-2 text-base">Quản lý và cập nhật thông tin tài khoản của bạn</p>
          </div>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-start gap-3 mb-8">
            <AlertCircle className="w-5 h-5 text-rose-400 mt-0.5" />
            <p className="text-rose-400 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Avatar & Summary */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors"></div>
              
              <div className="relative mx-auto w-24 h-24 mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center ring-4 ring-indigo-500/20">
                  <span className="text-white text-3xl font-bold">
                    {userProfile?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-slate-900 border-2 border-slate-950 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
              </div>

              <h2 className="text-xl font-bold text-white mb-1">{userProfile?.name}</h2>
              <p className="text-slate-500 text-sm mb-4">{userProfile?.email}</p>
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-400">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                {userProfile?.role === "ADMIN" ? "Quản trị viên" : "Thành viên"}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Edit Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-400" />
                Thông tin cá nhân nội dung
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-slate-400 ml-1">
                    Họ và tên
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nhập họ và tên"
                      className="w-full bg-slate-800 border border-slate-700/60 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-400 ml-1">
                    Địa chỉ Email
                  </label>
                  <div className="relative group opacity-60 cursor-not-allowed">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      disabled
                      placeholder="Email"
                      className="w-full bg-slate-800 border border-slate-700/60 rounded-2xl pl-12 pr-4 py-3.5 text-white cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-slate-500 ml-1 italic">Email không thể thay đổi vì lý do bảo mật</p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 mt-8 flex justify-end">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Lưu thay đổi
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}
