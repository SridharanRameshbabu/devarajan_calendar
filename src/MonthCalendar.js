import React, { useState, useMemo } from "react";
import { getTamilDate, getTamilMonthsInGregorianMonth, getPanchangamData, DAY_TYPES } from "./panchangamData";
import { getRahukalamData } from "./rahukalam";


// Import month images from ImageKit CDN
const januaryImg = "https://cdn.jsdelivr.net/gh/sridevarajankuzhumamems/SDK-CALENDAR-IMAGES/downloads/IMG-20250611-WA0085.jpg";
const februaryImg = "https://cdn.jsdelivr.net/gh/sridevarajankuzhumamems/SDK-CALENDAR-IMAGES/downloads/IMG-20250531-WA0189(1).jpg";
const marchImg = 'https://cdn.jsdelivr.net/gh/sridevarajankuzhumamems/SDK-CALENDAR-IMAGES/downloads/May_21_Singam_Vaganam.jpg';
const aprilImg = 'https://cdn.jsdelivr.net/gh/sridevarajankuzhumamems/SDK-CALENDAR-IMAGES/downloads/IMG_20260110_124508.jpg';
const mayImg = 'https://cdn.jsdelivr.net/gh/sridevarajankuzhumamems/SDK-CALENDAR-IMAGES/downloads/May_23_Garuda_Vaganam.jpg';
const juneImg = 'https://cdn.jsdelivr.net/gh/sridevarajankuzhumamems/SDK-CALENDAR-IMAGES/downloads/May_24_Anumantha_Vaganam.jpg';
const julyImg = 'https://cdn.jsdelivr.net/gh/sridevarajankuzhumamems/SDK-CALENDAR-IMAGES/downloads/May_25_Yanai_Vaganam.jpg';
const augustImg = 'https://cdn.jsdelivr.net/gh/sridevarajankuzhumamems/SDK-CALENDAR-IMAGES/downloads/IMG_20260110_124325.jpg';
const septemberImg = 'https://cdn.jsdelivr.net/gh/sridevarajankuzhumamems/SDK-CALENDAR-IMAGES/downloads/May-27?updatedAt=1767456631432';
const octoberImg = 'https://cdn.jsdelivr.net/gh/sridevarajankuzhumamems/SDK-CALENDAR-IMAGES/downloads/May_28_Kudurai_Mrg.jpg';
const novemberImg = 'https://cdn.jsdelivr.net/gh/sridevarajankuzhumamems/SDK-CALENDAR-IMAGES/downloads/May_29_Therthavaari.jpg';
const decemberImg = 'https://cdn.jsdelivr.net/gh/sridevarajankuzhumamems/SDK-CALENDAR-IMAGES/downloads/Dec_Month.jpg';
const logo = 'https://cdn.jsdelivr.net/gh/sridevarajankuzhumamems/SDK-CALENDAR-IMAGES/downloads/SDK_Logo_Final.png';

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// Month images mapping (add more images as needed)
const MONTH_IMAGES = {
    0: januaryImg,  // January
    1: februaryImg, // February
    2: marchImg,     // March
    3: aprilImg,
    4: mayImg,
    5: juneImg,
    6: julyImg,
    7: augustImg,
    8: septemberImg,
    9: octoberImg,
    10: novemberImg,
    11: decemberImg
};

