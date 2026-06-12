export type Role = 'admin' | 'student' | 'parent' | 'tutor';

export type Screen = 
  | 'landing' 
  | 'login' 
  | 'register' 
  | 'admin' 
  | 'student' 
  | 'parent' 
  | 'tutor';

export interface Student {
  id: string;
  name: string;
  grade: string;
  subject: string;
  phone: string;
  email: string;
  parentPhone?: string;
  status: 'Active' | 'Pending' | 'Inactive';
  progress: number;
  avatar?: string;
  initials?: string;
  avgGrade: number;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  experience: string;
  status: 'Active' | 'On Leave';
  courses: string[];
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  attendance?: string;
  salaryStatus?: string;
}

export interface ActivityLog {
  id: string;
  studentName: string;
  initials?: string;
  avatar?: string;
  type: 'New Enrollment' | 'Fee Payment' | 'Session Scheduled' | 'Payment Failed';
  detail: string;
  dateTime: string;
  amount?: number;
  status: 'Active' | 'Completed' | 'Pending' | 'Failed';
}

export interface Course {
  id: string;
  name: string;
  tutorName: string;
  schedule: string;
  iconType: 'math' | 'physics' | 'lit' | 'chem';
  progress: number;
  room?: string;
}

export interface Bill {
  id: string;
  itemName: string;
  paidDate: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
}

export interface ExamResult {
  id: string;
  examName: string;
  date: string;
  score: number;
  maxScore: number;
  teacherNotes: string;
}

export interface ExamSchedule {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  type: 'Midterm' | 'Quiz';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  timeAgo: string;
  iconType: 'event' | 'celebration' | 'info';
}

export interface UserProfile {
  id?: string;
  name: string;
  email?: string;
  role: Role;
  profilePhoto?: string;
}
