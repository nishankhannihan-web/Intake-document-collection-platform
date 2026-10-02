import React, { useState, useEffect } from 'react';
import { 
  ViewMode, 
  CaseRecord, 
  DocumentItem, 
  CaseDeadline, 
  ClientProfile, 
  MessageRecord,
  InvoiceRecord,
  RetainerRecord,
  DocStatus,
  CaseStatus
} from './types';
import { 
  INITIAL_CASES, 
  INITIAL_CLIENTS, 
  INITIAL_DOCUMENTS, 
  INITIAL_DEADLINES, 
  INITIAL_MESSAGES,
  INITIAL_INVOICES,
  INITIAL_RETAINERS 
} from './mockData';
import { ToastProvider, useToast } from './components/common/Toast';
import { CommandPalette } from './components/common/CommandPalette';
import { Modal } from './components/common/Modal';
import { Button } from './components/common/Button';
import { Sidebar } from './components/practitioner/Sidebar';
import { TopBar } from './components/practitioner/TopBar';
import { TodayView } from './components/practitioner/TodayView';
import { CasesView } from './components/practitioner/CasesView';
import { CaseDetailDrawer } from './components/practitioner/CaseDetailDrawer';
import { DocumentRequestsView } from './components/practitioner/DocumentRequestsView';
import { DeadlinesView } from './components/practitioner/DeadlinesView';
import { ClientsView } from './components/practitioner/ClientsView';
import { IntakeFormsView } from './components/practitioner/IntakeFormsView';
import { MessagesView } from './components/practitioner/MessagesView';
import { BillingView } from './components/practitioner/BillingView';
import { TemplatesView } from './components/practitioner/TemplatesView';
import { SettingsView } from './components/practitioner/SettingsView';
import { ClientPortal } from './components/client/ClientPortal';
import { 
  FileText, 
  Download, 
  Send, 
  Check, 
  Copy, 
  ExternalLink, 
  ShieldCheck, 
  Share2 
} from 'lucide-react';

