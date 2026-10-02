import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Upload, 
  Camera, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Calendar, 
  Send, 
  CreditCard, 
  ChevronRight, 
  ArrowLeft, 
  Check, 
  Lock, 
  Smartphone, 
  Laptop, 
  Globe, 
  X,
  FileCheck2,
  AlertTriangle
} from 'lucide-react';
import { DocumentItem, CaseRecord, MessageRecord, RetainerRecord, InvoiceRecord } from '../../types';
import { ProgressRing } from '../common/ProgressRing';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';

interface ClientPortalProps {
  caseRecord: CaseRecord;
  documents: DocumentItem[];
  messages: MessageRecord[];
  retainers: RetainerRecord[];
  invoices: InvoiceRecord[];
  onUploadDocument: (docId: string, fileName: string, fileSize: string) => void;
  onSendMessage: (content: string) => void;
  onSignRetainer: (retId: string, signeeName: string) => void;
  onPayInvoice: (invId: string) => void;
  onSwitchBackToPractitioner: () => void;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({
  caseRecord,
  documents,
  messages,
  retainers,
  invoices,
  onUploadDocument,
  onSendMessage,
  onSignRetainer,
  onPayInvoice,
  onSwitchBackToPractitioner
}) => {
  const { addToast } = useToast();
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'desktop'>('mobile');
  const [language, setLanguage] = useState<'en' | 'bn'>('en');
  const [activeTab, setActiveTab] = useState<'todo' | 'submitted' | 'timeline' | 'sign_pay' | 'messages'>('todo');

  // Upload simulation modal
  const [uploadingDoc, setUploadingDoc] = useState<DocumentItem | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Camera capture simulation
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraDoc, setCameraDoc] = useState<DocumentItem | null>(null);

  // E-Sign modal
  const [showSignModal, setShowSignModal] = useState(false);
  const [signerNameInput, setSignerNameInput] = useState('Rahim Khan');
  const [signatureType, setSignatureType] = useState<'draw' | 'type'>('type');

  // Pay Modal
  const [showPayModal, setShowPayModal] = useState(false);
  const [payingInvoice, setPayingInvoice] = useState<InvoiceRecord | null>(null);

  // Chat input
  const [clientChatText, setClientChatText] = useState('');

  const caseDocs = documents.filter(d => d.caseId === caseRecord.id);
  const todoDocs = caseDocs.filter(d => d.status === 'pending' || d.status === 'needs_fix');
  const submittedDocs = caseDocs.filter(d => d.status === 'uploaded' || d.status === 'approved');

  const approvedCount = caseDocs.filter(d => d.status === 'approved').length;
  const progressPercent = caseDocs.length > 0 ? Math.round((approvedCount / caseDocs.length) * 100) : 0;

  // Language dictionaries
  const t = {
    en: {
      greeting: 'Hi Rahim, here’s what we need from you',
      subtitle: 'Upload your required documents below so Elena can submit your Express Entry dossier.',
      encryption: 'Your files are 256-bit encrypted and only visible to Apex Legal & Immigration.',
      nextDue: 'Next deadline: Oct 2, 2026 (in 2 days)',
      todo: 'To Do',
      submitted: 'Submitted',
      timeline: 'Case Status',
      signPay: 'Sign & Pay',
      messages: 'Messages',
      uploadBtn: 'Upload File',
      photoBtn: 'Take Photo',
      needsFixAlert: 'Needs a clearer copy:',
      approvedChip: 'Approved & Verified',
      underReviewChip: 'Received · Under Review'
    },
    bn: {
      greeting: 'হ্যালো রহিম, আপনার প্রয়োজনীয় ডকুমেন্টস',
      subtitle: 'এলেনা আপনার এক্সপ্রেস এন্ট্রি ফাইল জমা দেওয়ার জন্য নিচের ডকুমেন্টসগুলো আপলোড করুন।',
      encryption: 'আপনার ফাইলগুলো এনক্রিপ্ট করা এবং শুধুমাত্র এপেক্স লিগ্যাল দেখতে পাবে।',
      nextDue: 'পরবর্তী ডেডলাইন: ২ অক্টোবর, ২০২৬ (২ দিন বাকি)',
      todo: 'বাকি আছে',
      submitted: 'জমা দেওয়া হয়েছে',
      timeline: 'কেসের অবস্থা',
      signPay: 'স্বাক্ষর ও ফি',
      messages: 'মেসেজ',
      uploadBtn: 'ফাইল আপলোড',
      photoBtn: 'ছবি তুলুন',
      needsFixAlert: 'আবার পরিষ্কার কপি দিন:',
      approvedChip: 'যাচাই সম্পন্ন',
      underReviewChip: 'গ্রহণ করা হয়েছে · পর্যালোচনায়'
    }
  }[language];

