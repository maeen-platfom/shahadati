/**
 * أنواع Access Code
 */

export interface AccessCode {
  id: string;
  template_id: string;
  code: string;
  unique_link: string;
  expires_at: string | null;
  max_uses: number | null;
  current_uses: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AccessCodeFormData {
  expires_at: string | null;
  max_uses: number | null;
  is_active: boolean;
}

export interface AccessCodeValidation {
  is_valid: boolean;
  error_message: string | null;
  template_id: string | null;
}

export interface CertificateRequestData {
  code: string;
  student_name: string;
  student_email?: string;
  save_to_account?: boolean;
}

export interface IssuedCertificate {
  id: string;
  template_id: string;
  access_code_id: string;
  recipient_name: string;
  recipient_email: string | null;
  student_id: string | null;
  certificate_file_url: string;
  certificate_number: string | null;
  issue_method: 'self_service' | 'manual_instructor' | 'manual_admin';
  issued_by: string | null;
  field_values: Record<string, any> | null;
  ip_address: string | null;
  user_agent: string | null;
  issued_at: string;
}
