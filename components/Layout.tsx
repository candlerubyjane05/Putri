
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Library, 
  BookOpen, 
  ArrowLeftRight, 
  LogOut,
  User as UserIcon,
  Search,
  MessageSquare,
  Users,
  SearchIcon,
  Clock,
  Settings
} from 'lucide-react';
import { User, UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const location = useLocation();

  if (!user) return <>{children}</>;

  const isAdmin = user.role === UserRole.ADMIN;

  const adminMenu = [
    { name: 'Dashboard Admin', path: '/', icon: LayoutDashboard },
    { name: 'Sirkulasi (Backend)', path: '/circulation', icon: ArrowLeftRight },
    { name: 'Inventaris Buku', path: '/inventory', icon: BookOpen },
    { name: 'Manajemen Anggota', path: '/users', icon: Users },
    { name: 'Repository Digital', path: '/repository', icon: Library },
    { name: 'Profil Saya', path: '/profile', icon: Settings },
  ];

  const userMenu = [
    { name: 'Beranda Anggota', path: '/', icon: LayoutDashboard },
    { name: 'Katalog Buku (OPAC)', path: '/opac', icon: SearchIcon },
    { name: 'Repository Digital', path: '/repository', icon: Library },
    { name: 'Riwayat Pinjam', path: '/history', icon: Clock },
    { name: 'Asisten AI', path: '/ai-assistant', icon: MessageSquare },
    { name: 'Profil Saya', path: '/profile', icon: Settings },
  ];

  const activeMenu = isAdmin ? adminMenu : userMenu;

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-blue-400">DigiLib FH UNDANA</h1>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-semibold">
            {isAdmin ? 'ADMINISTRATOR BACKEND' : 'STUDENT PORTAL / OPAC'}
          </p>
        </div>
        
        <nav className="flex-1 mt-4 px-4 space-y-2">
          {activeMenu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                location.pathname === item.path 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-bold text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={onLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full text-slate-400 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-bold text-sm">Keluar Sistem</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="flex items-center flex-1 max-w-xl">
             <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Cari buku atau dokumen digital..."
                  className="w-full bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
             </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/profile" className="flex items-center space-x-4 hover:bg-slate-50 p-2 rounded-xl transition-all">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-800">{user.nama}</p>
                <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">{user.role}</p>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 border border-blue-200">
                <UserIcon size={20} />
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
