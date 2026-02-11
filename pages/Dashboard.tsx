
import React from 'react';
import { store } from '../store';
import { 
  FileText, 
  Users, 
  BookOpen, 
  Clock, 
  ArrowUpRight,
  TrendingUp,
  Award,
  Calendar,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const collections = store.getKoleksi();
  const books = store.getBuku();
  const circulations = store.getPeminjaman();

  const stats = [
    { label: 'E-Resources', value: collections.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Buku Fisik', value: books.length, icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Circulation', value: circulations.filter(c => c.status === 'dipinjam').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Members', value: '1,240', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  const today = new Date().toLocaleDateString('id-ID', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="max-w-7xl mx-auto space-y-10 py-4 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Intelligence Dashboard</h2>
          <div className="flex items-center text-slate-400 mt-2 space-x-2 font-bold uppercase tracking-widest text-[10px]">
             <Calendar size={12} className="text-blue-500" />
             <span>{today}</span>
             <span className="text-slate-200">•</span>
             <span className="text-emerald-500 flex items-center"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1 animate-pulse"></span> Sistem Aktif</span>
          </div>
        </div>
        <div className="flex items-center space-x-4 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex -space-x-3">
             {[1,2,3,4].map(i => (
               <div key={i} className="w-9 h-9 rounded-full border-2 border-white bg-slate-200 overflow-hidden ring-1 ring-slate-100">
                 <img src={`https://i.pravatar.cc/100?u=law${i}`} alt="user" className="w-full h-full object-cover" />
               </div>
             ))}
          </div>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-tight">Petugas<br/>Online</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all group">
            <div className={`${stat.bg} ${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <p className="text-4xl font-black text-slate-800 tracking-tighter">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <h3 className="font-black text-xl flex items-center space-x-3">
                <TrendingUp size={24} className="text-blue-500" />
                <span className="uppercase tracking-tight">Koleksi Digital Terbaru</span>
              </h3>
              <button className="text-blue-600 text-xs font-black uppercase tracking-widest hover:text-blue-800 transition-colors bg-blue-50 px-5 py-2 rounded-xl">Lihat Semua</button>
            </div>
            <div className="divide-y divide-slate-50">
              {collections.slice(0, 4).map((item) => (
                <div key={item.id} className="p-6 hover:bg-slate-50 transition-all flex items-center justify-between group">
                  <div className="flex items-center space-x-5">
                    <div className="w-14 h-14 bg-white border border-slate-100 shadow-sm rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all">
                      <FileText size={28} />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-800 truncate max-w-xs md:max-w-md group-hover:text-blue-600 transition-colors">{item.judul}</h4>
                      <div className="flex items-center space-x-3 mt-1">
                        <p className="text-xs text-slate-400 font-bold">{item.penulis}</p>
                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                        <p className="text-xs text-blue-500 font-black uppercase tracking-widest">{item.jenis}</p>
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-slate-200 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="flex items-center space-x-6 relative z-10">
              <div className="bg-white/10 p-5 rounded-3xl border border-white/10 backdrop-blur-sm">
                <ShieldCheck size={36} className="text-emerald-400" />
              </div>
              <div>
                <h4 className="font-black text-2xl tracking-tight">Database JDIH Terintegrasi</h4>
                <p className="text-slate-400 text-sm font-medium mt-1">Sinkronisasi dokumen hukum nasional dilakukan secara real-time.</p>
              </div>
            </div>
            <button className="bg-white text-slate-900 px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all mt-6 md:mt-0 relative z-10 shadow-xl active:scale-95">
              CEK STATUS
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gradient-to-br from-blue-700 to-indigo-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group min-h-[400px] flex flex-col justify-between border border-white/10">
            <div className="absolute top-[-5%] right-[-5%] w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-1000"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center mb-8 border border-white/20 shadow-xl">
                <Sparkles size={32} className="text-amber-400 animate-pulse" />
              </div>
              <h3 className="font-black text-4xl mb-3 tracking-tighter leading-tight">AI Legal Assistant</h3>
              <p className="text-blue-100/70 text-base mb-10 font-medium leading-relaxed">
                Butuh bantuan mencari yurisprudensi atau ringkasan skripsi? Asisten hukum cerdas kami siap membantu 24/7.
              </p>
            </div>
            <button className="w-full bg-white text-blue-900 font-black py-5 rounded-[1.5rem] text-sm uppercase tracking-[0.2em] hover:bg-blue-50 transition-all transform hover:-translate-y-1 shadow-2xl active:scale-95 relative z-10">
              Mulai Konsultasi
            </button>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 space-y-8">
            <h3 className="font-black text-xs uppercase tracking-[0.3em] text-slate-400">Inventory Metrics</h3>
            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                   <span className="font-black text-slate-700 text-[10px] uppercase tracking-widest">Akurasi Stok</span>
                   <span className="font-black text-blue-600 text-sm">94.2%</span>
                </div>
                <div className="h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                  <div className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out" style={{ width: '94.2%' }}></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                   <span className="font-black text-slate-700 text-[10px] uppercase tracking-widest">Pengembalian Tepat</span>
                   <span className="font-black text-emerald-600 text-sm">88.5%</span>
                </div>
                <div className="h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out" style={{ width: '88.5%' }}></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                   <span className="font-black text-slate-700 text-[10px] uppercase tracking-widest">Kapasitas Rak</span>
                   <span className="font-black text-amber-600 text-sm">72.1%</span>
                </div>
                <div className="h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                  <div className="h-full bg-amber-500 rounded-full transition-all duration-1000 ease-out" style={{ width: '72.1%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
