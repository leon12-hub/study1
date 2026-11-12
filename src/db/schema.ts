/**
 * HighStudy Production Relational Database Schema
 * Dialect: PostgreSQL (via Cloud SQL & Drizzle ORM)
 */

import { pgTable, text, serial, integer, doublePrecision, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';

// 1. Central Institute
export const institutes = pgTable('institutes', {
  id: text('id').primaryKey(),
  name: text('name').notNull().default('HighStudy Apex Academy'),
  code: text('code').notNull().unique().default('HIGHSTUDY-HQ'),
  tagline: text('tagline'),
  contactEmail: text('contact_email').notNull(),
  contactPhone: text('contact_phone').notNull(),
  headquartersAddress: text('headquarters_address').notNull(),
  website: text('website'),
  establishedYear: integer('established_year').default(2018),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 2. Physical Campuses / Branches
export const branches = pgTable('branches', {
  id: text('id').primaryKey(),
  instituteId: text('institute_id').notNull(),
  name: text('name').notNull(),
  code: text('code').notNull().unique(),
  city: text('city').notNull(),
  address: text('address').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  branchAdminName: text('branch_admin_name'),
  activeRevenue: doublePrecision('active_revenue').default(0),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 3. User Directory & Roles
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  phone: text('phone'),
  role: text('role').notNull(), // SUPER_ADMIN, INSTITUTE_ADMIN, BRANCH_ADMIN, TEACHER, STUDENT, PARENT
  branchId: text('branch_id'),
  branchName: text('branch_name'),
  avatarUrl: text('avatar_url'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 4. Courses & Programs
export const courses = pgTable('courses', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  code: text('code').notNull().unique(),
  targetExam: text('target_exam').notNull(),
  durationMonths: integer('duration_months').notNull(),
  totalFee: doublePrecision('total_fee').notNull(),
  description: text('description').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 5. Subjects & Modules
export const subjects = pgTable('subjects', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  code: text('code').notNull(),
  courseId: text('course_id').notNull(),
  colorCode: text('color_code'),
  iconName: text('icon_name'),
});

// 6. Chapters & Syllabus
export const chapters = pgTable('chapters', {
  id: text('id').primaryKey(),
  subjectId: text('subject_id').notNull(),
  name: text('name').notNull(),
  chapterNumber: integer('chapter_number').notNull(),
  totalLectures: integer('total_lectures').default(0),
});

// 7. Cohorts / Batches
export const batches = pgTable('batches', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  code: text('code').notNull().unique(),
  branchId: text('branch_id').notNull(),
  branchName: text('branch_name').notNull(),
  courseId: text('course_id').notNull(),
  courseName: text('course_name').notNull(),
  roomNumber: text('room_number').notNull(),
  timing: text('timing').notNull(),
  maxCapacity: integer('max_capacity').default(60),
  status: text('status').default('ONGOING').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 8. Timetable Slots
export const timetableSlots = pgTable('timetable_slots', {
  id: text('id').primaryKey(),
  batchId: text('batch_id').notNull(),
  dayOfWeek: text('day_of_week').notNull(),
  startTime: text('start_time').notNull(),
  endTime: text('end_time').notNull(),
  subjectName: text('subject_name').notNull(),
  teacherName: text('teacher_name').notNull(),
  room: text('room').notNull(),
});

// 9. Student Profiles
export const students = pgTable('students', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  enrollmentNumber: text('enrollment_number').notNull().unique(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  branchId: text('branch_id').notNull(),
  branchName: text('branch_name').notNull(),
  courseId: text('course_id').notNull(),
  courseName: text('course_name').notNull(),
  batchId: text('batch_id').notNull(),
  batchName: text('batch_name').notNull(),
  rollNumber: text('roll_number').notNull(),
  dateOfBirth: text('date_of_birth'),
  gender: text('gender').default('MALE'),
  parentName: text('parent_name'),
  parentPhone: text('parent_phone'),
  admissionDate: text('admission_date').notNull(),
  attendanceRate: doublePrecision('attendance_rate').default(100),
  studyStreakDays: integer('study_streak_days').default(1),
  overallScorePercent: doublePrecision('overall_score_percent').default(0),
  totalFee: doublePrecision('total_fee').notNull(),
  paidFee: doublePrecision('paid_fee').default(0).notNull(),
  pendingFee: doublePrecision('pending_fee').notNull(),
  status: text('status').default('ACTIVE').notNull(),
});

// 10. Teacher Profiles
export const teachers = pgTable('teachers', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  employeeCode: text('employee_code').notNull().unique(),
  designation: text('designation').notNull(),
  department: text('department').notNull(),
  specialization: text('specialization').notNull(),
  qualifications: text('qualifications').notNull(),
  experienceYears: integer('experience_years').default(5),
  branchName: text('branch_name').notNull(),
  rating: doublePrecision('rating').default(5.0),
  joiningDate: text('joining_date').notNull(),
  status: text('status').default('ACTIVE').notNull(),
});

// 11. Parent Profiles
export const parents = pgTable('parents', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  occupation: text('occupation'),
  address: text('address'),
});

// 12. Attendance Records
export const attendanceRecords = pgTable('attendance_records', {
  id: text('id').primaryKey(),
  studentId: text('student_id').notNull(),
  studentName: text('student_name').notNull(),
  rollNumber: text('roll_number').notNull(),
  batchId: text('batch_id').notNull(),
  batchName: text('batch_name').notNull(),
  date: text('date').notNull(),
  status: text('status').notNull(), // PRESENT, ABSENT, LATE
  markedByTeacherName: text('marked_by_teacher_name').notNull(),
  remarks: text('remarks'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 13. Study Materials & Recorded Classes
export const studyMaterials = pgTable('study_materials', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  subjectName: text('subject_name').notNull(),
  chapterName: text('chapter_name'),
  type: text('type').notNull(), // PDF_NOTE, VIDEO_LECTURE, FORMULA_SHEET, PRACTICE_SET
  fileUrl: text('file_url').notNull(),
  fileSizeBytes: doublePrecision('file_size_bytes'),
  durationMinutes: integer('duration_minutes'),
  uploaderTeacherName: text('uploader_teacher_name').notNull(),
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
});

// 14. Homework Assignments
export const assignments = pgTable('assignments', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  subjectName: text('subject_name').notNull(),
  batchId: text('batch_id').notNull(),
  batchName: text('batch_name').notNull(),
  assignedByTeacherName: text('assigned_by_teacher_name').notNull(),
  dueDate: text('due_date').notNull(),
  maxMarks: integer('max_marks').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 15. Student Assignment Submissions
export const assignmentSubmissions = pgTable('assignment_submissions', {
  id: text('id').primaryKey(),
  assignmentId: text('assignment_id').notNull(),
  studentId: text('student_id').notNull(),
  studentName: text('student_name').notNull(),
  submittedAt: text('submitted_at').notNull(),
  attachmentUrl: text('attachment_url').notNull(),
  remarks: text('remarks'),
  status: text('status').default('PENDING').notNull(), // PENDING, EVALUATED, LATE
  obtainedMarks: doublePrecision('obtained_marks'),
  teacherFeedback: text('teacher_feedback'),
  evaluatedAt: text('evaluated_at'),
});

// 16. Examinations
export const examinations = pgTable('examinations', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  courseName: text('course_name').notNull(),
  batchNames: jsonb('batch_names').notNull(), // array of strings
  totalQuestions: integer('total_questions').notNull(),
  totalMarks: doublePrecision('total_marks').notNull(),
  passingMarks: doublePrecision('passing_marks').notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  startsAt: text('starts_at').notNull(),
  endsAt: text('ends_at').notNull(),
  status: text('status').default('LIVE').notNull(), // SCHEDULED, LIVE, COMPLETED
  type: text('type').default('MOCK_TEST').notNull(), // MOCK_TEST, UNIT_TEST, TERM_EXAM
});

// 17. Exam Questions
export const examQuestions = pgTable('exam_questions', {
  id: text('id').primaryKey(),
  examId: text('exam_id').notNull(),
  subjectName: text('subject_name').notNull(),
  questionText: text('question_text').notNull(),
  optionsJson: jsonb('options_json').notNull(), // array of { id, optionText, isCorrect }
  explanation: text('explanation').notNull(),
  difficulty: text('difficulty').default('MEDIUM').notNull(),
  marks: doublePrecision('marks').notNull(),
  negativeMarks: doublePrecision('negative_marks').default(1).notNull(),
});

// 18. Student Exam Attempts
export const examAttempts = pgTable('exam_attempts', {
  id: text('id').primaryKey(),
  examId: text('exam_id').notNull(),
  examTitle: text('exam_title').notNull(),
  studentId: text('student_id').notNull(),
  studentName: text('student_name').notNull(),
  startedAt: text('started_at').notNull(),
  submittedAt: text('submitted_at').notNull(),
  score: doublePrecision('score').notNull(),
  totalMarks: doublePrecision('total_marks').notNull(),
  percentage: doublePrecision('percentage').notNull(),
  rank: integer('rank').default(1),
  accuracy: doublePrecision('accuracy').notNull(),
  correctAnswersCount: integer('correct_answers_count').notNull(),
  incorrectAnswersCount: integer('incorrect_answers_count').notNull(),
  unattemptedCount: integer('unattempted_count').notNull(),
  answersJson: jsonb('answers_json').notNull(),
});

// 19. Fee Payment Records & Ledgers
export const feePayments = pgTable('fee_payments', {
  id: text('id').primaryKey(),
  receiptNumber: text('receipt_number').notNull().unique(),
  studentId: text('student_id').notNull(),
  studentName: text('student_name').notNull(),
  enrollmentNumber: text('enrollment_number').notNull(),
  batchName: text('batch_name').notNull(),
  amount: doublePrecision('amount').notNull(),
  paymentMethod: text('payment_method').notNull(), // UPI, NET_BANKING, CREDIT_CARD, CASH
  transactionReference: text('transaction_reference').notNull(),
  paymentDate: text('payment_date').notNull(),
  feeType: text('fee_type').notNull(),
  status: text('status').default('SUCCESS').notNull(),
});

// 20. Notices & Announcements
export const announcements = pgTable('announcements', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  priority: text('priority').default('HIGH').notNull(),
  targetRoles: jsonb('target_roles').notNull(), // array of strings
  senderName: text('sender_name').notNull(),
  senderRole: text('sender_role').notNull(),
  publishedAt: text('published_at').notNull(),
});

// 21. System Security & Activity Logs
export const activityLogs = pgTable('activity_logs', {
  id: text('id').primaryKey(),
  actorName: text('actor_name').notNull(),
  actorRole: text('actor_role').notNull(),
  action: text('action').notNull(),
  details: text('details').notNull(),
  ipAddress: text('ip_address'),
  timestamp: text('timestamp').notNull(),
});
