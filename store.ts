
import { User, UserRole, Koleksi, CollectionType, Buku, BookStatus, Peminjaman, PeminjamanStatus, Fakultas } from './types';

// Initial Mock Data
export const MOCK_USERS: User[] = [
  { id: 1, nama: 'Admin Perpustakaan FH', nim_nidn: '198501012010121001', username: 'admin', role: UserRole.ADMIN, barcode: 'KTM-ADMIN' },
  { id: 2, nama: 'Prof. Dr. Yusak Farchne, S.H., M.H.', nim_nidn: '197503022000031002', username: 'dosen', role: UserRole.DOSEN, barcode: 'KTM-DOSEN' },
  { id: 3, nama: 'Ahmad Bagus Pratama', nim_nidn: '2101010042', username: 'mhs', role: UserRole.MAHASISWA, barcode: 'KTM-001' }
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
    abstrak: 'Penelitian ini menganalisis konstruksi hukum pertanggungjawaban pidana terhadap korporasi dan individu dalam jaringan perdagangan orang. Fokus utama adalah sinkronisasi UU TPPO dengan instrumen HAM internasional.',
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
  },
  { 
    id: 2, 
    kode_buku: 'LAW-002', 
    judul: 'Hukum Acara Pidana', 
    penulis: 'Andi Hamzah', 
    penerbit: 'Sinar Grafika', 
    tahun: 2019, 
    kategori: 'Hukum Pidana', 
    lokasi_rak: 'B-04', 
    status: BookStatus.DIPINJAM,
    cover: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 3, 
    kode_buku: 'LAW-003', 
    judul: 'Hukum Tata Negara Indonesia', 
    penulis: 'Jimly Asshiddiqie', 
    penerbit: 'Rajawali Pers', 
    tahun: 2022, 
    kategori: 'HTN', 
    lokasi_rak: 'C-02', 
    status: BookStatus.TERSEDIA,
    cover: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=400'
  }
];

export const MOCK_PEMINJAMAN: Peminjaman[] = [
  {
    id: 1,
    kode_buku: 'LAW-002',
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

  getKoleksi() { return this.koleksi; }
  getBuku() { return this.buku; }
  getPeminjaman() { return this.peminjaman; }
  getFakultas() { return this.fakultas; }

  login(username: string) {
    return this.users.find(u => u.username === username);
  }

  getUserByBarcode(barcode: string) {
    return this.users.find(u => u.barcode === barcode);
  }

  addKoleksi(k: Omit<Koleksi, 'id'>) {
    const newK = { ...k, id: this.koleksi.length + 1 };
    this.koleksi.push(newK);
    return newK;
  }

  deleteKoleksi(id: number) {
    this.koleksi = this.koleksi.filter(k => k.id !== id);
  }

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
    const diffTime = Math.max(0, tglKembali.getTime() - jatuhTempo.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    p.tanggal_dikembalikan = tglKembali.toISOString().split('T')[0];
    p.denda = diffDays * 2000;
    p.status = PeminjamanStatus.DIKEMBALIKAN;
    b.status = BookStatus.TERSEDIA;
    return p;
  }
}

export const store = new LibraryStore();
