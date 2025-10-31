-- ==========================================
-- Database Schema - منصة شهاداتي
-- ==========================================

-- 1. جدول profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('instructor', 'student', 'admin')),
  organization_name TEXT,
  profile_image_url TEXT,
  total_certificates_created INT DEFAULT 0,
  total_certificates_received INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON profiles(is_active);

-- 2. جدول certificate_templates
CREATE TABLE IF NOT EXISTS certificate_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_name TEXT NOT NULL,
  course_description TEXT,
  course_date DATE,
  template_file_url TEXT NOT NULL,
  template_file_type TEXT NOT NULL CHECK (template_file_type IN ('png', 'jpg', 'jpeg', 'pdf')),
  template_file_size INT,
  template_width INT,
  template_height INT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'deleted')),
  total_issued INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_templates_instructor ON certificate_templates(instructor_id);
CREATE INDEX IF NOT EXISTS idx_templates_status ON certificate_templates(status);
CREATE INDEX IF NOT EXISTS idx_templates_created ON certificate_templates(created_at DESC);

-- 3. جدول template_fields
CREATE TABLE IF NOT EXISTS template_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES certificate_templates(id) ON DELETE CASCADE,
  field_type TEXT NOT NULL CHECK (field_type IN ('student_name', 'date', 'certificate_number', 'custom')),
  field_label TEXT,
  position_x_percent DECIMAL(5,2) NOT NULL,
  position_y_percent DECIMAL(5,2) NOT NULL,
  font_family TEXT DEFAULT 'Arial',
  font_size INT DEFAULT 24,
  font_color TEXT DEFAULT '#000000',
  font_weight TEXT DEFAULT 'normal' CHECK (font_weight IN ('normal', 'bold')),
  text_align TEXT DEFAULT 'center' CHECK (text_align IN ('left', 'center', 'right')),
  max_width_percent DECIMAL(5,2),
  display_order INT DEFAULT 1,
  default_value TEXT,
  is_required BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fields_template ON template_fields(template_id);
CREATE INDEX IF NOT EXISTS idx_fields_type ON template_fields(field_type);
CREATE INDEX IF NOT EXISTS idx_fields_order ON template_fields(template_id, display_order);

-- 4. جدول access_codes
CREATE TABLE IF NOT EXISTS access_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES certificate_templates(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  unique_link TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ,
  max_uses INT,
  current_uses INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT code_length_check CHECK (length(code) >= 6 AND length(code) <= 12)
);

CREATE INDEX IF NOT EXISTS idx_codes_template ON access_codes(template_id);
CREATE INDEX IF NOT EXISTS idx_codes_code ON access_codes(code);
CREATE INDEX IF NOT EXISTS idx_codes_link ON access_codes(unique_link);
CREATE INDEX IF NOT EXISTS idx_codes_active ON access_codes(is_active);
CREATE INDEX IF NOT EXISTS idx_codes_expires ON access_codes(expires_at);

-- 5. جدول issued_certificates
CREATE TABLE IF NOT EXISTS issued_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES certificate_templates(id) ON DELETE SET NULL,
  access_code_id UUID REFERENCES access_codes(id) ON DELETE SET NULL,
  recipient_name TEXT NOT NULL,
  recipient_email TEXT,
  student_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  certificate_file_url TEXT NOT NULL,
  certificate_number TEXT UNIQUE,
  issue_method TEXT NOT NULL CHECK (issue_method IN ('self_service', 'manual_instructor', 'manual_admin')),
  issued_by UUID REFERENCES profiles(id),
  field_values JSONB,
  ip_address INET,
  user_agent TEXT,
  issued_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_issued_template ON issued_certificates(template_id);
CREATE INDEX IF NOT EXISTS idx_issued_student ON issued_certificates(student_id);
CREATE INDEX IF NOT EXISTS idx_issued_code ON issued_certificates(access_code_id);
CREATE INDEX IF NOT EXISTS idx_issued_date ON issued_certificates(issued_at DESC);
CREATE INDEX IF NOT EXISTS idx_issued_method ON issued_certificates(issue_method);
CREATE INDEX IF NOT EXISTS idx_issued_number ON issued_certificates(certificate_number);
CREATE INDEX IF NOT EXISTS idx_issued_field_values ON issued_certificates USING GIN (field_values);

