
import { User, UserRole, Koleksi, CollectionType, Buku, BookStatus, Peminjaman, PeminjamanStatus, Fakultas } from './types';

// Initial Mock Data
export const MOCK_USERS: User[] = [
  { id: 1, nama: 'Admin Perpustakaan FH', nim_nidn: '198501012010121001', username: 'admin', password: '123', role: UserRole.ADMIN, barcode: 'KTM-ADMIN' },
  { id: 2, nama: 'Prof. Dr. Yusak Farchne, S.H., M.H.', nim_nidn: '197503022000031002', username: 'dosen', password: '123', role: UserRole.DOSEN, barcode: 'KTM-DOSEN' },
  { id: 3, nama: 'Ahmad Bagus Pratama', nim_nidn: '2101010042', username: 'mhs', password: '123', role: UserRole.MAHASISWA, barcode: 'KTM-001' }
];

export const MOCK_FAKULTAS: Fakultas[] = [
  { id: 1, nama_fakultas: 'Hukum Pidana' },
  { id: 2, nama_fakultas: 'Hukum Perdata' },
  { id: 3, nama_fakultas: 'Hukum Tata Negara' },
  { id: 4, nama_fakultas: 'Hukum Internasional' }
];

export const MOCK_KOLEKSI: Koleksi[] = [
  {
    id: 1,
    judul: 'Pertanggungjawaban Pidana Pelaku Tindak Pidana Perdagangan Orang dalam Perspektif HAM',
    penulis: 'Ahmad Bagus Pratama',
    jenis: CollectionType.SKRIPSI,
    fakultas_id: 1,
    tahun: 2024,
    abstrak: 'Penelitian ini menganalisis konstruksi hukum pertanggungjawaban pidana terhadap korporasi and individu dalam jaringan perdagangan orang. Fokus utama adalah sinkronisasi UU TPPO dengan instrumen HAM internasional.',
    file: 'skripsi_ahmad_2024.pdf'
  },
  {
    id: 2,
    judul: 'Legalitas Smart Contracts dalam Hukum Perjanjian Indonesia',
    penulis: 'Siti Aminah, S.H.',
    jenis: CollectionType.JURNAL,
    fakultas_id: 2,
    tahun: 2023,
    abstrak: 'Mengkaji penerapan Pasal 1320 BW terhadap kontrak berbasis blockchain. Jurnal ini memberikan perspektif baru mengenai syarat sah perjanjian dalam era ekonomi digital.',
    file: 'jurnal_siti_2023.pdf'
  }
];

export const MOCK_BUKU: Buku[] = [
  { 
    id: 1, 
    kode_buku: 'LAW-001', 
    judul: 'Pengantar Hukum Indonesia', 
    penulis: 'R. Soeroso', 
    penerbit: 'Sinar Grafika', 
    tahun: 2021, 
    kategori: 'Dasar Hukum', 
    lokasi_rak: 'A-01', 
    status: BookStatus.TERSEDIA,
    cover: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=400'
  }
];

export const MOCK_PEMINJAMAN: Peminjaman[] = [
  {
    id: 1,
    kode_buku: 'LAW-001',
    user_id: 3,
    nama_peminjam: 'Ahmad Bagus Pratama',
    tanggal_pinjam: '2024-03-10',
    tanggal_kembali: '2024-03-17',
    denda: 0,
    status: PeminjamanStatus.DIPINJAM
  }
];

class LibraryStore {
  private users = [...MOCK_USERS];
  private koleksi = [...MOCK_KOLEKSI];
  private buku = [...MOCK_BUKU];
  private peminjaman = [...MOCK_PEMINJAMAN];
  private fakultas = [...MOCK_FAKULTAS];
  private fineAmount = 2000; // Default fine amount

  getKoleksi() { return this.koleksi; }
  getBuku() { return this.buku; }
  getPeminjaman() { return this.peminjaman; }
  getFakultas() { return this.fakultas; }
  getUsers() { return this.users; }
  
  getFineAmount() { return this.fineAmount; }
  setFineAmount(amount: number) { this.fineAmount = amount; }

  login(username: string, password?: string) {
    const user = this.users.find(u => u.username === username);
    if (user && user.password === password) return user;
    // For demo convenience if no password provided (matching existing behavior)
    if (user && !password) return user;
    return null;
  }

  getUserByBarcode(barcode: string) {
    return this.users.find(u => u.barcode === barcode);
  }

  // User Management
  addUser(userData: Omit<User, 'id'>) {
    const newId = this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1;
    const newUser = { ...userData, id: newId };
    this.users.push(newUser);
    return newUser;
  }

  deleteUser(id: number) {
    this.users = this.users.filter(u => u.id !== id);
  }

  updateUserPassword(id: number, newPassword: string) {
    const user = this.users.find(u => u.id === id);
    if (user) {
      user.password = newPassword;
      return true;
    }
    return false;
  }

  // Collection Management
  addKoleksi(k: Omit<Koleksi, 'id'>) {
    const newK = { ...k, id: this.koleksi.length + 1 };
    this.koleksi.push(newK);
    return newK;
  }

  deleteKoleksi(id: number) {
    this.koleksi = this.koleksi.filter(k => k.id !== id);
  }

  // Book Management
  addBuku(b: Omit<Buku, 'id' | 'status'>) {
    if (this.buku.some(item => item.kode_buku === b.kode_buku)) return null;
    const newB: Buku = { ...b, id: this.buku.length + 1, status: BookStatus.TERSEDIA };
    this.buku.push(newB);
    return newB;
  }

  deleteBuku(id: number) {
    this.buku = this.buku.filter(item => item.id !== id);
  }

  pinjamBuku(kode: string, userId: number, tglKembali: string) {
    const b = this.buku.find(item => item.kode_buku === kode);
    const user = this.users.find(u => u.id === userId);
    if (!b || b.status !== BookStatus.TERSEDIA || !user) return null;

    const newPinjam: Peminjaman = {
      id: this.peminjaman.length + 1,
      kode_buku: kode,
      user_id: userId,
      nama_peminjam: user.nama,
      tanggal_pinjam: new Date().toISOString().split('T')[0],
      tanggal_kembali: tglKembali,
      denda: 0,
      status: PeminjamanStatus.DIPINJAM
    };

    this.peminjaman.push(newPinjam);
    b.status = BookStatus.DIPINJAM;
    return newPinjam;
  }

  kembalikanBuku(kode: string) {
    const p = this.peminjaman.find(item => item.kode_buku === kode && item.status === PeminjamanStatus.DIPINJAM);
    const b = this.buku.find(item => item.kode_buku === kode);
    if (!p || !b) return null;

    const tglKembali = new Date();
    const jatuhTempo = new Date(p.tanggal_kembali);
    
    // Reset hours for date calculation
    const d1 = new Date(tglKembali.getFullYear(), tglKembali.getMonth(), tglKembali.getDate());
    const d2 = new Date(jatuhTempo.getFullYear(), jatuhTempo.getMonth(), jatuhTempo.getDate());

    const diffTime = d1.getTime() - d2.getTime();
    const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    
    p.tanggal_dikembalikan = tglKembali.toISOString().split('T')[0];
    p.denda = diffDays * this.fineAmount;
    p.status = PeminjamanStatus.DIKEMBALIKAN;
    b.status = BookStatus.TERSEDIA;
    return p;
  }
}

export const store = new LibraryStore();
