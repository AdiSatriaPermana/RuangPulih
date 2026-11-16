export type ServiceCategory = 'Finansial' | 'Akademik' | 'Bantuan Sosial';

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  category: ServiceCategory;
  summary: string;
  verifiedAt: string;
  source: string;
  unitName: string;
  contactEmail: string;
  contactPhone: string;
  officialSteps: string[];
  prerequisites: string[];
  isActive: boolean;
}

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: '1',
    slug: 'bantuan-beasiswa',
    title: 'Bantuan Beasiswa',
    category: 'Finansial',
    summary: 'Informasi program, syarat, dan tata cara pengajuan beasiswa.',
    verifiedAt: '10 Nov 2026',
    source: 'Unit Kemahasiswaan',
    unitName: 'Unit Layanan Kemahasiswaan',
    contactEmail: 'layanan@kampus.ac.id',
    contactPhone: '(022) 0000 0000',
    officialSteps: [
      'Periksa persyaratan dan periode pendaftaran.',
      'Siapkan dokumen yang tercantum pada daftar prasyarat.',
      'Kirim permohonan melalui formulir RuangPulih.',
    ],
    prerequisites: [
      'Kartu Tanda Mahasiswa (KTM)',
      'Kartu Keluarga atau dokumen pendukung',
    ],
    isActive: true,
  },
  {
    id: '2',
    slug: 'konseling-birokrasi',
    title: 'Konseling Birokrasi',
    category: 'Akademik',
    summary: 'Pendampingan memahami alur dan kelengkapan berkas administrasi.',
    verifiedAt: '10 Nov 2026',
    source: 'Unit Kemahasiswaan',
    unitName: 'Unit Layanan Kemahasiswaan',
    contactEmail: 'layanan@kampus.ac.id',
    contactPhone: '(022) 0000 0000',
    officialSteps: [
      'Periksa persyaratan dan periode pendaftaran.',
      'Siapkan dokumen yang tercantum pada daftar prasyarat.',
      'Kirim permohonan melalui formulir RuangPulih.',
    ],
    prerequisites: [
      'Konfirmasi persyaratan dengan unit layanan resmi',
      'Siapkan dokumen sesuai arahan unit layanan',
    ],
    isActive: true,
  },
  {
    id: '3',
    slug: 'bantuan-dana-darurat',
    title: 'Bantuan Dana Darurat',
    category: 'Finansial',
    summary: 'Informasi bantuan untuk kebutuhan mendesak mahasiswa.',
    verifiedAt: '10 Nov 2026',
    source: 'Unit Kemahasiswaan',
    unitName: 'Unit Layanan Kemahasiswaan',
    contactEmail: 'layanan@kampus.ac.id',
    contactPhone: '(022) 0000 0000',
    officialSteps: [
      'Periksa persyaratan dan periode pendaftaran.',
      'Siapkan dokumen yang tercantum pada daftar prasyarat.',
      'Kirim permohonan melalui formulir RuangPulih.',
    ],
    prerequisites: [
      'Konfirmasi persyaratan dengan unit layanan resmi',
      'Siapkan dokumen sesuai arahan unit layanan',
    ],
    isActive: true,
  },
  {
    id: '4',
    slug: 'pendampingan-sosial',
    title: 'Pendampingan Sosial',
    category: 'Bantuan Sosial',
    summary: 'Informasi unit pendamping untuk kebutuhan non-akademik mahasiswa.',
    verifiedAt: '10 Nov 2026',
    source: 'Unit Kemahasiswaan',
    unitName: 'Unit Layanan Kemahasiswaan',
    contactEmail: 'layanan@kampus.ac.id',
    contactPhone: '(022) 0000 0000',
    officialSteps: [
      'Periksa persyaratan dan periode pendaftaran.',
      'Siapkan dokumen yang tercantum pada daftar prasyarat.',
      'Kirim permohonan melalui formulir RuangPulih.',
    ],
    prerequisites: [
      'Konfirmasi persyaratan dengan unit layanan resmi',
      'Siapkan dokumen sesuai arahan unit layanan',
    ],
    isActive: true,
  },
  {
    id: '5',
    slug: 'konsultasi-akademik',
    title: 'Konsultasi Akademik',
    category: 'Akademik',
    summary: 'Arahan terkait proses dan administrasi akademik.',
    verifiedAt: '10 Nov 2026',
    source: 'Unit Kemahasiswaan',
    unitName: 'Unit Layanan Kemahasiswaan',
    contactEmail: 'layanan@kampus.ac.id',
    contactPhone: '(022) 0000 0000',
    officialSteps: [
      'Periksa persyaratan dan periode pendaftaran.',
      'Siapkan dokumen yang tercantum pada daftar prasyarat.',
      'Kirim permohonan melalui formulir RuangPulih.',
    ],
    prerequisites: [
      'Konfirmasi persyaratan dengan unit layanan resmi',
      'Siapkan dokumen sesuai arahan unit layanan',
    ],
    isActive: true,
  },
  {
    id: '6',
    slug: 'aksesibilitas-kampus',
    title: 'Aksesibilitas Kampus',
    category: 'Bantuan Sosial',
    summary: 'Informasi dukungan dan pendampingan akses layanan kampus.',
    verifiedAt: '10 Nov 2026',
    source: 'Unit Kemahasiswaan',
    unitName: 'Unit Layanan Kemahasiswaan',
    contactEmail: 'layanan@kampus.ac.id',
    contactPhone: '(022) 0000 0000',
    officialSteps: [
      'Periksa persyaratan dan periode pendaftaran.',
      'Siapkan dokumen yang tercantum pada daftar prasyarat.',
      'Kirim permohonan melalui formulir RuangPulih.',
    ],
    prerequisites: [
      'Konfirmasi persyaratan dengan unit layanan resmi',
      'Siapkan dokumen sesuai arahan unit layanan',
    ],
    isActive: true,
  },
  {
    id: '7',
    slug: 'program-bantuan-pendidikan',
    title: 'Program Bantuan Pendidikan',
    category: 'Finansial',
    summary: 'Informasi dukungan biaya pendidikan dan persyaratan pendaftaran.',
    verifiedAt: '10 Nov 2026',
    source: 'Unit Kemahasiswaan',
    unitName: 'Unit Layanan Kemahasiswaan',
    contactEmail: 'layanan@kampus.ac.id',
    contactPhone: '(022) 0000 0000',
    officialSteps: [
      'Periksa persyaratan dan periode pendaftaran.',
      'Siapkan dokumen yang tercantum pada daftar prasyarat.',
      'Kirim permohonan melalui formulir RuangPulih.',
    ],
    prerequisites: [
      'Konfirmasi persyaratan dengan unit layanan resmi',
      'Siapkan dokumen sesuai arahan unit layanan',
    ],
    isActive: true,
  },
];