/** Which storefront form a request came from, in the shop's words. */
export const INQUIRY_TYPES = {
  iletisim: "İletişim",
  teklif: "Fiyat teklifi",
  kurumsal: "Kurumsal / proje",
  toptan: "Toptan satış",
  bayi: "Bayi başvurusu",
  havale: "Havale bildirimi",
  kariyer: "İş başvurusu",
} as const

export type InquiryType = keyof typeof INQUIRY_TYPES

export const INQUIRY_STATUSES = {
  yeni: "Yeni",
  islemde: "İşlemde",
  tamamlandi: "Tamamlandı",
} as const

export type InquiryStatus = keyof typeof INQUIRY_STATUSES