const MonthCalendar = ({ onShowCredits, onShowEssentials, currentMonth, setCurrentMonth }) => {
    // Get today's date
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();

    const [currentYear] = useState(2026);
    const [selectedDate, setSelectedDate] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // For image carousel
    // State to store the center coordinates of the clicked date cell
    const [animOrigin, setAnimOrigin] = useState({ x: 0, y: 0 });
    const [direction, setDirection] = useState('forward');

    const monthName = MONTH_NAMES[currentMonth];

    // Get number of days in current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // First day of month (0 = Sun, 1 = Mon...)
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();

    // Create empty cells for alignment
    const emptyCells = Array(firstDay).fill(null);

    // Generate list of days with Tamil dates and Panchangam data
    const daysWithData = useMemo(() => {
        return Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const tamilDate = getTamilDate(currentYear, currentMonth, day);
            const panchangam = getPanchangamData(currentYear, currentMonth, day);
            const rahukalam = getRahukalamData(currentYear, currentMonth, day);
            const dayOfWeek = new Date(currentYear, currentMonth, day).getDay();
            return { day, tamilDate, panchangam, rahukalam, isSunday: dayOfWeek === 0 };
        });
    }, [daysInMonth, currentYear, currentMonth]);

    // Get Tamil months that span this Gregorian month
    const tamilMonths = useMemo(() => {
        return getTamilMonthsInGregorianMonth(currentYear, currentMonth);
    }, [currentYear, currentMonth]);

    // Navigation handlers - restricted to 2026 only
    // Navigation handlers - restricted to 2026 only
    const goToPreviousMonth = () => {
        if (currentMonth > 0) {
            setDirection('backward');
            setCurrentMonth(currentMonth - 1);
        }
        setSelectedDate(null);
    };

    const goToNextMonth = () => {
        if (currentMonth < 11) {
            setDirection('forward');
            setCurrentMonth(currentMonth + 1);
        }
        setSelectedDate(null);
    };

    const handleDateSelect = (e, dayData) => {
        // Calculate the center of the clicked element for animation origin
        if (e && e.currentTarget) {
            const rect = e.currentTarget.getBoundingClientRect();
            setAnimOrigin({
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            });
        } else {
            // Fallback to center screen if event is missing (unlikely)
            setAnimOrigin({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
        }
        setSelectedDate(dayData);
    };

    // Auto-slide for images when modal is open and has multiple images
    React.useEffect(() => {
        const panchangam = selectedDate?.panchangam;
        if (panchangam?.imageArray || panchangam?.secondaryImage) {
            const imageCount = panchangam.imageArray ? panchangam.imageArray.length : 2;
            const timer = setInterval(() => {
                setCurrentImageIndex(prev => (prev + 1) % imageCount);
            }, 2000);
            return () => clearInterval(timer);
        } else {
            setCurrentImageIndex(0);
        }
    }, [selectedDate]);

    // Get background color based on day type
    const getDayBackground = (dayType, isSelected) => {
        if (isSelected) return 'bg-blue-200 ring-2 ring-blue-500';
        switch (dayType) {
            case DAY_TYPES.MAJOR_FESTIVAL:
                return 'bg-red-100 hover:bg-red-200';
            case DAY_TYPES.AUSPICIOUS:
                return 'bg-yellow-100 hover:bg-yellow-200';
            default:
                return 'hover:bg-green-50';
        }
    };

    // Month-based background colors
    const monthColors = {
        0: 'bg-blue-200',      // January - Cool winter blue
        1: 'bg-pink-200',      // February - Valentine pink
        2: 'bg-green-200',     // March - Spring green
        3: 'bg-yellow-200',    // April - Bright yellow
        4: 'bg-orange-200',    // May - Warm orange
        5: 'bg-red-200',       // June - Summer red
        6: 'bg-purple-200',    // July - Monsoon purple
        7: 'bg-teal-200',      // August - Independence teal
        8: 'bg-amber-200',     // September - Autumn amber
        9: 'bg-rose-200',      // October - Festival rose
        10: 'bg-indigo-200',   // November - Deep indigo
        11: 'bg-emerald-200'   // December - Holiday emerald
    };

    const currentMonthColor = monthColors[currentMonth] || 'bg-green-200';

    return (
        <div className={`min-h-screen  bg-gradient-to-b flex items-center justify-center`}>
            {/* Inject dynamic keyframes for this specific open action */}
            {selectedDate && (
                <style>{`
                    @keyframes genieOpen {
                        0% {
                            opacity: 0;
                            transform: translate(calc(var(--origin-x) - 50vw), calc(var(--origin-y) - 50vh)) scale(0.05);
                        }
                        60% {
                             opacity: 1;
                             transform: translate(0, 0) scale(1.05);
                        }
                        100% {
                            opacity: 1;
                            transform: translate(0, 0) scale(1);
                        }
                    }
                `}</style>
            )}

            <div
                className={`w-full ${currentMonthColor} cont max-w-full md:max-w-6xl bg-[#8fbc8f] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden`}
            >

                {/* Header with decorative leaves */}
                <div className="relative pt-3 pb-1">
                    <div style={{ margin: '0 auto', width: 'fit-content', display: "flex", alignItems: "center", gap: "8px" }} className="">
                        <img src={logo} alt="SDK Logo" width="28" />
                        <span className="text-center inline-block text-sm sm:text-base md:text-lg font-semibold"
                            style={{ fontFamily: "'Playfair Display', serif" }}>
                            SRI DEVARAJAN KUZHUMAM - EMS
                        </span>
                        <img src={logo} alt="SDK Logo" width="28" />
                    </div>
                </div>

                {/* Side-by-Side Wrapper for MD+ screens */}
                <div className="flex flex-col md:flex-row p-4 gap-4">

                    {/* Left Column: Month Image (Desktop) / Top Section (Mobile) */}
                    <div className="md:w-5/12 lg:w-4/12 flex items-start justify-center">
                        {MONTH_IMAGES[currentMonth] && (
                            <div
                                key={currentMonth}
                                className={`w-full h-full max-w-[400px] md:max-w-[500px] lg:max-w-none rounded-2xl overflow-hidden shadow-2xl border-8 border-white/20 transform transition hover:scale-[1.02] duration-500 ${direction === 'forward' ? 'anim-next' : 'anim-prev'}`}
                            >
                                <img
                                    src={MONTH_IMAGES[currentMonth]}
                                    alt={`${monthName} decoration`}
                                    className="w-full object-cover h-[400px] md:h-[700px]"
                                    style={{
                                        objectPosition: 'top',
                                        borderRadius: '12px'
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Right Column: Navigation and Calendar Grid */}
                    <div className="md:w-7/12 lg:w-8/12 flex flex-col">

                        {/* Navigation Arrows - Smaller */}
                        <div className="flex justify-between items-center mb-4 bg-white/20 p-2 rounded-xl shadow-inner border border-white/10">
                            <button
                                onClick={goToPreviousMonth}
                                disabled={currentMonth === 0}
                                className={`w-8 h-8 flex items-center justify-center rounded-full shadow transition-all duration-200 text-lg font-bold ${currentMonth === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-white/90 hover:bg-white text-black hover:scale-110 active:scale-95'}`}
                            >
                                ◀
                            </button>
                            <div className="flex flex-col items-center">
                                <span className="text-black font-bold text-sm sm:text-base tracking-widest uppercase">{monthName.toUpperCase()} - {currentYear}</span>
                                <div className="flex gap-1">
                                    {tamilMonths.map((tm, idx) => (
                                        <span key={idx} className="text-[10px] text-black/80 font-medium">
                                            {tm.name} {idx < tamilMonths.length - 1 ? '•' : ''}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={goToNextMonth}
                                disabled={currentMonth === 11}
                                className={`w-8 h-8 flex items-center justify-center rounded-full shadow transition-all duration-200 text-lg font-bold ${currentMonth === 11 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-white/90 hover:bg-white text-black hover:scale-110 active:scale-95'}`}
                            >
                                ▶
                            </button>
                        </div>


                        {/* Calendar Grid Container */}
                        <div
                            key={currentMonth}
                            className={`bg-white rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 transition-all duration-300 ${direction === 'forward' ? 'anim-next' : 'anim-prev'}`}
                        >
                            {/* Weekday Headers */}
                            <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-100">
                                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, idx) => (
                                    <div key={day} className={`py-2 sm:py-4 text-center text-[10px] sm:text-sm font-black uppercase tracking-tighter ${idx === 0 ? 'text-red-500 bg-red-50/30' : 'text-gray-500'}`}>
                                        {day}
                                    </div>
                                ))}
                            </div>


                            {/* Days Grid */}
                            <div className="grid grid-cols-7">
                                {/* Empty cells */}
                                {emptyCells.map((_, i) => (
                                    <div key={`empty-${i}`} className="h-14 sm:h-24 md:h-28 border border-gray-50 bg-gray-50/20"></div>
                                ))}


                                {/* Day cells */}
                                {daysWithData.map((dayData, i) => {
                                    const { day, tamilDate, panchangam, isSunday } = dayData;
                                    const isSelected = selectedDate?.day === day;
                                    const isToday = todayYear === 2026 && todayMonth === currentMonth && todayDay === day;

                                    return (
                                        <button
                                            key={i}
                                            onClick={(e) => handleDateSelect(e, dayData)}
                                            className={`h-14 sm:h-24 md:h-28 border border-gray-50 relative transition-all duration-150 p-0.5 sm:p-1.5
                                                ${getDayBackground(panchangam.dayType, isSelected)}
                                                ${isToday ? 'bg-green-100 border-t-0 border-l-0' : ''}`}
                                        >

                                            {/* Gregorian Date */}
                                            <span className={`text-sm sm:text-lg font-bold block ${isToday ? 'text-green-600' : (isSunday || panchangam.isGovtHoliday) ? 'text-red-600' : 'text-[#0C0EA6]'}`}>
                                                {day}
                                            </span>


                                            {/* Thithi - small text */}
                                            <span className="text-[4px] sm:text-[6px] text-purple-600 block truncate">
                                                {panchangam.tithi}
                                            </span>


                                            {/* Nakshatra - small text */}
                                            {/* <span className="text-[6px] sm:text-[9px] text-blue-600 block truncate">
                                        {panchangam.nakshatra}
                                    </span> */}

                                            {/* Tamil Date - positioned at bottom right */}
                                            <span className={`absolute bottom-0 right-0.5 text-[10px] sm:text-[14px] font-medium ${(isSunday || panchangam.isGovtHoliday) ? 'text-red-500' : 'text-gray-500'}`}>
                                                {tamilDate.day}
                                            </span>


                                            {/* Tamil Month name for 1st day of Tamil month */}
                                            {tamilDate.day === 1 && (
                                                <span className="absolute bottom-0 left-0 text-[5px] sm:text-[5px] text-orange-600 font-bold leading-tight">
                                                    {tamilDate.month}
                                                </span>
                                            )}


                                            {/* Moon phase indicators */}
                                            {(panchangam.tithi === "அமாவாசை" || (panchangam.events && panchangam.events.includes("அமாவாசை"))) && (
                                                <span className="absolute bottom-1 left-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-black border border-gray-400" title="அமாவாசை"></span>
                                            )}
                                            {(panchangam.tithi === "பௌர்ணமி" || (panchangam.events && panchangam.events.includes("பௌர்ணமி"))) && (
                                                <span className="absolute bottom-1 left-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white border border-gray-400" title="பௌர்ணமி"></span>
                                            )}


                                            {/* Left image in cell (for dual image display) */}
                                            {panchangam.leftImage && (
                                                <img
                                                    src={panchangam.leftImage}
                                                    alt="Event Left"
                                                    className="absolute top-0 left-0 w-5 h-5 sm:w-8 sm:h-8 object-cover rounded-br"
                                                />
                                            )}

                                            {/* Right image in cell */}
                                            {(panchangam.gridImage || panchangam.image) && (
                                                <img
                                                    src={panchangam.gridImage || panchangam.image}
                                                    alt="Event"
                                                    className="absolute top-0 right-0 w-5 h-5 sm:w-8 sm:h-8 object-cover rounded-bl"
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div> {/* End Right Column */}
                </div> {/* End Side-by-Side Wrapper */}

                {/* Modal for Selected Date */}
                {selectedDate && (
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300"
                        onClick={() => setSelectedDate(null)}
                    >
                        <div
                            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                '--origin-x': `${animOrigin.x}px`,
                                '--origin-y': `${animOrigin.y}px`,
                                animation: 'genieOpen 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards'
                            }}
                        >
                            {/* Modal Header with Close Button */}
                            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-green-500 to-green-600 rounded-t-2xl">
                                <div>
                                    <p className="text-white/80 text-xs">Gregorian</p>
                                    <p className="text-white text-lg font-bold">
                                        {selectedDate.day} {monthName} {currentYear}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-white/80 text-xs">தமிழ்</p>
                                    <p className="text-orange-200 text-lg font-bold">
                                        {selectedDate.tamilDate.day} {selectedDate.tamilDate.month}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedDate(null)}
                                    className="ml-2 w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full text-white font-bold"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-4">
                                {/* Events - Full Width Top */}
                                {selectedDate.panchangam.events && selectedDate.panchangam.events.length > 0 && (
                                    <div className="bg-red-50 p-3 rounded-lg mb-4">
                                        <p className="text-xs text-red-600 font-medium mb-2">நிகழ்வுகள் (Events)</p>
                                        <div className="flex flex-wrap gap-1">
                                            {selectedDate.panchangam.events.map((event, idx) => (
                                                <span key={idx} className="px-2 py-1 bg-red-100 text-red-700 text-sm font-bold rounded">
                                                    {event}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 3-Column Grid for Details (REVERSED: Horizontal on mobile, Stacked on desktop) */}
                                <div className="grid grid-cols-3 md:grid-cols-1 gap-2 md:gap-6 items-center">

                                    {/* Column/Row: Thithi & Nakshatra */}
                                    <div className="flex flex-col gap-1.5 md:gap-3 order-1 md:order-2">
                                        <div className="bg-purple-50 p-2 md:p-4 rounded-xl border border-purple-100 shadow-sm flex flex-col items-center md:items-start text-center md:text-left">
                                            <p className="text-[8px] md:text-[10px] uppercase tracking-wider text-purple-600 font-bold mb-0.5 md:mb-1">திதி (Thithi)</p>
                                            <p className="text-[10px] md:text-base font-bold text-purple-900 leading-tight">{selectedDate.panchangam.tithi}</p>
                                        </div>
                                        <div className="bg-blue-50 p-2 md:p-4 rounded-xl border border-blue-100 shadow-sm flex flex-col items-center md:items-start text-center md:text-left">
                                            <p className="text-[8px] md:text-[10px] uppercase tracking-wider text-blue-600 font-bold mb-0.5 md:mb-1">நட்சத்திரம் (Nakshatra)</p>
                                            <p className="text-[10px] md:text-base font-bold text-blue-900 leading-tight">{selectedDate.panchangam.nakshatra}</p>
                                        </div>
                                    </div>

                                    {/* Column/Row: Event Image(s) - Auto-slide carousel */}
                                    <div className="order-2 md:order-1 flex flex-col items-center gap-2">
                                        {selectedDate.panchangam.image ? (
                                            <>
                                                <div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-lg border-2 md:border-4 border-white ring-1 ring-gray-100">
                                                    <img
                                                        src={
                                                            selectedDate.panchangam.imageArray
                                                                ? selectedDate.panchangam.imageArray[currentImageIndex] || selectedDate.panchangam.image
                                                                : (currentImageIndex === 0 ? selectedDate.panchangam.image : (selectedDate.panchangam.secondaryImage || selectedDate.panchangam.image))
                                                        }
                                                        alt="Event"
                                                        className="w-[120px] h-[180px] md:w-[200px] md:h-[300px] object-contain transition-opacity duration-500"
                                                    />
                                                </div>
                                                {/* Slide indicator dots */}
                                                {(selectedDate.panchangam.imageArray || selectedDate.panchangam.secondaryImage) && (
                                                    <div className="flex gap-1.5">
                                                        {(selectedDate.panchangam.imageArray || [selectedDate.panchangam.image, selectedDate.panchangam.secondaryImage]).map((_, idx) => (
                                                            <span
                                                                key={idx}
                                                                className={`w-2 h-2 rounded-full transition-all ${currentImageIndex === idx ? 'bg-green-600 scale-110' : 'bg-gray-300'}`}
                                                            ></span>
                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-lg border-2 md:border-4 border-white ring-1 ring-gray-100">
                                                <img
                                                    src={logo}
                                                    alt="SDK Logo"
                                                    className="w-[120px] h-[180px] md:w-[200px] md:h-[300px] object-contain bg-white"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Column/Row: Timings */}
                                    <div className="bg-gray-50 p-2 md:p-5 rounded-xl md:rounded-2xl border border-gray-100 shadow-sm order-3">
                                        <p className="text-[8px] md:text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1.5 md:mb-4 border-b pb-0.5 md:pb-2 flex items-center justify-center md:justify-start gap-1">
                                            ⏰ நேரங்கள்
                                        </p>
                                        <div className="space-y-1.5 md:space-y-4">
                                            <div className="flex flex-col md:flex-row md:justify-between items-center py-0.5 md:py-1.5 border-b border-red-50">
                                                <span className="text-[9px] md:text-[12px] font-semibold text-red-700">ராகு</span>
                                                <span className="text-[9px] md:text-sm font-bold text-red-600 px-1 md:px-3 py-0.5 rounded-full">{selectedDate.rahukalam.rahukalam}</span>
                                            </div>
                                            <div className="flex flex-col md:flex-row md:justify-between items-center py-0.5 md:py-1.5 border-b border-orange-50">
                                                <span className="text-[9px] md:text-[12px] font-semibold text-orange-700">யம</span>
                                                <span className="text-[9px] md:text-sm font-bold text-orange-600 px-1 md:px-3 py-0.5 rounded-full">{selectedDate.rahukalam.yamagandam}</span>
                                            </div>
                                            <div className="flex flex-col md:flex-row md:justify-between items-center py-0.5 md:py-1.5">
                                                <span className="text-[9px] md:text-[12px] font-semibold text-yellow-700">குளிகை</span>
                                                <span className="text-[9px] md:text-sm font-bold text-yellow-600 px-1 md:px-3 py-0.5 rounded-full">{selectedDate.rahukalam.kuligai}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="text-center py-4">
                    <button
                        onClick={onShowCredits}
                        className="px-6 py-2 bg-gradient-to-r from-amber-600/80 via-yellow-500/80 to-amber-600/80 text-white text-sm font-semibold rounded-full border-2 border-yellow-400/50 shadow-lg shadow-amber-500/30 hover:shadow-amber-400/50 hover:scale-105 hover:border-yellow-300 transition-all duration-300 backdrop-blur-sm"
                    >
                        ✨ Collaborators & Credits ✨
                    </button>
                    <p className="mt-3 text-black/70 text-xs">
                        © 2026 Sri Devarajan Kuzhumam. All Rights Reserved.
                    </p>

                    <div className="mt-2 text-center">
                        <button
                            onClick={onShowEssentials}
                            className="text-[13px] text-blue-800 hover:text-blue-900 underline font-medium cursor-pointer transition-colors"
                        >
                            Essentials | அடிப்படை தகவல்கள்
                        </button>
                    </div>

                    <p className="mt-2 text-black/90 text-[12px] px-4">
                        குறிப்பு: இக்காலண்டர் சில சந்தர்ப்பங்களில் தவறாக காட்டலாம். துல்லியமான அப்டேட்டுகளுக்கு{' '}
                        <a
                            href="https://sdkcalendar.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white underline hover:text-white-300"
                        >
                            இங்கே பார்க்கவும்
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MonthCalendar;
