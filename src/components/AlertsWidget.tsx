import React, { useState } from 'react';
import { AlertNotification } from '../types';
import { Bell, AlertOctagon, AlertTriangle, Info, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

interface AlertsWidgetProps {
  alerts: AlertNotification[];
  onUpdateAlerts: (updatedAlerts: AlertNotification[]) => void;
}

export default function AlertsWidget({
  alerts,
  onUpdateAlerts,
}: AlertsWidgetProps) {
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    if (expandedAlertId === id) {
      setExpandedAlertId(null);
    } else {
      setExpandedAlertId(id);
    }
  };

  const handleResolve = (id: string) => {
    const updated = alerts.map(alt => {
      if (alt.id === id) {
        return { ...alt, count: Math.max(0, alt.count - 1) };
      }
      return alt;
    }).filter(alt => alt.count > 0); // Hide alert if count drops to 0
    
    onUpdateAlerts(updated);
    setExpandedAlertId(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200">
        <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
          <Bell className="w-4 h-4 text-sky-600 animate-pulse" /> Alerts & Notifications
        </h3>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-2 text-xs">
        {alerts.length === 0 ? (
          <div className="py-8 text-center text-slate-400 italic flex flex-col items-center gap-1.5">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            All compliance and critical alerts resolved!
          </div>
        ) : (
          alerts.map(alt => {
            const isExpanded = expandedAlertId === alt.id;
            
            // Icon selection
            const icon = alt.type === 'danger' 
              ? <AlertOctagon className="w-4 h-4 text-rose-500 flex-shrink-0" />
              : alt.type === 'warning' 
                ? <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                : <Info className="w-4 h-4 text-sky-500 flex-shrink-0" />;

            const badgeBg = alt.type === 'danger' 
              ? 'bg-rose-50 border border-rose-100 hover:bg-rose-100/50'
              : alt.type === 'warning' 
                ? 'bg-amber-50 border border-amber-100 hover:bg-amber-100/50'
                : 'bg-sky-50 border border-sky-100 hover:bg-sky-100/50';

            const badgeText = alt.type === 'danger' 
              ? 'text-rose-800' 
              : alt.type === 'warning' 
                ? 'text-amber-800' 
                : 'text-sky-800';

            const countBg = alt.type === 'danger'
              ? 'bg-rose-500 text-white'
              : alt.type === 'warning'
                ? 'bg-amber-500 text-white'
                : 'bg-sky-500 text-white';

            return (
              <div 
                key={alt.id}
                className={`rounded-lg overflow-hidden transition-all duration-200 ${badgeBg}`}
              >
                {/* Expandable Alert Row */}
                <button
                  onClick={() => toggleExpand(alt.id)}
                  className="w-full text-left p-2.5 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {icon}
                    <span className={`font-semibold truncate ${badgeText}`}>{alt.title}</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded-full font-mono font-bold text-[10px] ${countBg}`}>
                      {alt.count}
                    </span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                  </div>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-3 pb-3 pt-0 border-t border-slate-100 text-[11px] text-slate-600 space-y-2">
                    <p className="pt-2 font-sans text-slate-700">{alt.description}</p>
                    
                    {/* Simulated specific alert items */}
                    <div className="bg-white/80 border border-slate-100 rounded p-1.5 space-y-1">
                      <div className="font-semibold text-[10px] text-slate-500 uppercase">Awaiting Compliance action:</div>
                      {alt.id === 'ALT001' && (
                        <ul className="list-disc pl-4 space-y-0.5 font-sans">
                          <li>Patient Rahul Kumar: Lipid profile critical (UH00012345)</li>
                          <li>Patient Karan Singh: Blood Sugar Fasting (230 mg/dL)</li>
                          <li>OT Emergency: ABO crossmatch for surgery tomorrow</li>
                        </ul>
                      )}
                      {alt.id === 'ALT002' && (
                        <ul className="list-disc pl-4 space-y-0.5 font-sans">
                          <li>Ward A Pharmacy: 4 vials Inotropic drugs expiring</li>
                          <li>IPD-ICU: Inj. Piperacillin batch #B204 expiry July-2026</li>
                        </ul>
                      )}
                      {alt.id === 'ALT003' && (
                        <ul className="list-disc pl-4 space-y-0.5 font-sans">
                          <li>Defibrillator #3 (ICU Ward): Overdue 3 days</li>
                          <li>Ventilator #12 (Emergency): Calibration tag missing</li>
                        </ul>
                      )}
                      {alt.id === 'ALT004' && (
                        <ul className="list-disc pl-4 space-y-0.5 font-sans">
                          <li>Basic Life Support (BLS): 4 nurses expiring 12-Jul</li>
                          <li>NABH standard training: 11 staff pending</li>
                        </ul>
                      )}
                      {alt.id === 'ALT005' && (
                        <ul className="list-disc pl-4 space-y-0.5 font-sans">
                          <li>Karan Singh: Surgical consent signature missing</li>
                          <li>Patient 102 (Semi-Private): General Anesthesia signoff pending</li>
                        </ul>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => handleResolve(alt.id)}
                        className="px-2 py-1 bg-slate-800 text-white font-semibold rounded hover:bg-slate-900 transition flex items-center gap-1 text-[10px]"
                      >
                        Acknowledge & Resolve (1)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
