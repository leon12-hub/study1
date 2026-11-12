/**
 * HighStudy Central Interactive State Store & Context
 * Provides real-time state management, full CRUD operations, and persistent localStorage sync.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Branch,
  Course,
  Subject,
  Chapter,
  Batch,
  StudentProfile,
  TeacherProfile,
  ParentProfile,
  AttendanceRecord,
  StudyMaterial,
  Assignment,
  AssignmentSubmission,
  Examination,
  ExamAttempt,
  FeePaymentRecord,
  Announcement,
  ActivityLog,
  User,
  UserRole,
} from '@highstudy/shared-types';
import {
  INITIAL_BRANCHES,
  INITIAL_COURSES,
  INITIAL_SUBJECTS,
  INITIAL_CHAPTERS,
  INITIAL_BATCHES,
  CURRENT_STUDENT,
  CURRENT_TEACHER,
  CURRENT_PARENT,
  INITIAL_ATTENDANCE,
  INITIAL_STUDY_MATERIALS,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_EXAMINATION,
  INITIAL_FEE_PAYMENTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_USERS,
} from '../data/mockDatabase';

interface HighStudyContextType {
  // State Entities
  branches: Branch[];
  courses: Course[];
  subjects: Subject[];
  chapters: Chapter[];
  batches: Batch[];
  students: StudentProfile[];
  teachers: TeacherProfile[];
  parents: ParentProfile[];
  attendance: AttendanceRecord[];
  materials: StudyMaterial[];
  assignments: Assignment[];
  submissions: AssignmentSubmission[];
  exams: Examination[];
  examAttempts: ExamAttempt[];
  feePayments: FeePaymentRecord[];
  announcements: Announcement[];
  activityLogs: ActivityLog[];
  currentUser: User;
  currentRole: UserRole;

  // Actions
  setCurrentRole: (role: UserRole) => void;
  addBranch: (branch: Omit<Branch, 'id' | 'createdAt' | 'totalStudents' | 'totalTeachers' | 'totalBatches' | 'activeRevenue'>) => void;
  deleteBranch: (id: string) => void;
  addCourse: (course: Omit<Course, 'id' | 'subjectCount' | 'batchCount'>) => void;
  addBatch: (batch: Omit<Batch, 'id' | 'enrolledStudentsCount'>) => void;
  admitStudent: (student: Omit<StudentProfile, 'id' | 'attendanceRate' | 'studyStreakDays' | 'overallScorePercent' | 'paidFee' | 'pendingFee' | 'status'>) => void;
  addTeacher: (teacher: Omit<TeacherProfile, 'id' | 'rating' | 'joiningDate'>) => void;
  markAttendance: (record: Omit<AttendanceRecord, 'id' | 'date'> & { date?: string }) => void;
  markBatchAttendance: (batchId: string, batchName: string, records: Array<{ studentId: string; studentName: string; roll: string; status: 'PRESENT' | 'ABSENT' | 'LATE' }>, teacherName: string) => void;
  addStudyMaterial: (material: Omit<StudyMaterial, 'id' | 'uploadedAt' | 'downloadCount'>) => void;
  deleteStudyMaterial: (id: string) => void;
  addAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt' | 'submissionsCount' | 'totalStudents'>) => void;
  submitAssignment: (assignmentId: string, studentId: string, studentName: string, attachmentUrl: string, remarks?: string) => void;
  evaluateSubmission: (submissionId: string, obtainedMarks: number, teacherFeedback: string) => void;
  createExam: (exam: Omit<Examination, 'id' | 'status'>) => void;
  recordExamAttempt: (attempt: ExamAttempt) => void;
  processFeePayment: (payment: { studentId: string; amount: number; paymentMethod: 'UPI' | 'NET_BANKING' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'CASH'; feeType: 'FIRST_INSTALLMENT' | 'SECOND_INSTALLMENT' | 'FULL_PAYMENT' | 'EXAM_FEE' }) => FeePaymentRecord;
  publishAnnouncement: (announcement: Omit<Announcement, 'id' | 'publishedAt'>) => void;
  clearAllData: () => void;
  loadSampleData: () => void;
}

const HighStudyContext = createContext<HighStudyContextType | undefined>(undefined);

const STORAGE_KEY = 'highstudy_ecosystem_data_v1';

export const HighStudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from localStorage or start fresh
  const [branches, setBranches] = useState<Branch[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [parents, setParents] = useState<ParentProfile[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [exams, setExams] = useState<Examination[]>([]);
  const [examAttempts, setExamAttempts] = useState<ExamAttempt[]>([]);
  const [feePayments, setFeePayments] = useState<FeePaymentRecord[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [currentRole, setCurrentRole] = useState<UserRole>('SUPER_ADMIN');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Initialize from storage or clean sample
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setBranches(parsed.branches || []);
        setCourses(parsed.courses || []);
        setSubjects(parsed.subjects || []);
        setChapters(parsed.chapters || []);
        setBatches(parsed.batches || []);
        setStudents(parsed.students || []);
        setTeachers(parsed.teachers || []);
        setParents(parsed.parents || []);
        setAttendance(parsed.attendance || []);
        setMaterials(parsed.materials || []);
        setAssignments(parsed.assignments || []);
        setSubmissions(parsed.submissions || []);
        setExams(parsed.exams || []);
        setExamAttempts(parsed.examAttempts || []);
        setFeePayments(parsed.feePayments || []);
        setAnnouncements(parsed.announcements || []);
        setActivityLogs(parsed.activityLogs || []);
      } else {
        // First load: seed with authentic initial dataset so it's ready to use
        seedDefaultState();
      }
    } catch {
      seedDefaultState();
    }
    setIsInitialized(true);
  }, []);

  const seedDefaultState = () => {
    setBranches(INITIAL_BRANCHES);
    setCourses(INITIAL_COURSES);
    setSubjects(INITIAL_SUBJECTS);
    setChapters(INITIAL_CHAPTERS);
    setBatches(INITIAL_BATCHES);
    setStudents([CURRENT_STUDENT]);
    setTeachers([CURRENT_TEACHER]);
    setParents([CURRENT_PARENT]);
    setAttendance(INITIAL_ATTENDANCE);
    setMaterials(INITIAL_STUDY_MATERIALS);
    setAssignments(INITIAL_ASSIGNMENTS);
    setSubmissions(INITIAL_SUBMISSIONS);
    setExams([INITIAL_EXAMINATION]);
    setExamAttempts([]);
    setFeePayments(INITIAL_FEE_PAYMENTS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
  };

  // Sync to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    const stateToSave = {
      branches,
      courses,
      subjects,
      chapters,
      batches,
      students,
      teachers,
      parents,
      attendance,
      materials,
      assignments,
      submissions,
      exams,
      examAttempts,
      feePayments,
      announcements,
      activityLogs,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [
    isInitialized,
    branches,
    courses,
    subjects,
    chapters,
    batches,
    students,
    teachers,
    parents,
    attendance,
    materials,
    assignments,
    submissions,
    exams,
    examAttempts,
    feePayments,
    announcements,
    activityLogs,
  ]);

  const logAction = (action: string, details: string) => {
    const log: ActivityLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: `user-${currentRole.toLowerCase()}`,
      userName: currentUser.name,
      userRole: currentRole,
      action,
      details,
      ipAddress: '127.0.0.1',
      timestamp: new Date().toISOString(),
    };
    setActivityLogs((prev) => [log, ...prev]);
  };

  const currentUser: User = INITIAL_USERS.find((u) => u.role === currentRole) || {
    id: `user-${currentRole.toLowerCase()}`,
    name: currentRole === 'SUPER_ADMIN' ? 'Dr. Vikramaditya Malhotra' :
          currentRole === 'TEACHER' ? 'Prof. Arvind Raman' :
          currentRole === 'STUDENT' ? (students[0]?.fullName || 'Aarav Sharma') :
          currentRole === 'PARENT' ? 'Sunita Sharma' : 'Administrator',
    email: `${currentRole.toLowerCase()}@highstudy.edu`,
    phone: '+91 98110 00000',
    role: currentRole,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // 1. Clear All Data (Pure Fresh Slate)
  const clearAllData = () => {
    setBranches([]);
    setCourses([]);
    setSubjects([]);
    setChapters([]);
    setBatches([]);
    setStudents([]);
    setTeachers([]);
    setParents([]);
    setAttendance([]);
    setMaterials([]);
    setAssignments([]);
    setSubmissions([]);
    setExams([]);
    setExamAttempts([]);
    setFeePayments([]);
    setAnnouncements([]);
    setActivityLogs([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    logAction('DATABASE_RESET', 'Cleared all mock data. System reset to a clean slate.');
  };

  // 2. Load Sample Data
  const loadSampleData = () => {
    seedDefaultState();
    logAction('SAMPLE_DATA_LOADED', 'Loaded comprehensive curriculum, batch, and test data.');
  };

  // 3. Add Branch
  const addBranch = (branchData: Omit<Branch, 'id' | 'createdAt' | 'totalStudents' | 'totalTeachers' | 'totalBatches' | 'activeRevenue'>) => {
    const newBranch: Branch = {
      ...branchData,
      id: `branch-${Date.now()}`,
      totalStudents: 0,
      totalTeachers: 0,
      totalBatches: 0,
      activeRevenue: 0,
      createdAt: new Date().toISOString(),
    };
    setBranches((prev) => [newBranch, ...prev]);
    logAction('BRANCH_CREATED', `Created physical campus: ${newBranch.name} (${newBranch.code}) in ${newBranch.city}`);
  };

  const deleteBranch = (id: string) => {
    const branch = branches.find((b) => b.id === id);
    setBranches((prev) => prev.filter((b) => b.id !== id));
    logAction('BRANCH_DELETED', `Deleted campus ${branch?.name || id}`);
  };

  // 4. Add Course
  const addCourse = (courseData: Omit<Course, 'id' | 'subjectCount' | 'batchCount'>) => {
    const newCourse: Course = {
      ...courseData,
      id: `course-${Date.now()}`,
      subjectCount: 0,
      batchCount: 0,
    };
    setCourses((prev) => [newCourse, ...prev]);
    logAction('COURSE_CREATED', `Added academic curriculum: ${newCourse.name} (${newCourse.targetExam})`);
  };

  // 5. Add Batch
  const addBatch = (batchData: Omit<Batch, 'id' | 'enrolledStudentsCount'>) => {
    const newBatch: Batch = {
      ...batchData,
      id: `batch-${Date.now()}`,
      enrolledStudentsCount: 0,
    };
    setBatches((prev) => [newBatch, ...prev]);
    setBranches((prev) =>
      prev.map((b) =>
        b.id === newBatch.branchId ? { ...b, totalBatches: b.totalBatches + 1 } : b
      )
    );
    logAction('BATCH_CREATED', `Scheduled cohort ${newBatch.name} at ${newBatch.branchName} in Room ${newBatch.roomNumber}`);
  };

  // 6. Admit Student
  const admitStudent = (studentData: Omit<StudentProfile, 'id' | 'attendanceRate' | 'studyStreakDays' | 'overallScorePercent' | 'paidFee' | 'pendingFee' | 'status'>) => {
    const newStudent: StudentProfile = {
      ...studentData,
      id: `stud-${Date.now()}`,
      attendanceRate: 100,
      studyStreakDays: 1,
      overallScorePercent: 0,
      paidFee: 0,
      pendingFee: studentData.totalFee,
      status: 'ACTIVE',
    };
    setStudents((prev) => [newStudent, ...prev]);

    // Update batch student count
    setBatches((prev) =>
      prev.map((b) =>
        b.id === newStudent.batchId ? { ...b, enrolledStudentsCount: b.enrolledStudentsCount + 1 } : b
      )
    );

    // Update branch student count
    setBranches((prev) =>
      prev.map((b) =>
        b.id === newStudent.branchId ? { ...b, totalStudents: b.totalStudents + 1 } : b
      )
    );

    logAction('STUDENT_ADMITTED', `Enrolled ${newStudent.fullName} (${newStudent.enrollmentNumber}) into ${newStudent.batchName}`);
  };

  // 7. Add Teacher
  const addTeacher = (teacherData: Omit<TeacherProfile, 'id' | 'rating' | 'joiningDate'>) => {
    const newTeacher: TeacherProfile = {
      ...teacherData,
      id: `teach-${Date.now()}`,
      rating: 5.0,
      joiningDate: new Date().toISOString(),
    };
    setTeachers((prev) => [newTeacher, ...prev]);
    logAction('TEACHER_REGISTERED', `Added faculty: ${newTeacher.fullName} (${newTeacher.employeeCode})`);
  };

  // 8. Mark Attendance (Single & Batch)
  const markAttendance = (record: Omit<AttendanceRecord, 'id' | 'date'> & { date?: string }) => {
    const newRecord: AttendanceRecord = {
      ...record,
      id: `att-${Date.now()}`,
      date: record.date || new Date().toISOString().split('T')[0],
    };
    setAttendance((prev) => [newRecord, ...prev]);

    // Recalculate student attendance
    recalculateStudentAttendance(newRecord.studentId, newRecord.status);
    logAction('ATTENDANCE_MARKED', `Marked ${newRecord.studentName} as ${newRecord.status}`);
  };

  const markBatchAttendance = (
    batchId: string,
    batchName: string,
    records: Array<{ studentId: string; studentName: string; roll: string; status: 'PRESENT' | 'ABSENT' | 'LATE' }>,
    teacherName: string
  ) => {
    const date = new Date().toISOString().split('T')[0];
    const newRecords: AttendanceRecord[] = records.map((r, idx) => ({
      id: `att-${Date.now()}-${idx}`,
      studentId: r.studentId,
      studentName: r.studentName,
      enrollmentNumber: r.roll,
      batchId,
      batchName,
      date,
      status: r.status,
      markedByTeacherId: 'user-04',
      markedByTeacherName: teacherName,
    }));

    setAttendance((prev) => [...newRecords, ...prev]);

    // Update attendance rates for all marked students
    records.forEach((r) => recalculateStudentAttendance(r.studentId, r.status));
    logAction('BATCH_ATTENDANCE_RECORDED', `Logged attendance for ${records.length} students in ${batchName}`);
  };

  const recalculateStudentAttendance = (studentId: string, newStatus: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const studentRecords = attendance.filter((a) => a.studentId === studentId);
        const presentCount = studentRecords.filter((a) => a.status === 'PRESENT' || a.status === 'LATE').length + (newStatus !== 'ABSENT' ? 1 : 0);
        const total = studentRecords.length + 1;
        const rate = parseFloat(((presentCount / total) * 100).toFixed(1));
        return { ...s, attendanceRate: rate };
      })
    );
  };

  // 9. Study Materials
  const addStudyMaterial = (materialData: Omit<StudyMaterial, 'id' | 'uploadedAt' | 'downloadCount'>) => {
    const newMat: StudyMaterial = {
      ...materialData,
      id: `mat-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
      downloadCount: 0,
    };
    setMaterials((prev) => [newMat, ...prev]);
    logAction('MATERIAL_UPLOADED', `Uploaded ${newMat.type}: ${newMat.title} for ${newMat.subjectName}`);
  };

  const deleteStudyMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
    logAction('MATERIAL_DELETED', `Deleted study material record ${id}`);
  };

  // 10. Assignments
  const addAssignment = (asnData: Omit<Assignment, 'id' | 'createdAt' | 'submissionsCount' | 'totalStudents'>) => {
    const targetBatch = batches.find((b) => b.id === asnData.batchId);
    const totalStudents = targetBatch?.enrolledStudentsCount || students.filter((s) => s.batchId === asnData.batchId).length || 1;
    const newAsn: Assignment = {
      ...asnData,
      id: `asn-${Date.now()}`,
      createdAt: new Date().toISOString(),
      submissionsCount: 0,
      totalStudents,
    };
    setAssignments((prev) => [newAsn, ...prev]);
    logAction('ASSIGNMENT_CREATED', `Published assignment: ${newAsn.title} (Due: ${newAsn.dueDate.split('T')[0]})`);
  };

  const submitAssignment = (
    assignmentId: string,
    studentId: string,
    studentName: string,
    attachmentUrl: string,
    remarks?: string
  ) => {
    const newSub: AssignmentSubmission = {
      id: `sub-${Date.now()}`,
      assignmentId,
      studentId,
      studentName,
      submittedAt: new Date().toISOString(),
      attachmentUrl,
      remarks,
      status: 'PENDING',
    };
    setSubmissions((prev) => [newSub, ...prev]);
    setAssignments((prev) =>
      prev.map((a) => (a.id === assignmentId ? { ...a, submissionsCount: a.submissionsCount + 1 } : a))
    );
    logAction('ASSIGNMENT_SUBMITTED', `${studentName} submitted solutions for assignment`);
  };

  const evaluateSubmission = (submissionId: string, obtainedMarks: number, teacherFeedback: string) => {
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === submissionId
          ? {
              ...sub,
              status: 'EVALUATED',
              obtainedMarks,
              teacherFeedback,
              evaluatedAt: new Date().toISOString(),
            }
          : sub
      )
    );
    logAction('SUBMISSION_EVALUATED', `Awarded ${obtainedMarks} marks for submission ${submissionId}`);
  };

  // 11. Examinations & Attempts
  const createExam = (examData: Omit<Examination, 'id' | 'status'>) => {
    const newExam: Examination = {
      ...examData,
      id: `exam-${Date.now()}`,
      status: 'LIVE',
    };
    setExams((prev) => [newExam, ...prev]);
    logAction('EXAM_SCHEDULED', `Created online exam: ${newExam.title} (${newExam.totalMarks} Marks)`);
  };

  const recordExamAttempt = (attempt: ExamAttempt) => {
    setExamAttempts((prev) => [attempt, ...prev]);

    // Recalculate student overall score
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== attempt.studentId) return s;
        return {
          ...s,
          overallScorePercent: attempt.percentage,
          studyStreakDays: s.studyStreakDays + 1,
        };
      })
    );
    logAction('EXAM_COMPLETED', `${attempt.studentName} scored ${attempt.score}/${attempt.totalMarks} (${attempt.accuracy}% accuracy)`);
  };

  // 12. Fee Payments
  const processFeePayment = (payment: {
    studentId: string;
    amount: number;
    paymentMethod: 'UPI' | 'NET_BANKING' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'CASH';
    feeType: 'FIRST_INSTALLMENT' | 'SECOND_INSTALLMENT' | 'FULL_PAYMENT' | 'EXAM_FEE';
  }): FeePaymentRecord => {
    const targetStudent = students.find((s) => s.id === payment.studentId) || students[0];
    const receiptNum = `RCP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const record: FeePaymentRecord = {
      id: `pay-${Date.now()}`,
      receiptNumber: receiptNum,
      studentId: targetStudent.id,
      studentName: targetStudent.fullName,
      enrollmentNumber: targetStudent.enrollmentNumber,
      batchName: targetStudent.batchName,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      transactionReference: `TXN/${new Date().getFullYear()}/${Math.floor(10000000 + Math.random() * 90000000)}`,
      paymentDate: new Date().toISOString().split('T')[0],
      feeType: payment.feeType,
      status: 'SUCCESS',
      invoicePdfUrl: '#',
    };

    setFeePayments((prev) => [record, ...prev]);

    // Update student paid and pending fee
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== payment.studentId) return s;
        const newPaid = s.paidFee + payment.amount;
        const newPending = Math.max(0, s.totalFee - newPaid);
        return { ...s, paidFee: newPaid, pendingFee: newPending };
      })
    );

    // Update branch revenue
    setBranches((prev) =>
      prev.map((b) =>
        b.id === targetStudent.branchId ? { ...b, activeRevenue: b.activeRevenue + payment.amount } : b
      )
    );

    logAction('FEE_PAYMENT_PROCESSED', `Receipt ${receiptNum}: Received ₹${payment.amount.toLocaleString()} from ${targetStudent.fullName}`);
    return record;
  };

  // 13. Announcements
  const publishAnnouncement = (annData: Omit<Announcement, 'id' | 'publishedAt'>) => {
    const newAnn: Announcement = {
      ...annData,
      id: `ann-${Date.now()}`,
      publishedAt: new Date().toISOString(),
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    logAction('ANNOUNCEMENT_BROADCAST', `Published notice: "${newAnn.title}" for roles: ${newAnn.targetRoles.join(', ')}`);
  };

  return (
    <HighStudyContext.Provider
      value={{
        branches,
        courses,
        subjects,
        chapters,
        batches,
        students,
        teachers,
        parents,
        attendance,
        materials,
        assignments,
        submissions,
        exams,
        examAttempts,
        feePayments,
        announcements,
        activityLogs,
        currentUser,
        currentRole,
        setCurrentRole,
        addBranch,
        deleteBranch,
        addCourse,
        addBatch,
        admitStudent,
        addTeacher,
        markAttendance,
        markBatchAttendance,
        addStudyMaterial,
        deleteStudyMaterial,
        addAssignment,
        submitAssignment,
        evaluateSubmission,
        createExam,
        recordExamAttempt,
        processFeePayment,
        publishAnnouncement,
        clearAllData,
        loadSampleData,
      }}
    >
      {children}
    </HighStudyContext.Provider>
  );
};

export const useHighStudy = () => {
  const context = useContext(HighStudyContext);
  if (!context) {
    throw new Error('useHighStudy must be used within a HighStudyProvider');
  }
  return context;
};
