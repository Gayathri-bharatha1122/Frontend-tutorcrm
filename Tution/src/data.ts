import { Student, ActivityLog, Tutor, Course } from './types';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'ST-90234',
    name: 'Elena Rodriguez',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4-x5LFi5SpyvOb4lgEHW0PtQfGhMmGtbSIQ09tr9Fpy2_D4rEdXFvdGhI7OWdYtZ4esWbgCjGiq42ZeuSEPdh6Cl__Mv48_no0RwJ58vXmDHi621n2AKA8PPfs-a0gC9KpNc05GlFhp6lHNnTYXxMRH1qnJ_QeQue7m6EJVFL8RWX6PutNoFrHW9kuEFteUwlvkODdBa0jI-Z_3xQ9YCcb12hAtK8beLpiNmGH7ggnrq4r6-8dZ0z0vKxv0veVdJSDayFNo3pDfD2',
    email: 'elena.rodriguez@edu.com',
    grade: 'Grade 10',
    course: 'Advanced Calculus',
    enrollmentDate: '2023-10-12',
    attendance: 94,
    paymentStatus: 'Paid',
    outstandingDue: 0,
    feesPaid: 1200,
  },
  {
    id: 'ST-90235',
    name: 'James Thompson',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpEPFJVdpsVEAZAm6PDG_CdOtXxh495RzUzCSX_txYC50TFWDPD92tsFMw7Ax4_T0hDVrhOsjBLIi1GD_wwTF4JMoaJI9F0-kNjeb6T_QVpYJYv5n_Z06LqbmcW5lHBWvSwrjAWDyRWaXj6pYBr4eslGVgyBffTKorw_Bz_Gnz7v6WslyuVfmZE9lec4mq9hvMSodWhxFVJArjcd2Cbzoc9CgglLOaBpPuwVQEnrN2nWZIpNyNgHnp9E4JQkGZFBOwTiRi07U4VxII',
    email: 'james.thompson@edu.com',
    grade: 'Grade 11',
    course: 'Data Science 101',
    enrollmentDate: '2023-10-15',
    attendance: 82,
    paymentStatus: 'Pending',
    outstandingDue: 450,
    feesPaid: 800,
  },
  {
    id: 'ST-90236',
    name: 'Sarah Chen',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlJxLDEmnhmgx32eGFrqDCebAot5vaBoLrz8kV8fPRhzvTZvNvEODP475Qs_x4V8p4zdUWYP9Yh3SNEOgpVcePCG4XAYwHERNwsLh_aaZhM4BubjCAWBz5lUAHgDOquZRBNv3RyPUozNlF8LG0XGXzjuL77H7Df2v_lWU1__sTWzLkf_kcb5miMx4mFD2G1iKVOgHT1BEtliZdHrDGMolQXni6ZYyvv8CDNM5x4Nxpnqg0O3LkRiF_M5kswxAHoCNusfmXWVNRf0vv',
    email: 'sarah.chen@edu.com',
    grade: 'Grade 10',
    course: 'World History',
    enrollmentDate: '2023-11-02',
    attendance: 65,
    paymentStatus: 'Overdue',
    outstandingDue: 320,
    feesPaid: 400,
  },
  {
    id: 'ST-90237',
    name: 'David Miller',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdg-wiaQK6PPpVgefZvSU4WD9yWrCxvfAmOEX5R5f6iaxkZ-PvQ4IwPgfHXPNJj8h83OQnmGpD3ue-NK9OBYiJtPaLTfdfJdlY4kv00tqHdtWvU0Oz9pIffF8pm-MQCCXq-eHfr4zr8sktD_PHjK8Hztw31v9aaDAtcQddGmF_DX-_yuAARuQhAXthqMO1NoLrPbCjm4hH1pUDbYzO6_kQElIJIoemyOx0fH3aQ7txJXI-WPCKXKp85WTPlrzRJz2jPU_vA2t6aoMy',
    email: 'david.miller@edu.com',
    grade: 'Grade 12',
    course: 'English Lit',
    enrollmentDate: '2023-11-05',
    attendance: 88,
    paymentStatus: 'Paid',
    outstandingDue: 0,
    feesPaid: 1500,
  },
  {
    id: 'ST-2023-0842',
    name: 'Jonathan Smith',
    avatar: '', // Custom standard abbreviation generated visually
    email: 'jonathan.smith@edu.com',
    grade: 'Grade 10',
    course: 'Mathematics Advanced',
    enrollmentDate: '2023-10-12',
    attendance: 90,
    paymentStatus: 'Overdue',
    outstandingDue: 450,
    feesPaid: 1350,
  },
  {
    id: 'ST-2023-0845',
    name: 'Maria Williams',
    avatar: '',
    email: 'maria.williams@edu.com',
    grade: 'Grade 11',
    course: 'English Literature',
    enrollmentDate: '2023-10-15',
    attendance: 85,
    paymentStatus: 'Overdue',
    outstandingDue: 325,
    feesPaid: 975,
  },
  {
    id: 'ST-2023-0849',
    name: 'Alex Kim',
    avatar: '',
    email: 'alex.kim@edu.com',
    grade: 'Grade 12',
    course: 'Physics 101',
    enrollmentDate: '2023-10-18',
    attendance: 93,
    paymentStatus: 'Overdue',
    outstandingDue: 600,
    feesPaid: 1800,
  },
  {
    id: 'ST-2023-0852',
    name: 'Emma Brown',
    avatar: '',
    email: 'emma.brown@edu.com',
    grade: 'Grade 11',
    course: 'History of Art',
    enrollmentDate: '2023-10-20',
    attendance: 81,
    paymentStatus: 'Overdue',
    outstandingDue: 210,
    feesPaid: 630,
  },
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'ACT-001',
    studentId: 'ST-90238',
    studentName: 'Jane Doe',
    avatar: '',
    course: 'Math Advanced',
    type: 'New Enrollment',
    dateTime: 'Today, 10:45 AM',
    status: 'Active',
  },
  {
    id: 'ACT-002',
    studentId: 'ST-90239',
    studentName: 'Mark Smith',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1hoGVzgYt5UigScLmx8Hsu8qxPglEGTBMWWmYYUnexutCBx43-0k3NZqOrn1T0O8g4RegZHvzpk9H9-D7S7TRTqGCAbdZ_lGdOeE7OJ81exrKm1CTMIvjXc9uDubrwFbgDpmHNfIUOx3mXQWeBaZzvHg9T0kjkGHsxqG2brs8PjrxX40Mq1t8r4i2XNkIUCDbMAEpS8BBeaPdRHicylSWTFuMuiNrDSrv_Hw06mPYVWcLa-3NQNiW6KXXBq4T-Ir5lYA1Yw1JpLIL',
    course: 'Physics',
    type: 'Fee Payment',
    dateTime: 'Yesterday, 04:30 PM',
    amount: 450.00,
  },
  {
    id: 'ACT-003',
    studentName: 'Tutor Clara',
    avatar: '',
    course: 'Science Department',
    type: 'Session Scheduled',
    dateTime: 'Oct 24, 09:00 AM',
    status: 'Pending',
  },
  {
    id: 'ACT-004',
    studentId: 'ST-90236',
    studentName: 'Liam Hudson',
    avatar: '',
    course: 'English',
    type: 'Payment Failed',
    dateTime: 'Oct 23, 11:20 AM',
    amount: 320.00,
  },
];

