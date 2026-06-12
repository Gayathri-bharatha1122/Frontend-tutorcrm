import { Student, Teacher, ActivityLog, Course, Bill, ExamResult, ExamSchedule, Announcement } from './types';

// Realist initial student database list for the Admin and Tutor dashboards
export const initialStudents: Student[] = [
  { id: 'ST001', name: 'Marcus Thorne', grade: '11th Grade', subject: 'Advanced Physics', phone: '14155550218', email: 'marcus.thorne@edumail.com', parentPhone: '14155554921', status: 'Active', progress: 84, avgGrade: 3.8, initials: 'MT' },
  { id: 'ST002', name: 'Zoe Vance', grade: '10th Grade', subject: 'Chemistry Honors', phone: '14155550410', email: 'zoe.vance@edumail.com', parentPhone: '14155558911', status: 'Active', progress: 92, avgGrade: 4.0, initials: 'ZV' },
  { id: 'ST003', name: 'Liam Sterling', grade: '12th Grade', subject: 'Calculus BC', phone: '14155551102', email: 'liam.sterling@edumail.com', parentPhone: '14155551910', status: 'Active', progress: 76, avgGrade: 3.2, initials: 'LS' },
  { id: 'ST004', name: 'Penelope Chen', grade: '9th Grade', subject: 'Algebra I', phone: '14155559812', email: 'penelope.chen@edumail.com', parentPhone: '14155550239', status: 'Pending', progress: 45, avgGrade: 3.5, initials: 'PC' },
  { id: 'ST005', name: 'Jasper Vance', grade: '12th Grade', subject: 'AP Literature', phone: '14155557731', email: 'jasper.vance@edumail.com', parentPhone: '14155558911', status: 'Active', progress: 88, avgGrade: 3.7, initials: 'JV' },
  { id: 'ST006', name: 'Ethan Hunt', grade: '11th Grade', subject: 'Organic Chemistry', phone: '14155553091', email: 'ethan.hunt@edumail.com', parentPhone: '14155554311', status: 'Inactive', progress: 0, avgGrade: 2.8, initials: 'EH' }
];

export const initialTeachers: Teacher[] = [
  { id: 'T001', name: 'Prof. Alistair Miller', subject: 'Advanced Physics & Calculus', experience: '12 years', status: 'Active', courses: ['Physics Mechanics', 'Quantum Theory Basics', 'Calculus BC'] },
  { id: 'T002', name: 'Dr. Evelyn Sterling', subject: 'Chemistry Honors & Biotech', experience: '8 years', status: 'Active', courses: ['General Chemistry', 'Bio-Informatics'] },
  { id: 'T003', name: 'Sarah Jenkins', subject: 'Algebra I & Statistics', experience: '5 years', status: 'Active', courses: ['Intro to Statistics', 'College Algebra'] }
];

// Activity logging tracking table matching layout trends
export const initialActivityLogs: ActivityLog[] = [
  { id: 'ACT001', studentName: 'Marcus Thorne', initials: 'MT', type: 'New Enrollment', detail: 'Successfully enrolled by Administrator into AP Literature Course under Sarah Jenkins', dateTime: 'Today, 10:45 AM', status: 'Completed' },
  { id: 'ACT002', studentName: 'Zoe Vance', initials: 'ZV', type: 'Fee Payment', detail: 'Automatic recurring payment received for Spring Tutors Session Fee package', dateTime: 'Today, 09:12 AM', amount: 320, status: 'Completed' },
  { id: 'ACT003', studentName: 'Liam Sterling', initials: 'LS', type: 'Session Scheduled', detail: 'Private Calculus tutoring session booked with Sarah Jenkins for June 4', dateTime: 'Yesterday, 04:30 PM', status: 'Pending' },
  { id: 'ACT004', studentName: 'Marcus Thorne', initials: 'MT', type: 'Payment Failed', detail: 'Late Fee of ₹120 overdue billing UPI transaction decline - network timeout standard', dateTime: '2 Days ago', amount: 120, status: 'Failed' },
  { id: 'ACT005', studentName: 'Penelope Chen', initials: 'PC', type: 'New Enrollment', detail: 'Account created and awaiting verification checklist status approval', dateTime: '3 Days ago', status: 'Active' }
];