  const handleSimulateUpload = (doc: DocumentItem) => {
    setUploadingDoc(doc);
    setIsUploading(true);
    setUploadProgress(15);

    const step1 = setTimeout(() => setUploadProgress(50), 300);
    const step2 = setTimeout(() => setUploadProgress(85), 650);
    const step3 = setTimeout(() => {
      setUploadProgress(100);
      setIsUploading(false);
      onUploadDocument(
        doc.id,
        `${doc.name.replace(/\s+/g, '_')}_Upload_${new Date().toISOString().slice(0, 10)}.pdf`,
        '3.4 MB'
      );
      addToast('success', 'Document Uploaded', `${doc.name} received and forwarded to Elena for review.`);
      setUploadingDoc(null);
    }, 1000);
  };

  const handleSimulateCameraCapture = () => {
    if (!cameraDoc) return;
    setShowCameraModal(false);
    onUploadDocument(
      cameraDoc.id,
      `Mobile_Scan_${cameraDoc.name.replace(/\s+/g, '_')}_HighRes.jpg`,
      '2.8 MB'
    );
    addToast('success', 'Photo Scanned & Encrypted', 'Auto-cropped document uploaded successfully.');
    setCameraDoc(null);
  };

  const handleCompleteSign = () => {
    const ret = retainers.find(r => r.caseId === caseRecord.id);
    if (ret) {
      onSignRetainer(ret.id, signerNameInput);
      addToast('success', 'Agreement Digitally Signed', 'A certified copy has been saved with audit timestamp.');
    }
    setShowSignModal(false);
  };

  const handleCompletePay = () => {
    if (!payingInvoice) return;
    onPayInvoice(payingInvoice.id);
    addToast('success', 'Payment Successful', `Paid $${payingInvoice.amount.toLocaleString()} CAD. Receipt sent to your email.`);
    setShowPayModal(false);
  };

  const handleSendClientChat = () => {
    if (!clientChatText.trim()) return;
    onSendMessage(clientChatText.trim());
    setClientChatText('');
    addToast('success', 'Message Sent', 'Elena Rostova will be notified immediately.');
  };

  const retainer = retainers.find(r => r.caseId === caseRecord.id);
  const invoice = invoices.find(i => i.caseId === caseRecord.id);

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex flex-col items-center">
      {/* Top Simulator Control Bar */}
      <div className="w-full bg-[#2A2312] text-white px-4 py-2.5 flex items-center justify-between z-30 shrink-0 border-b border-[#3D331B] text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={onSwitchBackToPractitioner}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#FFBE0B] text-[#2A2312] rounded-lg font-bold hover:bg-[#F3B300] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Practitioner Workspace</span>
          </button>
          <span className="hidden sm:inline text-[#D5C9B3]">
            | Viewing as client: <strong>Rahim Khan</strong>
          </span>
        </div>

