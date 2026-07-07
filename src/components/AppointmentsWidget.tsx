import React, { useState } from 'react';
import { Appointment, Patient } from '../types';
import { Calendar, Plus, Clock, User, CheckCircle, XCircle } from 'lucide-react';

interface AppointmentsWidgetProps {
  appointments: Appointment[];
  selectedPatient: Patient;
  onAddAppointment: (appointment: Appointment) => void;
}

export default function AppointmentsWidget({
  appointments,
  selectedPatient,
  onAddAppointment,
}: AppointmentsWidgetProps) {
  const [selectedDay, setSelectedDay] = useState(13); // Default May 13 as highlighted in the image
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Appointment Form state
  const [appTime, setAppTime] = useState('10:00 AM');
  const [appDoctor, setAppDoctor] = useState('Dr. Amit Verma');
  const [appDept, setAppDept] = useState('Cardiology');

  // Dynamic Month & Year state
  const [currentMonth, setCurrentMonth] = useState(4); // 4 = May
  const [currentYear, setCurrentYear] = useState(2024);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Helper to get days in a month
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Helper to get starting day of a month (offset)
  const getStartOffset = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const startOffset = getStartOffset(currentMonth, currentYear);
  const calendarDays: (number | null)[] = [];
  
  for (let i = 0; i < startOffset; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  // Filtered appointments for the selected day
  const getAppointmentsForDay = (day: number) => {
    // Check if any appointment specifically matches this date
    const targetDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dateSpecificApps = appointments.filter(a => a.date === targetDate);
    if (dateSpecificApps.length > 0) {
      return dateSpecificApps;
    }

    // Default mock behavior for May 2024
    if (currentMonth === 4 && currentYear === 2024) {
      if (day === 13) {
        return appointments.filter(a => a.id === "APT001" || a.id === "APT002");
      } else if (day === 14) {
        return appointments.filter(a => a.id === "APT003" || a.id === "APT004");
      }
    }
    
    return [];
  };

  const activeAppointments = getAppointmentsForDay(selectedDay);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
    setSelectedDay(1);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
    setSelectedDay(1);
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `APT${(appointments.length + 1).toString().padStart(3, '0')}`;
    const newApp: Appointment = {
      id: newId,
      time: appTime,
      doctor: appDoctor,
      department: appDept,
      patientName: selectedPatient.name,
      patientUhid: selectedPatient.uhid,
      status: 'Scheduled',
      date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
    };
    onAddAppointment(newApp);
    setShowAddForm(false);
  };

  return (
    <div id="appointments-widget-container" className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex justify-between items-center">
        <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-emerald-600" /> Appointments
        </h3>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-1 hover:bg-slate-200 text-emerald-700 rounded transition flex items-center gap-0.5 text-[11px] font-semibold"
        >
          <Plus className="w-3.5 h-3.5" /> Book
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs">
        {/* Calendar Title & Month Selector */}
        <div>
          <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-2">
            <button 
              type="button"
              onClick={handlePrevMonth}
              className="text-slate-400 hover:text-slate-800 font-mono px-2 py-0.5 hover:bg-slate-100 rounded transition"
            >
              &lt;
            </button>
            <span>{months[currentMonth]} {currentYear}</span>
            <button 
              type="button"
              onClick={handleNextMonth}
              className="text-slate-400 hover:text-slate-800 font-mono px-2 py-0.5 hover:bg-slate-100 rounded transition"
            >
              &gt;
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 mb-1.5 font-sans">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          {/* Mini-Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-[11px]">
            {calendarDays.map((day, idx) => {
              if (day === null) {
                return <span key={idx} className="h-5"></span>;
              }

              const hasApp = getAppointmentsForDay(day).length > 0;
              const isSelected = selectedDay === day;

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDay(day)}
                  className={`h-5 w-5 mx-auto rounded flex items-center justify-center relative font-semibold transition ${
                    isSelected 
                      ? 'bg-sky-600 text-white shadow-xs' 
                      : hasApp 
                        ? 'bg-sky-50 text-sky-800 font-bold hover:bg-sky-100' 
                        : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {day}
                  {hasApp && !isSelected && (
                    <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-emerald-500"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Booking Form overlay/in-place */}
        {showAddForm && (
          <form onSubmit={handleBookAppointment} className="bg-slate-50 p-2.5 border border-slate-200 rounded space-y-2">
            <div className="text-[10px] text-slate-500 font-bold uppercase border-b border-slate-200 pb-0.5">
              Book Appointment for {selectedPatient.name}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">Time</label>
                <input 
                  type="text" 
                  value={appTime} 
                  onChange={e => setAppTime(e.target.value)} 
                  placeholder="10:00 AM"
                  className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none" 
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">Department</label>
                <select 
                  value={appDept} 
                  onChange={e => {
                    setAppDept(e.target.value);
                    if (e.target.value === 'Cardiology') setAppDoctor('Dr. Amit Verma');
                    else if (e.target.value === 'Pulmonology') setAppDoctor('Dr. Rajesh Iyer');
                    else if (e.target.value === 'Endocrinology') setAppDoctor('Dr. Sanya Mehta');
                    else setAppDoctor('Dr. Neha Singh');
                  }} 
                  className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                >
                  <option value="Cardiology">Cardiology</option>
                  <option value="General Physician">General Physician</option>
                  <option value="Endocrinology">Endocrinology</option>
                  <option value="Pulmonology">Pulmonology</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 mb-0.5">Assigned Doctor</label>
              <input 
                type="text" 
                value={appDoctor} 
                onChange={e => setAppDoctor(e.target.value)} 
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none" 
              />
            </div>
            <div className="flex justify-end gap-1.5 pt-1">
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)} 
                className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-[10px] font-semibold"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-2 py-1 bg-emerald-600 text-white rounded text-[10px] font-semibold hover:bg-emerald-700"
              >
                Schedule
              </button>
            </div>
          </form>
        )}

        {/* Appointments List for Selected Day */}
        <div>
          <div className="font-semibold text-slate-700 border-b border-slate-100 pb-1 mb-2 flex justify-between">
            <span>Appointments on May {selectedDay}</span>
            <span className="text-[10px] font-mono text-slate-500 font-normal">{activeAppointments.length} scheduled</span>
          </div>

          {activeAppointments.length === 0 ? (
            <div className="py-4 text-center text-slate-400 italic">No appointments for this day.</div>
          ) : (
            <div className="space-y-2">
              {activeAppointments.map(app => (
                <div 
                  key={app.id} 
                  className="p-2 border border-slate-100 rounded-lg bg-slate-50 hover:bg-slate-100 transition flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-800 flex items-center gap-1 font-mono text-[11px]">
                        <Clock className="w-3 h-3 text-emerald-600" /> {app.time}
                      </span>
                      <span className="text-[10px] text-slate-400">|</span>
                      <span className="text-[10px] font-semibold text-slate-600 bg-sky-50 px-1 rounded border border-sky-100">
                        {app.department}
                      </span>
                    </div>
                    <div className="font-medium text-slate-800 text-[11px] flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" /> {app.doctor}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Patient: <span className="font-medium text-slate-700">{app.patientName}</span> ({app.patientUhid})
                    </div>
                  </div>

                  <div>
                    {app.status === 'Scheduled' ? (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle className="w-2.5 h-2.5" /> Scheduled
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                        <XCircle className="w-2.5 h-2.5" /> Cancelled
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