function AppContent() {
  const { addToast } = useToast();

  // Primary App Mode: Practitioner Workspace vs Client Portal Simulator
  const [appMode, setAppMode] = useState<'practitioner' | 'client'>('practitioner');
  const [currentView, setCurrentView] = useState<ViewMode>('today');

  // Shared Core Data State
  const [cases, setCases] = useState<CaseRecord[]>(INITIAL_CASES);
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [deadlines, setDeadlines] = useState<CaseDeadline[]>(INITIAL_DEADLINES);
  const [clients, setClients] = useState<ClientProfile[]>(INITIAL_CLIENTS);
  const [messages, setMessages] = useState<MessageRecord[]>(INITIAL_MESSAGES);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(INITIAL_INVOICES);
  const [retainers, setRetainers] = useState<RetainerRecord[]>(INITIAL_RETAINERS);

  // Modals & Slide-overs
  const [selectedCaseDetailId, setSelectedCaseDetailId] = useState<string | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);

  // Quick Action Modals
  const [reminderModalData, setReminderModalData] = useState<{ clientName: string; caseTitle: string } | null>(null);
  const [reminderChannel, setReminderChannel] = useState<'whatsapp' | 'sms' | 'email'>('whatsapp');
  const [customReminderMsg, setCustomReminderMsg] = useState('');

  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [newCaseClientName, setNewCaseClientName] = useState('');
  const [newCaseClientEmail, setNewCaseClientEmail] = useState('');
  const [newCaseTitle, setNewCaseTitle] = useState('');
  const [newCaseType, setNewCaseType] = useState<CaseRecord['caseType']>('immigration');

  const [showNewDocRequestModal, setShowNewDocRequestModal] = useState(false);
  const [requestTargetCaseId, setRequestTargetCaseId] = useState(cases[0]?.id || '');
  const [requestTemplateType, setRequestTemplateType] = useState('express_entry');

  const [showShareIntakeModal, setShowShareIntakeModal] = useState(false);
  const [copiedIntake, setCopiedIntake] = useState(false);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers for Document Review & Approvals
  const handleApproveDocument = (docId: string) => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === docId
          ? { ...doc, status: 'approved', approvedAt: new Date().toISOString() }
          : doc
      )
    );

    // Update case count
    const targetDoc = documents.find(d => d.id === docId);
    if (targetDoc) {
      setCases(prev =>
        prev.map(c => {
          if (c.id === targetDoc.caseId) {
            return {
              ...c,
              documentsCount: {
                ...c.documentsCount,
                approved: c.documentsCount.approved + 1,
                uploaded: Math.max(0, c.documentsCount.uploaded - 1)
              }
            };
          }
          return c;
        })
      );
    }
  };

  const handleRequestFix = (docId: string, reason: string) => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === docId
          ? {
              ...doc,
              status: 'needs_fix',
              fixReason: reason,
              fixRequestedAt: new Date().toISOString()
            }
          : doc
      )
    );

    const targetDoc = documents.find(d => d.id === docId);
    if (targetDoc) {
      setCases(prev =>
        prev.map(c => {
          if (c.id === targetDoc.caseId) {
            return {
              ...c,
              documentsCount: {
                ...c.documentsCount,
                needsFix: c.documentsCount.needsFix + 1,
                uploaded: Math.max(0, c.documentsCount.uploaded - 1)
              }
            };
          }
          return c;
        })
      );
    }
  };

  // Client Upload Simulation Handler
  const handleClientUploadDocument = (docId: string, fileName: string, fileSize: string) => {
    setDocuments(prev =>
      prev.map(d =>
        d.id === docId
          ? {
              ...d,
              status: 'uploaded',
              fileName,
              fileSize,
              uploadedAt: 'Just now'
            }
          : d
      )
    );

    const targetDoc = documents.find(d => d.id === docId);
    if (targetDoc) {
      setCases(prev =>
        prev.map(c => {
          if (c.id === targetDoc.caseId) {
            return {
              ...c,
              documentsCount: {
                ...c.documentsCount,
                uploaded: c.documentsCount.uploaded + 1,
                pending: Math.max(0, c.documentsCount.pending - 1)
              }
            };
          }
          return c;
        })
      );
    }
  };

  const handleClientSendMessage = (content: string) => {
    const newMsg: MessageRecord = {
      id: `msg-${Date.now()}`,
      caseId: 'cas-1',
      sender: 'client',
      senderName: 'Rahim Khan',
      content,
      timestamp: 'Just now',
      isRead: false
    };
    setMessages(prev => [...prev, newMsg]);
  };

  const handleSignRetainer = (retId: string, signeeName: string) => {
    setRetainers(prev =>
      prev.map(r =>
        r.id === retId
          ? {
              ...r,
              status: 'signed',
              signedDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
              signeeName
            }
          : r
      )
    );
  };

  const handlePayInvoice = (invId: string) => {
    setInvoices(prev =>
      prev.map(inv =>
        inv.id === invId
          ? {
              ...inv,
              status: 'paid',
              paidAt: 'Just now',
              paymentMethod: 'Credit Card (Stripe · Visa *4242)'
            }
          : inv
      )
    );
  };

  const handleAddDeadline = (newDl: CaseDeadline) => {
    setDeadlines(prev => [newDl, ...prev]);
  };

  const handleOpenReminderModal = (clientName: string, caseTitle: string) => {
    setReminderModalData({ clientName, caseTitle });
    setCustomReminderMsg(
      `Hi ${clientName.split(' ')[0]}, Elena here from Apex Legal. A friendly reminder to upload your remaining required documents by this Friday so we can file your application without delay.`
    );
  };

  const handleConfirmSendReminder = () => {
    if (!reminderModalData) return;
    addToast(
      'success',
      `Reminder Dispatched via ${reminderChannel.toUpperCase()}`,
      `Sent to ${reminderModalData.clientName} with direct magic link.`
    );
    setReminderModalData(null);
  };

  const handleCreateNewCase = () => {
    if (!newCaseClientName.trim() || !newCaseTitle.trim()) {
      addToast('warning', 'Please provide client name and case title');
      return;
    }
    const newCaseId = `cas-${Date.now()}`;
    const newCaseNumber = `CAS-${100 + cases.length + 1}`;
    const newCase: CaseRecord = {
      id: newCaseId,
      caseNumber: newCaseNumber,
      clientId: `cli-${Date.now()}`,
      clientName: newCaseClientName,
      clientEmail: newCaseClientEmail || 'client@example.com',
      title: newCaseTitle,
      caseType: newCaseType,
      status: 'collecting_docs',
      leadPractitioner: 'Elena Rostova, RCIC',
      createdAt: new Date().toISOString().slice(0, 10),
      targetSubmissionDate: '2026-11-15',
      documentsCount: { total: 4, approved: 0, uploaded: 0, needsFix: 0, pending: 4 },
      nextDeadline: {
        title: 'Initial Intake Document Cut-off',
        date: '2026-10-15',
        daysLeft: 15,
        isOverdue: false
      },
      notes: 'New case created manually. Default document checklist auto-assigned.',
      retainerStatus: 'sent',
      invoiceStatus: 'pending'
    };
    setCases(prev => [newCase, ...prev]);
    setShowNewCaseModal(false);
    addToast('success', 'Case Dossier Created', `${newCaseNumber} initialized for ${newCaseClientName}.`);
  };

  const selectedCaseForDetail = cases.find(c => c.id === selectedCaseDetailId) || null;
  const pendingReviewCount = documents.filter(d => d.status === 'uploaded').length;
  const overdueCount = deadlines.filter(d => d.isOverdue).length;

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#2A2312] flex flex-col font-sans">
      {/* SURFACE 1: PRACTITIONER WORKSPACE */}
      {appMode === 'practitioner' && (
        <div className="flex h-screen overflow-hidden">
          {/* Left Dark Sidebar */}
          <Sidebar
            currentView={currentView}
            onSelectView={setCurrentView}
            onSwitchToClientPortal={() => setAppMode('client')}
            pendingReviewCount={pendingReviewCount}
            overdueCount={overdueCount}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#FAF7F0]">
            {/* Top Bar with Command Palette trigger and Breadcrumb */}
            <TopBar
              currentView={currentView}
              onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
              onSwitchToClientPortal={() => setAppMode('client')}
              onOpenNewCase={() => setShowNewCaseModal(true)}
              onOpenNewDocRequest={() => setShowNewDocRequestModal(true)}
              onOpenNewDeadline={() => setCurrentView('deadlines')}
            />

            {/* Scrollable View Container */}
            <main className="flex-1 overflow-y-auto p-6 md:p-8">
              {currentView === 'today' && (
                <TodayView
                  cases={cases}
                  documents={documents}
                  deadlines={deadlines}
                  clients={clients}
                  onSelectCase={(id) => setSelectedCaseDetailId(id)}
                  onOpenDocumentReview={(doc) => setPreviewDoc(doc)}
                  onSendReminderModal={handleOpenReminderModal}
                  onOpenNewCase={() => setShowNewCaseModal(true)}
                  onOpenNewDocRequest={() => setShowNewDocRequestModal(true)}
                  onShareIntakeModal={() => setShowShareIntakeModal(true)}
                  onSwitchToClientPortal={() => setAppMode('client')}
                />
              )}

              {currentView === 'cases' && (
                <CasesView
                  cases={cases}
                  onSelectCase={(id) => setSelectedCaseDetailId(id)}
                  onOpenNewCase={() => setShowNewCaseModal(true)}
                  onMoveCaseStatus={(caseId, newStatus) => {
                    setCases(prev => prev.map(c => c.id === caseId ? { ...c, status: newStatus } : c));
                    addToast('success', 'Pipeline stage updated');
                  }}
                />
              )}

              {currentView === 'document_requests' && (
                <DocumentRequestsView
                  documents={documents}
                  cases={cases}
                  onApproveDocument={handleApproveDocument}
                  onRequestFix={handleRequestFix}
                  onPreviewDocument={(doc) => setPreviewDoc(doc)}
                  onSendReminderModal={handleOpenReminderModal}
                  onOpenNewDocRequest={() => setShowNewDocRequestModal(true)}
                />
              )}

              {currentView === 'deadlines' && (
                <DeadlinesView
                  deadlines={deadlines}
                  cases={cases}
                  onAddDeadline={handleAddDeadline}
                  onSendReminderModal={handleOpenReminderModal}
                />
              )}

              {currentView === 'clients' && (
                <ClientsView
                  clients={clients}
                  cases={cases}
                  documents={documents}
                  onSwitchToClientPortal={() => setAppMode('client')}
                  onOpenNewCase={() => setShowNewCaseModal(true)}
                  onSendReminderModal={handleOpenReminderModal}
                />
              )}

              {currentView === 'intake_forms' && <IntakeFormsView />}

              {currentView === 'messages' && (
                <MessagesView
                  cases={cases}
                  onSwitchToClientPortal={() => setAppMode('client')}
                />
              )}

              {currentView === 'billing' && (
                <BillingView
                  cases={cases}
                  onSwitchToClientPortal={() => setAppMode('client')}
                />
              )}

              {currentView === 'templates' && <TemplatesView />}

              {currentView === 'settings' && <SettingsView />}
            </main>
          </div>

          {/* Right Slide-over Case Detail Drawer */}
          <CaseDetailDrawer
            caseRecord={selectedCaseForDetail}
            documents={documents}
            deadlines={deadlines}
            messages={messages}
            isOpen={Boolean(selectedCaseDetailId)}
            onClose={() => setSelectedCaseDetailId(null)}
            onApproveDocument={handleApproveDocument}
            onRequestFix={handleRequestFix}
            onPreviewDocument={(doc) => setPreviewDoc(doc)}
            onSendReminder={handleOpenReminderModal}
            onSwitchToClientPortal={() => setAppMode('client')}
          />
        </div>
      )}

      {/* SURFACE 2: CLIENT PORTAL SIMULATOR */}
      {appMode === 'client' && (
        <ClientPortal
          caseRecord={cases[0]} // Rahim Khan CAS-104
          documents={documents}
          messages={messages}
          retainers={retainers}
          invoices={invoices}
          onUploadDocument={handleClientUploadDocument}
          onSendMessage={handleClientSendMessage}
          onSignRetainer={handleSignRetainer}
          onPayInvoice={handlePayInvoice}
          onSwitchBackToPractitioner={() => setAppMode('practitioner')}
        />
      )}

      {/* GLOBAL MODALS */}

      {/* 1. Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectView={(v) => setCurrentView(v)}
        onSwitchToClientPortal={() => setAppMode('client')}
        onOpenNewCase={() => setShowNewCaseModal(true)}
        onOpenNewDocRequest={() => setShowNewDocRequestModal(true)}
        onOpenNewDeadline={() => setCurrentView('deadlines')}
      />

      {/* 2. Document Preview Modal */}
      {previewDoc && (
        <Modal
          isOpen={true}
          onClose={() => setPreviewDoc(null)}
          title={`Document Preview: ${previewDoc.name}`}
          subtitle={`${previewDoc.fileName || 'Uploaded file'} · ${previewDoc.fileSize || '2.4 MB'}`}
          maxWidth="lg"
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-[#6B6147] flex items-center gap-1">
                <ShieldCheck size={14} className="text-emerald-600" />
                Anti-virus scan passed · Encrypted
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Download size={13} />}
                  onClick={() => addToast('info', 'Download Watermarked PDF', 'Downloading encrypted copy with legal watermark...')}
                >
                  Download PDF
                </Button>
                {previewDoc.status === 'uploaded' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      handleApproveDocument(previewDoc.id);
                      setPreviewDoc(null);
                      addToast('success', 'Document Approved', `${previewDoc.name} marked as approved.`);
                    }}
                  >
                    Approve Document
                  </Button>
                )}
              </div>
            </div>
          }
        >
          <div className="space-y-4">
            {/* Realistic Document Mock Preview Container */}
            <div className="bg-[#FAF7F0] rounded-2xl p-6 border border-[#EADFC4] min-h-[300px] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-2 right-2 text-[10px] font-mono text-[#6B6147]/60 uppercase tracking-widest pointer-events-none select-none">
                Apex Legal Verified Copy
              </div>

              <div>
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#EADFC4]/60">
                  <div className="w-10 h-10 rounded-xl bg-[#2A2312] text-white flex items-center justify-center font-bold">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#2A2312]">{previewDoc.name}</h4>
                    <p className="text-xs text-[#6B6147]">{previewDoc.description}</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-[#EADFC4] space-y-2 text-xs text-[#2A2312]">
                  <div className="font-semibold text-sm border-b pb-2 border-[#EADFC4]/60 flex items-center justify-between">
                    <span>IRCC OFFICIAL SPECIMEN DOCUMENT</span>
                    <span className="text-xs text-emerald-700 font-mono">STATUS: VALID</span>
                  </div>
                  <p className="text-[#6B6147]">
                    Applicant: <strong>Rahim Khan</strong> · Case Ref: <strong>CAS-104</strong>
                  </p>
                  <p className="text-[#6B6147]">
                    Resolution: <strong>300 DPI Color Multi-Page Scan</strong> · Checksum: <code className="font-mono text-[10px]">7f83b165...a901</code>
                  </p>
                  <div className="mt-4 p-3 bg-[#FAF7F0] rounded-lg border border-[#EADFC4]/60 text-[11px] text-[#6B6147]">
                    ✓ Official stamps, biographical headers, and dates are legible and verified against IRCC standards.
                  </div>
                </div>
              </div>

              <div className="mt-4 text-center text-xs text-[#6B6147]">
                Page 1 of 4 · Scroll to zoom
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* 3. Send Reminder Modal */}
      {reminderModalData && (
        <Modal
          isOpen={true}
          onClose={() => setReminderModalData(null)}
          title={`Send Document Reminder to ${reminderModalData.clientName}`}
          subtitle={`Case: ${reminderModalData.caseTitle}`}
          maxWidth="md"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setReminderModalData(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" icon={<Send size={13} />} onClick={handleConfirmSendReminder}>
                Dispatch Reminder Now
              </Button>
            </>
          }
        >
          <div className="space-y-3.5 text-xs">
            <div>
              <label className="font-semibold text-[#2A2312] block mb-1">
                Dispatch Channel:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['whatsapp', 'sms', 'email'] as const).map(ch => (
                  <button
                    key={ch}
                    onClick={() => setReminderChannel(ch)}
                    className={`py-2 px-3 rounded-xl border font-bold capitalize transition-colors ${
                      reminderChannel === ch
                        ? 'bg-[#FFBE0B] border-[#FFBE0B] text-[#2A2312]'
                        : 'bg-[#FAF7F0] border-[#EADFC4] text-[#6B6147]'
                    }`}
                  >
                    {ch === 'whatsapp' ? '💬 WhatsApp' : ch === 'sms' ? '📱 SMS' : '✉️ Email'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-semibold text-[#2A2312] block mb-1">
                Message Preview:
              </label>
              <textarea
                value={customReminderMsg}
                onChange={(e) => setCustomReminderMsg(e.target.value)}
                rows={4}
                className="w-full p-3 rounded-xl border border-[#EADFC4] bg-[#FAF7F0] text-xs text-[#2A2312] focus:outline-none focus:border-[#FFBE0B]"
              />
              <span className="text-[10px] text-[#6B6147] mt-1 block">
                Includes passwordless magic link automatically: <code className="font-mono">chasefree.io/portal/portal-rk-9921</code>
              </span>
            </div>
          </div>
        </Modal>
      )}

      {/* 4. New Case Dossier Modal */}
      {showNewCaseModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowNewCaseModal(false)}
          title="Create New Client Case Dossier"
          subtitle="Initializes file, client portal, and document checklist"
          maxWidth="md"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setShowNewCaseModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleCreateNewCase}>
                Create Case
              </Button>
            </>
          }
        >
          <div className="space-y-3.5 text-xs">
            <div>
              <label className="font-semibold text-[#2A2312] block mb-1">Client Full Name:</label>
              <input
                type="text"
                value={newCaseClientName}
                onChange={(e) => setNewCaseClientName(e.target.value)}
                placeholder="e.g. Tariq Mansoor"
                className="w-full p-2.5 rounded-xl border border-[#EADFC4] bg-[#FAF7F0] text-[#2A2312]"
              />
            </div>

            <div>
              <label className="font-semibold text-[#2A2312] block mb-1">Client Email:</label>
              <input
                type="email"
                value={newCaseClientEmail}
                onChange={(e) => setNewCaseClientEmail(e.target.value)}
                placeholder="tariq@example.com"
                className="w-full p-2.5 rounded-xl border border-[#EADFC4] bg-[#FAF7F0] text-[#2A2312]"
              />
            </div>

            <div>
              <label className="font-semibold text-[#2A2312] block mb-1">Case Title:</label>
              <input
                type="text"
                value={newCaseTitle}
                onChange={(e) => setNewCaseTitle(e.target.value)}
                placeholder="e.g. LMIA Exemption & Intra-Company Transferee Dossier"
                className="w-full p-2.5 rounded-xl border border-[#EADFC4] bg-[#FAF7F0] text-[#2A2312]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-[#2A2312] block mb-1">Practice Domain:</label>
                <select
                  value={newCaseType}
                  onChange={(e) => setNewCaseType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-[#EADFC4] bg-[#FAF7F0] text-[#2A2312]"
                >
                  <option value="immigration">Immigration Consulting</option>
                  <option value="tax_accounting">Tax & Accounting</option>
                  <option value="legal_contract">Commercial Legal</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-[#2A2312] block mb-1">Checklist Template:</label>
                <select className="w-full p-2.5 rounded-xl border border-[#EADFC4] bg-[#FAF7F0] text-[#2A2312]">
                  <option>Express Entry Standard (6 docs)</option>
                  <option>Corporate Tax Pack (5 docs)</option>
                  <option>Commercial Dispute (4 docs)</option>
                </select>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* 5. Request Documents from Template Modal */}
      {showNewDocRequestModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowNewDocRequestModal(false)}
          title="Dispatch Document Checklist from Template"
          subtitle="Generate standardized requests for a client"
          maxWidth="md"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setShowNewDocRequestModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setShowNewDocRequestModal(false);
                  addToast('success', 'Checklist Dispatched', 'New document requests populated and magic link delivered to client.');
                }}
              >
                Dispatch to Client
              </Button>
            </>
          }
        >
          <div className="space-y-3.5 text-xs">
            <div>
              <label className="font-semibold text-[#2A2312] block mb-1">Target Case:</label>
              <select
                value={requestTargetCaseId}
                onChange={(e) => setRequestTargetCaseId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#EADFC4] bg-[#FAF7F0] text-[#2A2312]"
              >
                {cases.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.clientName} ({c.caseNumber} - {c.title})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-[#2A2312] block mb-1">Select Checklist Blueprint:</label>
              <select
                value={requestTemplateType}
                onChange={(e) => setRequestTemplateType(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#EADFC4] bg-[#FAF7F0] text-[#2A2312]"
              >
                <option value="express_entry">Canadian Express Entry Full Checklist (6 items)</option>
                <option value="corp_tax">Corporate T2 Annual Filing Checklist (5 items)</option>
                <option value="dispute">Breach of Contract Evidentiary Pack (4 items)</option>
              </select>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#EADFC4] text-[#6B6147]">
              ⚡ <strong>Zero Chasing:</strong> Automated reminders will be queued for 7 days, 3 days, and 1 day before the due date.
            </div>
          </div>
        </Modal>
      )}

      {/* 6. Share Intake Link Modal */}
      {showShareIntakeModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowShareIntakeModal(false)}
          title="Share Client Intake Link"
          subtitle="Self-serve onboarding for prospective clients"
          maxWidth="md"
          footer={
            <Button variant="primary" size="sm" onClick={() => setShowShareIntakeModal(false)}>
              Done
            </Button>
          }
        >
          <div className="space-y-3 text-xs">
            <p className="text-[#6B6147]">
              Clients fill out their initial information and upload core documents. Chasefree automatically creates their Case Dossier and assigns their checklist.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value="https://chasefree.io/intake/express-entry-intake"
                className="flex-1 p-2.5 rounded-xl bg-[#FAF7F0] border border-[#EADFC4] font-mono text-xs text-[#2A2312]"
              />
              <Button
                variant="primary"
                size="sm"
                icon={copiedIntake ? <Check size={14} /> : <Copy size={14} />}
                onClick={() => {
                  navigator.clipboard?.writeText?.('https://chasefree.io/intake/express-entry-intake');
                  setCopiedIntake(true);
                  addToast('success', 'Intake Link Copied');
                  setTimeout(() => setCopiedIntake(false), 3000);
                }}
              >
                {copiedIntake ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