-- 6. جدول certificate_archive
CREATE TABLE IF NOT EXISTS certificate_archive (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  certificate_id UUID NOT NULL REFERENCES issued_certificates(id) ON DELETE CASCADE,
  notes TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  archived_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_archive_student ON certificate_archive(student_id);
CREATE INDEX IF NOT EXISTS idx_archive_certificate ON certificate_archive(certificate_id);
CREATE INDEX IF NOT EXISTS idx_archive_favorite ON certificate_archive(student_id, is_favorite);
CREATE UNIQUE INDEX IF NOT EXISTS idx_archive_unique ON certificate_archive(student_id, certificate_id);

-- 7. جدول admin_logs
CREATE TABLE IF NOT EXISTS admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL CHECK (action_type IN (
    'manual_certificate_issued',
    'template_managed',
    'user_managed',
    'code_modified',
    'settings_changed'
  )),
  action_description TEXT NOT NULL,
  action_data JSONB,
  related_entity_type TEXT,
  related_entity_id UUID,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_logs_admin ON admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_logs_action ON admin_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_logs_date ON admin_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_entity ON admin_logs(related_entity_type, related_entity_id);

-- 8. جدول platform_templates
CREATE TABLE IF NOT EXISTS platform_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name TEXT NOT NULL,
  template_description TEXT,
  template_preview_url TEXT NOT NULL,
  template_file_url TEXT NOT NULL,
  category TEXT CHECK (category IN ('modern', 'classic', 'elegant', 'corporate')),
  default_fields JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 1,
  usage_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_platform_active ON platform_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_platform_order ON platform_templates(display_order);

-- ==========================================
-- Database Functions
-- ==========================================

-- دالة للتحقق من صلاحية الكود
CREATE OR REPLACE FUNCTION is_code_valid(code_text TEXT)
RETURNS TABLE (
  is_valid BOOLEAN,
  error_message TEXT,
  template_id UUID
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    CASE 
      WHEN ac.id IS NULL THEN FALSE
      WHEN NOT ac.is_active THEN FALSE
      WHEN ac.expires_at IS NOT NULL AND ac.expires_at < NOW() THEN FALSE
      WHEN ac.max_uses IS NOT NULL AND ac.current_uses >= ac.max_uses THEN FALSE
      ELSE TRUE
    END AS is_valid,
    
    CASE 
      WHEN ac.id IS NULL THEN 'الكود غير صحيح'
      WHEN NOT ac.is_active THEN 'الكود غير نشط'
      WHEN ac.expires_at IS NOT NULL AND ac.expires_at < NOW() THEN 'الكود منتهي الصلاحية'
      WHEN ac.max_uses IS NOT NULL AND ac.current_uses >= ac.max_uses THEN 'تم استنفاذ جميع الاستخدامات'
      ELSE NULL
    END AS error_message,
    
    ac.template_id
  FROM access_codes ac
  WHERE LOWER(ac.code) = LOWER(code_text)
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- Triggers
-- ==========================================

-- Trigger: زيادة عداد الاستخدامات عند إصدار شهادة
CREATE OR REPLACE FUNCTION increment_usage_counters()
RETURNS TRIGGER AS $$
BEGIN
  -- زيادة عداد القالب
  IF NEW.template_id IS NOT NULL THEN
    UPDATE certificate_templates 
    SET total_issued = total_issued + 1
    WHERE id = NEW.template_id;
  END IF;
  
  -- زيادة عداد الكود
  IF NEW.access_code_id IS NOT NULL THEN
    UPDATE access_codes 
    SET current_uses = current_uses + 1
    WHERE id = NEW.access_code_id;
  END IF;
  
  -- زيادة عداد الطالب
  IF NEW.student_id IS NOT NULL THEN
    UPDATE profiles 
    SET total_certificates_received = total_certificates_received + 1
    WHERE id = NEW.student_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS after_certificate_issued ON issued_certificates;
CREATE TRIGGER after_certificate_issued
  AFTER INSERT ON issued_certificates
  FOR EACH ROW
  EXECUTE FUNCTION increment_usage_counters();

-- Trigger: إنشاء profile تلقائياً عند التسجيل
CREATE OR REPLACE FUNCTION create_profile_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, email, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'مستخدم جديد'),
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_profile_on_signup();

-- ==========================================
-- Row Level Security (RLS) Policies
-- ==========================================

-- 1. profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 2. certificate_templates
ALTER TABLE certificate_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Instructors can view own templates" ON certificate_templates;
CREATE POLICY "Instructors can view own templates"
  ON certificate_templates FOR SELECT
  USING (instructor_id = auth.uid());

DROP POLICY IF EXISTS "Instructors can create templates" ON certificate_templates;
CREATE POLICY "Instructors can create templates"
  ON certificate_templates FOR INSERT
  WITH CHECK (
    instructor_id = auth.uid() AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'instructor')
  );

