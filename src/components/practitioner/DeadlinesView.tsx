import React, { useState } from 'react';
import { 
  CalendarClock, 
  Calendar, 
  List, 
  Plus, 
  AlertTriangle, 
  Clock, 
  Send, 
  BellRing,
  Filter,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { CaseDeadline, CaseRecord, DeadlineType } from '../../types';
import { DeadlineTypeBadge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';

interface DeadlinesViewProps {
  deadlines: CaseDeadline[];
  cases: CaseRecord[];
  onAddDeadline: (newDeadline: CaseDeadline) => void;
  onSendReminderModal: (clientName: string, caseTitle: string) => void;
}

export const DeadlinesView: React.FC<DeadlinesViewProps> = ({
  deadlines,
  cases,
  onAddDeadline,
  onSendReminderModal
}) => {
  const { addToast } = useToast();
  const [viewMode, setViewMode] = useState<'agenda' | 'calendar'>('agenda');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New deadline form state
  const [newTitle, setNewTitle] = useState('');
  const [newCaseId, setNewCaseId] = useState(cases[0]?.id || '');
  const [newDate, setNewDate] = useState('2026-10-15');
  const [newType, setNewType] = useState<DeadlineType>('filing_deadline');
  const [newDescription, setNewDescription] = useState('');

  const overdueDeadlines = deadlines.filter(d => d.isOverdue);
  const upcomingDeadlines = deadlines.filter(d => !d.isOverdue);

  const filteredUpcoming = upcomingDeadlines.filter(d => 
    typeFilter === 'all' || d.type === typeFilter
  );

  const handleCreateDeadline = () => {
    if (!newTitle.trim()) {
      addToast('warning', 'Please provide a deadline title');
      return;
    }
    const deadlineObj: CaseDeadline = {
      id: `dl-${Date.now()}`,
      caseId: newCaseId,
      title: newTitle,
      date: newDate,
      type: newType,
      description: newDescription || 'Statutory submission cut-off.',
      autoRemindDaysBefore: [7, 3, 1],
      clientNotified: true,
      isOverdue: false
    };
    onAddDeadline(deadlineObj);
    addToast('success', 'Deadline Created', `Auto-reminders scheduled for ${newDate}.`);
    setShowAddModal(false);
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#EADFC4] shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-[#2A2312] flex items-center gap-2">
            <CalendarClock size={22} className="text-[#FFBE0B]" />
            Deadlines & Statutory Cutoffs
          </h2>
          <p className="text-xs text-[#6B6147] mt-0.5">
            Never miss an IRCC cut-off, CRA tax deadline, or court conferral date.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Agenda vs Calendar Switch */}
          <div className="flex items-center bg-[#FAF7F0] p-1 rounded-xl border border-[#EADFC4]">
            <button
              onClick={() => setViewMode('agenda')}
              className={`p-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'agenda' ? 'bg-white text-[#2A2312] shadow-xs' : 'text-[#6B6147] hover:text-[#2A2312]'
              }`}
            >
              <List size={14} />
              <span>Agenda List</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'calendar' ? 'bg-white text-[#2A2312] shadow-xs' : 'text-[#6B6147] hover:text-[#2A2312]'
              }`}
            >
              <Calendar size={14} />
              <span>Month Grid</span>
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={15} />}
            onClick={() => setShowAddModal(true)}
          >
            Add Deadline
          </Button>
        </div>
      </div>

      {/* OVERDUE ALERT BANNER */}
      {overdueDeadlines.length > 0 && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-900 mb-2">
            <AlertTriangle size={16} className="text-rose-600" />
            <span>CRITICAL: OVERDUE STATUTORY DEADLINES ({overdueDeadlines.length})</span>
          </div>

          <div className="space-y-2.5">
            {overdueDeadlines.map(od => {
              const matchedCase = cases.find(c => c.id === od.caseId);
              return (
                <div
                  key={od.id}
                  className="bg-white p-3.5 rounded-xl border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-rose-950">
                        {od.title}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                        Expired on {od.date}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B6147] mt-0.5">
                      Case: <strong>{matchedCase?.clientName}</strong> ({matchedCase?.title})
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="danger"
                      size="sm"
                      icon={<Send size={13} />}
                      onClick={() => onSendReminderModal(matchedCase?.clientName || 'Client', od.title)}
                    >
                      Urgent Nudge
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter Row */}
      <div className="flex items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#EADFC4]">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[#6B6147]" />
          <span className="text-xs font-bold text-[#2A2312]">Category Filter:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs bg-[#FAF7F0] border border-[#EADFC4] rounded-xl px-2.5 py-1 text-[#2A2312] focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="filing_deadline">🏛️ Statutory Filing</option>
            <option value="client_deadline">⏳ Client Due Date</option>
            <option value="hearing_date">⚖️ Hearing / Conferral</option>
            <option value="renewal_expiry">⚠️ Permit Expiry</option>
          </select>
        </div>

        <div className="text-xs text-[#6B6147]">
          Showing <strong className="text-[#2A2312] tabular-nums">{filteredUpcoming.length}</strong> upcoming deadlines
        </div>
      </div>

      {/* AGENDA LIST VIEW */}
      {viewMode === 'agenda' && (
        <div className="space-y-3">
          {filteredUpcoming.map(dl => {
            const matchedCase = cases.find(c => c.id === dl.caseId);
            return (
              <div
                key={dl.id}
                className="p-4 rounded-2xl bg-white border border-[#EADFC4] hover:border-[#FFBE0B] transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <DeadlineTypeBadge type={dl.type} />
                    <span className="text-xs font-semibold text-[#6B6147]">
                      {matchedCase?.clientName} ({matchedCase?.caseNumber})
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#2A2312]">
                    {dl.title}
                  </h3>
                  {dl.description && (
                    <p className="text-xs text-[#6B6147] mt-0.5 max-w-2xl">
                      {dl.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-[#6B6147] mt-2">
                    <span className="font-mono tabular-nums font-bold text-[#2A2312] flex items-center gap-1">
                      <Clock size={13} className="text-[#FFBE0B]" />
                      Date: {dl.date}
                    </span>
                    <span>·</span>
                    <span>Auto-reminders: 7d, 3d, 1d before</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Send size={12} />}
                    onClick={() => onSendReminderModal(matchedCase?.clientName || 'Client', dl.title)}
                  >
                    Send Reminder
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MONTH GRID VIEW */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-2xl border border-[#EADFC4] shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#2A2312]">October 2026</h3>
            <div className="flex items-center gap-1 text-xs text-[#6B6147]">
              <span>Sync with Google/Outlook Calendar</span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-[#6B6147] mb-2 pb-2 border-b border-[#EADFC4]">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-xs">
            {Array.from({ length: 35 }).map((_, i) => {
              const dayNum = i - 3;
              const isCurrentMonth = dayNum >= 1 && dayNum <= 31;
              const dateStr = `2026-10-${dayNum < 10 ? '0' + dayNum : dayNum}`;
              const dayDeadlines = deadlines.filter(d => d.date === dateStr);

              return (
                <div
                  key={i}
                  className={`min-h-[78px] p-1.5 rounded-xl border text-left flex flex-col justify-between transition-colors ${
                    isCurrentMonth ? 'bg-[#FAF7F0]/60 border-[#EADFC4]/60' : 'bg-transparent border-transparent opacity-20'
                  }`}
                >
                  <span className={`font-mono text-[10px] font-bold ${dayNum === 2 ? 'text-[#FFBE0B] font-extrabold' : 'text-[#6B6147]'}`}>
                    {isCurrentMonth ? dayNum : ''}
                  </span>

                  <div className="space-y-1 mt-1">
                    {dayDeadlines.map(d => (
                      <div
                        key={d.id}
                        className="p-1 rounded bg-[#FFBE0B]/20 border border-[#FFBE0B]/40 text-[9px] font-bold text-[#2A2312] truncate"
                        title={d.title}
                      >
                        {d.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Deadline Modal */}
      {showAddModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowAddModal(false)}
          title="Add New Case Deadline"
          subtitle="Set statutory cut-off with automated client reminder schedule"
          maxWidth="md"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleCreateDeadline}>
                Schedule Deadline
              </Button>
            </>
          }
        >
          <div className="space-y-3.5 text-xs">
            <div>
              <label className="font-semibold text-[#2A2312] block mb-1">
                Deadline Title:
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. IRCC Portal Document Cut-off"
                className="w-full p-2.5 text-xs rounded-xl border border-[#EADFC4] bg-[#FAF7F0] text-[#2A2312] focus:outline-none focus:border-[#FFBE0B]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-[#2A2312] block mb-1">
                  Assign to Case:
                </label>
                <select
                  value={newCaseId}
                  onChange={(e) => setNewCaseId(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-[#EADFC4] bg-[#FAF7F0] text-[#2A2312]"
                >
                  {cases.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.clientName} ({c.caseNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-[#2A2312] block mb-1">
                  Due Date:
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-[#EADFC4] bg-[#FAF7F0] text-[#2A2312]"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-[#2A2312] block mb-1">
                Deadline Category:
              </label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
                className="w-full p-2.5 text-xs rounded-xl border border-[#EADFC4] bg-[#FAF7F0] text-[#2A2312]"
              >
                <option value="filing_deadline">🏛️ Statutory Filing Window</option>
                <option value="client_deadline">⏳ Client Document Cut-off</option>
                <option value="hearing_date">⚖️ Hearing / Conferral Date</option>
                <option value="renewal_expiry">⚠️ Visa / Permit Expiry</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-[#2A2312] block mb-1">
                Internal Notes or Statutory Reference:
              </label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                rows={2}
                placeholder="Reference IRCC section or CRA corporate installment code..."
                className="w-full p-2.5 text-xs rounded-xl border border-[#EADFC4] bg-[#FAF7F0] text-[#2A2312]"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
