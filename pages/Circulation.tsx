
import React, { useState } from 'react';
import { store } from '../store';
import { BookStatus, PeminjamanStatus, User } from '../types';
import { 
  ArrowLeftRight, 
  Search, 
  CheckCircle, 
  AlertCircle, 
  RotateCcw,
  Calendar,
  User as UserIcon,
  Barcode,
  Contact,
  BookOpen,
  ArrowRight,
  X
} from 'lucide-react';

const Circulation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pinjam' | 'kembali' | 'riwayat'>('pinjam');
  
  // State for KTM Scan
  const [barcodeMhs, setBarcodeMhs] = useState('');
  const [selectedMhs, setSelectedMhs] = useState<User | null>(null);

  // State for Book Scan
  const [kodeBuku, setKodeBuku] = useState('');
  const [tglKembali, setTglKembali] = useState('');
  
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const history = store.getPeminjaman();

  const handleScanMhs = (e: React.FormEvent) => {
    e.preventDefault();
    const user = store.getUserByBarcode(barcodeMhs);
    if (user) {
      setSelectedMhs(user);
      setMessage(null);
    } else {
      setSelectedMhs(null);
      setMessage({ text: 'Mahasiswa tidak ditemukan. Coba: KTM-001', type: 'error' });
    }
  };

  const handlePinjam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMhs) return;

    const result = store.pinjamBuku(kodeBuku, selectedMhs.id, tglKembali);
    if (result) {
      setMessage({ text: `Buku ${kodeBuku} berhasil dipinjam oleh ${selectedMhs.nama}`, type: 'success' });
      resetForm();
    } else {
      setMessage({ text: 'Buku tidak ditemukan atau sedang dipinjam.', type: 'error' });
    }
  };

  const handleKembali = (e: React.FormEvent) => {
    e.preventDefault();
    const result = store.kembalikanBuku(kodeBuku);
    if (result) {
      const dendaMsg = result.denda > 0 ? ` Denda: Rp ${result.denda.toLocaleString()}` : '';
      setMessage({ text: `Buku ${kodeBuku} telah dikembalikan.${dendaMsg}`, type: 'success' });
      resetForm();
    } else {
      setMessage({ text: 'Data peminjaman tidak ditemukan.', type: 'error' });
    }
  };

  const resetForm = () => {
    setBarcodeMhs('');
    setSelectedMhs(null);
    setKodeBuku('');
    setTglKembali('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Layanan Sirkulasi</h2>
          <p className="text-slate-500">Manajemen peminjaman (Scan KTM) dan pengembalian buku.</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200 w-fit">
          <button 
            onClick={() => { setActiveTab('pinjam'); resetForm(); }}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'pinjam' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Peminjaman
          </button>
          <button 
            onClick={() => { setActiveTab('kembali'); resetForm(); }}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'kembali' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Pengembalian
          </button>
          <button 
            onClick={() => { setActiveTab('riwayat'); resetForm(); }}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'riwayat' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Riwayat
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center space-x-3 animate-in fade-in slide-in-from-top-4 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span className="font-medium">{message.text}</span>
          <button onClick={() => setMessage(null)} className="ml-auto opacity-50 hover:opacity-100"><X size={16} /></button>
        </div>
      )}

      {activeTab === 'pinjam' && (
        <div className="space-y-6">
          {!selectedMhs ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
                <Contact size={40} />
              </div>
              <h3 className="text-xl font-bold mb-2">Langkah 1: Identifikasi Mahasiswa</h3>
              <p className="text-slate-500 max-w-sm mb-8">Scan Barcode pada KTM Mahasiswa atau masukkan barcode secara manual untuk memulai proses peminjaman.</p>
              
              <form onSubmit={handleScanMhs} className="w-full max-w-md flex items-center space-x-2">
                <div className="relative flex-1">
                  <Barcode className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-lg font-bold transition-all"
                    placeholder="SCAN BARCODE KTM"
                    value={barcodeMhs}
                    onChange={(e) => setBarcodeMhs(e.target.value.toUpperCase())}
                    autoFocus
                    required
                  />
                </div>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl shadow-lg shadow-blue-500/30 transition-all">
                  <ArrowRight size={24} />
                </button>
              </form>
              <p className="mt-4 text-xs text-slate-400 font-medium">Contoh barcode: <span className="text-blue-500">KTM-001</span>, <span className="text-blue-500">KTM-ADMIN</span></p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Member Card */}
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl">
                  <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
                  <div className="flex justify-between items-start mb-12">
                     <div>
                       <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400">Library Member Card</h4>
                       <p className="text-blue-400 font-bold text-xs">FACULTY OF LAW UNDANA</p>
                     </div>
                     <Contact className="text-blue-500 opacity-50" size={32} />
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-bold">{selectedMhs.nama}</h3>
                      <p className="text-xs text-slate-400 font-mono tracking-wider">{selectedMhs.nim_nidn}</p>
                    </div>
                    <div className="flex justify-between items-end">
                       <span className="text-[10px] bg-blue-600 px-2 py-1 rounded font-bold uppercase">{selectedMhs.role}</span>
                       <span className="text-[10px] text-slate-500 font-mono">{selectedMhs.barcode}</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => resetForm()}
                  className="w-full py-3 text-sm font-bold text-slate-500 hover:text-red-500 transition-colors flex items-center justify-center space-x-2 border border-dashed border-slate-300 rounded-xl"
                >
                  <RotateCcw size={16} />
                  <span>Ganti Mahasiswa</span>
                </button>
              </div>

              {/* Book Input Form */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                <form onSubmit={handlePinjam} className="space-y-6">
                  <h3 className="text-xl font-bold flex items-center space-x-2">
                    <BookOpen className="text-blue-600" size={24} />
                    <span>Langkah 2: Scan Buku</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Kode / Barcode Buku</label>
                      <div className="relative">
                        <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="text" 
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                          placeholder="SCAN KODE BUKU"
                          value={kodeBuku}
                          onChange={(e) => setKodeBuku(e.target.value.toUpperCase())}
                          required
                          autoFocus
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Tanggal Jatuh Tempo</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="date" 
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          value={tglKembali}
                          onChange={(e) => setTglKembali(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center space-x-3 text-lg">
                    <span>Selesaikan Peminjaman</span>
                    <ArrowRight size={20} />
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'kembali' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 max-w-2xl mx-auto">
          <form onSubmit={handleKembali} className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <RotateCcw size={40} />
              </div>
              <h3 className="text-2xl font-bold">Proses Pengembalian</h3>
              <p className="text-slate-500 mb-8">Masukkan atau Scan kode buku untuk mengembalikan koleksi.</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Kode / Barcode Buku</label>
              <input 
                type="text" 
                className="w-full px-4 py-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-center text-3xl font-black tracking-widest transition-all"
                placeholder="SCAN BUKU"
                value={kodeBuku}
                onChange={(e) => setKodeBuku(e.target.value.toUpperCase())}
                required
                autoFocus
              />
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl shadow-lg shadow-blue-500/20 transition-all text-xl">
              Konfirmasi Pengembalian
            </button>
          </form>
        </div>
      )}

      {activeTab === 'riwayat' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Peminjam</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Kode Buku</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Tgl Pinjam</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Jatuh Tempo</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Denda</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                       <p className="font-bold text-slate-800">{p.nama_peminjam}</p>
                       <p className="text-[10px] text-slate-400 font-mono">ID: {p.user_id}</p>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-blue-600">{p.kode_buku}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{p.tanggal_pinjam}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{p.tanggal_kembali}</td>
                    <td className="px-6 py-4">
                      {p.denda > 0 ? (
                        <span className="text-red-600 font-bold">Rp {p.denda.toLocaleString()}</span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        p.status === 'dipinjam' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Circulation;
