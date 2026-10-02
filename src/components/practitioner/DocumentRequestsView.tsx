import React, { useState } from 'react';
import { 
  FileCheck2, 
  Send, 
  Plus, 
  Filter, 
  Search, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileText, 
  Settings2, 
  Calendar, 
  MessageSquare, 
  RefreshCw 
} from 'lucide-react';
import { DocumentItem, CaseRecord } from '../../types';
import { DocStatusBadge } from '../common/Badge';
import { ProgressRing } from '../common/ProgressRing';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';

interface DocumentRequestsViewProps {
  documents: DocumentItem[];
  cases: CaseRecord[];
  onApproveDocument: (docId: string) => void;
  onRequestFix: (docId: string, reason: string) => void;
  onPreviewDocument: (doc: DocumentItem) => void;
  onSendReminderModal: (clientName: string, caseTitle: string) => void;
  onOpenNewDocRequest: () => void;
}

export const DocumentRequestsView: React.FC<DocumentRequestsViewProps> = ({
  documents,
  cases,
  onApproveDocument,
  onRequestFix,
  onPreviewDocument,
  onSendReminderModal,
  onOpenNewDocRequest
}) => {
  const { addToast } = useToast();
  const [selectedCaseId, setSelectedCaseId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Fix Request Dialog state
  const [fixTargetDoc, setFixTargetDoc] = useState<DocumentItem | null>(null);
  const [fixReason, setFixReason] = useState('');

  // Auto-reminder schedule states
  const [scheduleConfig, setScheduleConfig] = useState({
    threeDaysBefore: true,
    oneDayBefore: true,
    onOverdueDaily: true,
    channels: { email: true, sms: true, whatsapp: true },
    customMessage: 'Hi {ClientFirstName}, Elena here from Apex Legal. A friendly reminder to upload your remaining required documents by {DueDate} so we can submit your file on schedule.'
  });

  const filteredDocs = documents.filter(doc => {
    const matchesCase = selectedCaseId === 'all' || doc.caseId === selectedCaseId;
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.fileName && doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCase && matchesStatus && matchesSearch;
  });

  const totalCount = documents.length;
  const approvedCount = documents.filter(d => d.status === 'approved').length;
  const uploadedReviewCount = documents.filter(d => d.status === 'uploaded').length;
  const needsFixCount = documents.filter(d => d.status === 'needs_fix').length;
  const pendingCount = documents.filter(d => d.status === 'pending').length;

  const overallProgress = totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0;

  const handleOpenFixDialog = (doc: DocumentItem) => {
    setFixTargetDoc(doc);
    setFixReason(doc.fixReason || 'The uploaded file is blurry or missing the required pages. Please re-upload in clear color.');
  };

  const handleConfirmFix = () => {
    if (!fixTargetDoc) return;
    onRequestFix(fixTargetDoc.id, fixReason);
    addToast('warning', 'Fix requested from client', `Client notified via SMS & Portal: "${fixReason}"`);
    setFixTargetDoc(null);
  };

  const handleBulkRemind = () => {
    addToast('success', 'Automated reminders dispatched', 'Sent friendly nudge via SMS, WhatsApp & Email to all clients with pending items.');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Hero Metric & Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-[#EADFC4] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <ProgressRing
            progress={overallProgress}
            size={72}
            strokeWidth={6}
            showLabel={true}
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-[#6B6147] uppercase tracking-wider">
                DOCUMENT CHASE ENGINE
              </span>
              <span className="text-xs bg-[#FFF3CC] text-[#2A2312] px-2 py-0.5 rounded font-semibold border border-[#FFE58A]">
                Auto-reminders active
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#2A2312]">
              {approvedCount} of {totalCount} total documents collected ({overallProgress}%)
            </h2>
            <p className="text-xs text-[#6B6147] mt-1 max-w-xl">
              Chasefree automatically verifies format & size, follows up on client deadlines, and lets you approve or request fixes with 1 click.
            </p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            icon={<Settings2 size={14} />}
            onClick={() => setShowScheduleModal(true)}
          >
            Reminder Cadence
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<Send size={14} />}
            onClick={handleBulkRemind}
          >
            Bulk Remind
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={15} />}
            onClick={onOpenNewDocRequest}
          >
            Request Documents
          </Button>
        </div>
      </div>

      {/* Triage Status Pills & Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setStatusFilter(statusFilter === 'uploaded' ? 'all' : 'uploaded')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'uploaded'
              ? 'bg-[#FFF3CC] border-[#FFBE0B] shadow-xs'
              : 'bg-white border-[#EADFC4] hover:bg-[#FAF7F0]'
          }`}
        >
          <div className="text-[11px] font-bold text-[#6B6147] flex items-center justify-between">
            <span>Awaiting Review</span>
            <FileText size={14} className="text-[#2A2312]" />
          </div>
          <div className="text-2xl font-bold text-[#2A2312] mt-1 tabular-nums">
            {uploadedReviewCount}
          </div>
          <div className="text-[10px] text-[#6B6147] mt-0.5">Needs practitioner check</div>
        </button>

        <button
          onClick={() => setStatusFilter(statusFilter === 'needs_fix' ? 'all' : 'needs_fix')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'needs_fix'
              ? 'bg-amber-100/70 border-amber-300 shadow-xs'
              : 'bg-white border-[#EADFC4] hover:bg-[#FAF7F0]'
          }`}
        >
          <div className="text-[11px] font-bold text-[#6B6147] flex items-center justify-between">
            <span>Needs Fix</span>
            <AlertCircle size={14} className="text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-900 mt-1 tabular-nums">
            {needsFixCount}
          </div>
          <div className="text-[10px] text-[#6B6147] mt-0.5">Client notified to re-upload</div>
        </button>

        <button
          onClick={() => setStatusFilter(statusFilter === 'pending' ? 'all' : 'pending')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'pending'
              ? 'bg-[#FAF7F0] border-[#FFBE0B] shadow-xs'
              : 'bg-white border-[#EADFC4] hover:bg-[#FAF7F0]'
          }`}
        >
          <div className="text-[11px] font-bold text-[#6B6147] flex items-center justify-between">
            <span>Waiting on Client</span>
            <Clock size={14} className="text-[#6B6147]" />
          </div>
          <div className="text-2xl font-bold text-[#2A2312] mt-1 tabular-nums">
            {pendingCount}
          </div>
          <div className="text-[10px] text-[#6B6147] mt-0.5">In auto-chase queue</div>
        </button>

        <button
          onClick={() => setStatusFilter(statusFilter === 'approved' ? 'all' : 'approved')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'approved'
              ? 'bg-emerald-50 border-emerald-300 shadow-xs'
              : 'bg-white border-[#EADFC4] hover:bg-[#FAF7F0]'
          }`}
        >
          <div className="text-[11px] font-bold text-[#6B6147] flex items-center justify-between">
            <span>Approved & Verified</span>
            <CheckCircle2 size={14} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-900 mt-1 tabular-nums">
            {approvedCount}
          </div>
          <div className="text-[10px] text-[#6B6147] mt-0.5">Ready for final submission</div>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#EADFC4] shadow-xs">
        <div className="flex items-center gap-2.5 flex-1 flex-wrap">
          <div className="relative min-w-[220px] flex-1 sm:flex-initial">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6147]" />
            <input
              type="text"
              placeholder="Search document name, format, or filename..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF7F0] border border-[#EADFC4] rounded-xl text-[#2A2312] focus:outline-none focus:border-[#FFBE0B]"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Filter size={14} className="text-[#6B6147]" />
            <select
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              aria-label="Filter documents by client case"
              className="text-xs bg-[#FAF7F0] border border-[#EADFC4] rounded-xl px-2.5 py-1.5 text-[#2A2312] focus:outline-none focus:border-[#FFBE0B]"
            >
              <option value="all">All Cases ({cases.length})</option>
              {cases.map(c => (
                <option key={c.id} value={c.id}>
                  {c.clientName} ({c.caseNumber})
                </option>
              ))}
            </select>
          </div>

          {statusFilter !== 'all' && (
            <button
              onClick={() => setStatusFilter('all')}
              className="text-xs font-semibold text-[#2A2312] bg-[#FAF7F0] hover:bg-[#EADFC4]/40 px-2 py-1 rounded-lg border border-[#EADFC4]"
            >
              Clear Status Filter ×
            </button>
          )}
        </div>

        <div className="text-xs text-[#6B6147] font-medium">
          Showing <strong className="text-[#2A2312] tabular-nums">{filteredDocs.length}</strong> items
        </div>
      </div>

      {/* Checklist Cards Grid */}
      <div className="space-y-3">
        {filteredDocs.map(doc => {
          const matchedCase = cases.find(c => c.id === doc.caseId);
          return (
            <div
              key={doc.id}
              className="p-4 rounded-2xl bg-white border border-[#EADFC4] hover:border-[#FFBE0B] transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-bold text-[#2A2312]">
                    {matchedCase?.clientName || 'Client'}
                  </span>
                  <span className="text-[11px] text-[#6B6147]">
                    ({matchedCase?.caseNumber || 'CAS'})
                  </span>
                  <span className="text-[11px] font-semibold text-[#6B6147] bg-[#FAF7F0] px-2 py-0.5 rounded border border-[#EADFC4]">
                    {doc.category}
                  </span>
                  <DocStatusBadge status={doc.status} size="sm" />
                </div>

                <h3 className="text-sm font-bold text-[#2A2312]">
                  {doc.name}
                </h3>
                <p className="text-xs text-[#6B6147] mt-0.5 line-clamp-1">
                  {doc.description}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-[#6B6147] mt-2 flex-wrap">
                  <span>Accepted: {doc.acceptedFormats.join(', ')}</span>
                  <span>·</span>
                  <span>Limit: {doc.maxSizeMb} MB</span>
                  <span>·</span>
                  <span className="font-mono tabular-nums font-medium">Due: {doc.dueDate}</span>
                </div>

                {/* Uploaded File details */}
                {doc.fileName && (
                  <div className="mt-2.5 p-2 rounded-lg bg-[#FAF7F0] border border-[#EADFC4]/60 inline-flex items-center gap-2 text-xs">
                    <FileText size={14} className="text-[#2A2312] shrink-0" />
                    <span className="font-semibold text-[#2A2312] truncate max-w-xs">{doc.fileName}</span>
                    <span className="text-[10px] text-[#6B6147]">({doc.fileSize})</span>
                    <button
                      onClick={() => onPreviewDocument(doc)}
                      className="text-[11px] font-bold text-[#2A2312] hover:underline ml-1"
                    >
                      Preview
                    </button>
                  </div>
                )}

                {/* If needs fix reason */}
                {doc.status === 'needs_fix' && doc.fixReason && (
                  <div className="mt-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-1.5">
                    <AlertCircle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Reason:</strong> {doc.fixReason}</span>
                  </div>
                )}
              </div>

              {/* Right Action buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                {doc.status === 'uploaded' && (
                  <>
                    <button
                      onClick={() => handleOpenFixDialog(doc)}
                      className="px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-200 transition-colors"
                    >
                      Request Fix...
                    </button>
                    <button
                      onClick={() => {
                        onApproveDocument(doc.id);
                        addToast('success', 'Document Approved', `${doc.name} marked as verified.`);
                      }}
                      className="px-3.5 py-1.5 text-xs font-semibold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 rounded-xl border border-emerald-300 flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <CheckCircle2 size={14} className="text-emerald-700" />
                      <span>Approve</span>
                    </button>
                  </>
                )}

                {doc.status === 'pending' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Send size={12} />}
                    onClick={() => onSendReminderModal(matchedCase?.clientName || 'Client', doc.name)}
                  >
                    Send Nudge
                  </Button>
                )}

                {doc.status === 'needs_fix' && (
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<RefreshCw size={12} />}
                    onClick={() => handleOpenFixDialog(doc)}
                  >
                    Update Note
                  </Button>
                )}

                {doc.status === 'approved' && (
                  <span className="text-xs text-emerald-800 font-bold px-3 py-1 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 size={13} className="text-emerald-600" />
                    Approved
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {filteredDocs.length === 0 && (
          <div className="bg-white p-12 text-center rounded-2xl border border-[#EADFC4]">
            <FileCheck2 size={36} className="text-[#6B6147] mx-auto mb-3 opacity-60" />
            <h3 className="text-sm font-bold text-[#2A2312]">No document requests found</h3>
            <p className="text-xs text-[#6B6147] mt-1 max-w-sm mx-auto">
              No requests match your current filters. You can dispatch new checklist requests using predefined templates.
            </p>
            <Button
              variant="primary"
              size="sm"
              className="mt-4"
              onClick={onOpenNewDocRequest}
            >
              Request from Template
            </Button>
          </div>
        )}
      </div>

      {/* Fix Request Modal */}
      {fixTargetDoc && (
        <Modal
          isOpen={true}
          onClose={() => setFixTargetDoc(null)}
          title="Flag Document for Correction"
          subtitle={`Instruct client on what to fix for "${fixTargetDoc.name}"`}
          maxWidth="md"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setFixTargetDoc(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleConfirmFix}>
                Send Fix Instructions
              </Button>
            </>
          }
        >
          <div className="space-y-3 text-xs">
            <p className="text-[#6B6147]">
              The client will see this note prominently on their mobile portal and receive a brief SMS/WhatsApp alert with a direct replacement link.
            </p>

            <div>
              <label className="font-semibold text-[#2A2312] block mb-1">
                Reason / Required Fix:
              </label>
              <textarea
                value={fixReason}
                onChange={(e) => setFixReason(e.target.value)}
                rows={4}
                className="w-full p-3 text-xs rounded-xl border border-[#EADFC4] bg-[#FAF7F0] text-[#2A2312] focus:outline-none focus:border-[#FFBE0B]"
                placeholder="e.g., The corners are cropped. Please take a top-down photo with all 4 corners visible..."
              />
            </div>

            <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#EADFC4] text-[11px] text-[#6B6147]">
              💡 <strong>Quick tip:</strong> Specific guidance reduces re-upload errors by 90%.
            </div>
          </div>
        </Modal>
      )}

      {/* Auto-Reminder Cadence Modal */}
      {showScheduleModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowScheduleModal(false)}
          title="Automated Reminder Schedule"
          subtitle="Configure multi-channel chase cadence (Email, SMS & WhatsApp)"
          maxWidth="lg"
          footer={
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setShowScheduleModal(false);
                addToast('success', 'Reminder schedule saved', 'Cadence updated across all active cases.');
              }}
            >
              Save Schedule
            </Button>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="space-y-2.5">
              <label className="font-bold text-[#2A2312] block">Follow-up Triggers:</label>
              
              <label className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F0] border border-[#EADFC4] cursor-pointer">
                <div>
                  <div className="font-bold text-[#2A2312]">3 Days Before Due Date</div>
                  <div className="text-[11px] text-[#6B6147]">Friendly gentle reminder with checklist summary</div>
                </div>
                <input
                  type="checkbox"
                  checked={scheduleConfig.threeDaysBefore}
                  onChange={(e) => setScheduleConfig({ ...scheduleConfig, threeDaysBefore: e.target.checked })}
                  className="w-4 h-4 text-[#FFBE0B] rounded accent-[#FFBE0B]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F0] border border-[#EADFC4] cursor-pointer">
                <div>
                  <div className="font-bold text-[#2A2312]">1 Day Before Due Date</div>
                  <div className="text-[11px] text-[#6B6147]">Urgent notice with direct mobile camera link</div>
                </div>
                <input
                  type="checkbox"
                  checked={scheduleConfig.oneDayBefore}
                  onChange={(e) => setScheduleConfig({ ...scheduleConfig, oneDayBefore: e.target.checked })}
                  className="w-4 h-4 text-[#FFBE0B] rounded accent-[#FFBE0B]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F0] border border-[#EADFC4] cursor-pointer">
                <div>
                  <div className="font-bold text-[#2A2312]">On Overdue (Daily Chase)</div>
                  <div className="text-[11px] text-[#6B6147]">Daily reminder until practitioner reviews or extends deadline</div>
                </div>
                <input
                  type="checkbox"
                  checked={scheduleConfig.onOverdueDaily}
                  onChange={(e) => setScheduleConfig({ ...scheduleConfig, onOverdueDaily: e.target.checked })}
                  className="w-4 h-4 text-[#FFBE0B] rounded accent-[#FFBE0B]"
                />
              </label>
            </div>

            <div>
              <label className="font-bold text-[#2A2312] block mb-1">Friendly Default Message Template:</label>
              <textarea
                value={scheduleConfig.customMessage}
                onChange={(e) => setScheduleConfig({ ...scheduleConfig, customMessage: e.target.value })}
                rows={3}
                className="w-full p-2.5 text-xs rounded-xl border border-[#EADFC4] bg-[#FAF7F0] text-[#2A2312]"
              />
              <span className="text-[10px] text-[#6B6147]">Variables supported: {'{ClientFirstName}'}, {'{DueDate}'}, {'{PortalLink}'}</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
