import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Clock, 
  Send, 
  Eye, 
  Download, 
  Calendar, 
  MessageSquare, 
  CreditCard, 
  ExternalLink,
  ShieldCheck,
  UserCheck,
  FileCheck2,
  AlertTriangle,
  History
} from 'lucide-react';
import { CaseRecord, DocumentItem, CaseDeadline, MessageRecord, DocStatus } from '../../types';
import { DocStatusBadge, CaseStatusBadge, DeadlineTypeBadge } from '../common/Badge';
import { ProgressRing } from '../common/ProgressRing';
import { Button } from '../common/Button';
import { useToast } from '../common/Toast';

interface CaseDetailDrawerProps {
  caseRecord: CaseRecord | null;
  documents: DocumentItem[];
  deadlines: CaseDeadline[];
  messages: MessageRecord[];
  isOpen: boolean;
  onClose: () => void;
  onApproveDocument: (docId: string) => void;
  onRequestFix: (docId: string, reason: string) => void;
  onPreviewDocument: (doc: DocumentItem) => void;
  onSendReminder: (clientName: string, caseTitle: string) => void;
  onSwitchToClientPortal: () => void;
}

export const CaseDetailDrawer: React.FC<CaseDetailDrawerProps> = ({
  caseRecord,
  documents,
  deadlines,
  messages,
  isOpen,
  onClose,
  onApproveDocument,
  onRequestFix,
  onPreviewDocument,
  onSendReminder,
  onSwitchToClientPortal
}) => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'checklist' | 'deadlines' | 'messages' | 'billing' | 'activity'>('checklist');
  
  // Fix request modal state
  const [fixModalDoc, setFixModalDoc] = useState<DocumentItem | null>(null);
  const [fixReasonInput, setFixReasonInput] = useState('');

  if (!isOpen || !caseRecord) return null;

  const caseDocs = documents.filter(d => d.caseId === caseRecord.id);
  const caseDeadlines = deadlines.filter(d => d.caseId === caseRecord.id);
  const caseMessages = messages.filter(m => m.caseId === caseRecord.id);

  const approvedCount = caseDocs.filter(d => d.status === 'approved').length;
  const progressPercent = caseDocs.length > 0 ? Math.round((approvedCount / caseDocs.length) * 100) : 0;

  const handleOpenFixModal = (doc: DocumentItem) => {
    setFixModalDoc(doc);
    setFixReasonInput(doc.fixReason || 'The uploaded file is blurry or missing required signatures. Please upload a clear color PDF.');
  };

  const handleConfirmFixRequest = () => {
    if (!fixModalDoc) return;
    onRequestFix(fixModalDoc.id, fixReasonInput);
    addToast('warning', 'Fix requested from client', `Client notified via SMS & Portal: "${fixReasonInput}"`);
    setFixModalDoc(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#2A2312]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-2xl bg-white shadow-2xl border-l border-[#EADFC4] flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#EADFC4] bg-[#FAF7F0] flex items-start justify-between">
            <div className="min-w-0 pr-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-[#6B6147]">
                  {caseRecord.caseNumber}
                </span>
                <CaseStatusBadge status={caseRecord.status} />
                <span className="text-xs text-[#6B6147]">
                  Lead: {caseRecord.leadPractitioner}
                </span>
              </div>
              <h2 className="text-lg font-bold text-[#2A2312] truncate">
                {caseRecord.title}
              </h2>
              <div className="flex items-center gap-3 text-xs text-[#6B6147] mt-1">
                <span className="font-semibold text-[#2A2312]">{caseRecord.clientName}</span>
                <span>·</span>
                <span>{caseRecord.clientEmail}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onSwitchToClientPortal}
                title="View as client in portal simulator"
                className="p-1.5 rounded-lg bg-white border border-[#EADFC4] hover:bg-[#FFBE0B] text-xs font-semibold text-[#2A2312] flex items-center gap-1 transition-colors"
              >
                <ExternalLink size={13} />
                <span className="hidden sm:inline">Client View</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#6B6147] hover:text-[#2A2312] hover:bg-[#EADFC4]/40 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 px-6 bg-white border-b border-[#EADFC4] overflow-x-auto text-xs font-semibold">
            {[
              { id: 'checklist', label: `Checklist (${approvedCount}/${caseDocs.length})` },
              { id: 'overview', label: 'Overview' },
              { id: 'deadlines', label: `Deadlines (${caseDeadlines.length})` },
              { id: 'messages', label: `Messages (${caseMessages.length})` },
              { id: 'billing', label: 'Billing & Retainer' },
              { id: 'activity', label: 'Audit Trail' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-[#FFBE0B] text-[#2A2312] font-bold'
                    : 'border-transparent text-[#6B6147] hover:text-[#2A2312]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* TAB: CHECKLIST (HERO FEATURE) */}
            {activeTab === 'checklist' && (
              <div className="space-y-4">
                {/* Progress Card */}
                <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#EADFC4] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ProgressRing
                      progress={progressPercent}
                      size={48}
                      strokeWidth={4.5}
                      showLabel={true}
                    />
                    <div>
                      <h4 className="text-sm font-bold text-[#2A2312]">
                        {approvedCount} of {caseDocs.length} Documents Approved
                      </h4>
                      <p className="text-xs text-[#6B6147]">
                        {caseDocs.filter(d => d.status === 'needs_fix').length > 0
                          ? '1 item flagged for client correction'
                          : 'Auto-reminders active for remaining documents'}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    icon={<Send size={13} />}
                    onClick={() => onSendReminder(caseRecord.clientName, caseRecord.title)}
                  >
                    Send 1-Click Reminder
                  </Button>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  {caseDocs.map(doc => (
                    <div
                      key={doc.id}
                      className="p-4 rounded-xl bg-white border border-[#EADFC4] hover:border-[#FFBE0B]/80 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B6147]">
                              {doc.category}
                            </span>
                            <h4 className="text-sm font-bold text-[#2A2312]">
                              {doc.name}
                            </h4>
                          </div>
                          <DocStatusBadge status={doc.status} />
                        </div>

                        <p className="text-xs text-[#6B6147] leading-relaxed">
                          {doc.description}
                        </p>

                        <div className="flex items-center gap-3 text-[11px] text-[#6B6147] mt-2">
                          <span>Formats: {doc.acceptedFormats.join(', ')}</span>
                          <span>·</span>
                          <span>Max: {doc.maxSizeMb} MB</span>
                          <span>·</span>
                          <span className="tabular-nums">Due: {doc.dueDate}</span>
                        </div>

                        {/* If uploaded or needs fix, show file chip */}
                        {doc.fileName && (
                          <div className="mt-3 p-2.5 rounded-lg bg-[#FAF7F0] border border-[#EADFC4]/60 flex items-center justify-between">
                            <div className="flex items-center gap-2 min-w-0">
                              <FileText size={16} className="text-[#2A2312] shrink-0" />
                              <div className="truncate">
                                <div className="text-xs font-semibold text-[#2A2312] truncate">
                                  {doc.fileName}
                                </div>
                                <div className="text-[10px] text-[#6B6147]">
                                  {doc.fileSize} · Uploaded {doc.uploadedAt}
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => onPreviewDocument(doc)}
                              className="px-2 py-1 text-xs font-medium text-[#2A2312] hover:bg-white rounded border border-[#EADFC4] flex items-center gap-1 transition-colors"
                            >
                              <Eye size={12} />
                              <span>Preview</span>
                            </button>
                          </div>
                        )}

                        {/* If needs fix reason */}
                        {doc.status === 'needs_fix' && doc.fixReason && (
                          <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                            <AlertCircle size={15} className="text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <strong className="font-semibold block">Requested fix note:</strong>
                              <p className="mt-0.5">{doc.fixReason}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-[#EADFC4]/60">
                        {doc.status !== 'approved' && (
                          <>
                            <button
                              onClick={() => handleOpenFixModal(doc)}
                              className="px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors"
                            >
                              Request Fix...
                            </button>
                            <button
                              onClick={() => onApproveDocument(doc.id)}
                              className="px-3 py-1.5 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 flex items-center gap-1 transition-colors"
                            >
                              <CheckCircle2 size={13} className="text-emerald-700" />
                              <span>Approve Document</span>
                            </button>
                          </>
                        )}
                        {doc.status === 'approved' && (
                          <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1">
                            <CheckCircle2 size={14} /> Approved & Verified
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#EADFC4]">
                  <h4 className="font-bold text-sm text-[#2A2312] mb-2">Case Summary</h4>
                  <p className="text-[#6B6147] leading-relaxed mb-3">
                    {caseRecord.notes}
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#EADFC4]/60">
                    <div>
                      <span className="text-[#6B6147]">Target Submission:</span>
                      <p className="font-bold text-[#2A2312] tabular-nums">{caseRecord.targetSubmissionDate}</p>
                    </div>
                    <div>
                      <span className="text-[#6B6147]">Case Reference:</span>
                      <p className="font-bold text-[#2A2312]">{caseRecord.caseNumber}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#EADFC4]">
                  <h4 className="font-bold text-sm text-[#2A2312] mb-2">Automated Chase Schedule</h4>
                  <p className="text-[#6B6147] mb-3">
                    Chasefree delivers scheduled reminders via WhatsApp & Email until all required items are verified.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded bg-[#FAF7F0]">
                      <span>3 Days Before Due Date</span>
                      <span className="font-bold text-emerald-700">Scheduled</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-[#FAF7F0]">
                      <span>1 Day Before Due Date</span>
                      <span className="font-bold text-emerald-700">Scheduled</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-[#FAF7F0]">
                      <span>On Overdue (Daily Chase)</span>
                      <span className="font-bold text-emerald-700">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: DEADLINES */}
            {activeTab === 'deadlines' && (
              <div className="space-y-3">
                {caseDeadlines.map(dl => (
                  <div key={dl.id} className="p-4 rounded-xl bg-white border border-[#EADFC4]">
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="text-sm font-bold text-[#2A2312]">{dl.title}</h4>
                      <DeadlineTypeBadge type={dl.type} />
                    </div>
                    <p className="text-xs text-[#6B6147] mb-2">{dl.description}</p>
                    <div className="flex items-center justify-between text-xs text-[#6B6147] pt-2 border-t border-[#EADFC4]/60">
                      <span className="font-mono tabular-nums font-bold text-[#2A2312]">Cut-off: {dl.date}</span>
                      <span className="text-emerald-700 font-semibold">Client auto-notified</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB: MESSAGES */}
            {activeTab === 'messages' && (
              <div className="space-y-3">
                <div className="space-y-3">
                  {caseMessages.map(msg => (
                    <div
                      key={msg.id}
                      className={`p-3.5 rounded-xl text-xs max-w-[85%] ${
                        msg.sender === 'practitioner'
                          ? 'ml-auto bg-[#2A2312] text-white'
                          : 'bg-[#FAF7F0] text-[#2A2312] border border-[#EADFC4]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 mb-1 text-[10px] opacity-75">
                        <span className="font-bold">{msg.senderName}</span>
                        <span className="font-mono">{msg.timestamp}</span>
                      </div>
                      <p className="leading-relaxed">{msg.content}</p>
                      {msg.attachmentName && (
                        <div className="mt-2 p-2 rounded bg-black/10 flex items-center gap-1.5 text-[11px]">
                          <FileText size={13} />
                          <span className="truncate">{msg.attachmentName} ({msg.attachmentSize})</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: BILLING */}
            {activeTab === 'billing' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#EADFC4]">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-sm text-[#2A2312]">Retainer Agreement</h4>
                    <span className="font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      E-Signed & Certified
                    </span>
                  </div>
                  <p className="text-[#6B6147] mb-2">
                    Signed by Rahim Khan on 2026-09-16 11:42 (IP: 142.250.80.45). Audit hash verified.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#EADFC4]">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-sm text-[#2A2312]">Invoice INV-2026-089</h4>
                    <span className="font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      Paid · $1,250.00 CAD
                    </span>
                  </div>
                  <p className="text-[#6B6147]">
                    Settled via Stripe Credit Card on Sept 24, 2026.
                  </p>
                </div>
              </div>
            )}

            {/* TAB: ACTIVITY */}
            {activeTab === 'activity' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#EADFC4]">
                  <div className="font-bold text-[#2A2312]">Elena Rostova requested fix on Employer Reference Letter</div>
                  <div className="text-[11px] text-[#6B6147]">Today 09:10 · IP: 198.51.100.22</div>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#EADFC4]">
                  <div className="font-bold text-[#2A2312]">Rahim Khan uploaded bank statement</div>
                  <div className="text-[11px] text-[#6B6147]">Today 08:15 · Magic link portal</div>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#EADFC4]">
                  <div className="font-bold text-[#2A2312]">IRCC Portal Checklist Template applied</div>
                  <div className="text-[11px] text-[#6B6147]">2026-09-15 10:14 · Auto-created case</div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[#EADFC4] bg-[#FAF7F0] flex items-center justify-between">
            <span className="text-xs text-[#6B6147]">
              Next deadline: <strong className="text-[#2A2312]">{caseRecord.nextDeadline.date}</strong>
            </span>
            <Button
              variant="primary"
              size="sm"
              onClick={onClose}
            >
              Done Reviewing
            </Button>
          </div>
        </div>
      </div>

      {/* Fix Request Reason Dialog */}
      {fixModalDoc && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setFixModalDoc(null)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-md w-full border border-[#EADFC4] shadow-2xl z-10 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-[#2A2312] mb-1">
              Request Document Fix from Client
            </h3>
            <p className="text-xs text-[#6B6147] mb-3">
              Item: <strong>{fixModalDoc.name}</strong>. The client will receive this note directly in their portal and via SMS/Email.
            </p>

            <label className="text-xs font-semibold text-[#2A2312] block mb-1">
              Plain-language instructions for the client:
            </label>
            <textarea
              value={fixReasonInput}
              onChange={(e) => setFixReasonInput(e.target.value)}
              rows={4}
              className="w-full text-xs p-3 rounded-xl border border-[#EADFC4] bg-[#FAF7F0] text-[#2A2312] focus:outline-none focus:border-[#FFBE0B] mb-4"
              placeholder="Explain clearly what needs to be fixed..."
            />

            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setFixModalDoc(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleConfirmFixRequest}>
                Send Fix Request
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
