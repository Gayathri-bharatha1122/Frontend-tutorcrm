import { useState, useEffect } from 'react';
import { api } from './services/api';
import { motion, AnimatePresence } from 'motion/react';
import { LanguageProvider } from './LanguageContext';
import { Student, Teacher, ActivityLog, Course, Bill, Announcement, Screen, Role } from './types';
import { Sidebar } from './components/Sidebar';

// Importing Views
import { PublicNavbar } from './components/PublicNavbar';
import { LandingPage } from './components/LandingPage';
import { LoginScreen } from './components/LoginScreen';
import { RegisterStepper } from './components/RegisterStepper';
import { AdminDashboard } from './components/AdminDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { ParentDashboard } from './components/ParentDashboard';
import { TutorDashboard } from './components/TutorDashboard';
import { AIChatBox } from './components/AIChatBox';

// Role-based page components
import { AdminPage } from './components/pages/AdminPages';
import { TutorPage } from './components/pages/TutorPages';
import { StudentPage } from './components/pages/StudentPages';
import { ParentPage } from './components/pages/ParentPages';


export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [activeRole, setActiveRole] = useState<Role>('student');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPath, setCurrentPath] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('edumanage_token');
    if (token) {
      api.getCurrentUser().then(data => {
        const user = data.user || data;
        setActiveRole(user.role);
        setCurrentProfileName(user.name || user.firstName);
        setIsLoggedIn(true);
        if (user.role === 'admin') setScreen('admin');
        else if (user.role === 'tutor') setScreen('tutor');
        else if (user.role === 'parent') setScreen('parent');
        else setScreen('student');
      }).catch(() => {
        localStorage.removeItem('edumanage_token');
      }).finally(() => {
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  // Global Scroll Parallax State
  const [globalScrollY, setGlobalScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setGlobalScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Persistence States synced with LocalStorage

  const [publishedQuizzes, setPublishedQuizzes] = useState<Array<{
    id: string;
    title: string;
    subject: string;
    questionsCount: number;
    questions: Array<{
      id: number;
      text: string;
      options: string[];
      correctAnswer: string;
    }>;
  }>>(() => {
    const cached = localStorage.getItem('edumanage_quizzes');
    return cached ? JSON.parse(cached) : [
      {
        id: 'q1',
        title: 'Electromagnetic Fields Intro',
        subject: 'Electromagnetism',
        questionsCount: 1,
        questions: [
          {
            id: 1,
            text: 'What is the SI unit of magnetic flux density?',
            options: ['Tesla', 'Weber', 'Henry', 'Farad'],
            correctAnswer: 'A'
          }
        ]
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('edumanage_quizzes', JSON.stringify(publishedQuizzes));
  }, [publishedQuizzes]);

  const handlePublishQuiz = (newQuiz: { title: string; subject: string; questions: any[] }) => {
    setPublishedQuizzes(prev => [
      { id: `q-${Date.now()}`, ...newQuiz, questionsCount: newQuiz.questions.length },
      ...prev
    ]);
  };

  // Cached profile identity
  const [currentProfileName, setCurrentProfileName] = useState<string>('Marcus Thorne');



  // Route screen selections
  const handleNavigate = (targetScreen: Screen, initialRole?: Role) => {
    setScreen(targetScreen);
    if (initialRole) {
      setActiveRole(initialRole);
    }
    // Reset path when navigating via top-level pages
    setCurrentPath('');
  };

  // Sidebar navigation handler (path based) with RBAC
  const handleSidebarNavigate = (path: string) => {
    // Check RBAC permission
    if (
      (path.startsWith('/admin') && activeRole !== 'admin') ||
      (path.startsWith('/tutor') && activeRole !== 'tutor') ||
      (path.startsWith('/parent') && activeRole !== 'parent') ||
      (path.startsWith('/student') && activeRole !== 'student')
    ) {
      alert("Access Denied: You do not have permission to access this portal.");
      
      // Redirect to their own dashboard
      const dashboardPath = `/${activeRole}/dashboard`;
      setCurrentPath(dashboardPath);
      setScreen(activeRole);
      return;
    }

    setCurrentPath(path);
    if (path.startsWith('/admin')) {
      setScreen('admin');
    } else if (path.startsWith('/tutor')) {
      setScreen('tutor');
    } else if (path.startsWith('/parent')) {
      setScreen('parent');
    } else if (path.startsWith('/student')) {
      setScreen('student');
    } else {
      // fallback to landing for unknown paths
      setScreen('landing');
    }
  };

  const handleLoginSuccess = (role: Role, name?: string) => {
    setActiveRole(role);
    setIsLoggedIn(true);
    // Resolve personal name tags corresponding to roles for display
    if (role === 'admin') {
      setCurrentProfileName(name || 'System Administrator');
      setScreen('admin');
    } else if (role === 'tutor') {
      setCurrentProfileName(name || 'Prof. Alistair Miller');
      setScreen('tutor');
    } else if (role === 'parent') {
      setCurrentProfileName(name || 'Helena Thorne');
      setScreen('parent');
    } else {
      setCurrentProfileName(name || 'Marcus Thorne');
      setScreen('student');
    }
  };

  const handleRegisteredSuccess = (role: Role, customName: string) => {
    setActiveRole(role);
    setCurrentProfileName(customName);
    setIsLoggedIn(true);
    
    if (role === 'parent') {
      setScreen('parent');
    } else {
      setScreen('student');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('edumanage_token');
    setIsLoggedIn(false);
    setScreen('landing');
  };

  const handleHome = () => {
    setScreen('landing');
  };

  const isPublicPage = ['landing', 'login', 'register'].includes(screen);

  if (isLoading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading...</div>;
  }

  return (
    <LanguageProvider>
      <div className="bg-slate-800 min-h-screen w-full overflow-x-hidden text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative">

        {/* Global Mesh Gradient Background */}
        <div 
          className="fixed inset-0 mesh-gradient-bg pointer-events-none z-0" 
          style={{ transform: `translateY(${globalScrollY * 0.05}px)` }}
        />
        
        {/* Global Floating Particles */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {[...Array(15)].map((_, i) => {
            const size = (i % 3 + 1) * 6; // 6px, 12px, 18px
            const left = `${(i * 7) % 100}%`;
            const delay = `${(i * 1.2) % 12}s`;
            const duration = `${15 + (i * 4) % 20}s`;
            const color = i % 3 === 0 ? 'bg-indigo-400/10' : i % 3 === 1 ? 'bg-indigo-600/8' : 'bg-emerald-500/10';
            return (
              <div
                key={i}
                className={`absolute rounded-full blur-[2px] ${color}`}
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: left,
                  bottom: '-50px',
                  animation: `particle-float ${duration} infinite linear`,
                  animationDelay: delay,
                }}
              />
            );
          })}
        </div>

        {/* Global Content Wrapper */}
      <div className="relative z-10 flex-1 flex flex-col justify-between w-full">
        {isPublicPage && <PublicNavbar screen={screen} onNavigate={handleNavigate} isLoggedIn={isLoggedIn} activeRole={activeRole} />}

        {/* Authenticated Layout with Sidebar */}
        {!isPublicPage && (
          <div className="flex h-full">
            <Sidebar
              activeRole={activeRole}
              userName={currentProfileName}
              currentPath={currentPath}
              onNavigate={handleSidebarNavigate}
              onLogout={handleLogout}
            />
            <div className="flex-1 overflow-auto">
              <AnimatePresence mode="wait">

                {/* ===== ADMIN ROUTES ===== */}
                {screen === 'admin' && (() => {
                  const segment = currentPath.replace('/admin/', '').replace('/admin', '');
                  // Sub-pages with back button
                  if (segment && segment !== 'dashboard' && ['students','tutors','parents','courses','fees','reports','settings'].includes(segment)) {
                    if (segment === 'students' || segment === 'tutors') {
                      return (
                        <motion.div key={`admin-${segment}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full">
                          <AdminPage
                            pageKey={segment}
                            onBack={() => handleSidebarNavigate('/admin/dashboard')}
                            adminDashboardElement={
                              <AdminDashboard
                                currentPath={currentPath}
                                onLogout={handleLogout}
                                onHome={handleHome}
                              />
                            }
                          />
                        </motion.div>
                      );
                    }
                    return (
                      <motion.div key={`admin-${segment}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full">
                        <AdminPage
                          pageKey={segment}
                          onBack={() => handleSidebarNavigate('/admin/dashboard')}
                        />
                      </motion.div>
                    );
                  }
                  // Main dashboard
                  return (
                    <motion.div key="admin-dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
                      <AdminDashboard currentPath={currentPath} onLogout={handleLogout} onHome={handleHome} />
                    </motion.div>
                  );
                })()}

                {/* ===== TUTOR ROUTES ===== */}
                {screen === 'tutor' && (() => {
                  const segment = currentPath.replace('/tutor/', '').replace('/tutor', '');
                  const subPages = ['classes','attendance','assignments','performance','profile'];
                  if (segment && segment !== 'dashboard' && subPages.includes(segment)) {
                    return (
                      <motion.div key={`tutor-${segment}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full">
                        <TutorPage
                          pageKey={segment}
                          tutorName={currentProfileName}
                          onBack={() => handleSidebarNavigate('/tutor/dashboard')}
                        />
                      </motion.div>
                    );
                  }
                  return (
                    <motion.div key="tutor-dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
                      <TutorDashboard tutorName={currentProfileName} currentPath={currentPath} onLogout={handleLogout} onHome={handleHome} />
                    </motion.div>
                  );
                })()}

                {/* ===== STUDENT ROUTES ===== */}
                {screen === 'student' && (() => {
                  const segment = currentPath.replace('/student/', '').replace('/student', '');
                  const subPages = ['courses','assignments','attendance','results','profile'];
                  if (segment && segment !== 'dashboard' && subPages.includes(segment)) {
                    return (
                      <motion.div key={`student-${segment}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full">
                        <StudentPage
                          pageKey={segment}
                          studentName={currentProfileName}
                          onBack={() => handleSidebarNavigate('/student/dashboard')}
                        />
                      </motion.div>
                    );
                  }
                  return (
                    <motion.div key="student-dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
                      <StudentDashboard studentName={currentProfileName} publishedQuizzes={publishedQuizzes} currentPath={currentPath} onLogout={handleLogout} onHome={handleHome} />
                    </motion.div>
                  );
                })()}

                {/* ===== PARENT ROUTES ===== */}
                {screen === 'parent' && (() => {
                  const segment = currentPath.replace('/parent/', '').replace('/parent', '');
                  const subPages = ['progress','attendance','fees','notifications','profile'];
                  if (segment && segment !== 'dashboard' && subPages.includes(segment)) {
                    return (
                      <motion.div key={`parent-${segment}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full">
                        <ParentPage
                          pageKey={segment}
                          parentName={currentProfileName}
                          studentName="Marcus Thorne"
                          onBack={() => handleSidebarNavigate('/parent/dashboard')}
                        />
                      </motion.div>
                    );
                  }
                  return (
                    <motion.div key="parent-dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
                      <ParentDashboard parentName={currentProfileName} studentName="Marcus Thorne" currentPath={currentPath} onLogout={handleLogout} onHome={handleHome} />
                    </motion.div>
                  );
                })()}

              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Public pages fallback (landing / login / register) */}
        {isPublicPage && (
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {screen === 'landing' && (
                <motion.div
                  key="landing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full"
                >
                  <LandingPage onNavigate={handleNavigate} isLoggedIn={isLoggedIn} activeRole={activeRole} />
                </motion.div>
              )}
              {screen === 'login' && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="w-full"
                >
                  <LoginScreen 
                    onLoginSuccess={handleLoginSuccess} 
                    onNavigate={handleNavigate} 
                    initialRole={activeRole} 
                  />
                </motion.div>
              )}

              {screen === 'register' && (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full"
                >
                  <RegisterStepper 
                    onNavigate={handleNavigate} 
                    onRegisteredSuccess={handleRegisteredSuccess} 
                  />
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        )}
          <AIChatBox />
        </div>
      </div>
    </LanguageProvider>
  );
}
