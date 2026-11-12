/**
 * HIGHSTUDY — CORE DOMAIN TYPES & DATA CONTRACTS
 * Unified types shared across Web, Backend API, and Mobile client.
 */

// ==========================================
// 1. ROLES & AUTHENTICATION
// ==========================================

export type UserRole = 
  | 'SUPER_ADMIN'
  | 'INSTITUTE_ADMIN'
  | 'BRANCH_ADMIN'
  | 'TEACHER'
  | 'STUDENT'
  | 'PARENT';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  branchId?: string; // Optional: Super & Institute admins can oversee all branches
  branchName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface AuthSession {
  user: User;
  token: string;
  refreshToken: string;
}

// ==========================================
// 2. INSTITUTION & BRANCHES
// ==========================================

export interface InstituteInfo {
  id: string;
  name: string;
  tagline: string;
  code: string;
  logoUrl: string;
  contactEmail: string;
  contactPhone: string;
  headquartersAddress: string;
  website: string;
  establishedYear: number;
}

export interface Branch {
  id: string;
  name: string;
  code: string; // e.g. "HS-NORTH", "HS-MAIN"
  city: string;
  address: string;
  phone: string;
  email: string;
  branchAdminId?: string;
  branchAdminName?: string;
  totalStudents: number;
  totalTeachers: number;
  totalBatches: number;
  activeRevenue: number;
  isActive: boolean;
  createdAt: string;
}

// ==========================================
// 3. ACADEMIC STRUCTURE (Courses, Subjects, Chapters)
// ==========================================

export interface Course {
  id: string;
  name: string;
  code: string; // e.g., "JEE-ADV-2Y", "NEET-MED-1Y"
  category: 'Engineering' | 'Medical' | 'Foundation' | 'Boards' | 'Commerce';
  description: string;
  durationMonths: number;
  targetExam: string;
  totalFee: number;
  isActive: boolean;
  subjectCount: number;
  batchCount: number;
}

export interface Subject {
  id: string;
  courseId: string;
  courseName?: string;
  name: string;
  code: string; // e.g., "PHY-101", "CHE-101", "MTH-101", "BIO-101"
  icon: string;
  description: string;
  totalChapters: number;
}

export interface Chapter {
  id: string;
  subjectId: string;
  subjectName?: string;
  chapterNumber: number;
  title: string;
  description: string;
  estimatedHours: number;
  totalLectures: number;
  totalNotes: number;
  isCompleted?: boolean;
}

// ==========================================
// 4. BATCHES & TIMETABLE
// ==========================================

export interface Batch {
  id: string;
  name: string; // e.g. "NEET 2026 Achievers A1"
  code: string;
  branchId: string;
  branchName: string;
  courseId: string;
  courseName: string;
  academicYear: string; // e.g. "2026-2027"
  startDate: string;
  endDate: string;
  roomNumber: string;
  timing: string; // e.g. "08:30 AM - 01:30 PM"
  maxCapacity: number;
  enrolledStudentsCount: number;
  teacherIds: string[];
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
}

export interface TimetableSlot {
  id: string;
  batchId: string;
  batchName: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string; // "09:00 AM"
  endTime: string;   // "10:30 AM"
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  room: string;
  isLiveClass?: boolean;
  liveClassUrl?: string;
}

// ==========================================
// 5. STUDENT & PARENT DOMAIN
// ==========================================

export interface StudentProfile {
  id: string;
  userId: string;
  enrollmentNumber: string; // e.g. "HS2026-0842"
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  avatarUrl?: string;
  branchId: string;
  branchName: string;
  courseId: string;
  courseName: string;
  batchId: string;
  batchName: string;
  rollNumber: string;
  admissionDate: string;
  parentUserId?: string;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  parentRelation?: 'FATHER' | 'MOTHER' | 'GUARDIAN';
  attendanceRate: number; // Percentage, e.g. 94.2
  studyStreakDays: number; // e.g. 18
  overallScorePercent: number; // e.g. 88.5
  totalFee: number;
  paidFee: number;
  pendingFee: number;
  status: 'ACTIVE' | 'ON_LEAVE' | 'ALUMNI' | 'SUSPENDED';
}

export interface ParentProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  occupation: string;
  address: string;
  linkedStudents: Array<{
    studentId: string;
    enrollmentNumber: string;
    studentName: string;
    batchName: string;
    branchName: string;
    attendancePercent: number;
    pendingFee: number;
  }>;
}

// ==========================================
// 6. TEACHER WORKSPACE
// ==========================================

export interface TeacherProfile {
  id: string;
  userId: string;
  employeeCode: string; // e.g. "HST-204"
  fullName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  specialization: string;
  qualification: string;
  experienceYears: number;
  assignedBranchIds: string[];
  assignedSubjectIds: string[];
  assignedSubjects: string[];
  assignedBatches: Array<{
    batchId: string;
    batchName: string;
    branchName: string;
    subjectName: string;
  }>;
  rating: number; // e.g. 4.9
  joiningDate: string;
}

