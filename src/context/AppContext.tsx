import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  UserRole,
  Candidate,
  CandidateStatus,
  Task,
  TaskStatus,
  AttendanceRecord,
  LeaveRequest,
  WarningRecord,
  CompletionCertificate,
  InternshipEvaluation,
  SystemSettings,
  AuditLog,
  OnboardingItem,
  NotificationItem,
  DailyWorkReport,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_CANDIDATES,
  INITIAL_TASKS,
  INITIAL_ATTENDANCE,
  INITIAL_LEAVES,
  INITIAL_WARNINGS,
  INITIAL_EVALUATIONS,
  INITIAL_CERTIFICATES,
  INITIAL_AUDIT_LOGS,
  INITIAL_SETTINGS,
  INITIAL_ONBOARDING_ITEMS,
  INITIAL_NOTIFICATIONS,
} from '../data/initialData';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  availableUsers: User[];
  candidates: Candidate[];
  tasks: Task[];
  attendance: AttendanceRecord[];
  leaves: LeaveRequest[];
  warnings: WarningRecord[];
  evaluations: InternshipEvaluation[];
  certificates: CompletionCertificate[];
  auditLogs: AuditLog[];
  settings: SystemSettings;
  onboardingItems: OnboardingItem[];
  notifications: NotificationItem[];
  isRealtimeSyncing: boolean;
  lastSyncedAt: Date;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => { success: boolean; error?: string };
  logout: () => void;
  
  // Lifecycle Actions
  createCandidate: (candidateData: Partial<Candidate>) => void;
  updateCandidateStatus: (candidateId: string, status: CandidateStatus, reason?: string) => void;
  generateAndSendOffer: (candidateId: string, offerDetails: Partial<Candidate['offer']>) => void;
  signOffer: (candidateId: string, signatureDataUrl: string) => void;
  submitDocument: (candidateId: string, documentId: string, fileName: string, fileSize: string) => void;
  verifyDocument: (candidateId: string, documentId: string, action: 'approve' | 'reject', remarks?: string) => void;
  approveCandidate: (candidateId: string) => void;
  toggleOnboardingItem: (candidateId: string, itemId: string) => void;
  requestInternshipActivation: (candidateId: string) => void;
  activateInternship: (candidateId: string, mentorId: string) => void;
  
  // Task Actions
  createTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'submissions' | 'reviews' | 'rejectionCount'>) => { success: boolean; error?: string };
  submitTask: (taskId: string, submission: { completionSummary: string; deliverableUrl?: string; attachments: { name: string; size: string }[]; comments?: string }) => void;
  reviewTask: (taskId: string, action: 'approved' | 'changes_requested' | 'rejected', feedback: string) => void;
  
  // Attendance & Work Reports
  clockIn: (candidateId: string) => void;
  clockOut: (candidateId: string, dailyReport: DailyWorkReport) => void;
  
  // Leave & Extension Actions
  applyLeave: (leaveData: { candidateId: string; leaveType: LeaveRequest['leaveType']; startDate: string; endDate: string; totalDays: number; reason: string }) => void;
  reviewLeave: (leaveId: string, action: 'approved' | 'rejected', remarks?: string) => void;
  
  // Performance & Completion
  submitInternshipEvaluation: (evaluationData: Omit<InternshipEvaluation, 'id' | 'status'>) => void;
  approveInternshipCompletion: (candidateId: string, evaluationId: string) => void;
  terminateInternship: (candidateId: string, reason: string) => void;
  
  // System & Settings
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  resetAllData: () => void;
  logAuditAction: (action: string, entity: string, entityId: string, details: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'heloix_workhub_';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error('Failed to load from localStorage', e);
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUserState] = useState<User>(() =>
    loadFromStorage('current_user', INITIAL_USERS[0])
  );
  const [availableUsers] = useState<User[]>(INITIAL_USERS);
  const [candidates, setCandidates] = useState<Candidate[]>(() =>
    loadFromStorage('candidates', INITIAL_CANDIDATES)
  );
  const [tasks, setTasks] = useState<Task[]>(() =>
    loadFromStorage('tasks', INITIAL_TASKS)
  );
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() =>
    loadFromStorage('attendance', INITIAL_ATTENDANCE)
  );
  const [leaves, setLeaves] = useState<LeaveRequest[]>(() =>
    loadFromStorage('leaves', INITIAL_LEAVES)
  );
  const [warnings, setWarnings] = useState<WarningRecord[]>(() =>
    loadFromStorage('warnings', INITIAL_WARNINGS)
  );
  const [evaluations, setEvaluations] = useState<InternshipEvaluation[]>(() =>
    loadFromStorage('evaluations', INITIAL_EVALUATIONS)
  );
  const [certificates, setCertificates] = useState<CompletionCertificate[]>(() =>
    loadFromStorage('certificates', INITIAL_CERTIFICATES)
  );
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() =>
    loadFromStorage('audit_logs', INITIAL_AUDIT_LOGS)
  );
  const [settings, setSettings] = useState<SystemSettings>(() =>
    loadFromStorage('settings', INITIAL_SETTINGS)
  );
  const [onboardingItems, setOnboardingItems] = useState<OnboardingItem[]>(() =>
    loadFromStorage('onboarding_items', INITIAL_ONBOARDING_ITEMS)
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    loadFromStorage('notifications', INITIAL_NOTIFICATIONS)
  );
  const [isRealtimeSyncing, setIsRealtimeSyncing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date>(new Date());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    loadFromStorage('is_authenticated', false)
  );

  // Synchronize state changes to localStorage
  useEffect(() => { saveToStorage('current_user', currentUser); }, [currentUser]);
  useEffect(() => { saveToStorage('is_authenticated', isAuthenticated); }, [isAuthenticated]);
  useEffect(() => { saveToStorage('candidates', candidates); }, [candidates]);
  useEffect(() => { saveToStorage('tasks', tasks); }, [tasks]);
  useEffect(() => { saveToStorage('attendance', attendance); }, [attendance]);
  useEffect(() => { saveToStorage('leaves', leaves); }, [leaves]);
  useEffect(() => { saveToStorage('warnings', warnings); }, [warnings]);
  useEffect(() => { saveToStorage('evaluations', evaluations); }, [evaluations]);
  useEffect(() => { saveToStorage('certificates', certificates); }, [certificates]);
  useEffect(() => { saveToStorage('audit_logs', auditLogs); }, [auditLogs]);
  useEffect(() => { saveToStorage('settings', settings); }, [settings]);
  useEffect(() => { saveToStorage('onboarding_items', onboardingItems); }, [onboardingItems]);
  useEffect(() => { saveToStorage('notifications', notifications); }, [notifications]);

  // Simulated Real-Time Cloud Synchronization pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setIsRealtimeSyncing(true);
      setTimeout(() => {
        setIsRealtimeSyncing(false);
        setLastSyncedAt(new Date());
      }, 800);
    }, settings.realtimeSyncIntervalSeconds * 1000);
    return () => clearInterval(interval);
  }, [settings.realtimeSyncIntervalSeconds]);

  const addNotification = (title: string, message: string, type: NotificationItem['type'] = 'info') => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev.slice(0, 19)]);
  };

  const logAuditAction = (action: string, entity: string, entityId: string, details: string) => {
    const newLog: AuditLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role,
      action,
      entity,
      entityId,
      details,
      timestamp: new Date().toISOString(),
      ipAddress: '103.212.144.18',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const setCurrentUser = (user: User) => {
    setCurrentUserState(user);
    logAuditAction('SWITCH_ROLE', 'User', user.id, `Session switched to ${user.name} (${user.role})`);
  };

  // 1. CANDIDATE CREATION
  const createCandidate = (candidateData: Partial<Candidate>) => {
    const isIndian = (candidateData.country || 'India') === 'India';
    const id = `cand-${Date.now().toString().slice(-6)}`;
    const firstName = candidateData.firstName || candidateData.fullName?.split(' ')[0] || 'Candidate';
    const lastName = candidateData.lastName || candidateData.fullName?.split(' ').slice(1).join(' ') || '';
    const fullName = `${firstName} ${lastName}`.trim();

    // Default document checklist based on Country (Section 10)
    const defaultDocs: Candidate['documents'] = isIndian
      ? [
          {
            id: `doc-${id}-1`,
            candidateId: id,
            documentName: 'Aadhaar Card',
            type: 'aadhaar',
            isMandatory: true,
            status: 'not_submitted',
          },
          {
            id: `doc-${id}-2`,
            candidateId: id,
            documentName: 'PAN Card',
            type: 'pan',
            isMandatory: !settings.isPanOptional,
            status: 'not_submitted',
          },
          {
            id: `doc-${id}-3`,
            candidateId: id,
            documentName: 'Recent Degree & College Marksheets',
            type: 'marksheet',
            isMandatory: true,
            status: 'not_submitted',
          },
          {
            id: `doc-${id}-4`,
            candidateId: id,
            documentName: 'Bank Details & Cancelled Cheque',
            type: 'bank_details',
            isMandatory: true,
            status: 'not_submitted',
          },
        ]
      : [
          {
            id: `doc-${id}-1`,
            candidateId: id,
            documentName: 'Passport Copy (Identity & Photo Page)',
            type: 'passport',
            isMandatory: true,
            status: 'not_submitted',
          },
          {
            id: `doc-${id}-2`,
            candidateId: id,
            documentName: 'National ID / Tax Identification',
            type: 'national_id',
            isMandatory: true,
            status: 'not_submitted',
          },
          {
            id: `doc-${id}-3`,
            candidateId: id,
            documentName: 'Educational Transcripts & Portfolio Proof',
            type: 'marksheet',
            isMandatory: true,
            status: 'not_submitted',
          },
        ];

    const duration = candidateData.durationMonths || 3;
    const joiningDate = candidateData.joiningDate || new Date().toISOString().split('T')[0];
    const joinDateObj = new Date(joiningDate);
    const relievingDateObj = new Date(joinDateObj);
    relievingDateObj.setMonth(relievingDateObj.getMonth() + duration);
    const expectedRelievingDate = relievingDateObj.toISOString().split('T')[0];

    const newCandidate: Candidate = {
      id,
      fullName,
      firstName,
      lastName,
      email: candidateData.email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone: candidateData.phone || '+91 98000 00000',
      country: candidateData.country || 'India',
      nationality: candidateData.nationality || (isIndian ? 'Indian' : 'International'),
      dob: candidateData.dob || '2002-01-01',
      gender: candidateData.gender || 'Not specified',
      avatarUrl: candidateData.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      address: candidateData.address || 'Tech Park, Whitefield',
      city: candidateData.city || 'Bengaluru',
      state: candidateData.state || 'Karnataka',
      postalCode: candidateData.postalCode || '560066',
      qualification: candidateData.qualification || 'B.Tech / B.E.',
      departmentId: candidateData.departmentId || 'dept-dev',
      departmentName: candidateData.departmentName || 'Software Engineering',
      position: candidateData.position || 'Software Engineering Intern',
      internshipType: candidateData.internshipType || 'Full-time',
      durationMonths: duration,
      joiningDate,
      expectedRelievingDate,
      status: 'offer_pending',
      leaveEntitlement: {
        casual: duration * settings.monthlyCasualLeave,
        sick: duration * settings.monthlySickLeave,
        usedCasual: 0,
        usedSick: 0,
        excessDays: 0,
      },
      extensionDays: 0,
      onboardingProgress: 0,
      documents: defaultDocs,
      createdAt: new Date().toISOString(),
    };

    setCandidates((prev) => [newCandidate, ...prev]);
    logAuditAction('CANDIDATE_CREATED', 'Candidate', id, `Created candidate ${fullName} for ${newCandidate.position}`);
    addNotification('Candidate Profile Created', `${fullName} added to hiring pipeline.`, 'info');
  };

  const updateCandidateStatus = (candidateId: string, status: CandidateStatus, reason?: string) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidateId) {
          return { ...c, status, extensionReason: reason || c.extensionReason };
        }
        return c;
      })
    );
    logAuditAction('STATUS_UPDATE', 'Candidate', candidateId, `Status changed to ${status}${reason ? ` (${reason})` : ''}`);
  };

  // 2. OFFER GENERATION & SENDING
  const generateAndSendOffer = (candidateId: string, offerDetails: Partial<Candidate['offer']>) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidateId) {
          const offer: Candidate['offer'] = {
            id: `off-${c.id}`,
            candidateId: c.id,
            position: offerDetails?.position || c.position,
            department: offerDetails?.department || c.departmentName,
            stipend: offerDetails?.stipend || '₹25,000 / month',
            joiningDate: offerDetails?.joiningDate || c.joiningDate,
            durationMonths: offerDetails?.durationMonths || c.durationMonths,
            expectedRelievingDate: offerDetails?.expectedRelievingDate || c.expectedRelievingDate,
            terms: offerDetails?.terms || `1. Candidate shall commit to ${c.internshipType} schedule.\n2. Must clock in and submit daily work report at clock-out.\n3. Maximum task turnaround is 7 days.\n4. Confidentiality and IP assignment agreement applies.`,
            workingHours: offerDetails?.workingHours || '9:30 AM - 6:30 PM (Mon-Fri)',
            reportingMentorId: offerDetails?.reportingMentorId || c.assignedMentorId,
            reportingMentorName: offerDetails?.reportingMentorName || c.assignedMentorName,
            sentDate: new Date().toISOString(),
            status: 'sent',
          };
          return { ...c, offer, status: 'offer_sent' };
        }
        return c;
      })
    );
    logAuditAction('OFFER_SENT', 'Offer', `off-${candidateId}`, `Offer letter sent to candidate ${candidateId}`);
    addNotification('Offer Letter Dispatched', `Offer letter generated and sent to candidate.`, 'info');
  };

  // 3. DIGITAL SIGNATURE ON OFFER (BR-001)
  const signOffer = (candidateId: string, signatureDataUrl: string) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidateId && c.offer) {
          const updatedOffer = {
            ...c.offer,
            signatureDataUrl,
            acceptedDate: new Date().toISOString(),
            status: 'accepted' as const,
          };
          return {
            ...c,
            offer: updatedOffer,
            status: 'documents_pending' as CandidateStatus,
          };
        }
        return c;
      })
    );
    logAuditAction('OFFER_ACCEPTED', 'Offer', `off-${candidateId}`, `Offer digitally signed by candidate ${candidateId}`);
    addNotification('Offer Digitally Signed', 'Candidate digitally accepted and signed the offer letter.', 'success');
  };

  // 4. CANDIDATE DOCUMENT SUBMISSION
  const submitDocument = (candidateId: string, documentId: string, fileName: string, fileSize: string) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidateId) {
          const updatedDocs = c.documents.map((d) => {
            if (d.id === documentId) {
              return {
                ...d,
                fileName,
                fileSize,
                uploadedAt: new Date().toISOString(),
                status: 'under_review' as const,
                rejectionReason: undefined,
              };
            }
            return d;
          });
          const allMandatorySubmitted = updatedDocs
            .filter((d) => d.isMandatory)
            .every((d) => d.status === 'under_review' || d.status === 'approved');

          return {
            ...c,
            documents: updatedDocs,
            status: allMandatorySubmitted ? 'under_hr_verification' : 'documents_pending',
          };
        }
        return c;
      })
    );
    logAuditAction('DOCUMENT_UPLOADED', 'CandidateDocument', documentId, `Uploaded file ${fileName}`);
  };

  // 5. HR DOCUMENT VERIFICATION (Approve / Reject with remarks)
  const verifyDocument = (candidateId: string, documentId: string, action: 'approve' | 'reject', remarks?: string) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidateId) {
          const updatedDocs = c.documents.map((d) => {
            if (d.id === documentId) {
              return {
                ...d,
                status: action === 'approve' ? ('approved' as const) : ('resubmission_required' as const),
                verifiedAt: new Date().toISOString(),
                verifiedBy: `${currentUser.name} (${currentUser.role})`,
                rejectionReason: action === 'reject' ? remarks : undefined,
                remarks: action === 'approve' ? remarks : undefined,
              };
            }
            return d;
          });

          const hasRejections = updatedDocs.some((d) => d.status === 'resubmission_required' || d.status === 'rejected');
          const allMandatoryApproved = updatedDocs
            .filter((d) => d.isMandatory)
            .every((d) => d.status === 'approved');

          let newStatus = c.status;
          if (hasRejections) {
            newStatus = 'documents_rejected';
          } else if (allMandatoryApproved) {
            newStatus = 'approved';
          }

          return {
            ...c,
            documents: updatedDocs,
            status: newStatus,
          };
        }
        return c;
      })
    );

    logAuditAction(
      action === 'approve' ? 'DOCUMENT_APPROVED' : 'DOCUMENT_REJECTED',
      'CandidateDocument',
      documentId,
      `${action === 'approve' ? 'Approved' : 'Rejected'} document: ${remarks || 'No remarks'}`
    );
    addNotification(
      action === 'approve' ? 'Document Approved' : 'Document Rejected',
      `Document verification updated for candidate.`,
      action === 'approve' ? 'success' : 'warning'
    );
  };

  // 6. CANDIDATE APPROVAL & ONBOARDING ACTIVATION (BR-002, BR-003)
  const approveCandidate = (candidateId: string) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidateId) {
          return {
            ...c,
            status: 'onboarding' as CandidateStatus,
          };
        }
        return c;
      })
    );
    logAuditAction('CANDIDATE_APPROVED', 'Candidate', candidateId, `Candidate approved by HR. Onboarding workspace unlocked.`);
    addNotification('Candidate Approved', 'Candidate approved and onboarding workspace unlocked.', 'success');
  };

  // 7. ONBOARDING ITEMS TOGGLE & PROGRESS CALCULATION (BR-004)
  const toggleOnboardingItem = (candidateId: string, itemId: string) => {
    setOnboardingItems((prev) => {
      const updated = prev.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            isCompleted: !item.isCompleted,
            completedAt: !item.isCompleted ? new Date().toISOString() : undefined,
          };
        }
        return item;
      });

      // Recalculate candidate progress
      const mandatoryItems = updated.filter((i) => i.isMandatory);
      const completedMandatory = mandatoryItems.filter((i) => i.isCompleted).length;
      const progressPercent = Math.round((completedMandatory / mandatoryItems.length) * 100);

      setCandidates((candList) =>
        candList.map((c) => {
          if (c.id === candidateId) {
            const newStatus = progressPercent === 100 && c.status === 'onboarding' ? 'onboarding_completed' : c.status;
            return {
              ...c,
              onboardingProgress: progressPercent,
              status: newStatus,
            };
          }
          return c;
        })
      );

      return updated;
    });
  };

  // 8. REQUEST INTERNSHIP ACTIVATION (Intern side)
  const requestInternshipActivation = (candidateId: string) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidateId) {
          return {
            ...c,
            status: 'internship_pending' as CandidateStatus,
          };
        }
        return c;
      })
    );
    logAuditAction('ACTIVATION_REQUESTED', 'Candidate', candidateId, `Intern requested formal internship activation.`);
    addNotification('Activation Request Received', 'Intern requested internship activation after completing onboarding.', 'info');
  };

  // 9. HR ACTIVATES INTERNSHIP & ASSIGNS MENTOR (BR-004)
  const activateInternship = (candidateId: string, mentorId: string) => {
    const mentor = availableUsers.find((u) => u.id === mentorId) || availableUsers.find((u) => u.role === 'mentor');
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidateId) {
          return {
            ...c,
            status: 'internship_active' as CandidateStatus,
            assignedMentorId: mentor?.id,
            assignedMentorName: mentor?.name,
          };
        }
        return c;
      })
    );
    logAuditAction('INTERNSHIP_ACTIVATED', 'Candidate', candidateId, `Internship formally activated with mentor ${mentor?.name}`);
    addNotification('Internship Activated', `Internship active. Mentor ${mentor?.name} assigned.`, 'success');
  };

  // 10. TASK CREATION (BR-005: Max 7 days duration strictly enforced!)
  const createTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'submissions' | 'reviews' | 'rejectionCount'>) => {
    if (taskData.durationDays > settings.taskMaxDurationDays) {
      return {
        success: false,
        error: `BR-005 Violation: Task duration cannot exceed ${settings.taskMaxDurationDays} days! Configured task was ${taskData.durationDays} days.`,
      };
    }
    if (taskData.durationDays < 1) {
      return { success: false, error: 'Task duration must be at least 1 day.' };
    }

    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now().toString().slice(-5)}`,
      status: 'assigned',
      submissions: [],
      reviews: [],
      rejectionCount: 0,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);
    logAuditAction('TASK_CREATED', 'Task', newTask.id, `Created task "${newTask.title}" for ${newTask.assignedInternName} (${newTask.durationDays} days)`);
    addNotification('New Task Assigned', `Task "${newTask.title}" assigned to ${newTask.assignedInternName}.`, 'info');
    return { success: true };
  };

  // 11. TASK SUBMISSION
  const submitTask = (taskId: string, submission: { completionSummary: string; deliverableUrl?: string; attachments: { name: string; size: string }[]; comments?: string }) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const newSub: Task['submissions'][0] = {
            id: `sub-${Date.now()}`,
            taskId,
            submittedAt: new Date().toISOString(),
            completionSummary: submission.completionSummary,
            deliverableUrl: submission.deliverableUrl,
            attachments: submission.attachments,
            comments: submission.comments,
            version: t.submissions.length + 1,
          };
          return {
            ...t,
            status: 'submitted',
            submissions: [newSub, ...t.submissions],
          };
        }
        return t;
      })
    );
    logAuditAction('TASK_SUBMITTED', 'Task', taskId, `Submitted work deliverable`);
    addNotification('Task Submitted', `Task deliverable submitted for mentor review.`, 'info');
  };

  // 12. MENTOR TASK REVIEW (Approve, Request Changes, Reject) + AUTOMATED PERFORMANCE ESCALATION (Section 30)
  const reviewTask = (taskId: string, action: 'approved' | 'changes_requested' | 'rejected', feedback: string) => {
    let affectedCandidateId = '';
    let candidateName = '';
    let rejectionCount = 0;
    let taskTitle = '';

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          affectedCandidateId = t.assignedInternId;
          candidateName = t.assignedInternName;
          taskTitle = t.title;

          const isRejectionOrChanges = action === 'changes_requested' || action === 'rejected';
          const newRejectionCount = isRejectionOrChanges ? t.rejectionCount + 1 : t.rejectionCount;
          rejectionCount = newRejectionCount;

          const newReview: Task['reviews'][0] = {
            id: `rev-${Date.now()}`,
            taskId,
            reviewerId: currentUser.id,
            reviewerName: currentUser.name,
            reviewedAt: new Date().toISOString(),
            action,
            feedback,
          };

          const newStatus: TaskStatus = action === 'approved' ? 'approved' : action === 'changes_requested' ? 'changes_requested' : 'rejected';

          return {
            ...t,
            status: newStatus,
            rejectionCount: newRejectionCount,
            reviewRemarks: feedback,
            reviews: [newReview, ...t.reviews],
          };
        }
        return t;
      })
    );

    logAuditAction('TASK_REVIEWED', 'Task', taskId, `Task ${action}: ${feedback}`);

    // AUTOMATED PERFORMANCE ESCALATION ENGINE (Section 30, 31, 32, 59)
    if (action === 'changes_requested' || action === 'rejected') {
      // Check total failed tasks for candidate across all tasks
      const allCandidateTasks = tasks.map((t) => (t.id === taskId ? { ...t, rejectionCount } : t)).filter((t) => t.assignedInternId === affectedCandidateId);
      const totalFailures = allCandidateTasks.reduce((sum, t) => sum + t.rejectionCount, 0);

      if (totalFailures >= settings.terminationThreshold) {
        // Termination condition reached
        const warn: WarningRecord = {
          id: `term-${Date.now()}`,
          candidateId: affectedCandidateId,
          candidateName,
          type: 'termination',
          issueDate: new Date().toISOString().split('T')[0],
          mentorName: currentUser.name,
          departmentName: 'Software Engineering',
          relatedTaskId: taskId,
          failedTaskCount: totalFailures,
          reason: `Repeated critical task failures exceeded configured termination threshold (${settings.terminationThreshold} failures). Final task: "${taskTitle}".`,
          requiredImprovement: 'Internship contract terminated under Section 33.',
          signatory: settings.authorizedSignatory,
          isAcknowledged: false,
        };
        setWarnings((prev) => [warn, ...prev]);
        logAuditAction('TERMINATION_TRIGGERED', 'WarningRecord', warn.id, `Candidate reached termination threshold (${totalFailures} failures).`);
        addNotification('Termination Threshold Reached', `Critical: ${candidateName} has exceeded maximum failure limit.`, 'alert');
      } else if (totalFailures >= settings.finalWarningThreshold) {
        // Final Warning
        const warn: WarningRecord = {
          id: `warn-final-${Date.now()}`,
          candidateId: affectedCandidateId,
          candidateName,
          type: 'final_warning',
          issueDate: new Date().toISOString().split('T')[0],
          mentorName: currentUser.name,
          departmentName: 'Software Engineering',
          relatedTaskId: taskId,
          failedTaskCount: totalFailures,
          reason: `Continued performance deficiency and task rejection (${totalFailures} failures). Previous warning unheeded.`,
          requiredImprovement: 'Immediate 100% adherence to quality standards and code review protocols is required. Further failure will trigger termination.',
          signatory: settings.authorizedSignatory,
          isAcknowledged: false,
        };
        setWarnings((prev) => [warn, ...prev]);
        logAuditAction('FINAL_WARNING_ISSUED', 'WarningRecord', warn.id, `Final Warning Letter generated for ${candidateName}`);
        addNotification('Final Warning Letter Issued', `Official Final Warning issued to ${candidateName}.`, 'alert');
      } else if (totalFailures >= settings.warningThreshold) {
        // First Warning Letter
        const warn: WarningRecord = {
          id: `warn-${Date.now()}`,
          candidateId: affectedCandidateId,
          candidateName,
          type: 'warning',
          issueDate: new Date().toISOString().split('T')[0],
          mentorName: currentUser.name,
          departmentName: 'Software Engineering',
          relatedTaskId: taskId,
          failedTaskCount: totalFailures,
          reason: `Repeated task review rejections (${totalFailures} failure iterations). Deliverables fell below required acceptance criteria.`,
          requiredImprovement: 'Candidate must consult mentor during work progression and run automated verification prior to submission.',
          signatory: settings.authorizedSignatory,
          isAcknowledged: false,
        };
        setWarnings((prev) => [warn, ...prev]);
        logAuditAction('WARNING_ISSUED', 'WarningRecord', warn.id, `Warning Letter generated for ${candidateName}`);
        addNotification('Performance Warning Issued', `Warning letter issued to ${candidateName} per Section 30.`, 'warning');
      }
    }
  };

  // 13. ATTENDANCE CLOCK-IN (BR-006)
  const clockIn = (candidateId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const candidate = candidates.find((c) => c.id === candidateId);
    const existing = attendance.find((a) => a.candidateId === candidateId && a.date === today);

    if (existing) {
      return;
    }

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      candidateId,
      candidateName: candidate?.fullName || 'Intern',
      date: today,
      clockInTime: nowTime,
      ipAddress: '103.212.144.18',
      deviceInfo: `${navigator.platform} / ${navigator.userAgent.slice(0, 40)}`,
      status: 'clocked_in',
    };

    setAttendance((prev) => [newRecord, ...prev]);
    logAuditAction('CLOCK_IN', 'Attendance', newRecord.id, `Candidate ${candidate?.fullName} clocked in at ${nowTime}`);
    addNotification('Clock In Recorded', `${candidate?.fullName} clocked in at ${nowTime}`, 'info');
  };

  // 14. ATTENDANCE CLOCK-OUT WITH MANDATORY DAILY WORK REPORT (BR-006, BR-007)
  const clockOut = (candidateId: string, dailyReport: DailyWorkReport) => {
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setAttendance((prev) =>
      prev.map((a) => {
        if (a.candidateId === candidateId && a.date === today) {
          return {
            ...a,
            clockOutTime: nowTime,
            status: 'present',
            dailyReport,
          };
        }
        return a;
      })
    );

    logAuditAction('CLOCK_OUT', 'Attendance', `${candidateId}-${today}`, `Clocked out with daily work report: ${dailyReport.workCompleted.slice(0, 60)}...`);
    addNotification('Daily Report Submitted', `Clock out complete and daily work log recorded.`, 'success');
  };

  // 15. LEAVE APPLICATION & AUTOMATIC INTERNSHIP EXTENSION (BR-008, BR-009)
  const applyLeave = (leaveData: { candidateId: string; leaveType: LeaveRequest['leaveType']; startDate: string; endDate: string; totalDays: number; reason: string }) => {
    const candidate = candidates.find((c) => c.id === leaveData.candidateId);
    const newLeave: LeaveRequest = {
      id: `leave-${Date.now()}`,
      candidateId: leaveData.candidateId,
      candidateName: candidate?.fullName || 'Intern',
      leaveType: leaveData.leaveType,
      startDate: leaveData.startDate,
      endDate: leaveData.endDate,
      totalDays: leaveData.totalDays,
      reason: leaveData.reason,
      status: 'pending',
      appliedAt: new Date().toISOString(),
      isExcessLeave: false,
    };

    setLeaves((prev) => [newLeave, ...prev]);
    logAuditAction('LEAVE_APPLIED', 'LeaveRequest', newLeave.id, `${candidate?.fullName} applied for ${leaveData.totalDays} day(s) ${leaveData.leaveType} leave.`);
    addNotification('Leave Request Submitted', `${candidate?.fullName} applied for ${leaveData.totalDays} days leave.`, 'info');
  };

  const reviewLeave = (leaveId: string, action: 'approved' | 'rejected', remarks?: string) => {
    let affectedCandidateId = '';
    let leaveDays = 0;
    let leaveType: LeaveRequest['leaveType'] = 'casual';

    setLeaves((prev) =>
      prev.map((l) => {
        if (l.id === leaveId) {
          affectedCandidateId = l.candidateId;
          leaveDays = l.totalDays;
          leaveType = l.leaveType;
          return {
            ...l,
            status: action,
            reviewedBy: `${currentUser.name} (${currentUser.role})`,
            reviewedAt: new Date().toISOString(),
            remarks,
          };
        }
        return l;
      })
    );

    // If approved, calculate leave entitlement and apply AUTOMATIC EXTENSION RULE (Section 21 & BR-008)
    if (action === 'approved') {
      setCandidates((prev) =>
        prev.map((c) => {
          if (c.id === affectedCandidateId) {
            const currentUsed = leaveType === 'casual' ? c.leaveEntitlement.usedCasual : c.leaveEntitlement.usedSick;
            const allowed = leaveType === 'casual' ? c.leaveEntitlement.casual : c.leaveEntitlement.sick;
            const newUsed = currentUsed + leaveDays;
            const excess = Math.max(0, newUsed - allowed);

            let newExtensionDays = c.extensionDays;
            let newRelievingDate = c.expectedRelievingDate;
            let extensionReason = c.extensionReason;
            let newStatus = c.status;

            if (excess > 0) {
              newExtensionDays = c.extensionDays + excess;
              const dateObj = new Date(c.expectedRelievingDate);
              dateObj.setDate(dateObj.getDate() + excess);
              newRelievingDate = dateObj.toISOString().split('T')[0];
              extensionReason = `Excess leave of ${excess} day(s) taken beyond allowed entitlement. Relieving date extended automatically from ${c.expectedRelievingDate} to ${newRelievingDate} per BR-008.`;
              newStatus = 'internship_extended';

              logAuditAction(
                'INTERNSHIP_EXTENDED',
                'Candidate',
                c.id,
                `Automatic extension applied: +${excess} days due to excess leave. Revised relieving date: ${newRelievingDate}`
              );
              addNotification(
                'Internship Relieving Date Extended',
                `Due to excess leave, ${c.fullName}'s completion date is extended to ${newRelievingDate}.`,
                'warning'
              );
            }

            return {
              ...c,
              status: newStatus,
              extensionDays: newExtensionDays,
              expectedRelievingDate: newRelievingDate,
              extensionReason,
              leaveEntitlement: {
                ...c.leaveEntitlement,
                usedCasual: leaveType === 'casual' ? newUsed : c.leaveEntitlement.usedCasual,
                usedSick: leaveType === 'sick' ? newUsed : c.leaveEntitlement.usedSick,
                excessDays: c.leaveEntitlement.excessDays + excess,
              },
            };
          }
          return c;
        })
      );
    }

    logAuditAction(action === 'approved' ? 'LEAVE_APPROVED' : 'LEAVE_REJECTED', 'LeaveRequest', leaveId, `${action} leave request: ${remarks || ''}`);
  };

  // 16. MENTOR INTERNSHIP EVALUATION (Section 34, 35)
  const submitInternshipEvaluation = (evaluationData: Omit<InternshipEvaluation, 'id' | 'status'>) => {
    const newEval: InternshipEvaluation = {
      ...evaluationData,
      id: `eval-${Date.now()}`,
      status: 'pending_hr',
    };

    setEvaluations((prev) => [newEval, ...prev]);
    logAuditAction('EVALUATION_SUBMITTED', 'InternshipEvaluation', newEval.id, `Mentor submitted evaluation for intern ${evaluationData.candidateId} (Recommendation: ${evaluationData.mentorRecommendation})`);
    addNotification('Internship Evaluation Submitted', `Evaluation ready for final HR sign-off.`, 'info');
  };

  // 17. FINAL HR COMPLETION APPROVAL & CERTIFICATE GENERATION (BR-010, BR-011, BR-012)
  const approveInternshipCompletion = (candidateId: string, evaluationId: string) => {
    const candidate = candidates.find((c) => c.id === candidateId);
    const evalRecord = evaluations.find((e) => e.id === evaluationId);
    if (!candidate) return;

    const certNumber = `HLX-CERT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const verifyCode = `VERIFY-HLX-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    const newCert: CompletionCertificate = {
      id: `cert-${Date.now()}`,
      certificateNumber: certNumber,
      candidateId: candidate.id,
      candidateName: candidate.fullName,
      position: candidate.position,
      department: candidate.departmentName,
      internshipDuration: `${candidate.durationMonths} Months (${candidate.joiningDate} to ${candidate.expectedRelievingDate})`,
      joiningDate: candidate.joiningDate,
      relievingDate: candidate.expectedRelievingDate,
      originalRelievingDate: candidate.expectedRelievingDate,
      issueDate: new Date().toISOString().split('T')[0],
      verificationCode: verifyCode,
      signatoryName: settings.authorizedSignatory,
      signatoryTitle: settings.signatoryTitle,
      companyName: settings.companyName,
      hasLor: !!evalRecord?.issueLor,
      lorText: evalRecord?.lorStatement || (evalRecord?.issueLor ? `During the tenure, ${candidate.fullName} demonstrated high diligence, technical precision, and teamwork. We enthusiastically recommend them for forward-thinking engineering and leadership opportunities.` : undefined),
    };

    setCertificates((prev) => [newCert, ...prev]);
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, status: 'internship_completed', actualRelievingDate: new Date().toISOString().split('T')[0] } : c))
    );
    setEvaluations((prev) =>
      prev.map((e) => (e.id === evaluationId ? { ...e, status: 'approved_by_hr' } : e))
    );

    logAuditAction('CERTIFICATE_GENERATED', 'CompletionCertificate', newCert.id, `Generated Certificate #${certNumber} with LOR: ${newCert.hasLor}`);
    addNotification('Certificate Generated', `Completion certificate #${certNumber} successfully issued for ${candidate.fullName}.`, 'success');
  };

  // 18. TERMINATION WORKFLOW (BR-013)
  const terminateInternship = (candidateId: string, reason: string) => {
    const candidate = candidates.find((c) => c.id === candidateId);
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, status: 'terminated', extensionReason: reason } : c))
    );
    const termRecord: WarningRecord = {
      id: `term-${Date.now()}`,
      candidateId,
      candidateName: candidate?.fullName || 'Intern',
      type: 'termination',
      issueDate: new Date().toISOString().split('T')[0],
      mentorName: currentUser.name,
      departmentName: candidate?.departmentName || 'Engineering',
      failedTaskCount: 5,
      reason,
      requiredImprovement: 'Internship contract terminated per Section 33.',
      signatory: settings.authorizedSignatory,
      isAcknowledged: false,
    };
    setWarnings((prev) => [termRecord, ...prev]);
    logAuditAction('TERMINATION_ENACTED', 'Candidate', candidateId, `Internship formally terminated. Reason: ${reason}`);
    addNotification('Internship Terminated', `${candidate?.fullName} has been terminated. Historical data retained.`, 'alert');
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    logAuditAction('SETTINGS_UPDATED', 'SystemSettings', 'settings', 'Updated system business policies');
    addNotification('Settings Saved', 'System configurations updated.', 'success');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const resetAllData = () => {
    setCurrentUserState(INITIAL_USERS[0]);
    setCandidates(INITIAL_CANDIDATES);
    setTasks(INITIAL_TASKS);
    setAttendance(INITIAL_ATTENDANCE);
    setLeaves(INITIAL_LEAVES);
    setWarnings(INITIAL_WARNINGS);
    setEvaluations(INITIAL_EVALUATIONS);
    setCertificates(INITIAL_CERTIFICATES);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setSettings(INITIAL_SETTINGS);
    setOnboardingItems(INITIAL_ONBOARDING_ITEMS);
    setNotifications(INITIAL_NOTIFICATIONS);
    localStorage.clear();
    logAuditAction('RESET_SYSTEM', 'System', 'all', 'Restored platform to default sample data.');
  };

  const STANDARD_PASSWORD = 'Heloix@11';

  const login = (email: string, password?: string) => {
    if (password && password !== STANDARD_PASSWORD) {
      return {
        success: false,
        error: 'Incorrect password. Universal password for all accounts is Heloix@11',
      };
    }

    const trimmed = email.trim().toLowerCase();
    const matched = availableUsers.find((u) => u.email.toLowerCase() === trimmed);
    const userToLogin = matched || {
      ...INITIAL_USERS[0],
      email: email.trim(),
      name: email.split('@')[0] || 'WorkHub User',
    };
    setCurrentUserState(userToLogin);
    saveToStorage('current_user', userToLogin);
    setIsAuthenticated(true);
    saveToStorage('is_authenticated', true);
    logAuditAction('USER_LOGIN', 'User', userToLogin.id, `User ${userToLogin.name} (${userToLogin.email}) authenticated into Heloix WorkHub.`);
    addNotification('Welcome to WorkHub', `Signed in as ${userToLogin.name} (${userToLogin.role.replace('_', ' ')})`, 'success');
    return { success: true };
  };

  const logout = () => {
    logAuditAction('USER_LOGOUT', 'User', currentUser.id, `User ${currentUser.name} signed out.`);
    setIsAuthenticated(false);
    saveToStorage('is_authenticated', false);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        availableUsers,
        candidates,
        tasks,
        attendance,
        leaves,
        warnings,
        evaluations,
        certificates,
        auditLogs,
        settings,
        onboardingItems,
        notifications,
        isRealtimeSyncing,
        lastSyncedAt,
        isAuthenticated,
        login,
        logout,
        createCandidate,
        updateCandidateStatus,
        generateAndSendOffer,
        signOffer,
        submitDocument,
        verifyDocument,
        approveCandidate,
        toggleOnboardingItem,
        requestInternshipActivation,
        activateInternship,
        createTask,
        submitTask,
        reviewTask,
        clockIn,
        clockOut,
        applyLeave,
        reviewLeave,
        submitInternshipEvaluation,
        approveInternshipCompletion,
        terminateInternship,
        updateSettings,
        markNotificationRead,
        clearAllNotifications,
        resetAllData,
        logAuditAction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