        {/* Viewport switch & Language */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#1F190D] p-1 rounded-lg border border-[#3D331B]">
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-1 px-2 rounded font-medium flex items-center gap-1 transition-colors ${
                deviceMode === 'mobile' ? 'bg-[#FFBE0B] text-[#2A2312] font-bold' : 'text-[#D5C9B3]'
              }`}
            >
              <Smartphone size={13} />
              <span className="hidden sm:inline">Mobile Frame</span>
            </button>
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`p-1 px-2 rounded font-medium flex items-center gap-1 transition-colors ${
                deviceMode === 'desktop' ? 'bg-[#FFBE0B] text-[#2A2312] font-bold' : 'text-[#D5C9B3]'
              }`}
            >
              <Laptop size={13} />
              <span className="hidden sm:inline">Desktop Web</span>
            </button>
          </div>

          <div className="flex items-center gap-1 bg-[#1F190D] px-2 py-1 rounded-lg border border-[#3D331B]">
            <Globe size={13} className="text-[#FFBE0B]" />
            <button
              onClick={() => setLanguage('en')}
              className={`font-semibold ${language === 'en' ? 'text-[#FFBE0B]' : 'text-[#A69B82]'}`}
            >
              EN
            </button>
            <span className="text-[#6B6147]">/</span>
            <button
              onClick={() => setLanguage('bn')}
              className={`font-semibold ${language === 'bn' ? 'text-[#FFBE0B]' : 'text-[#A69B82]'}`}
            >
              বাংলা
            </button>
          </div>
        </div>
      </div>

      {/* Main Portal Viewport Container */}
      <div className={`w-full ${deviceMode === 'mobile' ? 'max-w-[420px] my-6' : 'max-w-4xl my-6 px-4'}`}>
        <div className={`bg-white rounded-3xl shadow-xl border border-[#EADFC4] overflow-hidden flex flex-col ${deviceMode === 'mobile' ? 'min-h-[820px]' : 'min-h-[700px]'}`}>
          
          {/* Client Portal Header */}
          <div className="bg-[#2A2312] text-white p-5 border-b border-[#3D331B]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#FFBE0B] text-[#2A2312] font-extrabold flex items-center justify-center text-sm">
                  A
                </div>
                <div className="text-xs font-bold tracking-tight text-white">
                  Apex Legal & Immigration
                </div>
              </div>

              {/* Encryption Trust Badge */}
              <div className="flex items-center gap-1 text-[11px] text-[#FFBE0B] font-semibold bg-[#3D331B] px-2.5 py-0.5 rounded-full border border-[#FFBE0B]/30">
                <Lock size={11} />
                <span>256-Bit Encrypted</span>
              </div>
            </div>

            {/* Simulated Magic Link Bar */}
            <div className="bg-[#1F190D] px-3 py-1.5 rounded-xl border border-[#3D331B] flex items-center justify-between text-[11px] text-[#A69B82] font-mono">
              <span className="truncate">chasefree.io/portal/portal-rk-9921</span>
              <span className="text-emerald-400 font-bold ml-2">Verified</span>
            </div>
          </div>

          {/* Hero Welcome & Progress Ring Banner */}
          <div className="bg-gradient-to-b from-[#FFFDF8] to-white p-6 border-b border-[#EADFC4]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-[#2A2312] leading-tight">
                  {t.greeting}
                </h1>
                <p className="text-xs text-[#6B6147] mt-1 leading-relaxed">
                  {t.subtitle}
                </p>
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg mt-3 w-fit">
                  <Clock size={13} className="text-amber-700 shrink-0" />
                  <span>{t.nextDue}</span>
                </div>
              </div>

              <div className="shrink-0 flex flex-col items-center">
                <ProgressRing
                  progress={progressPercent}
                  size={64}
                  strokeWidth={6}
                  showLabel={true}
                />
                <span className="text-[10px] text-[#6B6147] font-semibold mt-1">
                  {approvedCount} of {caseDocs.length} Approved
                </span>
              </div>
            </div>

            {/* Reassurance Copy */}
            <div className="mt-4 p-2.5 rounded-xl bg-[#FAF7F0] border border-[#EADFC4]/80 text-[11px] text-[#6B6147] flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-700 shrink-0" />
              <span>{t.encryption}</span>
            </div>
          </div>

          {/* Navigation Tabs (Mobile-Friendly, 44px tap targets) */}
          <div className="flex items-center justify-between bg-white border-b border-[#EADFC4] px-2 text-xs font-bold overflow-x-auto">
            <button
              onClick={() => setActiveTab('todo')}
              className={`py-3 px-3 border-b-2 transition-colors min-h-[44px] flex items-center gap-1 whitespace-nowrap ${
                activeTab === 'todo' ? 'border-[#FFBE0B] text-[#2A2312]' : 'border-transparent text-[#6B6147]'
              }`}
            >
              <span>{t.todo}</span>
              {todoDocs.length > 0 && (
                <span className="text-[10px] bg-[#FFBE0B] text-[#2A2312] px-1.5 py-0.2 rounded-full font-extrabold">
                  {todoDocs.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('submitted')}
              className={`py-3 px-3 border-b-2 transition-colors min-h-[44px] flex items-center gap-1 whitespace-nowrap ${
                activeTab === 'submitted' ? 'border-[#FFBE0B] text-[#2A2312]' : 'border-transparent text-[#6B6147]'
              }`}
            >
              <span>{t.submitted}</span>
              <span className="text-[10px] text-[#6B6147] font-mono">({submittedDocs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('sign_pay')}
              className={`py-3 px-3 border-b-2 transition-colors min-h-[44px] flex items-center gap-1 whitespace-nowrap ${
                activeTab === 'sign_pay' ? 'border-[#FFBE0B] text-[#2A2312]' : 'border-transparent text-[#6B6147]'
              }`}
            >
              <span>{t.signPay}</span>
            </button>

            <button
              onClick={() => setActiveTab('timeline')}
              className={`py-3 px-3 border-b-2 transition-colors min-h-[44px] whitespace-nowrap ${
                activeTab === 'timeline' ? 'border-[#FFBE0B] text-[#2A2312]' : 'border-transparent text-[#6B6147]'
              }`}
            >
              {t.timeline}
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`py-3 px-3 border-b-2 transition-colors min-h-[44px] whitespace-nowrap ${
                activeTab === 'messages' ? 'border-[#FFBE0B] text-[#2A2312]' : 'border-transparent text-[#6B6147]'
              }`}
            >
              {t.messages}
            </button>
          </div>

          {/* TAB CONTENT */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {/* TAB: TO DO */}
            {activeTab === 'todo' && (
              <div className="space-y-4">
                {todoDocs.map(doc => {
                  const isNeedsFix = doc.status === 'needs_fix';
                  return (
                    <div
                      key={doc.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isNeedsFix
                          ? 'bg-[#FFFDF8] border-amber-300 shadow-sm'
                          : 'bg-white border-[#EADFC4] shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B6147]">
                          {doc.category}
                        </span>
                        {isNeedsFix ? (
                          <span className="text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded flex items-center gap-1">
                            <AlertCircle size={12} className="text-amber-600" />
                            Needs Correction
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-[#6B6147] bg-[#FAF7F0] border border-[#EADFC4] px-2 py-0.5 rounded">
                            Due Oct 2
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-[#2A2312]">
                        {doc.name}
                      </h3>
                      <p className="text-xs text-[#6B6147] mt-1 leading-relaxed">
                        {doc.description}
                      </p>

                      {/* If practitioner requested fix */}
                      {isNeedsFix && doc.fixReason && (
                        <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
                          <AlertTriangle size={15} className="text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold block">{t.needsFixAlert}</span>
                            <p className="mt-0.5 text-xs text-amber-900">{doc.fixReason}</p>
                          </div>
                        </div>
                      )}

                      {/* Accepted Formats */}
                      <div className="text-[11px] text-[#6B6147] mt-2.5">
                        Accepted: <strong>{doc.acceptedFormats.join(', ')}</strong> (Max {doc.maxSizeMb} MB)
                      </div>

                      {/* Mobile action buttons (min 44px height) */}
                      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#EADFC4]/60">
                        <button
                          onClick={() => {
                            setCameraDoc(doc);
                            setShowCameraModal(true);
                          }}
                          className="min-h-[44px] px-3 py-2 bg-[#FAF7F0] hover:bg-[#EADFC4]/40 text-[#2A2312] font-semibold text-xs rounded-xl border border-[#EADFC4] flex items-center justify-center gap-1.5 transition-colors active:scale-98"
                        >
                          <Camera size={15} />
                          <span>{t.photoBtn}</span>
                        </button>

                        <button
                          onClick={() => handleSimulateUpload(doc)}
                          className="min-h-[44px] px-3 py-2 bg-[#FFBE0B] hover:bg-[#F3B300] text-[#2A2312] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-colors"
                        >
                          <Upload size={15} />
                          <span>{t.uploadBtn}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}

                {todoDocs.length === 0 && (
                  <div className="text-center py-10 bg-white rounded-2xl border border-[#EADFC4] p-6">
                    <CheckCircle2 size={40} className="text-emerald-600 mx-auto mb-2" />
                    <h3 className="text-base font-bold text-[#2A2312]">All required documents submitted!</h3>
                    <p className="text-xs text-[#6B6147] mt-1">
                      Elena is reviewing your files. You will be notified via SMS if anything else is needed.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB: SUBMITTED */}
            {activeTab === 'submitted' && (
              <div className="space-y-3">
                {submittedDocs.map(doc => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-2xl bg-white border border-[#EADFC4] shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="text-xs font-bold text-[#2A2312]">
                          {doc.name}
                        </span>
                        {doc.status === 'approved' ? (
                          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                            <CheckCircle2 size={12} className="text-emerald-600" />
                            {t.approvedChip}
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-[#2A2312] bg-[#FFF3CC] border border-[#FFE58A] px-2 py-0.5 rounded">
                            {t.underReviewChip}
                          </span>
                        )}
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#FAF7F0] border border-[#EADFC4]/60 flex items-center gap-2 mt-2 text-xs">
                        <FileText size={16} className="text-[#2A2312] shrink-0" />
                        <div className="truncate flex-1">
                          <div className="font-semibold text-[#2A2312] truncate">{doc.fileName}</div>
                          <div className="text-[10px] text-[#6B6147]">{doc.fileSize} · Uploaded {doc.uploadedAt}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs mt-3 pt-2.5 border-t border-[#EADFC4]/60">
                      <span className="text-[11px] text-[#6B6147]">Need to make changes?</span>
                      <button
                        onClick={() => handleSimulateUpload(doc)}
                        className="text-xs font-bold text-[#2A2312] underline hover:text-[#FFBE0B]"
                      >
                        Replace File
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB: SIGN & PAY */}
            {activeTab === 'sign_pay' && (
              <div className="space-y-4">
                {/* Retainer Agreement Card */}
                {retainer && (
                  <div className="p-5 rounded-2xl bg-white border border-[#EADFC4] shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#6B6147] uppercase">Legal Agreement</span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                        retainer.status === 'signed'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {retainer.status === 'signed' ? '✓ Signed & Certified' : 'Signature Required'}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#2A2312]">
                      {retainer.title}
                    </h3>
                    <p className="text-xs text-[#6B6147]">
                      {retainer.status === 'signed'
                        ? `Digitally signed by ${retainer.signeeName} on ${retainer.signedDate}. Certified copy stored.`
                        : 'Please review and apply your electronic signature before document filing.'}
                    </p>

                    {retainer.status !== 'signed' && (
                      <button
                        onClick={() => setShowSignModal(true)}
                        className="w-full min-h-[44px] py-2 px-4 rounded-xl bg-[#2A2312] text-white font-bold text-xs hover:bg-[#3D331B] transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span>Review & Sign Agreement</span>
                        <ChevronRight size={14} />
                      </button>
                    )}
                  </div>
                )}

                {/* Retainer Invoice Card */}
                {invoice && (
                  <div className="p-5 rounded-2xl bg-white border border-[#EADFC4] shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#6B6147] uppercase">Invoice & Payment</span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                        invoice.status === 'paid'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {invoice.status === 'paid' ? '✓ Paid in Full' : 'Due for Payment'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-[#2A2312]">{invoice.invoiceNumber}</h3>
                        <p className="text-xs text-[#6B6147]">IRCC Document Assessment & Retainer</p>
                      </div>
                      <div className="text-lg font-extrabold text-[#2A2312] tabular-nums">
                        ${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} CAD
                      </div>
                    </div>

                    {invoice.status !== 'paid' && (
                      <button
                        onClick={() => {
                          setPayingInvoice(invoice);
                          setShowPayModal(true);
                        }}
                        className="w-full min-h-[44px] py-2 px-4 rounded-xl bg-[#FFBE0B] text-[#2A2312] font-extrabold text-xs hover:bg-[#F3B300] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <CreditCard size={15} />
                        <span>Pay via Credit Card or Apple Pay</span>
                      </button>
                    )}

                    {invoice.status === 'paid' && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                        <span>Payment processed via {invoice.paymentMethod}. Official tax receipt mailed.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB: CASE STATUS TIMELINE */}
            {activeTab === 'timeline' && (
              <div className="p-5 bg-white rounded-2xl border border-[#EADFC4] shadow-xs space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-[#2A2312]">Express Entry Case Milestones</h3>
                  <p className="text-xs text-[#6B6147]">Track your file progress in real time</p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      ✓
                    </div>
                    <div>
                      <span className="font-bold text-[#2A2312] block">1. Intake Questionnaire & Retainer</span>
                      <span className="text-[11px] text-[#6B6147]">Completed on Sept 15, 2026</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#FFBE0B] text-[#2A2312] flex items-center justify-center font-black text-xs shrink-0 ring-4 ring-[#FFE58A]">
                      2
                    </div>
                    <div>
                      <span className="font-bold text-[#2A2312] block">2. Document Collection & Verification (Current)</span>
                      <span className="text-[11px] text-[#6B6147]">4 of 6 documents verified. 1 pending correction.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 opacity-60">
                    <div className="w-6 h-6 rounded-full bg-[#FAF7F0] border border-[#EADFC4] text-[#6B6147] flex items-center justify-center font-bold text-xs shrink-0">
                      3
                    </div>
                    <div>
                      <span className="font-bold text-[#2A2312] block">3. Practitioner Legal Assessment</span>
                      <span className="text-[11px] text-[#6B6147]">Elena Rostova finalizes IRCC legal submission dossier.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 opacity-60">
                    <div className="w-6 h-6 rounded-full bg-[#FAF7F0] border border-[#EADFC4] text-[#6B6147] flex items-center justify-center font-bold text-xs shrink-0">
                      4
                    </div>
                    <div>
                      <span className="font-bold text-[#2A2312] block">4. Formal Lodgement with IRCC</span>
                      <span className="text-[11px] text-[#6B6147]">Application transmission and receipt of AOR.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: MESSAGES */}
            {activeTab === 'messages' && (
              <div className="space-y-4">
                <div className="space-y-3">
                  {messages.map(msg => {
                    const isClient = msg.sender === 'client';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isClient ? 'items-end' : 'items-start'}`}
                      >
                        <div className="text-[10px] text-[#6B6147] mb-0.5">
                          {msg.senderName} · {msg.timestamp}
                        </div>
                        <div
                          className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                            isClient
                              ? 'bg-[#FFBE0B] text-[#2A2312] font-semibold rounded-tr-xs'
                              : 'bg-white text-[#2A2312] border border-[#EADFC4] rounded-tl-xs shadow-xs'
                          }`}
                        >
                          <p>{msg.content}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Input box */}
                <div className="p-2 rounded-2xl bg-white border border-[#EADFC4] flex items-center gap-2">
                  <input
                    type="text"
                    value={clientChatText}
                    onChange={(e) => setClientChatText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendClientChat()}
                    placeholder="Type message to Elena..."
                    className="flex-1 p-2 text-xs bg-transparent focus:outline-none text-[#2A2312]"
                  />
                  <button
                    onClick={handleSendClientChat}
                    className="min-h-[40px] px-3 py-1.5 bg-[#2A2312] text-white rounded-xl text-xs font-bold hover:bg-[#3D331B] transition-colors"
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="p-3 bg-[#FAF7F0] border-t border-[#EADFC4] text-center text-[10px] text-[#6B6147]">
            🔒 Secured by Chasefree · Encrypted in Canada Central
          </div>
        </div>
      </div>

      {/* Uploading Progress Modal Simulation */}
      {uploadingDoc && (
        <Modal
          isOpen={true}
          onClose={() => setUploadingDoc(null)}
          title="Uploading Document..."
          subtitle={uploadingDoc.name}
          maxWidth="sm"
        >
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FFF3CC] border-2 border-[#FFBE0B] flex items-center justify-center mx-auto text-[#2A2312]">
              <Upload size={28} />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-[#2A2312] block">
                Encrypting & scanning for viruses...
              </span>
              <span className="text-xs text-[#6B6147] font-mono tabular-nums">
                {uploadProgress}% completed
              </span>
            </div>

            <div className="w-full h-2 bg-[#FAF7F0] rounded-full overflow-hidden border border-[#EADFC4]">
              <div
                className="h-full bg-[#FFBE0B] transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Mobile Camera Scan Simulation Modal */}
      {showCameraModal && cameraDoc && (
        <Modal
          isOpen={true}
          onClose={() => setShowCameraModal(false)}
          title="Document Camera Scan"
          subtitle={`Auto-detecting edges for "${cameraDoc.name}"`}
          maxWidth="md"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setShowCameraModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" icon={<Camera size={14} />} onClick={handleSimulateCameraCapture}>
                Capture & Crop
              </Button>
            </>
          }
        >
          <div className="space-y-3 text-center">
            {/* Camera Viewfinder mockup */}
            <div className="relative w-full h-64 bg-[#1F190D] rounded-2xl overflow-hidden border-2 border-[#FFBE0B] flex items-center justify-center">
              {/* Document boundary box */}
              <div className="w-48 h-48 border-2 border-dashed border-[#FFBE0B] rounded-xl flex items-center justify-center relative">
                <span className="text-xs text-[#FFBE0B] font-semibold bg-[#1F190D]/80 px-2 py-1 rounded">
                  Align document within frame
                </span>
                {/* 4 corner brackets */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#FFBE0B]" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#FFBE0B]" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#FFBE0B]" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#FFBE0B]" />
              </div>
            </div>

            <p className="text-xs text-[#6B6147]">
              Automatic perspective correction and shadow removal will be applied.
            </p>
          </div>
        </Modal>
      )}

      {/* E-Sign Signature Pad Modal */}
      {showSignModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowSignModal(false)}
          title="E-Sign Legal Retainer Agreement"
          subtitle="RCIC Immigration Representation Contract"
          maxWidth="md"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setShowSignModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleCompleteSign}>
                Sign & Certify
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-2 border-b border-[#EADFC4] pb-2">
              <button
                onClick={() => setSignatureType('type')}
                className={`px-3 py-1 font-bold rounded-lg ${
                  signatureType === 'type' ? 'bg-[#2A2312] text-white' : 'text-[#6B6147]'
                }`}
              >
                Type Legal Name
              </button>
              <button
                onClick={() => setSignatureType('draw')}
                className={`px-3 py-1 font-bold rounded-lg ${
                  signatureType === 'draw' ? 'bg-[#2A2312] text-white' : 'text-[#6B6147]'
                }`}
              >
                Draw Signature
              </button>
            </div>

            {signatureType === 'type' ? (
              <div>
                <label className="font-semibold text-[#2A2312] block mb-1">
                  Type your full legal name:
                </label>
                <input
                  type="text"
                  value={signerNameInput}
                  onChange={(e) => setSignerNameInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#EADFC4] bg-[#FAF7F0] text-sm text-[#2A2312] font-semibold"
                />
                <div className="mt-3 p-4 rounded-xl bg-[#FAF7F0] border border-[#EADFC4] text-center font-serif text-2xl italic text-[#2A2312]">
                  {signerNameInput || 'Signature Preview'}
                </div>
              </div>
            ) : (
              <div className="p-6 border-2 border-dashed border-[#EADFC4] rounded-xl text-center bg-[#FAF7F0] cursor-crosshair">
                <div className="text-xl font-serif italic text-[#2A2312] opacity-80">
                  ✍️ Rahim Khan
                </div>
                <span className="text-[10px] text-[#6B6147] mt-2 block">
                  Touchscreen / stylus input active
                </span>
              </div>
            )}

            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 text-[11px]">
              By clicking &quot;Sign & Certify&quot;, you agree to be bound by the terms of the retainer agreement under Canadian UECA.
            </div>
          </div>
        </Modal>
      )}

      {/* Stripe-style Checkout Modal */}
      {showPayModal && payingInvoice && (
        <Modal
          isOpen={true}
          onClose={() => setShowPayModal(false)}
          title="Secure Invoice Payment"
          subtitle={`${payingInvoice.invoiceNumber} · Apex Legal & Advisory`}
          maxWidth="md"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setShowPayModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleCompletePay}>
                Pay ${payingInvoice.amount.toLocaleString()} CAD
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#EADFC4] flex items-center justify-between">
              <div>
                <span className="text-[#6B6147] block text-[11px]">Amount Due:</span>
                <span className="text-lg font-bold text-[#2A2312] tabular-nums">
                  ${payingInvoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} CAD
                </span>
              </div>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                Stripe 256-Bit SSL
              </span>
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="font-semibold text-[#2A2312] block mb-1">Card Number:</label>
                <div className="p-2.5 rounded-xl border border-[#EADFC4] bg-[#FAF7F0] font-mono text-xs flex items-center justify-between">
                  <span>•••• •••• •••• 4242</span>
                  <span className="font-sans font-bold text-blue-900">VISA</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#2A2312] block mb-1">Expires:</label>
                  <input
                    type="text"
                    defaultValue="12/28"
                    className="w-full p-2 rounded-xl border border-[#EADFC4] bg-[#FAF7F0] text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#2A2312] block mb-1">CVC:</label>
                  <input
                    type="text"
                    defaultValue="•••"
                    className="w-full p-2 rounded-xl border border-[#EADFC4] bg-[#FAF7F0] text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
