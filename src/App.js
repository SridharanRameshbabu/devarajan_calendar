import React, { useState, useEffect } from "react";
import MonthCalendar from "./MonthCalendar";
import Essentials from "./Essentials";
import Auth from "./Auth";
import { isAuthenticated, getUser } from "./utils/auth";
const sdkLogo = "https://cdn.jsdelivr.net/gh/sridevarajankuzhumamems/SDK-CALENDAR-IMAGES/downloads/SDK_Logo_Final.png";
const introImgmobile = 'https://cdn.jsdelivr.net/gh/sridevarajankuzhumamems/SDK-CALENDAR-IMAGES/downloads/Second-Loading-Mobile.jpg';
const introImglaptop = 'https://cdn.jsdelivr.net/gh/sridevarajankuzhumamems/SDK-CALENDAR-IMAGES/downloads/Second-loading-laptop.jpg'
const credits = 'https://cdn.jsdelivr.net/gh/sridevarajankuzhumamems/SDK-CALENDAR-IMAGES/downloads/SDK%20Credits%20&%20Creators%20.jpg'
const laptopcredits = 'https://cdn.jsdelivr.net/gh/sridevarajankuzhumamems/SDK-CALENDAR-IMAGES/downloads/SDK_Credits%20&%20Creators%20%20(Website).jpg'

