const BASE_URL = `${import.meta.env.VITE_API_URL || 'https://backend-tutorcrm.vercel.app'}/api`;

// Helper to construct authorization headers
const getHeaders = (contentType = 'application/json') => {
  const token = localStorage.getItem('edumanage_token');
  const headers: Record<string, string> = {};
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Generic fetch wrapper
const request = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(options.body instanceof FormData ? '' : 'application/json'),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error || `HTTP error! Status: ${response.status}`;
    const error = new Error(errorMessage) as any;
    error.status = response.status;
    throw error;
  }

  return response.json();
};

export const api = {
  // Authentication
  login: (credentials: { email: string; passwordHash?: string; password?: string; role: string }) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password || credentials.passwordHash,
        role: credentials.role
      })
    });
  },

  register: (data: any) => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  verifyLinkage: (phone: string) => {
    return request(`/auth/verify-linkage?phone=${encodeURIComponent(phone)}`, {
      method: 'GET'
    });
  },

  getCurrentUser: () => {
    return request('/auth/me');
  },

  // Admin Dashboard
  getAdminMetrics: () => {
    return request('/admin/metrics');
  },

  getAdminStudents: (query = '', status = 'All') => {
    return request(`/admin/students?query=${encodeURIComponent(query)}&status=${status}`);
  },

  enrollStudent: (student: any) => {
    return request('/admin/students/enroll', {
      method: 'POST',
      body: JSON.stringify(student)
    });
  },

  getActivityLogs: () => {
    return request('/admin/activities');
  },

  getTeachers: () => {
    return request('/admin/teachers');
  },

  getCourses: () => {
    return request('/admin/courses');
  },

  addCourse: (courseData: any) => {
    return request('/admin/courses', {
      method: 'POST',
      body: JSON.stringify(courseData)
    });
  },

  // Tutor Dashboard
  getTutorStudents: () => {
    return request('/tutor/students');
  },

  markAttendance: (studentId: string, status: 'Present' | 'Absent' | 'Excused') => {
    return request('/tutor/attendance', {
      method: 'POST',
      body: JSON.stringify({ studentId, status })
    });
  },

  gradeAssignment: (data: { studentId: string; assignmentName: string; score: number; feedback: string }) => {
    return request('/tutor/assignments/grade', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  publishQuiz: (quiz: { title: string; subject: string; questions: any[] }) => {
    return request('/tutor/quizzes/publish', {
      method: 'POST',
      body: JSON.stringify(quiz)
    });
  },

  scheduleLecture: (lecture: { title: string; date: string; time: string; location: string }) => {
    return request('/tutor/lectures/schedule', {
      method: 'POST',
      body: JSON.stringify(lecture)
    });
  },

  // Student Dashboard
  getStudentDashboard: () => {
    return request('/student/dashboard');
  },

  submitQuiz: (quizId: string, answers: Record<number, string>) => {
    return request(`/student/quizzes/${quizId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers })
    });
  },

  // Parent Dashboard
  getParentDashboard: () => {
    return request('/parent/dashboard');
  },

  getParentBills: () => {
    return request('/parent/bills');
  },

  payBill: (billId: string) => {
    return request(`/parent/bills/${billId}/pay`, {
      method: 'POST'
    });
  },

  // Communications / Chats
  getChatHistory: (otherUserId: string) => {
    return request(`/messages/${otherUserId}`);
  },

  sendMessage: (receiverId: string, text: string) => {
    return request('/messages/send', {
      method: 'POST',
      body: JSON.stringify({ receiverId, text })
    });
  },

  // AI assistant Chatbox
  chatWithAI: (message: string, history: Array<{ sender: 'user' | 'bot'; text: string }>) => {
    return request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, history })
    });
  },

  approveStudent: (studentId: string, action: 'accept' | 'decline') => {
    return request(`/admin/students/${studentId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ action })
    });
  },

  getStudentById: (studentId: string) => {
    return request(`/admin/students/${studentId}`);
  },

  getTutorById: (tutorId: string) => {
    return request(`/admin/tutors/${tutorId}`);
  },

  editStudent: (studentId: string, studentData: any) => {
    return request(`/admin/students/${studentId}`, {
      method: 'PUT',
      body: JSON.stringify(studentData)
    });
  },

  deleteStudent: (studentId: string) => {
    return request(`/admin/students/${studentId}`, {
      method: 'DELETE'
    });
  },

  addTutor: (tutorData: any) => {
    return request('/admin/tutors', {
      method: 'POST',
      body: JSON.stringify(tutorData)
    });
  },

  editTutor: (tutorId: string, tutorData: any) => {
    return request(`/admin/tutors/${tutorId}`, {
      method: 'PUT',
      body: JSON.stringify(tutorData)
    });
  },

  deleteTutor: (tutorId: string) => {
    return request(`/admin/tutors/${tutorId}`, {
      method: 'DELETE'
    });
  },

  getAdminParents: () => {
    return request('/admin/parents');
  },

  addParent: (data: { firstName: string; lastName: string; email?: string; phone: string; password: string }) => {
    return request('/admin/parents', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  updateParent: (id: string, data: { firstName: string; lastName: string; email?: string; phone: string }) => {
    return request(`/admin/parents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  deleteParent: (id: string) => {
    return request(`/admin/parents/${id}`, {
      method: 'DELETE'
    });
  },

  // Feedback API endpoints
  getStudentFeedback: () => {
    return request('/student/feedback');
  },

  submitStudentFeedback: (feedback: string, rating: number) => {
    return request('/student/feedback', {
      method: 'POST',
      body: JSON.stringify({ feedback, rating })
    });
  },

  getParentFeedback: () => {
    return request('/parent/feedback');
  },

  submitParentFeedback: (feedback: string, rating: number) => {
    return request('/parent/feedback', {
      method: 'POST',
      body: JSON.stringify({ feedback, rating })
    });
  },

  // Tutor Profile Endpoint
  getTutorProfile: () => {
    return request('/tutor/profile');
  },

  // ── Razorpay Payment Integration ──────────────────────────────────────────

  /** Fetch the Razorpay public key_id from the backend (never hardcode it in frontend) */
  getRazorpayKey: (): Promise<{ key_id: string }> => {
    return request('/razorpay-key');
  },

  /** Create a Razorpay order on the backend and receive the order_id */
  createOrder: (amount: number, currency = 'INR', receipt: string): Promise<{ order_id: string; amount: number; currency: string }> => {
    return request('/create-order', {
      method: 'POST',
      body: JSON.stringify({ amount, currency, receipt })
    });
  },

  /** Verify payment signature on the backend — never verify client-side */
  verifyPayment: (payload: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }): Promise<{ success: boolean; message?: string; error?: string }> => {
    return request('/verify-payment', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
};
