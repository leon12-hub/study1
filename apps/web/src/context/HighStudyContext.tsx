/**
 * HighStudy Production State Store & Real API Context
 * Fetches and persists all records directly to Cloud SQL PostgreSQL via backend REST APIs.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  TimetableSlot,
  User,
  UserRole,
} from '@highstudy/shared-types';

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
  timetable: TimetableSlot[];
  currentUser: User;
  currentRole: UserRole;
  isLoading: boolean;

  // Actions
  setCurrentRole: (role: UserRole) => void;
  refreshData: () => Promise<void>;
  addBranch: (branch: any) => Promise<void>;
  deleteBranch: (id: string) => Promise<void>;
  addCourse: (course: any) => Promise<void>;
  addBatch: (batch: any) => Promise<void>;
  admitStudent: (student: any) => Promise<void>;
  addTeacher: (teacher: any) => Promise<void>;
  markBatchAttendance: (batchId: string, batchName: string, records: Array<{ studentId: string; studentName: string; roll: string; status: 'PRESENT' | 'ABSENT' | 'LATE' }>, teacherName: string) => Promise<void>;
  addStudyMaterial: (material: any) => Promise<void>;
  deleteStudyMaterial: (id: string) => Promise<void>;
  addAssignment: (assignment: any) => Promise<void>;
  submitAssignment: (assignmentId: string, studentId: string, studentName: string, attachmentUrl: string, remarks?: string) => Promise<void>;
  evaluateSubmission: (submissionId: string, obtainedMarks: number, teacherFeedback: string) => Promise<void>;
  createExam: (exam: any) => Promise<void>;
  recordExamAttempt: (attempt: { examId: string; studentId: string; studentName: string; answers: Record<string, string> }) => Promise<void>;
  processFeePayment: (payment: { studentId: string; amount: number; paymentMethod: string; feeType?: string }) => Promise<FeePaymentRecord>;
  publishAnnouncement: (announcement: any) => Promise<void>;
  clearAllData: () => Promise<void>;
  loadSampleData: () => Promise<void>;
}

const HighStudyContext = createContext<HighStudyContextType | undefined>(undefined);

export const HighStudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentRole, setCurrentRole] = useState<UserRole>('SUPER_ADMIN');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch all records directly from live PostgreSQL backend
  const refreshData = useCallback(async () => {
    try {
      const [
        branchesRes,
        coursesRes,
        subjectsRes,
        chaptersRes,
        batchesRes,
        studentsRes,
        teachersRes,
        attendanceRes,
        materialsRes,
        assignmentsRes,
        submissionsRes,
        examsRes,
        attemptsRes,
        feesRes,
        announcementsRes,
        logsRes,
        usersRes,
        timetableRes,
      ] = await Promise.all([
        fetch('/api/branches').then((r) => r.ok ? r.json() : []),
        fetch('/api/courses').then((r) => r.ok ? r.json() : []),
        fetch('/api/subjects').then((r) => r.ok ? r.json() : []),
        fetch('/api/chapters').then((r) => r.ok ? r.json() : []),
        fetch('/api/batches').then((r) => r.ok ? r.json() : []),
        fetch('/api/students').then((r) => r.ok ? r.json() : []),
        fetch('/api/teachers').then((r) => r.ok ? r.json() : []),
        fetch('/api/attendance').then((r) => r.ok ? r.json() : []),
        fetch('/api/materials').then((r) => r.ok ? r.json() : []),
        fetch('/api/assignments').then((r) => r.ok ? r.json() : []),
        fetch('/api/submissions').then((r) => r.ok ? r.json() : []),
        fetch('/api/exams').then((r) => r.ok ? r.json() : []),
        fetch('/api/exams/attempts').then((r) => r.ok ? r.json() : []),
        fetch('/api/fees').then((r) => r.ok ? r.json() : []),
        fetch('/api/announcements').then((r) => r.ok ? r.json() : []),
        fetch('/api/audit-logs').then((r) => r.ok ? r.json() : []),
        fetch('/api/users').then((r) => r.ok ? r.json() : []),
        fetch('/api/timetable').then((r) => r.ok ? r.json() : []),
      ]);

      setBranches(branchesRes);
      setCourses(coursesRes);
      setSubjects(subjectsRes);
      setChapters(chaptersRes);
      setBatches(batchesRes);
      setStudents(studentsRes);
      setTeachers(teachersRes);
      setAttendance(attendanceRes);
      setMaterials(materialsRes);
      setAssignments(assignmentsRes);
      setSubmissions(submissionsRes);
      setExams(examsRes);
      setExamAttempts(attemptsRes);
      setFeePayments(feesRes);
      setAnnouncements(announcementsRes);
      setActivityLogs(logsRes);
      setUsers(usersRes);
      setTimetable(timetableRes);
    } catch (err) {
      console.error('Failed to sync with Cloud SQL PostgreSQL backend:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Current user derived from live PostgreSQL users
  const currentUser: User = users.find((u) => u.role === currentRole) || {
    id: 'user-01',
    name: currentRole === 'SUPER_ADMIN' ? 'Dr. Vikramaditya Malhotra' :
          currentRole === 'INSTITUTE_ADMIN' ? 'Rajeshwar Sen' :
          currentRole === 'BRANCH_ADMIN' ? 'Ananya Deshmukh' :
          currentRole === 'TEACHER' ? 'Prof. Arvind Raman' :
          currentRole === 'STUDENT' ? 'Aarav Sharma' : 'Sunita Sharma',
    email: `${currentRole.toLowerCase()}@highstudy.edu`,
    phone: '+91 98110 12001',
    role: currentRole,
    branchName: 'Main Campus',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const addBranch = async (branchData: any) => {
    const res = await fetch('/api/branches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(branchData),
    });
    if (res.ok) await refreshData();
  };

  const deleteBranch = async (id: string) => {
    const res = await fetch(`/api/branches/${id}`, { method: 'DELETE' });
    if (res.ok) await refreshData();
  };

  const addCourse = async (courseData: any) => {
    const res = await fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(courseData),
    });
    if (res.ok) await refreshData();
  };

  const addBatch = async (batchData: any) => {
    const res = await fetch('/api/batches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(batchData),
    });
    if (res.ok) await refreshData();
  };

  const admitStudent = async (studentData: any) => {
    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData),
    });
    if (res.ok) await refreshData();
  };

  const addTeacher = async (teacherData: any) => {
    const res = await fetch('/api/teachers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teacherData),
    });
    if (res.ok) await refreshData();
  };

  const markBatchAttendance = async (batchId: string, batchName: string, records: any[], teacherName: string) => {
    const res = await fetch('/api/attendance/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ batchId, batchName, records, markedByTeacherName: teacherName }),
    });
    if (res.ok) await refreshData();
  };

  const addStudyMaterial = async (materialData: any) => {
    const res = await fetch('/api/materials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(materialData),
    });
    if (res.ok) await refreshData();
  };

  const deleteStudyMaterial = async (id: string) => {
    const res = await fetch(`/api/materials/${id}`, { method: 'DELETE' });
    if (res.ok) await refreshData();
  };

  const addAssignment = async (asnData: any) => {
    const res = await fetch('/api/assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(asnData),
    });
    if (res.ok) await refreshData();
  };

  const submitAssignment = async (assignmentId: string, studentId: string, studentName: string, attachmentUrl: string, remarks?: string) => {
    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assignmentId, studentId, studentName, attachmentUrl, remarks }),
    });
    if (res.ok) await refreshData();
  };

  const evaluateSubmission = async (submissionId: string, obtainedMarks: number, teacherFeedback: string) => {
    const res = await fetch(`/api/submissions/${submissionId}/evaluate`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ obtainedMarks, teacherFeedback }),
    });
    if (res.ok) await refreshData();
  };

  const createExam = async (examData: any) => {
    const res = await fetch('/api/exams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(examData),
    });
    if (res.ok) await refreshData();
  };

  const recordExamAttempt = async (attemptData: { examId: string; studentId: string; studentName: string; answers: Record<string, string> }) => {
    const res = await fetch('/api/exams/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(attemptData),
    });
    if (res.ok) await refreshData();
  };

  const processFeePayment = async (paymentData: any): Promise<FeePaymentRecord> => {
    const res = await fetch('/api/fees/collect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData),
    });
    const record = await res.json();
    await refreshData();
    return record;
  };

  const publishAnnouncement = async (annData: any) => {
    const res = await fetch('/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(annData),
    });
    if (res.ok) await refreshData();
  };

  const clearAllData = async () => {
    try {
      await fetch('/api/db/clear', { method: 'POST' });
    } catch (err) {
      console.error('Failed to clear data:', err);
    }
    await refreshData();
  };

  const loadSampleData = async () => {
    await refreshData();
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
        timetable,
        currentUser,
        currentRole,
        isLoading,
        setCurrentRole,
        refreshData,
        addBranch,
        deleteBranch,
        addCourse,
        addBatch,
        admitStudent,
        addTeacher,
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

export const useHighStudy = (): HighStudyContextType => {
  const context = useContext(HighStudyContext);
  if (!context) {
    throw new Error('useHighStudy must be used within a HighStudyProvider');
  }
  return context;
};
