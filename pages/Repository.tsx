
import React, { useState } from 'react';
import { store } from '../store';
import { Koleksi, CollectionType, UserRole } from '../types';
import { summarizeAbstract } from '../services/geminiService';
import { 
  FileDown, 
  Search, 
  Filter, 
  BookOpen, 
  Sparkles,
  ChevronRight,
  Loader2,
  Plus,
  Trash2,
  X,
  FileText,
  Calendar,
  User as UserIcon,
  Tag,
  Download
} from 'lucide-react';

interface RepositoryProps {
  userRole: UserRole;
}

const Repository: React.FC<RepositoryProps> = ({ userRole }) => {
  const [collections, setCollections] = useState(store.getKoleksi());
  const [filterType, setFilterType] = useState<CollectionType | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKoleksi, setSelectedKoleksi] = useState<Koleksi | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const [newForm, setNewForm] = useState({
    judul: '',
    penulis: '',
    jenis: CollectionType.SKRIPSI,
    fakultas_id: 1,
    tahun: new Date().getFullYear(),
    abstrak: '',
    file: ''
  });

  const isAdmin = userRole === UserRole.ADMIN;
  const fakultas = store.getFakultas();

  const filtered = collections.filter(item => {
    const matchesType = filterType === 'all' || item.jenis === filterType;
    const matchesSearch = item.judul.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.penulis.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleSummarize = async (abstrak: string) => {
    setIsSummarizing(true);
    const summary = await summarizeAbstract(abstrak);
    setAiSummary(summary);
    setIsSummarizing(false);
  };

  const handleAddCollection = (e: React.FormEvent) => {
    e.preventDefault();
    store.addKoleksi(newForm);
    setCollections([...store.getKoleksi()]);
    setIsAdding(false);
    setNewForm({
      judul: '',
      penulis: '',
      jenis: CollectionType.SKRIPSI,
      fakultas_id: 1,
      tahun: new Date().getFullYear(),
      abstrak: '',
      file: ''
    });
  };

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus data koleksi ini secara permanen?')) {
      store.deleteKoleksi(id);
      setCollections([...store.getKoleksi()]);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Repository Digital Hukum</h2>
          <p className="text-slate-500 mt-1 font-medium italic">Akses literatur hukum FH UNDANA secara online.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {isAdmin && (
            <button 
              onClick={() => setIsAdding(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center space-x-2 transition-all shadow-lg shadow-blue-500/25 active:scale-95"
            >
              <Plus size={18} />
              <span>Tambah Dokumen</span>
            </button>
          )}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Cari judul, penulis, kata kunci..."
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full sm:w-64 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {(['all', ...Object.values(CollectionType)] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              filterType === type 
                ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' 
                : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-400 hover:text-slate-700'
            }`}
          >
            {type === 'all' ? 'SEMUA' : type}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div 
            key={item.id} 
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group relative flex flex-col h-full"
            onClick={() => setSelectedKoleksi(item)}
          >
            {isAdmin && (
              <button 
                onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                className="absolute top-4 right-4 p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10"
              >
                <Trash2 size={16} />
              </button>
            )}
            <div className="flex justify-between items-start mb-5">
              <span className={`text-[9px] px-2.5 py-1 rounded-lg font-black uppercase tracking-widest shadow-sm border ${
                item.jenis === CollectionType.SKRIPSI ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                item.jenis === CollectionType.JURNAL ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
              }`}>
                {item.jenis}
              </span>
              <BookOpen size={18} className="text-slate-200 group-hover:text-blue-500 transition-colors" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg leading-snug mb-3 line-clamp-3 group-hover:text-blue-600 transition-colors">{item.judul}</h3>
            <p className="text-slate-500 text-sm mb-6 flex-1">Oleh <span className="text-slate-900 font-bold">{item.penulis}</span></p>
            <div className="flex items-center justify-between pt-5 border-t border-slate-50 mt-auto">
              <span className="text-xs font-black text-slate-400 tracking-tighter">{item.tahun}</span>
              <div className="flex items-center text-blue-600 font-black text-xs uppercase tracking-widest space-x-1">
                <span>DETAIL</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20 animate-in zoom-in-95 duration-300">
            <div className="p-10">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Input Koleksi Digital</h3>
                  <p className="text-slate-400 text-sm font-medium">Unggah referensi hukum baru ke database.</p>
                </div>
                <button onClick={() => setIsAdding(false)} className="p-3 bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors"><X size={24} /></button>
              </div>

              <form onSubmit={handleAddCollection} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center">
                    <FileText size={14} className="mr-2 text-blue-500" /> Judul Lengkap
                  </label>
                  <input 
                    type="text" required
                    placeholder="Masukkan judul skripsi/jurnal..."
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold transition-all"
                    value={newForm.judul}
                    onChange={e => setNewForm({...newForm, judul: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center">
                      <UserIcon size={14} className="mr-2 text-blue-500" /> Penulis
                    </label>
                    <input 
                      type="text" required
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold transition-all"
                      value={newForm.penulis}
                      onChange={e => setNewForm({...newForm, penulis: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center">
                      <Calendar size={14} className="mr-2 text-blue-500" /> Tahun
                    </label>
                    <input 
                      type="number" required
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold transition-all"
                      value={newForm.tahun}
                      onChange={e => setNewForm({...newForm, tahun: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Jenis</label>
                    <select 
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold transition-all"
                      value={newForm.jenis}
                      onChange={e => setNewForm({...newForm, jenis: e.target.value as CollectionType})}
                    >
                      {Object.values(CollectionType).map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Peminatan</label>
                    <select 
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold transition-all"
                      value={newForm.fakultas_id}
                      onChange={e => setNewForm({...newForm, fakultas_id: parseInt(e.target.value)})}
                    >
                      {fakultas.map(f => <option key={f.id} value={f.id}>{f.nama_fakultas}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center">
                    <Tag size={14} className="mr-2 text-blue-500" /> Abstrak
                  </label>
                  <textarea 
                    required rows={4}
                    placeholder="Tulis abstrak penelitian di sini..."
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-medium resize-none transition-all"
                    value={newForm.abstrak}
                    onChange={e => setNewForm({...newForm, abstrak: e.target.value})}
                  />
                </div>
                <div className="pt-6 flex space-x-4">
                  <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-4 border border-slate-200 rounded-2xl font-black text-slate-500 hover:bg-slate-50 transition-all">BATAL</button>
                  <button type="submit" className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-500/30 transition-all uppercase tracking-widest">SIMPAN DATA</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {selectedKoleksi && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-lg animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-10 duration-500">
            <div className="p-12 relative">
              <button 
                onClick={() => setSelectedKoleksi(null)}
                className="absolute top-8 right-8 p-3 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full transition-colors"
              >
                <X size={28} />
              </button>

              <div className="mb-10">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">{selectedKoleksi.jenis} • {selectedKoleksi.tahun}</span>
                <h3 className="text-4xl font-black text-slate-900 mt-4 leading-tight">{selectedKoleksi.judul}</h3>
                <div className="flex items-center space-x-3 mt-4 text-slate-500 font-bold">
                   <UserIcon size={18} />
                   <span>{selectedKoleksi.penulis}</span>
                </div>
              </div>

              <div className="space-y-10">
                <div className="bg-slate-50/80 rounded-[2rem] p-8 border border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
                      <Tag size={16} className="mr-2" /> Abstrak Penelitian
                    </h4>
                    <button 
                      onClick={() => handleSummarize(selectedKoleksi.abstrak)}
                      disabled={isSummarizing}
                      className="flex items-center space-x-2 text-xs font-black text-purple-600 hover:bg-purple-100 px-4 py-2 rounded-full transition-all disabled:opacity-50"
                    >
                      {isSummarizing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                      <span>RINGKAS DENGAN AI</span>
                    </button>
                  </div>
                  
                  {aiSummary && (
                    <div className="bg-white border border-purple-100 rounded-3xl p-6 text-sm text-slate-700 mb-6 shadow-sm animate-in slide-in-from-top-4">
                      <p className="font-black text-purple-800 mb-3 flex items-center text-xs uppercase tracking-widest">
                        <Sparkles size={14} className="mr-2" /> Intisari Cerdas:
                      </p>
                      <div className="prose prose-slate prose-sm max-w-none font-medium whitespace-pre-wrap leading-relaxed">
                        {aiSummary}
                      </div>
                    </div>
                  )}

                  <p className="text-slate-700 font-medium leading-[1.8] text-justify">
                    {selectedKoleksi.abstrak}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button className="w-full sm:flex-1 bg-slate-900 hover:bg-black text-white font-black py-5 rounded-[1.5rem] flex items-center justify-center space-x-3 shadow-2xl shadow-slate-900/30 transition-all uppercase tracking-widest text-sm">
                    <Download size={20} />
                    <span>UNDUH DOKUMEN PDF</span>
                  </button>
                  <button className="w-full sm:w-auto px-8 py-5 border-2 border-slate-100 rounded-[1.5rem] text-slate-500 font-black hover:bg-slate-50 transition-all uppercase tracking-widest text-xs">
                    BOOKMARK
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Repository;
