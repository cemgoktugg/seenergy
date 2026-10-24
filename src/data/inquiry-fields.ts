/**
 * The field shape the request forms are written in, and the contact fields
 * every form starts with. Kept out of inquiry-form.tsx (a client module) so
 * server pages can import the values, not a client reference.
 */

export interface InquiryField {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'date' | 'number';
  required?: boolean;
  placeholder?: string;
  hint?: string;
  options?: readonly string[];
  /** Spans both columns from `sm`. */
  wide?: boolean;
  autoComplete?: string;
}

/** Name, e-mail and phone — every form starts with them. */
export const CONTACT_FIELDS: InquiryField[] = [
  { name: 'name', label: 'Ad soyad', required: true, autoComplete: 'name' },
  { name: 'email', label: 'E-posta', type: 'email', required: true, autoComplete: 'email' },
  { name: 'phone', label: 'Telefon', type: 'tel', placeholder: '05xx xxx xx xx', autoComplete: 'tel' },
];

