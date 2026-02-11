
import React, { useState, useRef } from 'react';
import { store } from '../store';
import { Buku, BookStatus } from '../types';
import { 
  Plus, 
  Search, 
  BookOpen, 
  Hash, 
  MapPin, 
  User as UserIcon, 
  Building2, 
  Calendar, 
  Tags,
  CheckCircle,
  AlertCircle,
  LayoutGrid,
  List,
  Image as ImageIcon,
  X,
  Trash2
} from 'lucide-react';

const Inventory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');
  const [viewMode, setViewMode] = useState<'shelf' | 'table'>('shelf');
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [books, setBooks] = useState(store.getBuku());
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [form, setForm] = useState({
    kode_buku: '',
    judul: '',
    penulis: '',
    penerbit: '',
    tahun: new Date().getFullYear(),
    kategori: '',
    lokasi_rak: '',
    cover: ''
  });

  const filteredBooks = books.filter(b => 
    b.judul.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.kode_buku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, cover: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = store.addBuku(form);
    if (result) {
      setMessage({ text: `Buku "${form.judul}" berhasil ditambahkan ke inventaris.`, type: 'success' });
      setBooks(store.getBuku());
      setForm({
        kode_buku: '',
        judul: '',
        penulis: '',
        penerbit: '',
        tahun: new Date().getFullYear(),
        kategori: '',
        lokasi_rak: '',
        cover: ''
      });
      setTimeout(() => setActiveTab('list'), 1500);
    } else {
      setMessage({ text: 'Gagal menambahkan buku. Kode buku mungkin sudah ada.', type: 'error' });
    }
  };

  const handleDelete = (id: number, title: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus buku "${title}"?`)) {
      store.deleteBuku(id);
      setBooks(store.getBuku());
      setMessage({ text: `Buku "${title}" telah dihapus dari inventaris.`, type: 'success' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Inventaris Buku Fisik</h2>
          <p className="text-slate-500">Manajemen koleksi buku perpustakaan FH UNDANA.</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200 w-fit">
          <button 
            onClick={() => setActiveTab('list')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'list' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Daftar Buku
          </button>
          <button 
            onClick={() => setActiveTab('add')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'add' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Tambah Buku Baru
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

      {activeTab === 'list' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Cari kode atau judul buku..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center bg-slate-200 p-1 rounded-lg">
              <button 
                onClick={() => setViewMode('shelf')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'shelf' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
                title="Tampilan Rak"
              >
                <LayoutGrid size={20} />
              </button>
              <button 
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'table' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
                title="Tampilan Tabel"
              >
                <List size={20} />
              </button>
            </div>
          </div>

          {viewMode === 'shelf' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {filteredBooks.map((book) => (
                <div key={book.id} className="group bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all flex flex-col relative">
                  <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
                    {book.cover ? (
                      <img src={book.cover} alt={book.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 p-4 text-center">
                        <BookOpen size={48} className="mb-2 opacity-50" />
                        <span className="text-[10px] uppercase font-bold tracking-widest">No Cover</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                       <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest shadow-sm ${
                        book.status === BookStatus.TERSEDIA ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {book.status}
                      </span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(book.id, book.judul); }}
                        className="p-1.5 bg-white/90 hover:bg-red-500 hover:text-white text-slate-500 rounded-lg shadow-sm transition-all opacity-0 group-hover:opacity-100"
                        title="Hapus Buku"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="p-3 flex-1 flex flex-col">
                    <h4 className="font-bold text-xs text-slate-800 line-clamp-2 leading-tight mb-1" title={book.judul}>{book.judul}</h4>
                    <p className="text-[10px] text-slate-500 truncate mb-2">{book.penulis}</p>
                    <div className="mt-auto flex items-center justify-between text-[9px] font-bold text-slate-400">
                      <span className="bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">{book.lokasi_rak}</span>
                      <span className="uppercase">{book.kode_buku}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Buku</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Kode</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Kategori</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Rak</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredBooks.map((book) => (
                      <tr key={book.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-14 bg-slate-100 rounded overflow-hidden flex-shrink-0 border border-slate-200">
                              {book.cover ? (
                                <img src={book.cover} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                  <BookOpen size={16} />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 leading-tight">{book.judul}</p>
                              <p className="text-xs text-slate-500">{book.penulis} • {book.penerbit} ({book.tahun})</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded text-slate-600 border border-slate-200">{book.kode_buku}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-600">{book.kategori}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2 text-sm text-slate-600">
                            <MapPin size={14} className="text-slate-400" />
                            <span>{book.lokasi_rak}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            book.status === BookStatus.TERSEDIA ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                          }`}>
                            {book.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleDelete(book.id, book.judul)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            title="Hapus Buku"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <Plus size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Input Data Buku Baru</h3>
                <p className="text-sm text-slate-500">Lengkapi formulir untuk menambahkan koleksi fisik baru.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Cover Upload */}
              <div className="md:col-span-1">
                <label className="text-sm font-bold text-slate-700 block mb-4">Cover Buku</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-[3/4] w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-100 hover:border-blue-300 transition-all overflow-hidden group"
                >
                  {form.cover ? (
                    <div className="relative w-full h-full">
                      <img src={form.cover} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                        Ganti Gambar
                      </div>
                    </div>
                  ) : (
                    <>
                      <ImageIcon size={48} className="mb-2 opacity-50" />
                      <span className="text-xs text-center px-4 font-medium">Klik untuk Unggah Cover</span>
                      <span className="text-[10px] mt-1">Format: JPG, PNG</span>
                    </>
                  )}
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  ref={fileInputRef} 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {form.cover && (
                  <button 
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, cover: '' }))}
                    className="mt-2 text-xs text-red-500 font-bold hover:underline flex items-center"
                  >
                    <X size={12} className="mr-1" /> Hapus Cover
                  </button>
                )}
              </div>

              {/* Form Fields */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center">
                    <Hash size={14} className="mr-2" /> Kode Buku / Barcode
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="Contoh: LAW-001"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={form.kode_buku}
                    onChange={e => setForm({...form, kode_buku: e.target.value.toUpperCase()})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center">
                    <BookOpen size={14} className="mr-2" /> Judul Buku
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="Masukkan judul lengkap"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={form.judul}
                    onChange={e => setForm({...form, judul: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center">
                    <UserIcon size={14} className="mr-2" /> Penulis
                  </label>
                  <input 
                    type="text" 
                    placeholder="Nama penulis"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={form.penulis}
                    onChange={e => setForm({...form, penulis: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center">
                    <Building2 size={14} className="mr-2" /> Penerbit
                  </label>
                  <input 
                    type="text" 
                    placeholder="Nama penerbit"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={form.penerbit}
                    onChange={e => setForm({...form, penerbit: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center">
                    <Calendar size={14} className="mr-2" /> Tahun Terbit
                  </label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={form.tahun}
                    onChange={e => setForm({...form, tahun: parseInt(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center">
                    <Tags size={14} className="mr-2" /> Kategori
                  </label>
                  <input 
                    type="text" 
                    placeholder="Pidana, Perdata, Dasar, dll."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={form.kategori}
                    onChange={e => setForm({...form, kategori: e.target.value})}
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center">
                    <MapPin size={14} className="mr-2" /> Lokasi Rak
                  </label>
                  <input 
                    type="text" 
                    placeholder="Contoh: A-05"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={form.lokasi_rak}
                    onChange={e => setForm({...form, lokasi_rak: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-end space-x-4">
              <button 
                type="button" 
                onClick={() => setActiveTab('list')}
                className="px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
              >
                Batal
              </button>
              <button 
                type="submit"
                className="px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all"
              >
                Simpan Buku
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Inventory;
