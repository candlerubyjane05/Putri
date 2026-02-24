
import React, { useState } from 'react';
import { User } from '../types';
import { store } from '../store';
import { 
  User as UserIcon, 
  Key, 
  AtSign, 
  Fingerprint, 
  Save, 
  CheckCircle, 
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

interface ProfileProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser }) => {
  const [formData, setFormData] = useState({
    nama: user.nama,
    username: user.username,
    nim_nidn: user.nim_nidn,
    password: user.password || '',
    confirmPassword: user.password || ''
  });

  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage({ text: 'Konfirmasi password tidak cocok!', type: 'error' });
      return;
    }

    const result = store.updateUser(user.id, {
      nama: formData.nama,
      username: formData.username,
      nim_nidn: formData.nim_nidn,
      password: formData.password
    });

    if (result.success && result.user) {
      setMessage({ text: 'Profil berhasil diperbarui!', type: 'success' });
      onUpdateUser(result.user);
    } else {
      setMessage({ text: result.message || 'Gagal memperbarui profil.', type: 'error' });
    }

    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Pengaturan Profil</h2>
        <p className="text-slate-500 mt-1 font-medium">Kelola informasi pribadi dan keamanan akun Anda.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl flex items-center space-x-3 shadow-lg ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
        }`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span className="font-bold text-sm">{message.text}</span>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 p-8 text-white flex items-center space-x-6">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/30 border-4 border-white/10">
            <UserIcon size={40} />
          </div>
          <div>
            <h3 className="text-2xl font-black tracking-tight">{user.nama}</h3>
            <div className="flex items-center space-x-3 mt-1">
              <span className="text-[10px] font-black uppercase tracking-widest bg-white/10 px-2 py-1 rounded-lg">ID: {user.nim_nidn}</span>
              <span className="text-[10px] font-black uppercase tracking-widest bg-blue-500 px-2 py-1 rounded-lg">{user.role}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                <UserIcon size={12} className="mr-2 text-blue-500" /> Nama Lengkap
              </label>
              <input 
                type="text" required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold transition-all"
                value={formData.nama}
                onChange={e => setFormData({...formData, nama: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                <Fingerprint size={12} className="mr-2 text-blue-500" /> Identitas (NIM/NIDN)
              </label>
              <input 
                type="text" required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-mono font-bold transition-all"
                value={formData.nim_nidn}
                onChange={e => setFormData({...formData, nim_nidn: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                <AtSign size={12} className="mr-2 text-blue-500" /> Username Login
              </label>
              <input 
                type="text" required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold transition-all"
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
              />
            </div>

            <div className="hidden md:block"></div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                <Key size={12} className="mr-2 text-blue-500" /> Password Baru
              </label>
              <input 
                type="password" required
                placeholder="••••••••"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold transition-all"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                <ShieldCheck size={12} className="mr-2 text-blue-500" /> Konfirmasi Password
              </label>
              <input 
                type="password" required
                placeholder="••••••••"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold transition-all"
                value={formData.confirmPassword}
                onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>
          </div>

          <div className="pt-8 border-t border-slate-50 flex justify-end">
            <button 
              type="submit"
              className="bg-slate-900 hover:bg-black text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all flex items-center space-x-3 active:scale-95"
            >
              <Save size={18} />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>

      <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 flex items-start space-x-4">
        <AlertCircle className="text-amber-500 mt-1" size={20} />
        <div>
          <p className="text-sm font-bold text-amber-900">Penting:</p>
          <p className="text-xs text-amber-700 leading-relaxed mt-1">Mengubah identitas (NIM/NIDN) atau Username akan berpengaruh pada kredensial login Anda di masa mendatang. Harap pastikan data yang Anda masukkan sudah benar.</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