function App() {
  const [step, setStep] = useState('loading'); // 'loading', 'intro', 'auth', 'calendar', 'exiting', 'credits', 'essentials'
  const [isIntroClosing, setIsIntroClosing] = useState(false);

  // Calculate initial month (current month if 2026, else January or December)
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const initialMonth = todayYear === 2026 ? todayMonth : (todayYear < 2026 ? 0 : 11);

  const [currentMonth, setCurrentMonth] = useState(initialMonth);

  useEffect(() => {
    if (step === 'loading') {
      const timer = setTimeout(() => {
        setStep('intro');
      }, 3000);
      return () => clearTimeout(timer);
    } else if (step === 'intro') {
      const closingTimer = setTimeout(() => {
        setIsIntroClosing(true);
      }, 2000); // Start closing animation after 2s

      const timer = setTimeout(() => {
        // Check if user is authenticated
        if (isAuthenticated()) {
          setStep('calendar');
        } else {
          setStep('auth');
        }
      }, 3000); // Transition after 3s (1s animation window)
      return () => {
        clearTimeout(timer);
        clearTimeout(closingTimer);
      };
    } else if (step === 'exiting') {
      const timer = setTimeout(() => {
        // Try to close the window/app
        window.close();
        // If window.close() doesn't work (most browsers block it), go back in history
        if (window.history.length > 1) {
          window.history.back();
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Logging API call when user enters the calendar
  useEffect(() => {
    if (step === 'calendar') {
      const user = getUser();
      if (user) {
        fetch('https://sdk-calendar-be-1.onrender.com/api/logs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            phone: user.phone
          })
        }).catch(err => console.error('Logging failed:', err));
      }
    }
  }, [step]);

  // Handle back button press and swipe gestures
  useEffect(() => {
    // Push multiple history states on mount to prevent immediate back navigation
    if (step === 'calendar' || step === 'auth' || step === 'credits' || step === 'essentials') {
      // Push multiple states to create a buffer for swipe gestures
      window.history.pushState({ page: 'app1' }, '');
      window.history.pushState({ page: 'app2' }, '');
      window.history.pushState({ page: 'current' }, '');
    }
  }, [step]);

  useEffect(() => {
    const handlePopState = (event) => {
      if (step === 'credits') {
        // Go back to calendar from credits
        event.preventDefault();
        setStep('calendar');
        window.history.pushState({ page: 'calendar' }, '');
      } else if (step === 'essentials') {
        // Go back to calendar from essentials
        event.preventDefault();
        setStep('calendar');
        window.history.pushState({ page: 'calendar' }, '');
      } else if (step === 'calendar' || step === 'auth') {
        // Prevent default back navigation
        event.preventDefault();
        // Show exit screen
        setStep('exiting');
        // Push state to prevent actual navigation
        window.history.pushState({ page: 'exit' }, '');
      }
    };

    const handleBeforeUnload = (event) => {
      if (step === 'calendar') {
        // This helps on some browsers
        event.preventDefault();
        event.returnValue = '';
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [step]);

  const handleAuthSuccess = () => {
    setStep('calendar');
  };

  // Prevent right-click on images
  useEffect(() => {
    const preventContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    const preventDrag = (e) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('dragstart', preventDrag);

    return () => {
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('dragstart', preventDrag);
    };
  }, []);


  if (step === 'loading') {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden bg-[#0c0600]">
        {/* Advanced Background - Dark Spiritual with Moving Energy Spots */}
        <div className="absolute inset-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#FF9933]/15 blur-[120px] animate-pulse-slow"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#FFD700]/10 blur-[120px] animate-pulse-delayed"></div>
          <div className="absolute top-[30%] right-[10%] w-[20%] h-[30%] bg-[#FF9933]/5 blur-[80px] animate-float"></div>
        </div>

        {/* Traditional Grain Overlay for texture */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>

        <div className="relative flex flex-col items-center justify-center p-8">
          {/* Animated SVG Kolam Background (Rotating) - Visibility Increased */}
          <div className="absolute w-[320px] h-[320px] sm:w-[550px] sm:h-[550px] opacity-40 animate-spin-extremely-slow">
            <svg viewBox="0 0 200 200" className="w-full h-full stroke-[#FFD700] fill-none stroke-[0.8]">
              <path d="M100,10 Q120,50 190,100 Q120,150 100,190 Q80,150 10,100 Q80,50 100,10" />
              <circle cx="100" cy="100" r="20" />
              <path d="M100,30 Q140,100 100,170 Q60,100 100,30" transform="rotate(45 100 100)" />
              <path d="M100,30 Q140,100 100,170 Q60,100 100,30" transform="rotate(90 100 100)" />
              <path d="M100,30 Q140,100 100,170 Q60,100 100,30" transform="rotate(135 100 100)" />
              <rect x="80" y="80" width="40" height="40" rx="2" transform="rotate(22.5 100 100)" />
            </svg>
          </div>

          {/* Glassmorphic Logo Container */}
          <div className="relative flex items-center justify-center w-44 h-44 sm:w-60 sm:h-60">
            {/* Outer Progress Ring Animation */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 overflow-visible">
              <circle
                cx="50%"
                cy="50%"
                r="42%"
                fill="none"
                stroke="url(#goldGradient)"
                strokeWidth="3"
                strokeDasharray="400"
                style={{ transformOrigin: 'center' }}
                className="animate-ring-draw"
              />
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF9933" />
                  <stop offset="100%" stopColor="#FFD700" />
                </linearGradient>
              </defs>
            </svg>

            {/* Logo Wrapper with Shimmer Glass Effect */}
            <div className="relative z-10 w-48 h-48 sm:w-64 sm:h-64 bg-white/5 backdrop-blur-2xl rounded-full border border-white/10 flex items-center justify-center overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <img
                src={sdkLogo}
                alt="SDK Logo"
                className="w-64 h-64 sm:w-64 sm:h-64 object-contain relative z-10 drop-shadow-[0_0_20px_rgba(255,153,51,0.3)]"
              />
              {/* Shimmer Light Beam Effect */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg] animate-shimmer"></div>
            </div>
          </div>

          {/* Elegant Loading Label */}
          <div className="mt-16 group flex flex-col items-center pointer-events-none">
            <div className="h-[1.5px] w-32 bg-gradient-to-r from-transparent via-[#FFD700]/40 to-transparent"></div>
          </div>
        </div>

        <style>{`
          @keyframes spin-extremely-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
           @keyframes pulse-slow {
            0%, 100% { opacity: 0.1; transform: scale(1); }
            50% { opacity: 0.25; transform: scale(1.15); }
          }
          @keyframes pulse-delayed {
            0%, 100% { opacity: 0.25; transform: scale(1.15); }
            50% { opacity: 0.1; transform: scale(1); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-30px) scale(1.1); }
          }
          @keyframes ring-draw {
            0% { stroke-dashoffset: 400; opacity: 0; transform: rotate(0deg); }
            15% { opacity: 1; }
            85% { opacity: 1; }
            100% { stroke-dashoffset: 0; opacity: 0; transform: rotate(360deg); }
          }
          @keyframes shimmer {
            0% { transform: translateX(-200%) skewX(-25deg); }
            100% { transform: translateX(200%) skewX(-25deg); }
          }
          .animate-spin-extremely-slow {
            animation: spin-extremely-slow 60s linear infinite;
          }
          .animate-pulse-slow {
            animation: pulse-slow 10s ease-in-out infinite;
          }
          .animate-pulse-delayed {
            animation: pulse-delayed 12s ease-in-out infinite;
          }
          .animate-float {
            animation: float 8s ease-in-out infinite;
          }
          .animate-ring-draw {
            animation: ring-draw 1.1s linear infinite;
          }
          .animate-shimmer {
            animation: shimmer 4s infinite ease-in-out;
          }
        `}</style>
      </div>
    );
  }

  if (step === 'intro') {
    return (
      <div className={`fixed inset-0 z-50 bg-[#0c0600] transition-all duration-1000 ease-in-out ${isIntroClosing ? 'scale-110 opacity-0 blur-sm' : 'scale-100 opacity-100'}`}>
        {/* Mobile image */}
        <img
          src={introImgmobile}
          alt="Intro"
          className="w-full h-full object-fill animate-in fade-in zoom-in-110 duration-1000 md:hidden"
        />
        {/* Laptop/Desktop image */}
        <img
          src={introImglaptop}
          alt="Intro"
          className="w-full h-full object-cover animate-in fade-in zoom-in-110 duration-1000 hidden md:block"
        />
        {/* Cinematic Transition Overlay */}
        <div className={`absolute inset-0 bg-white/10 pointer-events-none transition-opacity duration-700 ${isIntroClosing ? 'opacity-100' : 'opacity-0'}`}></div>
      </div>
    );
  }

  if (step === 'exiting') {
    return (
      <div className="fixed inset-0 z-50 bg-[#0c0600]">
        {/* Mobile image */}
        <img
          src={introImgmobile}
          alt="Goodbye"
          className="w-full h-full object-fill animate-in fade-in zoom-in-105 duration-500 md:hidden"
        />
        {/* Laptop/Desktop image */}
        <img
          src={introImglaptop}
          alt="Goodbye"
          className="w-full h-full object-cover animate-in fade-in zoom-in-105 duration-500 hidden md:block"
        />
      </div>
    );
  }

  if (step === 'auth') {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  if (step === 'credits') {
    return (
      <div
        className="fixed inset-0 z-50 bg-[#0c0600] flex items-center justify-center cursor-pointer"
        onClick={() => setStep('calendar')}
      >
        <img
          src={credits}
          alt="Credits"
          className="max-w-full max-h-full object-contain animate-in fade-in zoom-in-95 duration-500 md:hidden"
        />
        <img
          src={laptopcredits}
          alt="Credits"
          className="max-w-full max-h-full object-contain animate-in fade-in zoom-in-95 duration-500 hidden md:block"
        />
      </div>
    );
  }

  if (step === 'essentials') {
    return <Essentials onBack={() => setStep('calendar')} />;
  }

  return (
    <div className="min-h-screen w-full bg-[#0c0600] animate-in fade-in zoom-in-75 duration-1000 ease-out">
      <MonthCalendar
        onShowCredits={() => setStep('credits')}
        onShowEssentials={() => setStep('essentials')}
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
      />
    </div>
  );
}

export default App;