DROP POLICY IF EXISTS "Instructors can update own templates" ON certificate_templates;
CREATE POLICY "Instructors can update own templates"
  ON certificate_templates FOR UPDATE
  USING (instructor_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage all templates" ON certificate_templates;
CREATE POLICY "Admins can manage all templates"
  ON certificate_templates FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 3. template_fields
ALTER TABLE template_fields ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Instructors can manage their template fields" ON template_fields;
CREATE POLICY "Instructors can manage their template fields"
  ON template_fields FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM certificate_templates
      WHERE id = template_fields.template_id
      AND instructor_id = auth.uid()
    )
  );

-- 4. access_codes
ALTER TABLE access_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Instructors can manage their codes" ON access_codes;
CREATE POLICY "Instructors can manage their codes"
  ON access_codes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM certificate_templates
      WHERE id = access_codes.template_id
      AND instructor_id = auth.uid()
    )
  );

-- 5. issued_certificates
ALTER TABLE issued_certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can issue certificate" ON issued_certificates;
CREATE POLICY "Anyone can issue certificate"
  ON issued_certificates FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Students can view own certificates" ON issued_certificates;
CREATE POLICY "Students can view own certificates"
  ON issued_certificates FOR SELECT
  USING (student_id = auth.uid());

DROP POLICY IF EXISTS "Instructors can view certificates from their templates" ON issued_certificates;
CREATE POLICY "Instructors can view certificates from their templates"
  ON issued_certificates FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM certificate_templates
      WHERE id = issued_certificates.template_id
      AND instructor_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can view all certificates" ON issued_certificates;
CREATE POLICY "Admins can view all certificates"
  ON issued_certificates FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 6. certificate_archive
ALTER TABLE certificate_archive ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can manage own archive" ON certificate_archive;
CREATE POLICY "Students can manage own archive"
  ON certificate_archive FOR ALL
  USING (student_id = auth.uid());

-- 7. admin_logs (read-only for admins)
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view logs" ON admin_logs;
CREATE POLICY "Admins can view logs"
  ON admin_logs FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can create logs" ON admin_logs;
CREATE POLICY "Admins can create logs"
  ON admin_logs FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 8. platform_templates (read-only for all)
ALTER TABLE platform_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active platform templates" ON platform_templates;
CREATE POLICY "Anyone can view active platform templates"
  ON platform_templates FOR SELECT
  USING (is_active = TRUE);

DROP POLICY IF EXISTS "Admins can manage platform templates" ON platform_templates;
CREATE POLICY "Admins can manage platform templates"
  ON platform_templates FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ==========================================
-- Views
-- ==========================================

-- طريقة عرض سريعة للوحة تحكم المحاضر
CREATE OR REPLACE VIEW instructor_dashboard_view AS
SELECT 
  ct.id AS template_id,
  ct.course_name,
  ct.status,
  ct.total_issued,
  ct.created_at,
  ac.code,
  ac.unique_link,
  ac.is_active AS code_is_active,
  ac.expires_at,
  ac.max_uses,
  ac.current_uses,
  p.full_name AS instructor_name,
  p.organization_name
FROM certificate_templates ct
LEFT JOIN access_codes ac ON ac.template_id = ct.id
INNER JOIN profiles p ON p.id = ct.instructor_id
WHERE ct.status = 'active';

-- طريقة عرض للشهادات من منظور الطالب
CREATE OR REPLACE VIEW student_certificates_view AS
SELECT 
  ic.id AS certificate_id,
  ic.recipient_name,
  ic.certificate_file_url,
  ic.certificate_number,
  ic.issued_at,
  ct.course_name,
  ct.course_date,
  p.full_name AS instructor_name,
  p.organization_name,
  ca.is_favorite,
  ca.notes
FROM issued_certificates ic
INNER JOIN certificate_templates ct ON ct.id = ic.template_id
INNER JOIN profiles p ON p.id = ct.instructor_id
LEFT JOIN certificate_archive ca ON ca.certificate_id = ic.id
WHERE ic.student_id IS NOT NULL;
