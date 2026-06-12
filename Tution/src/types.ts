export interface Student {
  id: string;
  name: string;
  avatar: string;
  email: string;
  grade: string;
  course: string;
  enrollmentDate: string;
  attendance: number; // e.g., 94 for 94%
  paymentStatus: 'Paid' | 'Pending' | 'Overdue';
  outstandingDue: number;
  feesPaid: number;
}

export interface ActivityLog {
  id: string;
  studentId?: string;
  studentName: string;
  avatar: string;
  course?: string;
  type: 'New Enrollment' | 'Fee Payment' | 'Session Scheduled' | 'Payment Failed' | 'General';
  dateTime: string;
  amount?: number;
  status?: string; // e.g., 'Active', 'Pending'
}

export interface Tutor {
  id: string;
  name: string;
  avatar: string;
  department: string;
  status: 'Active' | 'Inactive';
}

export interface Course {
  id: string;
  name: string;
  code: string;
  tutorName: string;
  activeStudents: number;
}
