-- ====================================================================
-- HELOIX WORKHUB - POSTGRESQL PRODUCTION RELATIONAL SCHEMA
-- Prepared for: Heloix Startup Minds Pvt. Ltd.
-- Complies with: SRS Version 1.0 (Section 50 & 51 Database Requirements)
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE user_role AS ENUM (
  'super_admin',
  'hr_admin',
  'dept_admin',
  'mentor',
  'intern'
);

CREATE TYPE candidate_status AS ENUM (
  'draft',
  'offer_pending',
  'offer_sent',
  'offer_accepted',
  'offer_rejected',
  'documents_pending',
  'documents_submitted',
  'under_hr_verification',
  'documents_rejected',
  'approved',
  'onboarding',
  'onboarding_completed',
  'internship_pending',
  'internship_active',
  'internship_extended',
  'internship_completed',
  'terminated',
  'withdrawn'
);

CREATE TYPE document_status AS ENUM (
  'required',
  'optional',
  'not_submitted',
  'submitted',
  'under_review',
  'approved',
  'rejected',
  'resubmission_required'
);

CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'critical');

CREATE TYPE task_status AS ENUM (
  'assigned',
  'in_progress',
  'submitted',
  'under_review',
  'changes_requested',
  'resubmitted',
  'approved',
  'overdue',
  'rejected',
  'completed'
);

CREATE TYPE leave_type AS ENUM ('casual', 'sick', 'unpaid', 'special');
CREATE TYPE leave_status AS ENUM ('pending', 'approved', 'rejected');

-- 3. DEPARTMENTS & POSITIONS
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(120) NOT NULL UNIQUE,
  code VARCHAR(10) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE positions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  title VARCHAR(120) NOT NULL,
  default_duration_months INT DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. USERS & AUTHENTICATION
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(150) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'intern',
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  position VARCHAR(120),
  phone VARCHAR(30),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. CANDIDATES & PROFILES
CREATE TABLE candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  full_name VARCHAR(150) NOT NULL,
  first_name VARCHAR(60) NOT NULL,
  middle_name VARCHAR(60),
  last_name VARCHAR(60) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  phone VARCHAR(30) NOT NULL,
  country VARCHAR(50) NOT NULL DEFAULT 'India',
  nationality VARCHAR(60) NOT NULL DEFAULT 'Indian',
  dob DATE NOT NULL,
  gender VARCHAR(20) NOT NULL,
  avatar_url TEXT,
  address TEXT NOT NULL,
  city VARCHAR(80) NOT NULL,
  state VARCHAR(80) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  qualification VARCHAR(150) NOT NULL,
  department_id UUID REFERENCES departments(id) ON DELETE RESTRICT,
  position VARCHAR(120) NOT NULL,
  internship_type VARCHAR(30) DEFAULT 'Full-time',
  duration_months INT NOT NULL DEFAULT 3,
  joining_date DATE NOT NULL,
  expected_relieving_date DATE NOT NULL,
  actual_relieving_date DATE,
  status candidate_status NOT NULL DEFAULT 'draft',
  assigned_mentor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  extension_days INT NOT NULL DEFAULT 0,
  extension_reason TEXT,
  onboarding_progress INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. OFFERS & DIGITAL SIGNATURES
CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  position VARCHAR(120) NOT NULL,
  department VARCHAR(120) NOT NULL,
  stipend VARCHAR(80),
  joining_date DATE NOT NULL,
  duration_months INT NOT NULL,
  expected_relieving_date DATE NOT NULL,
  working_hours VARCHAR(120) DEFAULT '9:30 AM - 6:30 PM (Mon-Fri)',
  terms TEXT NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'pending',
  sent_date TIMESTAMP WITH TIME ZONE,
  accepted_date TIMESTAMP WITH TIME ZONE,
  signature_data TEXT,
  pdf_storage_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. CANDIDATE DOCUMENTS & VERIFICATION
CREATE TABLE candidate_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  document_name VARCHAR(150) NOT NULL,
  type VARCHAR(50) NOT NULL,
  is_mandatory BOOLEAN NOT NULL DEFAULT TRUE,
  status document_status NOT NULL DEFAULT 'not_submitted',
  file_url TEXT,
  file_name VARCHAR(255),
  file_size VARCHAR(50),
  uploaded_at TIMESTAMP WITH TIME ZONE,
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
  rejection_reason TEXT,
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. ONBOARDING ITEMS & TRACKING
CREATE TABLE onboarding_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department_id VARCHAR(50) NOT NULL DEFAULT 'all',
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  is_mandatory BOOLEAN NOT NULL DEFAULT TRUE,
  sequence INT NOT NULL DEFAULT 1,
  estimated_minutes INT NOT NULL DEFAULT 15,
  content_url TEXT,
  content_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE candidate_onboarding_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  onboarding_item_id UUID NOT NULL REFERENCES onboarding_items(id) ON DELETE CASCADE,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(candidate_id, onboarding_item_id)
);

