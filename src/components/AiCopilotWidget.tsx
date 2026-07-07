import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Patient, Incident, BedCategory, ComplianceMilestone } from '../types';
import { Sparkles, Send, X, Bot, User, Brain, AlertCircle, RefreshCw, HelpCircle } from 'lucide-react';

interface AiCopilotWidgetProps {
  selectedPatient: Patient;
  incidents: Incident[];
  beds: BedCategory[];
  milestones: ComplianceMilestone[];
  openTriggeredIncident: Incident | null;
  onClearTriggeredIncident: () => void;
}

export default function AiCopilotWidget({
  selectedPatient,
  incidents,
  beds,
  milestones,
  openTriggeredIncident,
  onClearTriggeredIncident,
}: AiCopilotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      role: "model",
      content: "Hello! I am your ABDM & NABH Compliance Copilot. I have real-time access to your 120-bed hospital dashboard state, selected patient records, active bed occupancy rate, and incident logs.\n\nHow can I assist you with clinical quality auditing, drafting CAPAs, or navigating ABDM integration technical specs today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Quick Action Chips
  const promptChips = [
    { label: "Draft CAPA for Patient Fall", prompt: "An incident was logged regarding Karan Singh falling in the ICU on a wet floor. Draft a highly professional Corrective and Preventive Action (CAPA) plan suitable for a NABH review committee." },
    { label: "Audit active Patient File", prompt: `Please audit the active patient file (${selectedPatient.name}, UHID: ${selectedPatient.uhid}) for clinical completeness, documented allergies, chronic conditions, and ABDM linking readiness.` },
    { label: "Explain ABDM M1-M4", prompt: "Explain Ayushman Bharat Digital Mission (ABDM) Milestones M1, M2, M3, and M4, highlighting what technical HL7 FHIR APIs or directories (HFR, HPR) are required to pass certification." },
    { label: "Analyze dashboard KPIs", prompt: "Examine our current hospital KPIs (81% Bed Occupancy, 4.2 days stay, 8.5% readmission rate). Identify any compliance bottlenecks or areas of administrative concern." }
  ];

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle triggered incident from dashboard
  useEffect(() => {
    if (openTriggeredIncident) {
      setIsOpen(true);
      const prompt = `Draft a formal Corrective and Preventive Action (CAPA) plan for the logged incident:
Incident ID: ${openTriggeredIncident.id}
Type: ${openTriggeredIncident.type}
Severity: ${openTriggeredIncident.severity}
Patient: ${openTriggeredIncident.patientName}
Reporter: ${openTriggeredIncident.reporter}
Description: ${openTriggeredIncident.description}

Please include:
1. Root Cause Analysis (using fishbone/5-Whys methodology).
2. Immediate Corrective Action taken.
3. Long-term Preventive Action.
4. Monitoring strategy and timelines.`;
      
      handleSendMessage(prompt);
      onClearTriggeredIncident();
    }
  }, [openTriggeredIncident]);

  const handleSendMessage = async (textToSend?: string) => {
    const finalMsg = (textToSend || input).trim();
    if (!finalMsg) return;

    if (!textToSend) setInput('');

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: finalMsg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // Context snapshot to send to Gemini
    const contextSnapshot = {
      selectedPatient: {
        name: selectedPatient.name,
        uhid: selectedPatient.uhid,
        abhaId: selectedPatient.abhaId,
        age: selectedPatient.age,
        gender: selectedPatient.gender,
        allergies: selectedPatient.allergies,
        chronicConditions: selectedPatient.chronicConditions,
        currentMedications: selectedPatient.currentMedications,
        recentVisitsCount: selectedPatient.recentVisits.length
      },
      hospitalBeds: beds,
      incidentLogs: incidents.map(inc => ({
        id: inc.id,
        type: inc.type,
        severity: inc.severity,
        reporter: inc.reporter,
        patient: inc.patientName,
        desc: inc.description,
        status: inc.status,
        hasCapa: !!inc.capaPlan
      })),
      abdmCheckedMilestones: milestones.filter(m => m.checked).map(m => m.name)
    };

    try {
      const response = await fetch('/api/ai-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          context: contextSnapshot
        })
      });

      if (!response.ok) {
        throw new Error('API server returned error');
      }

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: data.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        role: 'model',
        content: "I ran into a connection error proxying the request to the server-side Gemini gateway. Please verify that your `GEMINI_API_KEY` is configured in **Settings > Secrets**.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Sparkly Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-indigo-900 text-white rounded-full shadow-2xl hover:bg-indigo-950 transition-all duration-300 z-40 border border-indigo-700/50 flex items-center gap-2 hover:scale-105"
        >
          <Brain className="w-5 h-5 text-indigo-300 animate-pulse" />
          <span className="font-extrabold text-xs tracking-wider uppercase font-sans pr-1">AI Copilot</span>
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
          </span>
        </button>
      )}

      {/* Slide-out Sidebar Chat Tray */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col z-50 animate-slide-in font-sans">
          
          {/* Chat Header */}
          <div className="bg-indigo-950 text-white px-4 py-3 flex justify-between items-center border-b border-indigo-900/40">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-900/60 rounded">
                <Brain className="w-5 h-5 text-indigo-300 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-[13px] text-white flex items-center gap-1 leading-none">
                  ABDM & NABH AI Copilot <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                </h3>
                <span className="text-[10px] text-indigo-200">System Auditor & CAPA Generator</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded text-indigo-200 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Context Bar */}
          <div className="bg-indigo-900 text-indigo-100 px-4 py-1.5 text-[10.5px] flex justify-between items-center font-medium font-sans">
            <span>Selected Patient: <strong>{selectedPatient.name}</strong></span>
            <span>Incidents logged: <strong>{incidents.length}</strong></span>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
            {messages.map(msg => (
              <div 
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* Avatar */}
                {msg.role !== 'user' && (
                  <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200 flex-shrink-0 text-indigo-800">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] rounded-lg px-3.5 py-2.5 shadow-3xs ${msg.role === 'user' ? 'bg-emerald-800 text-white text-xs leading-relaxed font-sans' : 'bg-white border border-slate-200 text-slate-700 text-xs leading-relaxed font-sans'}`}>
                  {/* Render content with line breaks */}
                  <div className="whitespace-pre-line font-sans prose prose-slate">
                    {msg.content}
                  </div>
                  <span className={`text-[8.5px] mt-1.5 block font-mono text-right ${msg.role === 'user' ? 'text-emerald-200' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center border border-slate-300 flex-shrink-0 text-slate-700">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200 animate-spin">
                  <RefreshCw className="w-4 h-4 text-indigo-800" />
                </div>
                <div className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-xs text-slate-500 animate-pulse font-medium">
                  Analyzing compliance state and drafting response...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Chips Tray (Only shown when not loading) */}
          {!isLoading && (
            <div className="p-3 border-t border-slate-100 bg-white space-y-1.5">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <HelpCircle className="w-3 h-3" /> Quick Compliance Audits:
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pb-1.5">
                {promptChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(chip.prompt)}
                    className="text-[10px] bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-900 border border-slate-200 hover:border-indigo-200 px-2.5 py-1 rounded transition text-left font-medium"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Input */}
          <div className="p-3 border-t border-slate-200 bg-white flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(); }}
              placeholder="Ask about NABH standards, M1-M4, draft CAPA..."
              className="flex-1 px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-indigo-600 text-xs"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isLoading}
              className="p-2 bg-emerald-800 text-white hover:bg-emerald-900 disabled:bg-slate-200 rounded transition flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
}
