import React, { useState, useEffect } from 'react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['September', 'October', 'November', 'December', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August'];

const isBefore = (date1, date2) => date1 < date2;
const isWithinInterval = (date, start, end) => date >= start && date <= end;

const differenceInDays = (date1, date2) => {
  const diffTime = Math.abs(date2 - date1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const KarimKalender = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [yearProgress, setYearProgress] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [daysUntilMeetup, setDaysUntilMeetup] = useState(0);

  const karimVisitStart = new Date(currentDate.getFullYear(), 9, 11); // October 11th
  const karimVisitEnd = new Date(currentDate.getFullYear(), 9, 24); // October 24th

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000 * 60 * 60); // Update every hour

    setIsLoaded(true);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const start = new Date(currentDate.getFullYear(), 8, 1); // September 1st
    const end = new Date(currentDate.getFullYear() + 1, 7, 31); // August 31st next year
    const totalDays = differenceInDays(end, start) + 1;
    const daysPassed = differenceInDays(currentDate, start) + 1;
    setYearProgress((daysPassed / totalDays) * 100);

    setDaysUntilMeetup(Math.max(0, differenceInDays(karimVisitStart, currentDate)));
  }, [currentDate, karimVisitStart]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const renderMonth = (monthIndex) => {
    const year = monthIndex < 4 ? currentDate.getFullYear() : currentDate.getFullYear() + 1;
    const month = (monthIndex + 8) % 12;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    const days = [];
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isPast = isBefore(date, currentDate);
      const isToday = date.toDateString() === currentDate.toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      const isKarimVisit = isWithinInterval(date, karimVisitStart, karimVisitEnd);

      days.push(
        <div
          key={date.toISOString()}
          onClick={() => handleDateSelect(date)}
          className={`
            h-10 flex items-center justify-center text-sm rounded-lg transition-all duration-300 cursor-pointer
            transform hover:scale-110 hover:shadow-neon relative
            ${isPast ? 'bg-gray-800 text-gray-400' : 'bg-gray-700 text-white hover:bg-gray-600'} 
            ${isToday ? 'ring-2 ring-purple-500 animate-pulse' : ''}
            ${isSelected ? 'bg-purple-600 text-white hover:bg-purple-500' : ''}
            ${isKarimVisit ? 'bg-pink-500 text-white hover:bg-pink-400' : ''}
          `}
        >
          {day}
          {isKarimVisit && <span className="absolute top-0 right-0 text-xs">❤️</span>}
        </div>
      );
    }

    return (
      <div className={`mb-6 bg-gray-900 rounded-lg shadow-neon p-4 transition-all duration-500 transform hover:shadow-neon-intense ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{transitionDelay: `${monthIndex * 100}ms`}}>
        <h3 className="text-center font-bold mb-2 text-lg text-purple-400">{MONTHS[monthIndex]}</h3>
        <div className="grid grid-cols-7 gap-1">
          {DAYS.map(day => (
            <div key={day} className="text-center text-xs font-semibold text-gray-400 mb-1">{day}</div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-full mx-auto p-8 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 min-h-screen text-white">
      <h1 className="text-6xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient">
        Karim Kalender ❤️
      </h1>
      <div className="flex flex-col lg:flex-row lg:space-x-8">
        <div className="lg:w-3/4">
          <div className="grid gap-6">
            {MONTHS.map((_, index) => renderMonth(index))}
          </div>
        </div>
        <div className="lg:w-1/4 mt-6 lg:mt-0">
          <div className="sticky top-8">
            <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-lg shadow-neon p-6 mb-6 transition-all duration-300 transform hover:shadow-neon-intense">
              <h2 className="text-3xl font-bold mb-4 text-center text-purple-300">Countdown to Karim ❤️</h2>
              <div className="flex justify-center items-center h-40">
                <div className="text-6xl font-bold text-pink-400 animate-bounce">
                  {daysUntilMeetup}
                </div>
                <div className="text-2xl ml-4 text-purple-300">
                  {daysUntilMeetup === 1 ? 'day' : 'days'}
                </div>
              </div>
              <p className="text-center text-xl text-gray-300 mt-4">
                Until Karim&apos;s lovely visit! ❤️
              </p>
            </div>
            <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-lg shadow-neon p-6 transition-all duration-300 transform hover:shadow-neon-intense">
              <h3 className="text-lg font-semibold text-purple-300 mb-2">Year of Love Progress</h3>
              <div className="w-full bg-gray-700 rounded-full h-4 mb-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-pink-500 to-purple-500 h-4 rounded-full transition-all duration-1000 ease-out animate-pulse"
                  style={{ width: `${yearProgress}%` }}
                ></div>
              </div>
              <p className="text-center text-gray-300">
                {yearProgress.toFixed(2)}% of the year of love completed ❤️
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KarimKalender;
