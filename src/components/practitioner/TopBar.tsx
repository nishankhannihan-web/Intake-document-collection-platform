import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  ExternalLink, 
  Bell, 
  FolderPlus,
  FileUp,
  CalendarPlus,
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { ViewMode } from '../../types';
import { Button } from '../common/Button';

interface TopBarProps {
  currentView: ViewMode;
  onOpenCommandPalette: () => void;
  onSwitchToClientPortal: () => void;
  onOpenNewCase: () => void;
  onOpenNewDocRequest: () => void;
  onOpenNewDeadline: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentView,
  onOpenCommandPalette,
  onSwitchToClientPortal,
  onOpenNewCase,
  onOpenNewDocRequest,
  onOpenNewDeadline
}) => {
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const viewTitles: Record<ViewMode, { title: string; subtitle: string }> = {
    today: { title: 'Today', subtitle: 'Priority dashboard & morning status' },
    cases: { title: 'Cases', subtitle: 'Pipeline & dossier management' },
    document_requests: { title: 'Document Requests', subtitle: 'Pending uploads, approvals & reminders' },
    deadlines: { title: 'Deadlines', subtitle: 'IRCC, CRA & statutory calendars' },
    clients: { title: 'Clients', subtitle: 'Client directory & portal links' },
    intake_forms: { title: 'Intake Forms', subtitle: 'Automated questionnaires & case generators' },
    messages: { title: 'Messages', subtitle: 'Direct client communication threads' },
    billing: { title: 'Billing', subtitle: 'Retainers, e-signatures & invoices' },
    templates: { title: 'Templates', subtitle: 'Reusable checklists & auto-sequences' },
    settings: { title: 'Settings & Security', subtitle: 'Audit log, encryption & firm branding' }
  };

  const { title, subtitle } = viewTitles[currentView] || { title: 'Chasefree', subtitle: '' };

  return (
    <header className="h-16 px-6 border-b border-[#EADFC4] bg-white flex items-center justify-between shrink-0 sticky top-0 z-20">
      {/* Zone 1: Context & Breadcrumb */}
      <div className="flex items-center gap-3 min-w-[200px]">
        <div>
          <h1 className="text-base font-bold text-[#2A2312] leading-tight flex items-center gap-2">
            {title}
          </h1>
          <p className="text-xs text-[#6B6147] hidden sm:block">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Zone 2: Global Search & Command Palette trigger */}
      <div className="flex-1 max-w-md mx-4">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-[#FAF7F0] border border-[#EADFC4] text-xs text-[#6B6147] hover:border-[#FFBE0B] hover:bg-white transition-all shadow-xs group"
        >
          <div className="flex items-center gap-2">
            <Search size={15} className="text-[#6B6147] group-hover:text-[#2A2312]" />
            <span className="truncate">Search cases, clients, documents...</span>
          </div>
          <kbd className="hidden sm:inline-block font-mono text-[10px] px-1.5 py-0.5 rounded bg-white border border-[#EADFC4] text-[#6B6147]">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Zone 3: Actions & Client Simulator Toggle */}
      <div className="flex items-center gap-2.5">
        {/* Switch to Client Portal CTA */}
        <button
          onClick={onSwitchToClientPortal}
          title="Open Rahim Khan's client view in portal simulator"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#FFF3CC] text-[#2A2312] hover:bg-[#FFE58A] border border-[#FFE58A] transition-colors"
        >
          <ExternalLink size={13} className="text-[#2A2312]" />
          <span>View as Client</span>
        </button>

        {/* Notifications toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-[#6B6147] hover:text-[#2A2312] hover:bg-[#FAF7F0] border border-transparent hover:border-[#EADFC4] relative transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#EADFC4] p-3 z-30 animate-in fade-in duration-100">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#EADFC4]">
                <span className="text-xs font-bold text-[#2A2312]">Recent Activity</span>
                <span className="text-[10px] font-medium text-[#6B6147]">Auto-synced</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-[#FAF7F0] flex items-start gap-2">
                  <FileUp size={14} className="text-[#2A2312] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[#2A2312] font-semibold">Rahim Khan uploaded bank statement</p>
                    <p className="text-[10px] text-[#6B6147]">CAS-104 · 2 hours ago</p>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-[#FAF7F0] flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[#2A2312] font-semibold">Priya Sharma settled invoice #089</p>
                    <p className="text-[10px] text-[#6B6147]">$1,250.00 CAD · Yesterday</p>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-[#FAF7F0] flex items-start gap-2">
                  <Clock size={14} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[#2A2312] font-semibold">Auto-reminder sent for T2 filing</p>
                    <p className="text-[10px] text-[#6B6147]">Dispatched via WhatsApp & Email</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick + Add Menu */}
        <div className="relative">
          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={15} />}
            onClick={() => setShowQuickMenu(!showQuickMenu)}
          >
            New
          </Button>

          {showQuickMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#EADFC4] p-1.5 z-30 animate-in fade-in duration-100">
              <button
                onClick={() => {
                  setShowQuickMenu(false);
                  onOpenNewCase();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#2A2312] hover:bg-[#FAF7F0] rounded-xl transition-colors text-left"
              >
                <FolderPlus size={15} className="text-[#FFBE0B]" />
                <span>New Case Dossier</span>
              </button>
              <button
                onClick={() => {
                  setShowQuickMenu(false);
                  onOpenNewDocRequest();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#2A2312] hover:bg-[#FAF7F0] rounded-xl transition-colors text-left"
              >
                <FileUp size={15} className="text-amber-600" />
                <span>Request Documents</span>
              </button>
              <button
                onClick={() => {
                  setShowQuickMenu(false);
                  onOpenNewDeadline();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#2A2312] hover:bg-[#FAF7F0] rounded-xl transition-colors text-left"
              >
                <CalendarPlus size={15} className="text-blue-600" />
                <span>Add Deadline</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
