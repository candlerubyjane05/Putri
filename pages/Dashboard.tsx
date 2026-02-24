
import React from 'react';
import { store } from '../store';
import { UserRole, PeminjamanStatus } from '../types';
import { 
  FileText, 
  Users, 
  BookOpen, 
  Clock, 
  TrendingUp,
  Calendar,
  Sparkles,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC<{ user?: any }> = ({ user }) => {
  const isAdmin = user?.role === UserRole.ADMIN;
  
  // Data Admin
  const collections = store.getKoleksi();
  const books = store.getBuku();
  const allCirculations = store.getPeminjaman();

  // Data User
  const myLoans = allCirculations.filter(c => c.user_id === user?.id && c.status === PeminjamanStatus.DIPINJAM);
  const myTotalFine = myLoans.reduce((acc, curr) => acc + store.calculateCurrentFine(curr), 0);

  const stats = isAdmin ? [
    { label: 'E-Resources', value: collections.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Buku Fisik', value: books.length, icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Aktif Pinjam', value: allCirculations.filter(c => c.status === 'dipinjam').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Total Anggota', value: store.getUsers().length, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ] : [
    { label: 'Buku Dipinjam', value: myLoans.length, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'E-Journal Diakses', value: 12, icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Total Denda', value: `Rp ${myTotalFine.toLocaleString()}`, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Rank Pembaca', value: '#4', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  const todayStr = new Date().toLocaleDateString('id-ID', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  return (
    <div className="max-w-7xl mx-auto space-y-10 py-4 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            {isAdmin ? 'System Oversight' : `Halo, ${user?.nama.split(' ')[0]}!`}
          </h2>
          <div className="flex items-center text-slate-400 mt-2 space-x-2 font-bold uppercase tracking-widest text-[10px]">
             <Calendar size={12} className="text-blue-500" />
             <span>{todayStr}</span>
             <span className="text-slate-200">•</span>
             <span className="text-emerald-500 flex items-center">
               <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1 animate-pulse"></span> 
               Portal {isAdmin ? 'Pustakawan' : 'Anggota'} Aktif
             </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
            <div className={`${stat.bg} ${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-slate-800 tracking-tighter">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {!isAdmin && myLoans.length > 0 && (
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
               <div className="p-8 border-b border-slate-50">
                  <h3 className="font-black text-xl flex items-center space-x-3">
                    <Clock size={24} className="text-amber-500" />
                    <span className="uppercase tracking-tight">Pinjaman Aktif Anda</span>
                  </h3>
               </div>
               <div className="p-8 space-y-4">
                  {myLoans.map(loan => {
                    const fine = store.calculateCurrentFine(loan);
                    return (
                      <div key={loan.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div>
                          <p className="font-bold text-slate-800">{loan.kode_buku}</p>
                          <p className="text-xs text-slate-500">Jatuh Tempo: {new Date(loan.tanggal_kembali).toLocaleDateString('id-ID')}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-black ${fine > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                            {fine > 0 ? `Denda: Rp ${fine.toLocaleString()}` : 'Tepat Waktu'}
                          </p>
                        </div>
                      </div>
                    )
                  })}
               </div>
            </div>
          )}

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <h3 className="font-black text-xl flex items-center space-x-3">
                <TrendingUp size={24} className="text-blue-500" />
                <span className="uppercase tracking-tight">Koleksi Terbaru</span>
              </h3>
              <Link to={isAdmin ? "/inventory" : "/opac"} className="text-blue-600 text-[10px] font-black uppercase tracking-widest bg-blue-50 px-4 py-2 rounded-xl">JELAJAHI</Link>
            </div>
            <div className="divide-y divide-slate-50">
              {books.slice(0, 3).map((item) => (
                <div key={item.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-all group">
                   <div className="flex items-center space-x-4">
                      <div className="w-12 h-16 bg-slate-100 rounded-lg flex-shrink-0 border border-slate-200 overflow-hidden">
                        {item.cover ? <img src={item.cover} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><BookOpen size={20}/></div>}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm leading-tight">{item.judul}</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{item.kategori}</p>
                      </div>
                   </div>
                   <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${item.status === 'tersedia' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group min-h-[300px] flex flex-col justify-between border border-white/10">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-6 border border-white/20">
                  <Sparkles size={24} className="text-amber-400" />
                </div>
                <h3 className="font-black text-2xl mb-2 tracking-tight">Smart Librarian AI</h3>
                <p className="text-blue-100/60 text-xs font-medium leading-relaxed">
                  Gunakan asisten AI untuk membedah abstrak hukum yang kompleks atau mencari referensi skripsi yang relevan dengan topik Anda.
                </p>
              </div>
              <Link to="/ai-assistant" className="w-full bg-white text-blue-900 font-black py-4 rounded-2xl text-xs uppercase tracking-widest text-center shadow-xl active:scale-95 transition-all">
                Mulai Konsultasi
              </Link>
           </div>

           <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 space-y-6">
              <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">Jam Layanan</h3>
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-slate-500">Senin - Kamis</span>
                    <span className="font-black text-slate-800">08:00 - 16:00</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-slate-500">Jumat</span>
                    <span className="font-black text-slate-800">08:00 - 16:30</span>
                 </div>
                 <div className="pt-4 border-t border-slate-50">
                    <p className="text-[10px] text-slate-400 italic">Sabtu, Minggu & Tanggal Merah Libur</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