export const INITIAL_TUTORS: Tutor[] = [
  { id: 'TUT-01', name: 'Tutor Clara', avatar: '', department: 'Science Department', status: 'Active' },
  { id: 'TUT-02', name: 'James Davis', avatar: '', department: 'Mathematics Department', status: 'Active' },
  { id: 'TUT-03', name: 'Melissa Stewart', avatar: '', department: 'Humanities Department', status: 'Active' },
];

export const INITIAL_COURSES: Course[] = [
  { id: 'CRS-01', name: 'Advanced Calculus', code: 'MATH-401', tutorName: 'James Davis', activeStudents: 154 },
  { id: 'CRS-02', name: 'Data Science 101', code: 'DS-101', tutorName: 'Dr. Evelyn Harris', activeStudents: 212 },
  { id: 'CRS-03', name: 'World History', code: 'HIST-202', tutorName: 'Melissa Stewart', activeStudents: 98 },
  { id: 'CRS-04', name: 'English Lit', code: 'LIT-105', tutorName: 'Sarah Jenkins', activeStudents: 110 },
  { id: 'CRS-05', name: 'Physics 101', code: 'PHYS-101', tutorName: 'Tutor Clara', activeStudents: 132 },
  { id: 'CRS-06', name: 'History of Art', code: 'ART-201', tutorName: 'Dr. Marcus Vance', activeStudents: 45 },
];

// Helper functions for persistent Local Storage state management
export const loadFromStorage = <T>(key: string, initial: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(`Failed to load key "${key}" from localStorage:`, e);
  }
  return initial;
};

export const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save key "${key}" to localStorage:`, e);
  }
};
