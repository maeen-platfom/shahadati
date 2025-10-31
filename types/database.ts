export type UserRole = 'instructor' | 'student' | 'admin';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  organization_name?: string;
  profile_image_url?: string;
  total_certificates_created: number;
  total_certificates_received: number;
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

export interface CertificateTemplate {
  id: string;
  instructor_id: string;
  course_name: string;
  course_description?: string;
  course_date?: string;
  template_file_url: string;
  template_file_type: 'png' | 'jpg' | 'jpeg' | 'pdf';
  template_file_size?: number;
  template_width?: number;
  template_height?: number;
  status: 'active' | 'inactive' | 'deleted';
  total_issued: number;
  created_at: string;
  updated_at: string;
}

export interface TemplateField {
  id: string;
  template_id: string;
  field_type: 'student_name' | 'date' | 'certificate_number' | 'custom';
  field_label?: string;
  position_x_percent: number;
  position_y_percent: number;
  font_family: string;
  font_size: number;
  font_color: string;
  font_weight: 'normal' | 'bold';
  text_align: 'left' | 'center' | 'right';
  max_width_percent?: number;
  display_order: number;
  default_value?: string;
  is_required: boolean;
  created_at: string;
}

export interface AccessCode {
  id: string;
  template_id: string;
  code: string;
  unique_link: string;
  expires_at?: string;
  max_uses?: number;
  current_uses: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface IssuedCertificate {
  id: string;
  template_id: string;
  access_code_id?: string;
  recipient_name: string;
  recipient_email?: string;
  student_id?: string;
  certificate_file_url: string;
  certificate_number?: string;
  issue_method: 'self_service' | 'manual_instructor' | 'manual_admin';
  issued_by?: string;
  field_values?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  issued_at: string;
}
