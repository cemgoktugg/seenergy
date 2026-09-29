/**
 * One glyph per top-level category, shared by the homepage board and the
 * /kategori index so a category is recognisable by the same shape in both.
 *
 * Keyed by href, so a renamed label cannot silently unpair a category from its
 * glyph; an unmapped category simply renders without one. Lucide has no
 * fingerprint in this version, so access control uses the face scan.
 */

import {
  BellRing,
  Cable,
  Car,
  Cctv,
  Flame,
  HardDrive,
  LockKeyhole,
  Monitor,
  Network,
  SatelliteDish,
  ScanFace,
  Server,
  Siren,
  Speaker,
  type LucideIcon,
} from 'lucide-react';

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  '/kategori/cctv-guvenlik-sistemleri': Cctv,
  '/kategori/arac-kameralari': Car,
  '/kategori/kayit-ve-depolama': HardDrive,
  '/kategori/network-urunleri': Network,
  '/kategori/yangin-algilama-sistemleri': Flame,
  '/kategori/alarm-sistemleri': Siren,
  '/kategori/uydu-sistemleri': SatelliteDish,
  '/kategori/rack-kabinetler': Server,
  '/kategori/aksesuarlar': Cable,
  '/kategori/elektronik-kilit-sistemleri': LockKeyhole,
  '/kategori/gecis-kontrol-sistemleri': ScanFace,
  '/kategori/interkom-sistemleri': BellRing,
  '/kategori/seslendirme-sistemleri': Speaker,
  '/kategori/monitor': Monitor,
};
