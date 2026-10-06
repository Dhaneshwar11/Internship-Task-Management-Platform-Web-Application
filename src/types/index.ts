export type UserRole = 'super_admin' | 'hr_admin' | 'dept_admin' | 'mentor' | 'intern';

export type CandidateStatus =
  | 'draft'
  | 'offer_pending'
  | 'offer_sent'
  | 'offer_accepted'
  | 'offer_rejected'
  | 'documents_pending'
  | 'documents_submitted'
  | 'under_hr_verification'
  | 'documents_rejected'
  | 'approved'
  | 'onboarding'
  | 'onboarding_completed'
  | 'internship_pending'
  | 'internship_active'
  | 'internship_extended'
  | 'internship_completed'
  | 'terminated'
  | 'withdrawn';

export type DocumentStatus =
  | 'required'
  | 'optional'
  | 'not_submitted'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'resubmission_required';

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export type TaskStatus =
  | 'assigned'
  | 'in_progress'
  | 'submitted'
  | 'under_review'
  | 'changes_requested'
  | 'resubmitted'
  | 'approved'
  | 'overdue'
  | 'rejected'
  | 'completed';

export type LeaveType = 'casual' | 'sick' | 'unpaid' | 'special';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  departmentId?: string;
  departmentName?: string;
  position?: string;
  phone?: string;
  isActive: boolean;
}

export interface CandidateDocument {
  id: string;
  candidateId: string;
  documentName: string;
  type: 'aadhaar' | 'pan' | 'marksheet' | 'degree' | 'address_proof' | 'bank_details' | 'passport' | 'national_id' | 'other';
  isMandatory: boolean;
  status: DocumentStatus;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  uploadedAt?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
  remarks?: string;
}

export interface OfferDetails {
  id: string;
  candidateId: string;
  position: string;
  department: string;
  stipend: string;
  joiningDate: string;
  durationMonths: number;
  expectedRelievingDate: string;
  terms: string;
  workingHours: string;
  reportingMentorId?: string;
  reportingMentorName?: string;
  sentDate?: string;
  acceptedDate?: string;
  signatureDataUrl?: string;
  status: 'pending' | 'sent' | 'accepted' | 'rejected';
}

export interface OnboardingItem {
  id: string;
  candidateId?: string;
  departmentId: string;
  title: string;
  description: string;
  type: 'text' | 'pdf' | 'document' | 'video' | 'external_url' | 'task' | 'quiz' | 'acknowledgement';
  isMandatory: boolean;
  sequence: number;
  estimatedMinutes: number;
  contentUrl?: string;
  contentText?: string;
  isCompleted: boolean;
  completedAt?: string;
}

export interface TaskSubmission {
  id: string;
  taskId: string;
  submittedAt: string;
  completionSummary: string;
  deliverableUrl?: string;
  attachments: { name: string; size: string; url?: string }[];
  comments?: string;
  version: number;
}

export interface TaskReview {
  id: string;
  taskId: string;
  reviewerId: string;
  reviewerName: string;
  reviewedAt: string;
  action: 'approved' | 'changes_requested' | 'rejected';
  feedback: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  departmentId: string;
  departmentName: string;
  assignedInternId: string;
  assignedInternName: string;
  assignedMentorId: string;
  assignedMentorName: string;
  priority: TaskPriority;
  startDate: string;
  dueDate: string;
  durationDays: number; // Max 7 days!
  instructions: string;
  expectedDeliverable: string;
  status: TaskStatus;
  submissions: TaskSubmission[];
  reviews: TaskReview[];
  reviewRemarks?: string;
  rejectionCount: number;
  createdAt: string;
}

export interface DailyWorkReport {
  workCompleted: string;
  tasksWorkedOn: string;
  workInProgress: string;
  problemsEncountered: string;
  timeSpentHours: number;
  comments?: string;
  attachments?: string[];
}

export interface AttendanceRecord {
  id: string;
  candidateId: string;
  candidateName: string;
  date: string;
  clockInTime: string;
  clockOutTime?: string;
  ipAddress: string;
  deviceInfo: string;
  dailyReport?: DailyWorkReport;
  status: 'present' | 'clocked_in' | 'absent' | 'half_day';
}

export interface LeaveRequest {
  id: string;
  candidateId: string;
  candidateName: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  appliedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  remarks?: string;
  isExcessLeave: boolean;
}

export interface InternshipEvaluation {
  id: string;
  candidateId: string;
  mentorId: string;
  mentorName: string;
  evaluationDate: string;
  scores: {
    taskCompletion: number; // 1-5
    workQuality: number;
    attendanceDiscipline: number;
    communication: number;
    technicalSkills: number;
    learningAbility: number;
    teamwork: number;
    reliability: number;
  };
  overallPerformance: string;
  mentorRecommendation: 'completed' | 'not_completed';
  issueLor: boolean;
  lorStatement?: string;
  status: 'pending_hr' | 'approved_by_hr' | 'rejected_by_hr';
}

export interface WarningRecord {
  id: string;
  candidateId: string;
  candidateName: string;
  type: 'warning' | 'final_warning' | 'termination';
  issueDate: string;
  mentorName: string;
  departmentName: string;
  relatedTaskId?: string;
  failedTaskCount: number;
  reason: string;
  requiredImprovement: string;
  signatory: string;
  isAcknowledged: boolean;
  acknowledgedAt?: string;
}

export interface CompletionCertificate {
  id: string;
  certificateNumber: string;
  candidateId: string;
  candidateName: string;
  position: string;
  department: string;
  internshipDuration: string;
  joiningDate: string;
  relievingDate: string;
  originalRelievingDate: string;
  issueDate: string;
  verificationCode: string;
  signatoryName: string;
  signatoryTitle: string;
  companyName: string;
  hasLor: boolean;
  lorText?: string;
}

export interface Candidate {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: 'India' | 'International';
  nationality: string;
  dob: string;
  gender: string;
  avatarUrl: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  qualification: string;
  departmentId: string;
  departmentName: string;
  position: string;
  internshipType: 'Full-time' | 'Part-time' | 'Remote';
  durationMonths: number;
  joiningDate: string;
  expectedRelievingDate: string;
  actualRelievingDate?: string;
  status: CandidateStatus;
  assignedMentorId?: string;
  assignedMentorName?: string;
  leaveEntitlement: {
    casual: number;
    sick: number;
    usedCasual: number;
    usedSick: number;
    excessDays: number;
  };
  extensionDays: number;
  extensionReason?: string;
  offer?: OfferDetails;
  documents: CandidateDocument[];
  onboardingProgress: number; // 0 - 100
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  role: UserRole;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface SystemSettings {
  companyName: string;
  companyAddress: string;
  authorizedSignatory: string;
  signatoryTitle: string;
  monthlyCasualLeave: number;
  monthlySickLeave: number;
  taskMaxDurationDays: number; // 7
  warningThreshold: number; // 2 failed tasks
  finalWarningThreshold: number; // 4 failed tasks
  terminationThreshold: number; // 5 failed tasks
  isPanOptional: boolean;
  realtimeSyncIntervalSeconds: number;
  departments: { id: string; name: string; code: string; mentorCount: number }[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  timestamp: string;
  read: boolean;
  link?: string;
}
