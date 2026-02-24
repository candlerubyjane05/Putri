
import React, { useState } from 'react';
import { store } from '../store';
import { BookStatus, User, PeminjamanStatus } from '../types';
import { 
  Search, BookOpen, MapPin, Filter, ChevronRight, LayoutGrid, List,
  Clock, AlertCircle, TrendingUp, Calendar
} from 'lucide-react';

interface OpacProps {
  user?: User;
}

const Opac: React.FC<OpacProps> = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  
  const books = store.getBuku();
  const categories = ['Semua', ...new Set(books.map(b => b.kategori))];

  const myLoans = store.getPeminjaman().filter(
    l => l.user_id === user?.id && l.status === PeminjamanStatus.DIPINJAM
  );
  const totalFine = myLoans.reduce((acc, l) => acc + store.calculateCurrentFine(l), 0);

  const filtered = books.filter(b => {
    const matchesSearch = b.judul.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         b.penulis.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'Semua' || b.kategori === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Katalog Publik (OPAC)</h2>
        <p className="text-slate-500 mt-1 font-medium">Cari dan cek ketersediaan koleksi fisik.</p>
      </div>

      {myLoans.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="bg-slate-900 px-8 py-4 flex items-center justify-between text-white text-[10px] font-black uppercase tracking-widest">
              <div className="flex items-center"><Clock size={16} className="mr-2 text-blue-400" /> Pinjaman Aktif Anda</div>
              <span className="bg-blue-600 px-3 py-1 rounded-full">{myLoans.length} BUKU</span>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {myLoans.map(loan => {
                const fine = store.calculateCurrentFine(loan);
                const bInfo = books.find(b => b.kode_buku === loan.kode_buku);
                return (
                  <div key={loan.id} className="p-5 bg-slate-50 rounded-3xl border border-slate-100 flex items-start space-x-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 border shadow-sm flex-shrink-0"><BookOpen size={20} /></div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 text-sm truncate">{bInfo?.judul || loan.kode_buku}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase mt-1">Tempo: {formatDate(loan.tanggal_kembali)}</p>
                      {fine > 0 && <span className="inline-block mt-2 text-[10px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-lg border border-red-100">DENDA: Rp {fine.toLocaleString()}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white flex flex-col justify-center shadow-xl shadow-blue-600/20">
             <TrendingUp className="text-white/30 mb-4" size={32} />
             <p className="text-[10px] font-black uppercase tracking-widest text-blue-100">Total Tagihan Denda</p>
             <h4 className="text-4xl font-black tracking-tighter">Rp {totalFine.toLocaleString()}</h4>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 flex flex-col md:flex-row gap-6">
        <div className="flex-1 relative">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
           <input 
              type="text" placeholder="Cari Judul atau Penulis..."
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold transition-all"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
        <select 
          className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-4 focus:ring-blue-500/10"
          value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filtered.map(book => (
          <div key={book.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-xl transition-all flex flex-col">
             <div className="aspect-[3/4] bg-slate-100 relative overflow-hidden">
                {book.cover ? <img src={book.cover} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><BookOpen size={48} /></div>}
                <span className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${book.status === BookStatus.TERSEDIA ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>{book.status}</span>
             </div>
             <div className="p-4 flex-1">
                <h4 className="font-bold text-slate-800 text-sm line-clamp-2 leading-tight">{book.judul}</h4>
                <div className="mt-4 flex items-center justify-between text-slate-500 text-[10px] font-black uppercase tracking-widest pt-3 border-t border-slate-50">
                   <div className="flex items-center space-x-1"><MapPin size={10} /><span>RAK {book.lokasi_rak}</span></div>
                   <ChevronRight size={14} className="text-slate-300" />
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Opac;
