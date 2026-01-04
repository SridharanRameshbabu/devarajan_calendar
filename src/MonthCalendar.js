import React, { useState, useMemo } from "react";
import { getTamilDate, getTamilMonthsInGregorianMonth, getPanchangamData, DAY_TYPES } from "./panchangamData";
import { getRahukalamData } from "./rahukalam";


// Import month images from ImageKit CDN
const januaryImg = "https://ik.imagekit.io/hskzc0fkv/assests/IMG-20250611-WA0085.jpg";
const februaryImg = "https://ik.imagekit.io/hskzc0fkv/assests/IMG-20250531-WA0189(1).jpg";
const marchImg = 'https://ik.imagekit.io/hskzc0fkv/assests/May_21_Singam_Vaganam.jpg';
const aprilImg = 'https://ik.imagekit.io/hskzc0fkv/assests/May_22_Sesa_Vaganam.jpg';
const mayImg = 'https://ik.imagekit.io/hskzc0fkv/assests/May_23_Garuda_Vaganam.jpg';
const juneImg = 'https://ik.imagekit.io/hskzc0fkv/assests/May_24_Anumantha_Vaganam.jpg';
const julyImg = 'https://ik.imagekit.io/hskzc0fkv/assests/May_25_Yanai_Vaganam.jpg';
const augustImg = 'https://ik.imagekit.io/hskzc0fkv/assests/May_26_Thirukallayanam(2).jpg';
const septemberImg = 'https://ik.imagekit.io/hskzc0fkv/assests/May-27?updatedAt=1767456631432';
const octoberImg = 'https://ik.imagekit.io/hskzc0fkv/assests/May_28_Kudurai_Mrg.jpg';
const novemberImg = 'https://ik.imagekit.io/hskzc0fkv/assests/May_29_Therthavaari.jpg';
const decemberImg = 'https://ik.imagekit.io/hskzc0fkv/assests/Dec_Month.jpg';
const logo = 'https://ik.imagekit.io/hskzc0fkv/assests/sdk_logo.png';

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

const MonthCalendar = () => {
    const [currentYear, setCurrentYear] = useState(2026);
    const [currentMonth, setCurrentMonth] = useState(0); // Start with January
    const [selectedDate, setSelectedDate] = useState(null);
    // const [touchStart, setTouchStart] = useState(null);

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
    const goToPreviousMonth = () => {
        if (currentMonth > 0) {
            setCurrentMonth(currentMonth - 1);
        }
        setSelectedDate(null);
    };

    const goToNextMonth = () => {
        if (currentMonth < 11) {
            setCurrentMonth(currentMonth + 1);
        }
        setSelectedDate(null);
    };

    const handleDateSelect = (dayData) => {
        setSelectedDate(dayData);
    };

    // Swipe navigation removed

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

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-200 to-green-300 flex items-center justify-center p-2 sm:p-4">
            <div
                className="w-full cont max-w-full md:max-w-6xl bg-[#8fbc8f] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden"
            >

                {/* Header with decorative leaves */}
                <div className="relative pt-3 pb-1">
                    <div style={{ margin: '0 auto', width: 'fit-content', display: "flex", alignItems: "center", gap: "8px" }} className="">
                        <img src={logo} alt="SDK Logo" width="28" />
                        <span className="text-center inline-block text-sm sm:text-base md:text-lg font-semibold"
                            style={{ fontFamily: 'cursive' }}>
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
                            <div className="w-full h-full max-w-[300px] md:max-w-[400px] lg:max-w-none rounded-2xl overflow-hidden shadow-2xl border-8 border-white/20 transform transition hover:scale-[1.02] duration-500">
                                <img
                                    src={MONTH_IMAGES[currentMonth]}
                                    alt={`${monthName} decoration`}
                                    className="w-full object-cover h-[300px] md:h-[700px]"
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
                                className={`w-8 h-8 flex items-center justify-center rounded-full shadow transition-all duration-200 text-lg font-bold ${currentMonth === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-white/90 hover:bg-white text-green-700 hover:scale-110 active:scale-95'}`}
                            >
                                ◀
                            </button>
                            <div className="flex flex-col items-center">
                                <span className="text-white font-bold text-sm sm:text-base tracking-widest uppercase">{monthName.toUpperCase()} - {currentYear}</span>
                                <div className="flex gap-1">
                                    {tamilMonths.map((tm, idx) => (
                                        <span key={idx} className="text-[10px] text-white/90 font-medium">
                                            {tm.name} {idx < tamilMonths.length - 1 ? '•' : ''}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={goToNextMonth}
                                disabled={currentMonth === 11}
                                className={`w-8 h-8 flex items-center justify-center rounded-full shadow transition-all duration-200 text-lg font-bold ${currentMonth === 11 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-white/90 hover:bg-white text-green-700 hover:scale-110 active:scale-95'}`}
                            >
                                ▶
                            </button>
                        </div>


                        {/* Calendar Grid Container */}
                        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 transition-all duration-300">
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

                                    return (
                                        <button
                                            key={i}
                                            onClick={() => handleDateSelect(dayData)}
                                            className={`h-14 sm:h-24 md:h-28 border border-gray-50 relative transition-all duration-150 p-0.5 sm:p-1.5
                                                ${getDayBackground(panchangam.dayType, isSelected)}`}
                                        >

                                            {/* Gregorian Date */}
                                            <span className={`text-sm sm:text-lg font-bold block ${(isSunday || panchangam.isGovtHoliday) ? 'text-red-600' : 'text-gray-800'}`}>
                                                {day}
                                            </span>


                                            {/* Thithi - small text */}
                                            <span className="text-[5px] sm:text-[9px] text-purple-600 block truncate">
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
                                                <span className="absolute bottom-0 left-0 text-[5px] sm:text-[7px] text-orange-600 font-bold leading-tight">
                                                    {tamilDate.month}
                                                </span>
                                            )}


                                            {/* Event indicator removed */}

                                            {/* Small event image in cell */}
                                            {panchangam.image && (
                                                <img
                                                    src={panchangam.image}
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
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setSelectedDate(null)}
                    >
                        <div
                            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
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

                                    {/* Column/Row: Event Image */}
                                    <div className="order-2 md:order-1 flex justify-center">
                                        {selectedDate.panchangam.image ? (
                                            <div className="rounded-xl md:rounded-2xl overflow-hidden shadow-lg border-2 md:border-4 border-white ring-1 ring-gray-100 transform transition hover:scale-105 duration-300">
                                                <img
                                                    src={selectedDate.panchangam.image}
                                                    alt="Event"
                                                    className="w-[120px] h-[180px] md:w-[200px] md:h-[300px] object-contain"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-full h-full min-h-[80px] md:min-h-[150px] flex items-center justify-center bg-gray-50 rounded-xl border-1 md:border-2 border-dashed border-gray-200">
                                                <span className="text-[8px] md:text-xs text-gray-400 italic text-center px-1">படம் இல்லை <br /> (No Image)</span>
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
                <div className="text-center pb-4 text-white/80 text-sm">
                    ← Previous  |  Next →
                </div>
            </div>
        </div>
    );
};

export default MonthCalendar;