// Marcus Thorne's personalized Student Learning Board data
export const marcusCourses: Course[] = [
  { id: 'C01', name: 'Advanced General Physics', tutorName: 'Prof. Alistair Miller', schedule: 'Tue, Thu at 3:00 PM', iconType: 'physics', progress: 84, room: 'Lab Hall 4B' },
  { id: 'C02', name: 'Calculus BC Intensive Course', tutorName: 'Sarah Jenkins', schedule: 'Mon, Wed at 4:30 PM', iconType: 'math', progress: 78, room: 'Seminar A' },
  { id: 'C03', name: 'AP Chemistry Honors Lab', tutorName: 'Dr. Evelyn Sterling', schedule: 'Fri at 2:00 PM', iconType: 'chem', progress: 91, room: 'Room 302' }
];

export const marcusExams: ExamResult[] = [
  { id: 'EX01', examName: 'Midterm Mechanics Mechanics Theory', date: 'April 22', score: 94, maxScore: 100, teacherNotes: 'Excellent understanding of rotational kinematic vectors. Keep it up Marcus.' },
  { id: 'EX02', examName: 'Thermodynamics Assessment 2', date: 'May 10', score: 81, maxScore: 100, teacherNotes: 'Solid results, pay closer attention to standard heat expansion variables on Exam Part B.' },
  { id: 'EX03', examName: 'Calculus BC Integration Quiz', date: 'May 24', score: 88, maxScore: 90, teacherNotes: 'Magnificent integration bounds implementation.' }
];

export const upcomingExams: ExamSchedule[] = [
  { id: 'UNEX01', name: 'Electromagnetism Final Exam', date: 'June 05, 2026', time: '10:00 AM', location: 'Main Examination Quad', type: 'Midterm' },
  { id: 'UNEX02', name: 'Complex Limits Practice Quiz', date: 'June 09, 2026', time: '04:30 PM', location: 'Tutoring Studio West', type: 'Quiz' }
];

// Helena Thorne's parent dashboard linking child Marcus Thorne
export const helenaBills: Bill[] = [
  { id: 'BL001', itemName: 'Weekly Physics Tutoring Package Charge', paidDate: 'May 28', amount: 320, status: 'Paid' },
  { id: 'BL002', itemName: 'Chemistry Lab Material Registration Surcharge', paidDate: '-', amount: 120, status: 'Pending' },
  { id: 'BL003', itemName: 'Math Materials and Workbook Printing Fee', paidDate: 'May 04', amount: 45, status: 'Paid' },
  { id: 'BL004', itemName: 'Calculus Prep Advanced Session Billing (Overdue)', paidDate: '-', amount: 180, status: 'Overdue' }
];

export const systemAnnouncements: Announcement[] = [
  { id: 'AN01', title: 'Interactive Science Symposium 2026', content: 'Join Dr. Sterling for an exploratory biotechnology seminar on chemical engineering. Students of all grade tiers welcome. Registration closes next Wednesday.', timeAgo: '2 hours ago', iconType: 'celebration' },
  { id: 'AN02', title: 'Summer Term Academic Scheduling Notice', content: 'Weekly tutoring session timesheets will transition fully to the Summer Shift standard effective June 15. Standard reservations will be locked.', timeAgo: '1 day ago', iconType: 'event' },
  { id: 'AN03', title: 'New Multi-Role Login Launch complete', content: 'Our state of the art EduManage Student, Parent and Tutor workspace CRM system interface is fully operational worldwide.', timeAgo: '3 days ago', iconType: 'info' }
];
