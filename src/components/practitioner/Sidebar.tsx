import React, { useState, useRef, useEffect } from 'react';
import { 
  Sun, 
  FolderKanban, 
  FileCheck2, 
  CalendarClock, 
  Users, 
  FileText, 
  MessageSquare, 
  CreditCard, 
  Layers, 
  ShieldCheck,
  ExternalLink,
  ChevronDown,
  Check,
  Plus,
  Settings
} from 'lucide-react';
import { ViewMode } from '../../types';
import { useToast } from '../common/Toast';

interface Workspace {
  id: string;
  name: string;
  type: string;
}

const WORKSPACES: Workspace[] = [
  { id: 'ws-1', name: 'Apex Legal & Advisory', type: 'Immigration & Litigation' },
  { id: 'ws-2', name: 'Rostova Tax & Accounting', type: 'CPA & Corporate Filing' },
  { id: 'ws-3', name: 'NorthStar Immigration Law', type: 'Family & Skilled Class' },
];

interface SidebarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  onSwitchToClientPortal: () => void;
  pendingReviewCount: number;
  overdueCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  onSwitchToClientPortal,
  pendingReviewCount,
  overdueCount
}) => {
  const { addToast } = useToast();
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace>(WORKSPACES[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Close on outside click or Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Focus management on arrow-key navigation
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && itemRefs.current[focusedIndex]) {
      itemRefs.current[focusedIndex]?.focus();
    }
  }, [isOpen, focusedIndex]);

  const handleMenuKeyDown = (e: React.KeyboardEvent) => {
    const totalItems = WORKSPACES.length + 2; // 3 workspaces + Add + Settings = 5
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
        setFocusedIndex(0);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => (prev + 1) % totalItems);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => (prev - 1 + totalItems) % totalItems);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setFocusedIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setFocusedIndex(totalItems - 1);
    } else if (e.key === 'Tab') {
      setIsOpen(false);
    }
  };

  const handleSelectWorkspace = (ws: Workspace) => {
    setSelectedWorkspace(ws);
    setIsOpen(false);
    buttonRef.current?.focus();
    addToast('success', 'Switched Workspace', `Active workspace changed to ${ws.name}.`);
  };

  const handleAddWorkspace = () => {
    setIsOpen(false);
    buttonRef.current?.focus();
    addToast('info', 'New Workspace', 'Opening workspace creation wizard...');
  };

  const handleWorkspaceSettings = () => {
    setIsOpen(false);
    buttonRef.current?.focus();
    onSelectView('settings');
    addToast('info', 'Workspace Settings', 'Navigating to firm branding and security settings.');
  };

  const navItems: {
    id: ViewMode;
    label: string;
    sub: string;
    icon: React.ReactNode;
    badge?: number;
    badgeAlert?: boolean;
  }[] = [
    {
      id: 'today',
      label: 'Today',
      sub: 'Priorities & morning briefing',
      icon: <Sun size={18} />
    },
    {
      id: 'cases',
      label: 'Cases',
      sub: 'Pipelines & client files',
      icon: <FolderKanban size={18} />
    },
    {
      id: 'document_requests',
      label: 'Document Requests',
      sub: 'Review uploads & checklists',
      icon: <FileCheck2 size={18} />,
      badge: pendingReviewCount > 0 ? pendingReviewCount : undefined
    },
    {
      id: 'deadlines',
      label: 'Deadlines',
      sub: 'IRCC, CRA & filing cutoffs',
      icon: <CalendarClock size={18} />,
      badge: overdueCount > 0 ? overdueCount : undefined,
      badgeAlert: true
    },
    {
      id: 'clients',
      label: 'Clients',
      sub: 'Directory & portal magic links',
      icon: <Users size={18} />
    },
    {
      id: 'intake_forms',
      label: 'Intake Forms',
      sub: 'Automated case questionnaires',
      icon: <FileText size={18} />
    },
    {
      id: 'messages',
      label: 'Messages',
      sub: 'Direct client communication',
      icon: <MessageSquare size={18} />
    },
    {
      id: 'billing',
      label: 'Billing & Retainers',
      sub: 'E-Sign, retainers & invoices',
      icon: <CreditCard size={18} />
    },
    {
      id: 'templates',
      label: 'Templates',
      sub: 'Checklists & reminders',
      icon: <Layers size={18} />
    },
    {
      id: 'settings',
      label: 'Settings & Security',
      sub: 'Audit logs & branding',
      icon: <ShieldCheck size={18} />
    }
  ];

  return (
    <aside className="w-64 bg-[#2A2312] text-white flex flex-col shrink-0 select-none border-r border-[#3D331B] min-h-screen">
      {/* Brand & Workspace Header with Dropdown */}
      <div className="p-5 border-b border-[#3D331B] relative z-30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FFBE0B] flex items-center justify-center text-[#2A2312] font-black text-lg shadow-sm">
              C
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white">
                Chasefree
              </span>
              <p className="text-[10px] text-[#A69B82] font-medium tracking-wide">
                Solo Practice OS
              </p>
            </div>
          </div>
        </div>

        {/* Practice Switcher Dropdown Container */}
        <div ref={dropdownRef} className="relative">
          <button
            ref={buttonRef}
            type="button"
            onClick={() => {
              const nextOpen = !isOpen;
              setIsOpen(nextOpen);
              if (nextOpen) setFocusedIndex(0);
            }}
            onKeyDown={handleMenuKeyDown}
            aria-haspopup="menu"
            aria-expanded={isOpen}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-[#1F190D] hover:bg-[#282112] border border-[#3D331B]/80 text-xs text-[#EADFC4] focus:outline-none focus:ring-2 focus:ring-[#FFBE0B] transition-colors cursor-pointer"
          >
            <span className="font-medium truncate text-white">{selectedWorkspace.name}</span>
            <ChevronDown 
              size={14} 
              className={`text-[#A69B82] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#FFBE0B]' : ''}`} 
            />
          </button>

          {/* Dropdown Menu (full width, sits above sidebar items) */}
          {isOpen && (
            <div
              role="menu"
              aria-orientation="vertical"
              className="absolute top-full left-0 right-0 mt-1.5 w-full bg-[#352D19] border border-[#4E4122] rounded-[12px] p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100"
            >
              {/* Workspace Options */}
              <div className="space-y-0.5">
                {WORKSPACES.map((ws, index) => {
                  const isSelected = ws.id === selectedWorkspace.id;
                  return (
                    <button
                      key={ws.id}
                      ref={el => { itemRefs.current[index] = el; }}
                      role="menuitem"
                      type="button"
                      onClick={() => handleSelectWorkspace(ws)}
                      onKeyDown={handleMenuKeyDown}
                      tabIndex={isOpen ? 0 : -1}
                      className={`w-full flex items-center justify-between p-2 rounded-[8px] text-left text-xs transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#FFBE0B] ${
                        isSelected
                          ? 'bg-[#FFBE0B]/20 text-white font-semibold'
                          : 'text-[#EADFC4] hover:bg-[#FFBE0B]/15 hover:text-white'
                      }`}
                    >
                      <div className="truncate min-w-0 pr-2">
                        <div className="font-medium truncate leading-tight">{ws.name}</div>
                        <div className="text-[10px] text-[#A69B82] truncate mt-0.5 leading-tight">{ws.type}</div>
                      </div>
                      {isSelected && <Check size={14} className="text-[#FFBE0B] shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="my-1.5 border-t border-[#4E4122]" role="separator" />

              {/* Action Buttons */}
              <div className="space-y-0.5">
                <button
                  ref={el => { itemRefs.current[3] = el; }}
                  role="menuitem"
                  type="button"
                  onClick={handleAddWorkspace}
                  onKeyDown={handleMenuKeyDown}
                  tabIndex={isOpen ? 0 : -1}
                  className="w-full flex items-center gap-2 p-2 rounded-[8px] text-xs text-[#EADFC4] hover:bg-[#FFBE0B]/15 hover:text-white focus:outline-none focus:ring-1 focus:ring-[#FFBE0B] transition-colors cursor-pointer"
                >
                  <Plus size={13} className="text-[#FFBE0B] shrink-0" />
                  <span>+ Add workspace</span>
                </button>

                <button
                  ref={el => { itemRefs.current[4] = el; }}
                  role="menuitem"
                  type="button"
                  onClick={handleWorkspaceSettings}
                  onKeyDown={handleMenuKeyDown}
                  tabIndex={isOpen ? 0 : -1}
                  className="w-full flex items-center gap-2 p-2 rounded-[8px] text-xs text-[#EADFC4] hover:bg-[#FFBE0B]/15 hover:text-white focus:outline-none focus:ring-1 focus:ring-[#FFBE0B] transition-colors cursor-pointer"
                >
                  <Settings size={13} className="text-[#A69B82] shrink-0" />
                  <span>Workspace settings</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nav List with hidden scrollbar */}
      <nav 
        className="flex-1 px-3 py-3 space-y-1 overflow-y-auto no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {navItems.map(item => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all duration-150 group ${
                isActive
                  ? 'bg-[#FFBE0B] text-[#2A2312] font-semibold shadow-sm'
                  : 'text-[#D5C9B3] hover:text-white hover:bg-[#3D331B]/50'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={`${isActive ? 'text-[#2A2312]' : 'text-[#A69B82] group-hover:text-white'} transition-colors shrink-0`}>
                  {item.icon}
                </span>
                <div className="truncate">
                  <div className="text-xs font-semibold leading-tight truncate">
                    {item.label}
                  </div>
                  <div className={`text-[10px] leading-tight truncate mt-0.5 ${isActive ? 'text-[#2A2312]/80' : 'text-[#8C8066]'}`}>
                    {item.sub}
                  </div>
                </div>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 tabular-nums ${
                    isActive
                      ? 'bg-[#2A2312] text-[#FFBE0B]'
                      : item.badgeAlert
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-[#FFBE0B]/20 text-[#FFBE0B] border border-[#FFBE0B]/30'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Client Portal Quick Switch Banner */}
      <div className="p-3 border-t border-[#3D331B]">
        <div className="p-3 rounded-xl bg-gradient-to-br from-[#3D331B] to-[#1F190D] border border-[#FFBE0B]/30 text-white mb-3">
          <div className="text-[11px] font-semibold text-[#FFBE0B] mb-1">
            <span>CLIENT SIMULATOR</span>
          </div>
          <p className="text-xs text-[#D5C9B3] mb-2 leading-tight">
            Preview Rahim Khan&apos;s mobile/desktop portal
          </p>
          <button
            onClick={onSwitchToClientPortal}
            className="w-full flex items-center justify-center gap-1.5 text-xs font-bold py-1.5 px-3 rounded-lg bg-[#FFBE0B] text-[#2A2312] hover:bg-[#F3B300] transition-colors"
          >
            <span>Open Client Portal</span>
            <ExternalLink size={13} />
          </button>
        </div>

        {/* Practitioner User Profile */}
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs text-[#D5C9B3]">
          <div className="w-8 h-8 rounded-full bg-[#FFBE0B]/20 border border-[#FFBE0B]/40 text-[#FFBE0B] font-bold flex items-center justify-center shrink-0">
            ER
          </div>
          <div className="truncate flex-1">
            <div className="font-semibold text-white truncate">Elena Rostova</div>
            <div className="text-[10px] text-[#A69B82] truncate">Solo Practitioner (Owner)</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
