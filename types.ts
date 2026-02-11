
export enum UserRole {
  ADMIN = 'admin',
  DOSEN = 'dosen',
  MAHASISWA = 'mahasiswa'
}

export enum CollectionType {
  SKRIPSI = 'skripsi',
  JURNAL = 'jurnal',
  BUKU = 'buku'
}

export enum BookStatus {
  TERSEDIA = 'tersedia',
  DIPINJAM = 'dipinjam'
}

export enum PeminjamanStatus {
  DIPINJAM = 'dipinjam',
  DIKEMBALIKAN = 'dikembalikan'
}

export interface User {
  id: number;
  nama: string;
  nim_nidn: string;
  username: string;
  role: UserRole;
  barcode?: string;
}

export interface Fakultas {
  id: number;
  nama_fakultas: string;
}

export interface Koleksi {
  id: number;
  judul: string;
  penulis: string;
  jenis: CollectionType;
  fakultas_id: number;
  tahun: number;
  abstrak: string;
  file: string;
}

export interface Buku {
  id: number;
  kode_buku: string;
  judul: string;
  penulis: string;
  penerbit: string;
  tahun: number;
  kategori: string;
  lokasi_rak: string;
  status: BookStatus;
  cover?: string;
}

export interface Peminjaman {
  id: number;
  kode_buku: string;
  user_id: number;
  nama_peminjam: string; // Cached name for historical display
  tanggal_pinjam: string;
  tanggal_kembali: string;
  tanggal_dikembalikan?: string;
  denda: number;
  status: PeminjamanStatus;
}
