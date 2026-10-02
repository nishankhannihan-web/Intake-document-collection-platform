import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  FileCheck2, 
  CalendarClock, 
  Users, 
  Share2, 
  TrendingUp, 
  Send, 
  Eye, 
  CreditCard, 
  ShieldCheck, 
  Check 
} from 'lucide-react';
import { CaseRecord, DocumentItem, CaseDeadline, ClientProfile } from '../../types';
import { DocStatusBadge, DeadlineTypeBadge } from '../common/Badge';
import { Button } from '../common/Button';
import { useToast } from '../common/Toast';

interface TodayViewProps {
  cases: CaseRecord[];
  documents: DocumentItem[];
  deadlines: CaseDeadline[];
  clients: ClientProfile[];
  onSelectCase: (caseId: string) => void;
  onOpenDocumentReview: (doc: DocumentItem) => void;
  onSendReminderModal: (clientName: string, caseTitle: string) => void;
  onOpenNewCase: () => void;
  onOpenNewDocRequest: () => void;
  onShareIntakeModal: () => void;
  onSwitchToClientPortal: () => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  cases,
  documents,
  deadlines,
  clients,
  onSelectCase,
  onOpenDocumentReview,
  onSendReminderModal,
  onOpenNewCase,
  onOpenNewDocRequest,
  onShareIntakeModal,
  onSwitchToClientPortal
}) => {
  const { addToast } = useToast();

  const [onboardingSteps, setOnboardingSteps] = useState([
    { id: 1, title: 'Set up firm branding & encryption settings', completed: true },
    { id: 2, title: 'Configure immigration & tax document templates', completed: true },
    { id: 3, title: 'Send first client document request (Rahim Khan)', completed: true },
    { id: 4, title: 'Publish client intake link or embed on website', completed: false }
  ]);

  const toggleOnboardingStep = (id: number) => {
    setOnboardingSteps(prev =>
      prev.map(step => (step.id === id ? { ...step, completed: !step.completed } : step))
    );
    addToast('success', 'Setup checklist updated');
  };

  const completedSteps = onboardingSteps.filter(s => s.completed).length;

  // Documents awaiting review
  const pendingReviewDocs = documents.filter(d => d.status === 'uploaded');

  // Deadlines this week
  const upcomingDeadlines = deadlines.slice(0, 4);

  // Clients with pending items
  const nonResponsiveClients = clients.filter(c => c.activeCasesCount > 0).slice(0, 3);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome & Morning Summary Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#EADFC4] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#6B6147] mb-1">
            <span>SOLO PRACTICE BRIEFING · WEDNESDAY, OCT 2026</span>
          </div>
          <h2 className="text-2xl font-bold text-[#2A2312] tracking-tight">
            Good morning, Elena
          </h2>
          <p className="text-sm text-[#6B6147] mt-1 max-w-2xl">
            You have <strong className="text-[#2A2312] font-semibold">{pendingReviewDocs.length} client documents</strong> waiting for review and <strong className="text-[#2A2312] font-semibold">1 overdue tax remittal</strong>. Chasefree auto-reminders saved 18.4 hours of manual follow-up this month.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <Button
            variant="outline"
            size="sm"
            icon={<Share2 size={14} />}
            onClick={onShareIntakeModal}
          >
            Share Intake Link
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<FileCheck2 size={14} />}
            onClick={onOpenNewDocRequest}
          >
            Request Documents
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<ArrowRight size={14} />}
            iconPosition="right"
            onClick={onOpenNewCase}
          >
            New Case
          </Button>
        </div>
      </div>

      {/* Hero "Needs Attention" Card */}
      <div className="bg-[#FFFDF8] rounded-2xl border-2 border-[#FFBE0B]/50 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-[#2A2312]">
            Action Required Today ({pendingReviewDocs.length + 1} items)
          </h3>
          <span className="text-xs text-[#6B6147]">High priority items</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Item 1: Rahim Khan's Bank Statement */}
          {pendingReviewDocs.length > 0 && (
            <div className="p-4 rounded-xl bg-white border border-[#EADFC4] flex flex-col justify-between hover:border-[#FFBE0B] transition-colors">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-semibold text-[#2A2312]">
                    Rahim Khan · CAS-104
                  </span>
                  <DocStatusBadge status="uploaded" size="sm" />
                </div>
                <h4 className="text-sm font-bold text-[#2A2312] truncate">
                  {pendingReviewDocs[0].name}
                </h4>
                <p className="text-xs text-[#6B6147] mt-1 line-clamp-2">
                  Uploaded {pendingReviewDocs[0].fileName} ({pendingReviewDocs[0].fileSize})
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-[#EADFC4]/60">
                <span className="text-[11px] text-[#6B6147]">Due in 2 days</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onOpenDocumentReview(pendingReviewDocs[0])}
                    className="px-2.5 py-1 text-xs font-semibold bg-[#2A2312] text-white hover:bg-[#3D331B] rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Eye size={12} />
                    <span>Review & Approve</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Item 2: Overdue Tax Client Follow-up */}
          <div className="p-4 rounded-xl bg-white border border-rose-200 flex flex-col justify-between hover:border-rose-300 transition-colors">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-semibold text-rose-900">
                  Priya Sharma · SolarKit Energy Inc.
                </span>
                <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                  2 Days Overdue
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#2A2312]">
                CRA Q3 Corporate Installment & Q4 Banking Records
              </h4>
              <p className="text-xs text-[#6B6147] mt-1">
                Client has not uploaded the missing bank statements requested 4 days ago.
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-rose-100">
              <span className="text-[11px] text-[#6B6147]">Next auto-reminder: Tomorrow 9 AM</span>
              <button
                onClick={() => onSendReminderModal('Priya Sharma', 'CAS-102 FY2025 Corporate T2')}
                className="px-2.5 py-1 text-xs font-semibold bg-[#FFBE0B] text-[#2A2312] hover:bg-[#F3B300] rounded-lg transition-colors flex items-center gap-1 shadow-xs"
              >
                <Send size={12} />
                <span>Send WhatsApp Nudge</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Time Saved by Auto-Reminders (Supports the Hook) */}
        <div className="bg-[#2A2312] text-white p-5 rounded-2xl flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between text-xs text-[#FFBE0B] font-semibold mb-2">
              <span className="flex items-center gap-1.5">
                <TrendingUp size={14} />
                PRODUCTIVITY IMPACT
              </span>
              <span className="text-[10px] bg-[#3D331B] px-2 py-0.5 rounded-full border border-[#FFBE0B]/30 text-[#FFBE0B]">
                84% Chase Reduction
              </span>
            </div>
            <div className="mt-2">
              <div className="text-4xl font-extrabold text-[#FFBE0B] tabular-nums tracking-tight">
                18.4 hrs
              </div>
              <p className="text-sm text-[#D5C9B3] mt-1 font-medium">
                Saved this month through automated SMS, WhatsApp & Email chase cycles.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#3D331B] space-y-2 text-xs text-[#D5C9B3]">
            <div className="flex items-center justify-between">
              <span>Automated reminders sent:</span>
              <strong className="text-white tabular-nums">46 dispatches</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Client turnaround time:</span>
              <strong className="text-white tabular-nums">1.8 days avg</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Missed statutory deadlines:</span>
              <strong className="text-emerald-400 font-bold tabular-nums">0 (100% on time)</strong>
            </div>
          </div>
        </div>

        {/* Card 2: Deadlines This Week */}
        <div className="bg-white p-5 rounded-2xl border border-[#EADFC4] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 h-5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#2A2312]">
                <CalendarClock size={16} className="text-[#FFBE0B]" />
                <span>Deadlines This Week</span>
              </div>
              <span className="text-xs text-[#6B6147] tabular-nums">
                {upcomingDeadlines.length} scheduled
              </span>
            </div>

            <div className="space-y-2.5">
              {upcomingDeadlines.map(dl => (
                <div
                  key={dl.id}
                  className="p-2.5 rounded-xl bg-[#FAF7F0] border border-[#EADFC4]/60 hover:border-[#FFBE0B] transition-colors flex flex-col justify-between h-[74px]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1 min-h-[32px] flex items-start">
                      <h4 className="text-xs font-bold text-[#2A2312] leading-4 line-clamp-2">
                        {dl.title}
                      </h4>
                    </div>
                    <DeadlineTypeBadge type={dl.type} short={true} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#6B6147] mt-auto">
                    <span className="tabular-nums font-mono leading-none">{dl.date}</span>
                    <span className={`leading-none ${dl.isOverdue ? 'text-rose-600 font-bold' : 'text-[#6B6147]'}`}>
                      {dl.isOverdue ? 'Overdue' : 'Auto-remind active'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onSelectCase(cases[0].id)}
            className="mt-4 pt-3 border-t border-[#EADFC4]/60 text-xs font-semibold text-[#2A2312] hover:text-[#FFBE0B] flex items-center justify-between group transition-colors"
          >
            <span>View full calendar & countdowns</span>
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Card 3: Clients Who Need Follow-up & Pending Invoices */}
        <div className="bg-white p-5 rounded-2xl border border-[#EADFC4] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 h-5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#2A2312]">
                <Users size={16} className="text-[#FFBE0B]" />
                <span>Non-Responsive Clients</span>
              </div>
              <span className="text-xs text-[#6B6147]">Awaiting docs</span>
            </div>

            <div className="space-y-2.5">
              {nonResponsiveClients.map(c => (
                <div
                  key={c.id}
                  className="p-2.5 rounded-xl bg-[#FAF7F0] border border-[#EADFC4]/60 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#2A2312] text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {c.avatarInitials}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-[#2A2312] truncate">
                        {c.name}
                      </div>
                      <div className="text-[11px] text-[#6B6147] truncate">
                        {c.company || c.tag} · {c.lastActive}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onSendReminderModal(c.name, c.tag)}
                    title="Send immediate reminder"
                    className="p-1.5 rounded-lg bg-white border border-[#EADFC4] hover:bg-[#FFBE0B] hover:text-[#2A2312] transition-colors shrink-0 text-[#2A2312]"
                  >
                    <Send size={13} />
                  </button>
                </div>
              ))}
            </div>

            {/* Unpaid Invoices Summary */}
            <div className="mt-4 p-3 rounded-xl bg-[#FFFDF8] border border-[#FFE58A] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard size={15} className="text-[#2A2312]" />
                <div>
                  <div className="text-xs font-bold text-[#2A2312]">Unpaid Invoices</div>
                  <div className="text-[11px] text-[#6B6147]">2 invoices pending payment</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-[#2A2312] tabular-nums">$3,600.00</div>
                <div className="text-[10px] text-amber-700 font-semibold">Stripe pay links active</div>
              </div>
            </div>
          </div>

          <button
            onClick={onSwitchToClientPortal}
            className="mt-4 pt-3 border-t border-[#EADFC4]/60 text-xs font-semibold text-[#2A2312] hover:text-[#FFBE0B] flex items-center justify-between group transition-colors"
          >
            <span>Simulate Client Portal (Rahim Khan)</span>
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Practice Onboarding Checklist (4-steps) */}
      <div className="bg-white p-5 rounded-2xl border border-[#EADFC4] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#2A2312] flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#FFBE0B]" />
              Solo Practice Quick-Launch Guide
            </h3>
            <p className="text-xs text-[#6B6147]">
              Complete these steps to fully automate document collection and client onboarding.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#2A2312]">
            <span>{completedSteps} of 4 steps completed</span>
            <div className="w-24 h-2 bg-[#FAF7F0] rounded-full overflow-hidden border border-[#EADFC4]">
              <div
                className="h-full bg-[#FFBE0B] transition-all duration-300"
                style={{ width: `${(completedSteps / 4) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {onboardingSteps.map(step => (
            <button
              key={step.id}
              onClick={() => toggleOnboardingStep(step.id)}
              className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                step.completed
                  ? 'bg-[#FAF7F0]/60 border-[#EADFC4] text-[#6B6147]'
                  : 'bg-white border-[#FFBE0B] shadow-xs text-[#2A2312]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  step.completed ? 'bg-emerald-600 text-white' : 'border border-[#EADFC4] bg-white'
                }`}
              >
                {step.completed && <Check size={12} strokeWidth={3} />}
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold block mb-0.5 text-[#2A2312]">
                  Step {step.id}
                </span>
                <span className={`text-xs leading-snug line-clamp-2 ${step.completed ? 'line-through opacity-70' : 'font-medium'}`}>
                  {step.title}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