-- 9. TASKS & SUBMISSIONS (ENFORCING MAX 7 DAYS BR-005)
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  department_id UUID REFERENCES departments(id) ON DELETE RESTRICT,
  assigned_intern_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  assigned_mentor_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  priority task_priority NOT NULL DEFAULT 'medium',
  start_date DATE NOT NULL,
  due_date DATE NOT NULL,
  duration_days INT NOT NULL CHECK (duration_days >= 1 AND duration_days <= 7), -- BR-005: Max 7 days
  instructions TEXT NOT NULL,
  expected_deliverable TEXT NOT NULL,
  status task_status NOT NULL DEFAULT 'assigned',
  rejection_count INT NOT NULL DEFAULT 0,
  review_remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE task_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  version INT NOT NULL DEFAULT 1,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completion_summary TEXT NOT NULL,
  deliverable_url TEXT,
  attachments JSONB DEFAULT '[]',
  comments TEXT
);

CREATE TABLE task_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  action VARCHAR(30) NOT NULL,
  feedback TEXT NOT NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. ATTENDANCE & DAILY WORK REPORTS (BR-006 & BR-007)
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  clock_in_time TIME NOT NULL,
  clock_out_time TIME,
  ip_address VARCHAR(50) NOT NULL,
  device_info TEXT NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'present',
  -- Daily Work Report Fields (Mandatory at Clock Out)
  work_completed TEXT,
  tasks_worked_on TEXT,
  work_in_progress TEXT,
  problems_encountered TEXT,
  time_spent_hours NUMERIC(4, 2),
  report_attachments JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(candidate_id, date)
);

-- 11. LEAVE MANAGEMENT & EXTENSIONS (BR-008 & BR-009)
CREATE TABLE leave_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  leave_type leave_type NOT NULL DEFAULT 'casual',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_days INT NOT NULL,
  reason TEXT NOT NULL,
  status leave_status NOT NULL DEFAULT 'pending',
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  remarks TEXT,
  is_excess_leave BOOLEAN DEFAULT FALSE
);

-- 12. PERFORMANCE MONITORING & WARNINGS (BR-014)
CREATE TABLE warnings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  type VARCHAR(30) NOT NULL, -- warning, final_warning, termination
  issue_date DATE NOT NULL,
  mentor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  related_task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  failed_task_count INT NOT NULL,
  reason TEXT NOT NULL,
  required_improvement TEXT NOT NULL,
  signatory VARCHAR(150) NOT NULL,
  is_acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. EVALUATIONS & CERTIFICATES (BR-011 & BR-012)
CREATE TABLE internship_evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  mentor_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  evaluation_date DATE NOT NULL,
  task_completion_score INT CHECK (task_completion_score BETWEEN 1 AND 5),
  work_quality_score INT CHECK (work_quality_score BETWEEN 1 AND 5),
  attendance_discipline_score INT CHECK (attendance_discipline_score BETWEEN 1 AND 5),
  communication_score INT CHECK (communication_score BETWEEN 1 AND 5),
  technical_skills_score INT CHECK (technical_skills_score BETWEEN 1 AND 5),
  learning_ability_score INT CHECK (learning_ability_score BETWEEN 1 AND 5),
  teamwork_score INT CHECK (teamwork_score BETWEEN 1 AND 5),
  reliability_score INT CHECK (reliability_score BETWEEN 1 AND 5),
  overall_performance TEXT NOT NULL,
  mentor_recommendation VARCHAR(30) NOT NULL,
  issue_lor BOOLEAN DEFAULT FALSE,
  lor_statement TEXT,
  status VARCHAR(30) DEFAULT 'pending_hr',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  certificate_number VARCHAR(80) NOT NULL UNIQUE,
  candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  candidate_name VARCHAR(150) NOT NULL,
  position VARCHAR(120) NOT NULL,
  department VARCHAR(120) NOT NULL,
  internship_duration VARCHAR(120) NOT NULL,
  joining_date DATE NOT NULL,
  relieving_date DATE NOT NULL,
  original_relieving_date DATE NOT NULL,
  issue_date DATE NOT NULL,
  verification_code VARCHAR(100) NOT NULL UNIQUE,
  signatory_name VARCHAR(150) NOT NULL,
  signatory_title VARCHAR(150) NOT NULL,
  company_name VARCHAR(200) NOT NULL,
  has_lor BOOLEAN DEFAULT FALSE,
  lor_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. AUDIT LOGS (BR-015)
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  user_name VARCHAR(150) NOT NULL,
  role VARCHAR(50) NOT NULL,
  action VARCHAR(100) NOT NULL,
  entity VARCHAR(100) NOT NULL,
  entity_id VARCHAR(100) NOT NULL,
  details TEXT NOT NULL,
  ip_address VARCHAR(50),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. INDEXES FOR HIGH-PERFORMANCE QUERYING
CREATE INDEX idx_candidates_status ON candidates(status);
CREATE INDEX idx_candidates_department ON candidates(department_id);
CREATE INDEX idx_candidates_mentor ON candidates(assigned_mentor_id);
CREATE INDEX idx_tasks_intern ON tasks(assigned_intern_id);
CREATE INDEX idx_tasks_mentor ON tasks(assigned_mentor_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
