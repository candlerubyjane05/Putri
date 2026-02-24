
import React, { useState } from 'react';
import { store } from '../store';
import { PeminjamanStatus, UserRole } from '../types';
import { 
  ArrowLeftRight, RotateCcw, Clock, Calendar, BookOpen, User as UserIcon, Edit2, Save, X, CheckCircle 
} from 'lucide-react';

const Circulation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pinjam' | 'kembali' | 'log'>('log');
  const [editingLoan, setEditingLoan] = useState<number | null>(null);
  const [newDueDate, setNewDueDate] = useState('');
  const [msg, setMsg] = useState('');

  const history = store.getPeminjaman();
  const allBooks = store.getBuku();

  const handleUpdateDate = (id: number) => {
    store.updateJatuhTempo(id, newDueDate);
    setEditingLoan(null);
    setMsg('Tanggal Jatuh Tempo berhasil diperbarui!');
    setTimeout(() => setMsg(''), 3000);
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Sirkulasi & Kendali Stok</h2>
          <p className="text-slate-500 mt-1 font-medium">Monitoring buku keluar, pengembalian, dan denda.</p>
        </div>
        <div className="bg-white p-1 rounded-2xl shadow-sm border border-slate-200 flex">
          <button onClick={() => setActiveTab('log')} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest ${activeTab === 'log' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>Buku Keluar (Log)</button>
        </div>
      </div>

      {msg && (
        <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 flex items-center space-x-3 font-bold text-sm">
          <CheckCircle size={20} /><span>{msg}</span>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="px-8 py-5">Anggota (NIM)</th>
              <th className="px-8 py-5">Koleksi Buku</th>
              <th className="px-8 py-5">Tgl Pinjam</th>
              <th className="px-8 py-5">Jatuh Tempo</th>
              <th className="px-8 py-5">Denda Berjalan</th>
              <th className="px-8 py-5 text-right">Kelola</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {[...history].reverse().map(p => {
              const book = allBooks.find(b => b.kode_buku === p.kode_buku);
              const fine = store.calculateCurrentFine(p);
              const isEditing = editingLoan === p.id;
              
              return (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-5">
                    <p className="font-black text-slate-800 text-sm leading-tight">{p.nama_peminjam}</p>
                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-1">ID: {p.user_id}</p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="font-bold text-slate-800 text-sm truncate max-w-xs">{book?.judul || p.kode_buku}</p>
                    <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mt-1">{p.kode_buku}</p>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-500">{formatDate(p.tanggal_pinjam)}</td>
                  <td className="px-8 py-5">
                    {isEditing ? (
                      <input type="date" className="bg-white border rounded px-2 py-1 text-xs font-bold outline-none ring-2 ring-blue-500" value={newDueDate} onChange={e => setNewDueDate(e.target.value)} />
                    ) : (
                      <span className={`text-sm font-bold ${fine > 0 ? 'text-red-600' : 'text-slate-600'}`}>{formatDate(p.tanggal_kembali)}</span>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    {fine > 0 ? (
                      <div className="flex flex-col"><span className="text-red-600 font-black text-sm">Rp {fine.toLocaleString()}</span><span className="text-[8px] text-red-400 font-black uppercase animate-pulse">OVERDUE</span></div>
                    ) : <span className="text-emerald-500 font-black text-[10px] bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100 uppercase">NORMAL</span>}
                  </td>
                  <td className="px-8 py-5 text-right">
                    {p.status === 'dipinjam' && (
                      isEditing ? (
                        <div className="flex justify-end space-x-2">
                          <button onClick={() => handleUpdateDate(p.id)} className="p-2 bg-emerald-500 text-white rounded-lg shadow-lg"><Save size={16} /></button>
                          <button onClick={() => setEditingLoan(null)} className="p-2 bg-slate-100 text-slate-400 rounded-lg"><X size={16} /></button>
                        </div>
                      ) : (
                        <button onClick={() => { setEditingLoan(p.id); setNewDueDate(p.tanggal_kembali); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit2 size={16} /></button>
                      )
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Circulation;
