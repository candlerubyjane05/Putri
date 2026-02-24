
import React, { useState } from 'react';
import { store } from '../store';
import { User, UserRole } from '../types';
import { 
  Users, 
  Plus, 
  Trash2, 
  Key, 
  Search, 
  X, 
  CheckCircle, 
  AlertCircle,
  UserPlus,
  Shield,
  CreditCard,
  Hash,
  Settings,
  Coins,
  Info
} from 'lucide-react';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState(store.getUsers());
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [fineAmount, setFineAmount] = useState(store.getFineAmount());
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form states
  const [newUserForm, setNewUserForm] = useState({
    nama: '',
    nim_nidn: '',
    username: '',
    password: '123',
    role: UserRole.MAHASISWA,
    barcode: ''
  });

  const [newPassword, setNewPassword] = useState('');

  const filteredUsers = users.filter(u => 
    u.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.nim_nidn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Jika username kosong, gunakan NIM sebagai username default
    const finalUsername = newUserForm.username || newUserForm.nim_nidn;
    const barcode = newUserForm.barcode || `KTM-${newUserForm.nim_nidn}`;
    
    const result = store.addUser({ 
      ...newUserForm, 
      username: finalUsername,
      barcode 
    });
    
    setUsers([...store.getUsers()]);
    setIsAddModalOpen(false);
    setNewUserForm({
      nama: '',
      nim_nidn: '',
      username: '',
      password: '123',
      role: UserRole.MAHASISWA,
      barcode: ''
    });
    setMessage({ text: `Anggota ${result.nama} berhasil ditambahkan. Mahasiswa dapat login menggunakan NIM: ${result.nim_nidn}`, type: 'success' });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleDeleteUser = (id: number, name: string) => {
    if (window.confirm(`Hapus anggota ${name}?`)) {
      store.deleteUser(id);
      setUsers([...store.getUsers()]);
      setMessage({ text: `Anggota ${name} telah dihapus.`, type: 'success' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    const success = store.updateUserPassword(selectedUser.id, newPassword);
    if (success) {
      setMessage({ text: `Password untuk ${selectedUser.nama} berhasil diperbarui.`, type: 'success' });
      setIsPassModalOpen(false);
      setNewPassword('');
      setSelectedUser(null);
    } else {
      setMessage({ text: 'Gagal memperbarui password.', type: 'error' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleUpdateSettings = (e: React.FormEvent) => {
    e.preventDefault();
    store.setFineAmount(fineAmount);
    setMessage({ text: `Konfigurasi sistem berhasil diperbarui.`, type: 'success' });
    setTimeout(() => setMessage(null), 3000);
  };

  // Helper untuk mengisi username otomatis dari NIM jika peran adalah Mahasiswa
  const handleNimChange = (nim: string) => {
    setNewUserForm(prev => ({
      ...prev,
      nim_nidn: nim,
      username: prev.username === prev.nim_nidn || prev.username === '' ? nim : prev.username
    }));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Manajemen & Konfigurasi</h2>
          <p className="text-slate-500 mt-1 font-medium">Kelola data anggota and pengaturan parameter sistem.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center space-x-2 transition-all shadow-lg shadow-blue-500/25 active:scale-95"
          >
            <UserPlus size={18} />
            <span>Tambah Anggota</span>
          </button>
          
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama, NIM, atau username..."
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full sm:w-64 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center space-x-3 animate-in fade-in slide-in-from-top-4 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span className="font-bold text-sm">{message.text}</span>
          <button onClick={() => setMessage(null)} className="ml-auto opacity-50 hover:opacity-100"><X size={16} /></button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Nama Lengkap</th>
                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">NIM / NIDN</th>
                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Username</th>
                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                            {u.nama.charAt(0)}
                          </div>
                          <span className="font-bold text-slate-800">{u.nama}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                          {u.nim_nidn}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm text-slate-500 font-medium">@{u.username}</span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => { setSelectedUser(u); setIsPassModalOpen(true); }}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Ubah Password"
                          >
                            <Key size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(u.id, u.nama)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Hapus Anggota"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-8">
           <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-slate-900 text-white rounded-2xl">
                  <Settings size={20} />
                </div>
                <h3 className="text-xl font-black text-slate-900">Konfigurasi Sistem</h3>
              </div>
              
              <form onSubmit={handleUpdateSettings} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center">
                    <Coins size={14} className="mr-2 text-amber-500" /> Denda Harian (Rp)
                  </label>
                  <input 
                    type="number"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-black text-lg transition-all"
                    value={fineAmount}
                    onChange={(e) => setFineAmount(parseInt(e.target.value))}
                  />
                  <p className="text-[10px] text-slate-400 font-medium italic">
                    * Jumlah denda yang dikenakan per hari untuk keterlambatan pengembalian buku.
                  </p>
                </div>
                
                <button 
                  type="submit"
                  className="w-full py-4 bg-slate-900 hover:bg-black text-white font-black rounded-2xl shadow-xl transition-all uppercase tracking-widest text-xs"
                >
                  SIMPAN PENGATURAN
                </button>
              </form>
           </div>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-white/20 animate-in zoom-in-95 duration-300">
            <div className="p-10">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Registrasi Mahasiswa/Dosen</h3>
                  <p className="text-slate-400 text-sm font-medium">NIM/NIDN akan menjadi identitas login utama anggota.</p>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="p-3 bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors"><X size={24} /></button>
              </div>

              <form onSubmit={handleAddUser} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center">
                    <Users size={14} className="mr-2 text-blue-500" /> Nama Lengkap
                  </label>
                  <input 
                    type="text" required
                    placeholder="Masukkan nama sesuai KTM/KTP..."
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold transition-all"
                    value={newUserForm.nama}
                    onChange={e => setNewUserForm({...newUserForm, nama: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center">
                      <Hash size={14} className="mr-2 text-blue-500" /> NIM / NIDN
                    </label>
                    <input 
                      type="text" required
                      placeholder="Contoh: 2101010042"
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold transition-all"
                      value={newUserForm.nim_nidn}
                      onChange={e => handleNimChange(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center">
                      <Shield size={14} className="mr-2 text-blue-500" /> Peran Akun
                    </label>
                    <select 
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold transition-all"
                      value={newUserForm.role}
                      onChange={e => setNewUserForm({...newUserForm, role: e.target.value as UserRole})}
                    >
                      {Object.values(UserRole).map(r => <option key={r} value={r}>{r.toUpperCase()}</option>)}
                    </select>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-start space-x-3">
                   <Info size={18} className="text-blue-500 mt-0.5" />
                   <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                      Mahasiswa dapat masuk ke sistem menggunakan <strong>NIM</strong> atau <strong>Username</strong>. Secara default, NIM akan diatur sebagai username awal.
                   </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center">
                      <Hash size={14} className="mr-2 text-blue-500" /> Custom Username
                    </label>
                    <input 
                      type="text"
                      placeholder="Ganti jika perlu..."
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold transition-all"
                      value={newUserForm.username}
                      onChange={e => setNewUserForm({...newUserForm, username: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center">
                      <Key size={14} className="mr-2 text-blue-500" /> Password Awal
                    </label>
                    <input 
                      type="text" required
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold transition-all"
                      value={newUserForm.password}
                      onChange={e => setNewUserForm({...newUserForm, password: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center">
                    <CreditCard size={14} className="mr-2 text-blue-500" /> Kode Barcode / KTM (Opsional)
                  </label>
                  <input 
                    type="text"
                    placeholder="Contoh: KTM-2101..."
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold transition-all"
                    value={newUserForm.barcode}
                    onChange={e => setNewUserForm({...newUserForm, barcode: e.target.value.toUpperCase()})}
                  />
                </div>

                <div className="pt-6 flex space-x-4">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4 border border-slate-200 rounded-2xl font-black text-slate-500 hover:bg-slate-50 transition-all uppercase tracking-widest">BATAL</button>
                  <button type="submit" className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-500/30 transition-all uppercase tracking-widest">SIMPAN ANGGOTA</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isPassModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] shadow-2xl max-md w-full border border-white/20 animate-in zoom-in-95 duration-300">
            <div className="p-10 text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Key size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Ubah Password</h3>
              <p className="text-slate-400 text-sm font-medium mb-8">Masukkan password baru untuk <span className="font-bold text-slate-700">{selectedUser.nama}</span>.</p>
              
              <form onSubmit={handleUpdatePassword} className="space-y-6">
                <input 
                  type="text" required autoFocus
                  placeholder="Password Baru..."
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-center font-black transition-all"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
                
                <div className="flex space-x-3 pt-4">
                  <button type="button" onClick={() => { setIsPassModalOpen(false); setSelectedUser(null); }} className="flex-1 py-4 border border-slate-200 rounded-xl font-black text-slate-500 hover:bg-slate-50 transition-all">BATAL</button>
                  <button type="submit" className="flex-1 py-4 bg-slate-900 text-white font-black rounded-xl shadow-xl transition-all">UPDATE</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