// ==========================================
// 7. ATTENDANCE SYSTEM
// ==========================================

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  enrollmentNumber: string;
  batchId: string;
  batchName: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  markedByTeacherId: string;
  markedByTeacherName: string;
  remarks?: string;
}

// ==========================================
// 8. FEES & FINANCIAL MANAGEMENT
// ==========================================

export interface FeeStructure {
  id: string;
  courseId: string;
  courseName: string;
  totalAmount: number;
  installmentsAllowed: number;
  breakdown: Array<{
    component: string; // "Tuition", "Lab & Library", "Examination", "Study Materials"
    amount: number;
  }>;
}

export interface FeePaymentRecord {
  id: string;
  receiptNumber: string; // e.g. "RCP-2026-9041"
  studentId: string;
  studentName: string;
  enrollmentNumber: string;
  batchName: string;
  amount: number;
  paymentMethod: 'UPI' | 'NET_BANKING' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'CASH' | 'CHEQUE';
  transactionReference: string;
  paymentDate: string;
  feeType: 'FIRST_INSTALLMENT' | 'SECOND_INSTALLMENT' | 'FULL_PAYMENT' | 'EXAM_FEE';
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  invoicePdfUrl?: string;
}

// ==========================================
// 9. LEARNING MATERIALS & LECTURES
// ==========================================

export interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  subjectName: string;
  chapterId: string;
  chapterName: string;
  batchIds: string[]; // Batches that have access
  type: 'PDF_NOTE' | 'VIDEO_LECTURE' | 'FORMULA_SHEET' | 'PRACTICE_SET' | 'RECORDED_CLASS';
  fileUrl: string;
  fileSizeBytes?: number;
  durationMinutes?: number;
  uploaderTeacherName: string;
  uploadedAt: string;
  downloadCount: number;
}

// ==========================================
// 10. ASSIGNMENTS & EVALUATIONS
// ==========================================

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  subjectName: string;
  batchId: string;
  batchName: string;
  assignedByTeacherName: string;
  dueDate: string;
  maxMarks: number;
  attachmentUrl?: string;
  createdAt: string;
  submissionsCount: number;
  totalStudents: number;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  attachmentUrl: string;
  remarks?: string;
  status: 'PENDING' | 'EVALUATED' | 'LATE';
  obtainedMarks?: number;
  teacherFeedback?: string;
  evaluatedAt?: string;
}

// ==========================================
// 11. EXAMINATIONS & QUESTION BANK
// ==========================================

export interface QuestionOption {
  id: string;
  optionText: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  subjectId: string;
  subjectName: string;
  chapterId?: string;
  chapterName?: string;
  questionText: string;
  options: QuestionOption[];
  explanation: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  marks: number;
  negativeMarks: number;
}

export interface Examination {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  batchIds: string[];
  batchNames: string[];
  totalQuestions: number;
  totalMarks: number;
  passingMarks: number;
  durationMinutes: number;
  startsAt: string;
  endsAt: string;
  status: 'SCHEDULED' | 'LIVE' | 'COMPLETED';
  type: 'MOCK_TEST' | 'UNIT_TEST' | 'TERM_EXAM' | 'PRACTICE';
  questions: Question[];
}

export interface ExamAttempt {
  id: string;
  examId: string;
  examTitle: string;
  studentId: string;
  studentName: string;
  startedAt: string;
  submittedAt: string;
  score: number;
  totalMarks: number;
  percentage: number;
  rank?: number;
  totalParticipants?: number;
  accuracy: number; // e.g. 84.5%
  correctAnswersCount: number;
  incorrectAnswersCount: number;
  unattemptedCount: number;
  answers: Array<{
    questionId: string;
    selectedOptionId?: string;
    isCorrect: boolean;
    timeSpentSeconds: number;
  }>;
}

// ==========================================
// 12. ANNOUNCEMENTS & ACTIVITY LOGS
// ==========================================

export interface Announcement {
  id: string;
  title: string;
  content: string;
  senderRole: string;
  senderName: string;
  targetRoles: UserRole[];
  branchId?: string; // Optional: all branches or specific
  branchName?: string;
  priority: 'NORMAL' | 'URGENT' | 'HIGH';
  publishedAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

// ==========================================
// 13. AI LEARNING ASSISTANT
// ==========================================

export interface AiChatMessage {
  id: string;
  sender: 'student' | 'ai';
  text: string;
  timestamp: string;
  subjectTag?: string;
  suggestions?: string[];
  structuredData?: {
    type?: 'formula' | 'practice_question' | 'step_by_step' | 'summary';
    title?: string;
    steps?: string[];
  };
}
