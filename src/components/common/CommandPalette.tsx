import React, { useState, useEffect } from 'react';
import { 
  Search, 
  FolderKanban, 
  FileCheck2, 
  CalendarClock, 
  Users, 
  FileText, 
  CreditCard, 
  ExternalLink,
  PlusCircle,
  BellRing,
  ArrowRight
} from 'lucide-react';
import { ViewMode } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectView: (view: ViewMode) => void;
  onSwitchToClientPortal: () => void;
  onOpenNewCase: () => void;
  onOpenNewDocRequest: () => void;
  onOpenNewDeadline: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectView,
  onSwitchToClientPortal,
  onOpenNewCase,
  onOpenNewDocRequest,
  onOpenNewDeadline
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // handled by parent
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickActions = [
    {
      id: 'switch-portal',
      label: 'Open Client Portal View (Rahim Khan)',
      sub: 'Preview secure magic-link mobile/desktop portal',
      icon: <ExternalLink size={16} className="text-[#FFBE0B]" />,
      action: () => {
        onSwitchToClientPortal();
        onClose();
      }
    },
    {
      id: 'new-case',
      label: 'Create New Client Case',
      sub: 'Start new intake or file dossier',
      icon: <PlusCircle size={16} className="text-emerald-600" />,
      action: () => {
        onOpenNewCase();
        onClose();
      }
    },
    {
      id: 'request-docs',
      label: 'Send Document Request Checklist',
      sub: 'Select template and dispatch to client',
      icon: <FileCheck2 size={16} className="text-amber-600" />,
      action: () => {
        onOpenNewDocRequest();
        onClose();
      }
    },
    {
      id: 'add-deadline',
      label: 'Set New Statutory or Client Deadline',
      sub: 'IRCC, CRA, or court filing cutoff',
      icon: <CalendarClock size={16} className="text-blue-600" />,
      action: () => {
        onOpenNewDeadline();
        onClose();
      }
    }
  ];

  const navigationItems: { label: string; view: ViewMode; icon: React.ReactNode; sub: string }[] = [
    { label: 'Today Dashboard', view: 'today', icon: <BellRing size={16} />, sub: 'Morning priority agenda & time saved' },
    { label: 'Cases & Pipelines', view: 'cases', icon: <FolderKanban size={16} />, sub: 'Kanban view of active legal & tax files' },
    { label: 'Document Requests', view: 'document_requests', icon: <FileCheck2 size={16} />, sub: 'Review uploads, approve or request fixes' },
    { label: 'Deadlines & Expiries', view: 'deadlines', icon: <CalendarClock size={16} />, sub: 'Calendar & agenda countdowns' },
    { label: 'Client Directory', view: 'clients', icon: <Users size={16} />, sub: 'Contact directory and magic link tokens' },
    { label: 'Intake Forms Builder', view: 'intake_forms', icon: <FileText size={16} />, sub: 'Self-serve questionnaires & auto-cases' },
    { label: 'Billing & Retainers', view: 'billing', icon: <CreditCard size={16} />, sub: 'E-sign retainer agreements and invoices' }
  ];

  const filteredActions = quickActions.filter(a => 
    a.label.toLowerCase().includes(query.toLowerCase()) || 
    a.sub.toLowerCase().includes(query.toLowerCase())
  );

  const filteredNav = navigationItems.filter(n =>
    n.label.toLowerCase().includes(query.toLowerCase()) ||
    n.sub.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div 
        className="fixed inset-0 bg-[#2A2312]/50 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#EADFC4] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[#EADFC4] bg-[#FAF7F0]/80">
          <Search size={18} className="text-[#6B6147] shrink-0" />
          <input
            type="text"
            placeholder="Type a command, case name, or search (e.g. 'Rahim', 'Intake', 'Deadline')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-[#2A2312] placeholder-[#6B6147]/70 focus:outline-none"
          />
          <kbd className="hidden sm:inline-block text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-white border border-[#EADFC4] text-[#6B6147]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {filteredActions.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-[#6B6147] uppercase tracking-wider px-3 mb-1.5">
                Quick Actions
              </div>
              <div className="space-y-1">
                {filteredActions.map(action => (
                  <button
                    key={action.id}
                    onClick={action.action}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-[#FAF7F0] transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-[#FAF7F0] group-hover:bg-white border border-[#EADFC4]/60 transition-colors">
                        {action.icon}
                      </div>
                      <div className="truncate">
                        <div className="text-sm font-semibold text-[#2A2312] group-hover:text-[#2A2312]">
                          {action.label}
                        </div>
                        <div className="text-xs text-[#6B6147]">
                          {action.sub}
                        </div>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-[#6B6147] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredNav.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-[#6B6147] uppercase tracking-wider px-3 mb-1.5">
                Navigation
              </div>
              <div className="space-y-1">
                {filteredNav.map(item => (
                  <button
                    key={item.view}
                    onClick={() => {
                      onSelectView(item.view);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-[#FAF7F0] transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-[#FAF7F0] group-hover:bg-white border border-[#EADFC4]/60 text-[#2A2312]">
                        {item.icon}
                      </div>
                      <div className="truncate">
                        <div className="text-sm font-medium text-[#2A2312]">
                          {item.label}
                        </div>
                        <div className="text-xs text-[#6B6147]">
                          {item.sub}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#6B6147] opacity-0 group-hover:opacity-100 transition-opacity">
                      Jump to
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredActions.length === 0 && filteredNav.length === 0 && (
            <div className="py-8 text-center text-sm text-[#6B6147]">
              No commands or cases found matching &quot;{query}&quot;
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
