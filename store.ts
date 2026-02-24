
import { User, UserRole, Koleksi, CollectionType, Buku, BookStatus, Peminjaman, PeminjamanStatus, Fakultas } from './types';

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

class LibraryStore {
  private users = [...MOCK_USERS];
  private koleksi: Koleksi[] = [
    {
      id: 1,
      judul: 'Pertanggungjawaban Pidana Pelaku Tindak Pidana Perdagangan Orang dalam Perspektif HAM',
      penulis: 'Ahmad Bagus Pratama',
      jenis: CollectionType.SKRIPSI,
      fakultas_id: 1,
      tahun: 2024,
      abstrak: 'Penelitian ini menganalisis konstruksi hukum pertanggungjawaban pidana terhadap korporasi dan individu dalam jaringan perdagangan orang. Fokus utama adalah sinkronisasi UU TPPO dengan instrumen HAM internasional.',
      file: 'skripsi_ahmad_2024.pdf'
    }
  ];
  private buku: Buku[] = [
    { 
      id: 1, kode_buku: 'LAW-001', judul: 'Pengantar Hukum Indonesia', penulis: 'R. Soeroso', 
      penerbit: 'Sinar Grafika', tahun: 2021, kategori: 'Dasar Hukum', lokasi_rak: 'A-01', status: BookStatus.TERSEDIA,
      cover: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=400'
    }
  ];
  private peminjaman: Peminjaman[] = [
    {
      id: 1, kode_buku: 'LAW-001', user_id: 3, nama_peminjam: 'Ahmad Bagus Pratama',
      tanggal_pinjam: '2024-03-10', tanggal_kembali: '2024-03-17', denda: 0, status: PeminjamanStatus.DIPINJAM
    }
  ];
  private fineAmount = 2000;

  getKoleksi() { return this.koleksi; }
  getBuku() { return this.buku; }
  getPeminjaman() { return this.peminjaman; }
  getUsers() { return this.users; }
  getFakultas() { return [
    { id: 1, nama_fakultas: 'Hukum Pidana' },
    { id: 2, nama_fakultas: 'Hukum Perdata' },
    { id: 3, nama_fakultas: 'Hukum Tata Negara' },
    { id: 4, nama_fakultas: 'Hukum Internasional' }
  ]; }
  
  getFineAmount() { return this.fineAmount; }
  setFineAmount(amount: number) { this.fineAmount = amount; }

  login(identifier: string, password?: string) {
    const user = this.users.find(u => 
      u.username.toLowerCase() === identifier.toLowerCase() || u.nim_nidn === identifier
    );
    if (user && user.password === password) return user;
    return null;
  }

  getUserByBarcode(barcode: string) {
    return this.users.find(u => u.barcode === barcode);
  }

  addUser(userData: Omit<User, 'id'>) {
    const newId = this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1;
    const newUser = { ...userData, id: newId };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(id: number, data: Partial<User>) {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...data };
      return { success: true, user: this.users[index] };
    }
    return { success: false, message: 'User tidak ditemukan' };
  }

  updateUserPassword(id: number, newPass: string) {
    const user = this.users.find(u => u.id === id);
    if (user) { user.password = newPass; return true; }
    return false;
  }

  deleteUser(id: number) { this.users = this.users.filter(u => u.id !== id); }

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

  updateJatuhTempo(peminjamanId: number, tglBaru: string) {
    const p = this.peminjaman.find(item => item.id === peminjamanId);
    if (p) { p.tanggal_kembali = tglBaru; return true; }
    return false;
  }

  calculateCurrentFine(p: Peminjaman) {
    if (p.status === PeminjamanStatus.DIKEMBALIKAN) return p.denda;
    const today = new Date();
    const jatuhTempo = new Date(p.tanggal_kembali);
    const d1 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const d2 = new Date(jatuhTempo.getFullYear(), jatuhTempo.getMonth(), jatuhTempo.getDate());
    const diffDays = Math.max(0, Math.ceil((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24)));
    return diffDays * this.fineAmount;
  }

  kembalikanBuku(kode: string) {
    const p = this.peminjaman.find(item => item.kode_buku === kode && item.status === PeminjamanStatus.DIPINJAM);
    const b = this.buku.find(item => item.kode_buku === kode);
    if (!p || !b) return null;
    p.denda = this.calculateCurrentFine(p);
    p.tanggal_dikembalikan = new Date().toISOString().split('T')[0];
    p.status = PeminjamanStatus.DIKEMBALIKAN;
    b.status = BookStatus.TERSEDIA;
    return p;
  }

  addBuku(b: Omit<Buku, 'id' | 'status'>) {
    const newB = { ...b, id: this.buku.length + 1, status: BookStatus.TERSEDIA };
    this.buku.push(newB);
    return newB;
  }

  deleteBuku(id: number) { this.buku = this.buku.filter(b => b.id !== id); }

  addKoleksi(k: Omit<Koleksi, 'id'>) {
    const newK = { ...k, id: this.koleksi.length + 1 };
    this.koleksi.push(newK);
    return newK;
  }

  deleteKoleksi(id: number) { this.koleksi = this.koleksi.filter(k => k.id !== id); }
}

export const store = new LibraryStore();
