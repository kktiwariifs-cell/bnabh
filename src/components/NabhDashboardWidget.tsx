import React, { useState } from 'react';
import { Incident } from '../types';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Award, TrendingUp, BarChart3, PieChartIcon, ShieldAlert, 
  Sparkles, CheckCircle2, ChevronRight, PlayCircle, Eye, AlertOctagon, Brain
} from 'lucide-react';

interface NabhDashboardWidgetProps {
  incidents: Incident[];
  onTriggerAiCapa: (incident: Incident) => void;
  aiGeneratingId: string | null;
}

export default function NabhDashboardWidget({
  incidents,
  onTriggerAiCapa,
  aiGeneratingId,
}: NabhDashboardWidgetProps) {
  const [selectedIncidentForView, setSelectedIncidentForView] = useState<Incident | null>(null);

  // Indicators mapping
  const indicators = [
    { name: "Bed Occupancy Rate", value: "81%", target: "> 80%", status: "compliant", desc: "Target met. General Ward heavily loaded." },
    { name: "Average Length of Stay", value: "4.2 Days", target: "< 5.0 Days", status: "compliant", desc: "Optimal discharge workflow." },
    { name: "Readmission Rate", value: "8.5%", target: "< 5.0%", status: "warning", desc: "Review cardiac department discharges." },
    { name: "Infection Rate (HAI)", value: "1.2%", target: "< 1.5%", status: "compliant", desc: "Under control. Surveillance active." },
    { name: "Patient Satisfaction", value: "92%", target: "> 90%", status: "compliant", desc: "Excellent feedback on care quality." },
    { name: "Medication Error Rate", value: "0.6%", target: "< 1.0%", status: "compliant", desc: "EHR barcode matching preventing errors." },
  ];

  // Bed Occupancy Trend Data (May 07 to May 13)
  const lineChartData = [
    { date: '07 May', occupancy: 74 },
    { date: '08 May', occupancy: 76 },
    { date: '09 May', occupancy: 82 },
    { date: '10 May', occupancy: 81 },
    { date: '11 May', occupancy: 85 },
    { date: '12 May', occupancy: 88 },
    { date: '13 May', occupancy: 81 },
  ];

  // HAI Trend Data
  const barChartData = [
    { date: '07 May', rate: 1.5 },
    { date: '08 May', rate: 1.3 },
    { date: '09 May', rate: 1.1 },
    { date: '10 May', rate: 1.2 },
    { date: '11 May', rate: 1.2 },
    { date: '12 May', rate: 1.0 },
    { date: '13 May', rate: 0.8 },
  ];

  // Incidents count by type for Pie Chart
  const incidentCounts = incidents.reduce((acc, inc) => {
    acc[inc.type] = (acc[inc.type] || 0) + 1;
    return acc;
  }, { 'Medication Error': 0, 'Patient Fall': 0, 'Near Miss': 0, 'Others': 0 } as Record<string, number>);

  // Pie chart data
  const pieChartData = [
    { name: 'Medication Error', value: incidentCounts['Medication Error'] || 12 }, // fallback to image defaults if none
    { name: 'Patient Fall', value: incidentCounts['Patient Fall'] || 10 },
    { name: 'Near Miss', value: incidentCounts['Near Miss'] || 8 },
    { name: 'Others', value: incidentCounts['Others'] || 18 },
  ];

  const totalIncidentsCount = pieChartData.reduce((acc, d) => acc + d.value, 0);

  // Pie Chart Colors
  const COLORS = ['#f43f5e', '#f59e0b', '#06b6d4', '#64748b'];

  return (
    <div className="space-y-4">
      {/* Bar Title */}
      <div className="bg-[#85addb] text-slate-950 border border-[#628bbb] px-4 py-2 rounded-lg font-black text-center tracking-wide shadow-sm flex items-center justify-center gap-2 text-sm uppercase">
        <TrendingUp className="w-5 h-5 text-indigo-950" /> NABH Compliance Dashboard
      </div>

      {/* Main Grid: Indicators (Left) + Charts (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Indicators Panel (Left 4 columns) */}
        <div className="lg:col-span-4 bg-white rounded-lg border border-slate-200 p-4 space-y-3.5 flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-1.5">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-700" /> Quality Safety Indicators
            </h4>
          </div>

          <div className="space-y-2.5 flex-1 flex flex-col justify-center">
            {indicators.map((ind, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-2 rounded border border-slate-100 hover:bg-slate-50 transition"
              >
                <div className="min-w-0">
                  <span className="text-[11px] font-bold text-slate-800 block truncate">{ind.name}</span>
                  <span className="text-[10px] text-slate-400 font-medium">Target: {ind.target}</span>
                </div>
                
                <div className="text-right flex-shrink-0 flex items-center gap-2">
                  <span className={`font-mono font-bold text-xs ${ind.status === 'warning' ? 'text-rose-600' : 'text-indigo-900'}`}>
                    {ind.value}
                  </span>
                  <span 
                    className={`w-2 h-2 rounded-full ${ind.status === 'warning' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}
                    title={ind.desc}
                  ></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Panel (Right 8 columns) */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Chart 1: Bed Occupancy Trend */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 flex flex-col justify-between h-64">
            <div className="border-b border-slate-100 pb-1.5 flex items-center justify-between">
              <h5 className="font-bold text-slate-700 text-[11px] uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-sky-500" /> Bed Occupancy Trend
              </h5>
              <span className="text-[9px] font-mono text-slate-400">Target &gt;80%</span>
            </div>
            
            <div className="h-44 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} domain={[50, 100]} />
                  <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '4px' }} />
                  <Line type="monotone" dataKey="occupancy" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: HAI Trend (Bar) */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 flex flex-col justify-between h-64">
            <div className="border-b border-slate-100 pb-1.5 flex items-center justify-between">
              <h5 className="font-bold text-slate-700 text-[11px] uppercase tracking-wider flex items-center gap-1">
                <BarChart3 className="w-3.5 h-3.5 text-indigo-500" /> Infection Rate (HAI)
              </h5>
              <span className="text-[9px] font-mono text-slate-400">Target &lt;1.5%</span>
            </div>
            
            <div className="h-44 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} domain={[0, 2]} />
                  <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '4px' }} />
                  <Bar dataKey="rate" fill="#6366f1" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Incidents Donut Chart */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 flex flex-col justify-between h-64">
            <div className="border-b border-slate-100 pb-1.5">
              <h5 className="font-bold text-slate-700 text-[11px] uppercase tracking-wider flex items-center gap-1">
                <PieChartIcon className="w-3.5 h-3.5 text-rose-500" /> Incidents by Type
              </h5>
            </div>
            
            <div className="h-40 w-full relative flex items-center justify-center mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={55}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: '9px', borderRadius: '4px' }} />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Inner Label for Donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Total</span>
                <span className="font-bold text-slate-800 text-lg font-mono leading-none">{totalIncidentsCount}</span>
              </div>
            </div>

            {/* Micro Legends */}
            <div className="grid grid-cols-2 gap-1 text-[9px] text-slate-500 mt-1 font-sans">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> <span>Med (Medication): {incidentCounts['Medication Error']}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> <span>Fall: {incidentCounts['Patient Fall']}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span> <span>Near Miss: {incidentCounts['Near Miss']}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span> <span>Others: {incidentCounts['Others']}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Incident Log Auditing Dashboard (Super rich interaction) */}
      <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 space-y-3.5 text-xs">
        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
          <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-indigo-700" /> Active Incidents & CAPA Board
          </h4>
          <span className="text-[10px] bg-indigo-100 text-indigo-800 font-semibold px-2 py-0.5 rounded">NABH Standard SEC-3</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Incidents Table/List */}
          <div className="bg-white rounded-lg border border-slate-200 p-3 h-48 overflow-y-auto space-y-2">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider pb-1 border-b border-slate-100">
              Logged Sentinel / Safety Events
            </div>

            {incidents.map(inc => (
              <button
                key={inc.id}
                onClick={() => setSelectedIncidentForView(inc)}
                className={`w-full text-left p-2 rounded border transition flex items-center justify-between gap-2 ${selectedIncidentForView?.id === inc.id ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'}`}
              >
                <div className="min-w-0">
                  <div className="font-bold text-slate-800 text-[11px] truncate flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${inc.severity === 'Severe' ? 'bg-rose-500' : inc.severity === 'Moderate' ? 'bg-amber-500' : 'bg-slate-400'}`}></span>
                    {inc.type} - {inc.id}
                  </div>
                  <p className="text-slate-500 text-[10px] truncate font-sans">{inc.description}</p>
                </div>
                
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${inc.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : inc.status === 'Under Review' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}`}>
                    {inc.status}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>

          {/* CAPA Viewer and AI Generator */}
          <div className="bg-white rounded-lg border border-slate-200 p-3 h-48 overflow-y-auto flex flex-col justify-between">
            {selectedIncidentForView ? (
              <div className="space-y-2 flex-1 flex flex-col justify-between text-slate-700">
                <div className="space-y-1 font-sans">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                    <span>Incident Audit Sheet</span>
                    <span className="font-mono">{selectedIncidentForView.id}</span>
                  </div>
                  <h5 className="font-bold text-slate-800 text-[11px]">{selectedIncidentForView.type}</h5>
                  <p className="text-slate-600 bg-slate-50 p-1.5 border border-slate-100 rounded text-[10.5px]">
                    &quot;{selectedIncidentForView.description}&quot;
                  </p>
                  <div className="text-[10px] text-slate-400">
                    Reporter: <span className="font-medium text-slate-600">{selectedIncidentForView.reporter}</span> | Patient: <span className="font-medium text-slate-600">{selectedIncidentForView.patientName}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  {selectedIncidentForView.capaPlan ? (
                    <div className="flex-1 text-[11px] bg-emerald-50 border border-emerald-100 p-1.5 rounded text-emerald-800 font-medium">
                      <strong>Logged CAPA:</strong> {selectedIncidentForView.capaPlan}
                    </div>
                  ) : (
                    <div className="flex-1 text-[11px] bg-rose-50 border border-rose-100 p-1.5 rounded text-rose-800 font-medium">
                      <strong>Missing CAPA Plan:</strong> Mandated by NABH. Generate Immediately.
                    </div>
                  )}

                  <button
                    onClick={() => onTriggerAiCapa(selectedIncidentForView)}
                    disabled={aiGeneratingId === selectedIncidentForView.id}
                    className="flex-shrink-0 px-2.5 py-1.5 bg-indigo-900 text-white hover:bg-indigo-800 disabled:bg-slate-300 rounded font-bold transition flex items-center gap-1 text-[10px] shadow-sm animate-pulse-slow"
                  >
                    <Brain className="w-3.5 h-3.5 text-indigo-300" />
                    {aiGeneratingId === selectedIncidentForView.id ? 'Analyzing...' : 'AI CAPA Draft'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 italic font-sans p-4 space-y-1">
                <AlertOctagon className="w-8 h-8 text-slate-300" />
                <p>Select an incident from the log panel to inspect details, check CAPA sheets, or draft corrective actions using the AI Copilot.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
