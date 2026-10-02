import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Share2, 
  QrCode, 
  Code, 
  Copy, 
  Check, 
  ArrowRight,
  Eye,
  Sliders,
  FolderPlus,
  Layers,
  ChevronRight
} from 'lucide-react';
import { IntakeFormTemplate, IntakeFormField } from '../../types';
import { INTAKE_TEMPLATES } from '../../mockData';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';

export const IntakeFormsView: React.FC = () => {
  const { addToast } = useToast();
  const [templates, setTemplates] = useState<IntakeFormTemplate[]>(INTAKE_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState<IntakeFormTemplate>(INTAKE_TEMPLATES[0]);
  const [activeTab, setActiveTab] = useState<'builder' | 'preview' | 'submissions'>('builder');

  // Share Modals
  const [showShareModal, setShowShareModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // New field addition
  const [showAddField, setShowAddField] = useState(false);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState<IntakeFormField['type']>('text');

  const handleCopyShareLink = () => {
    const url = `https://chasefree.io/intake/${selectedTemplate.shareableSlug}`;
    navigator.clipboard?.writeText?.(url);
    setCopiedLink(true);
    addToast('success', 'Intake Link Copied', 'Direct intake URL copied to clipboard.');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleAddField = () => {
    if (!newFieldLabel.trim()) return;
    const field: IntakeFormField = {
      id: `f-${Date.now()}`,
      label: newFieldLabel,
      type: newFieldType,
      required: false,
      placeholder: `Enter ${newFieldLabel.toLowerCase()}...`
    };
    setSelectedTemplate(prev => ({
      ...prev,
      fields: [...prev.fields, field]
    }));
    setNewFieldLabel('');
    setShowAddField(false);
    addToast('success', 'Question Added', `"${newFieldLabel}" added to form questionnaire.`);
  };

  const toggleAutoCreateCase = () => {
    setSelectedTemplate(prev => {
      const nextVal = !prev.autoCreateCase;
      addToast('info', nextVal ? 'Auto-Case Creation Enabled' : 'Auto-Case Creation Disabled', 
        nextVal ? 'New submissions will instantly create a Case Dossier and spawn document requests.' : 'Submissions will only save as drafts.');
      return { ...prev, autoCreateCase: nextVal };
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#EADFC4] shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-[#2A2312] flex items-center gap-2">
            <FileText size={22} className="text-[#FFBE0B]" />
            Intake Forms & Case Auto-Generators
          </h2>
          <p className="text-xs text-[#6B6147] mt-0.5">
            Collect client data, consent, and initial documents. Auto-creates case dossiers and populates checklists instantly.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Share2 size={14} />}
            onClick={() => setShowShareModal(true)}
          >
            Share Form Link
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<QrCode size={14} />}
            onClick={() => setShowQrModal(true)}
          >
            QR Code
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Code size={14} />}
            onClick={() => setShowEmbedModal(true)}
          >
            Embed on Website
          </Button>
        </div>
      </div>

      {/* Main Grid: Template Selector + Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Templates List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold text-[#6B6147] uppercase tracking-wider px-1">
            Pre-Built Intake Templates
          </div>

          {templates.map(tpl => {
            const isSelected = selectedTemplate.id === tpl.id;
            return (
              <div
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl)}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-white border-[#FFBE0B] ring-2 ring-[#FFBE0B]/30 shadow-md'
                    : 'bg-white border-[#EADFC4] hover:border-[#FFBE0B]/60'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B6147] bg-[#FAF7F0] px-2 py-0.5 rounded border border-[#EADFC4]">
                    {tpl.category === 'immigration' ? 'Immigration' : tpl.category === 'tax_accounting' ? 'Tax/CPA' : 'Law'}
                  </span>
                  <span className="text-[11px] font-mono text-[#6B6147]">
                    {tpl.fields.length} questions
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#2A2312] leading-tight">
                  {tpl.title}
                </h3>
                <p className="text-xs text-[#6B6147] mt-1 line-clamp-2 leading-relaxed">
                  {tpl.subtitle}
                </p>

                <div className="mt-3 pt-2.5 border-t border-[#EADFC4]/60 flex items-center justify-between text-[11px] text-[#6B6147]">
                  <span>Est: {tpl.estimatedTimeToComplete}</span>
                  <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {tpl.submissionCount} submitted
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Form Builder & Preview Tabs (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#EADFC4] shadow-xs overflow-hidden">
          {/* Editor Header */}
          <div className="px-6 py-4 border-b border-[#EADFC4] bg-[#FAF7F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-[#2A2312]">
                {selectedTemplate.title}
              </h3>
              <p className="text-xs text-[#6B6147]">
                Shareable link: <code className="font-mono text-[#2A2312]">/intake/{selectedTemplate.shareableSlug}</code>
              </p>
            </div>

            {/* Sub-tabs */}
            <div className="flex items-center bg-white p-1 rounded-xl border border-[#EADFC4] text-xs font-semibold">
              <button
                onClick={() => setActiveTab('builder')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'builder' ? 'bg-[#FFBE0B] text-[#2A2312]' : 'text-[#6B6147] hover:text-[#2A2312]'
                }`}
              >
                Builder
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'preview' ? 'bg-[#FFBE0B] text-[#2A2312]' : 'text-[#6B6147] hover:text-[#2A2312]'
                }`}
              >
                Client Preview
              </button>
              <button
                onClick={() => setActiveTab('submissions')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'submissions' ? 'bg-[#FFBE0B] text-[#2A2312]' : 'text-[#6B6147] hover:text-[#2A2312]'
                }`}
              >
                Submissions ({selectedTemplate.submissionCount})
              </button>
            </div>
          </div>

          {/* TAB 1: BUILDER */}
          {activeTab === 'builder' && (
            <div className="p-6 space-y-6">
              {/* Automation Mapping Bar */}
              <div className="p-4 rounded-xl bg-[#FFFDF8] border border-[#FFE58A] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-[#2A2312]">
                    Zero-Chase Automation Loop
                  </h4>
                  <p className="text-[11px] text-[#6B6147]">
                    Form submission → Auto-creates Case → Generates Document Checklist → Schedules Reminders.
                  </p>
                </div>

                <button
                  onClick={toggleAutoCreateCase}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    selectedTemplate.autoCreateCase
                      ? 'bg-[#2A2312] text-white hover:bg-[#3D331B]'
                      : 'bg-white text-[#6B6147] border border-[#EADFC4]'
                  }`}
                >
                  {selectedTemplate.autoCreateCase ? '✓ Auto-Case Active' : 'Enable Auto-Case'}
                </button>
              </div>

              {/* Questions List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#2A2312]">
                    Form Questions & Document Upload Slots ({selectedTemplate.fields.length})
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Plus size={13} />}
                    onClick={() => setShowAddField(true)}
                  >
                    Add Question
                  </Button>
                </div>

                {selectedTemplate.fields.map((field, idx) => (
                  <div
                    key={field.id}
                    className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#EADFC4] flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-white border border-[#EADFC4] flex items-center justify-center font-mono font-bold text-[11px] text-[#6B6147] shrink-0">
                        {idx + 1}
                      </span>
                      <div className="truncate">
                        <div className="font-bold text-[#2A2312] truncate">
                          {field.label}
                          {field.required && <span className="text-rose-600 ml-1">*</span>}
                        </div>
                        <div className="text-[10px] text-[#6B6147] capitalize">
                          Type: {field.type} {field.helpText && `· ${field.helpText}`}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-[#EADFC4] text-[#6B6147]">
                        {field.type === 'file' ? '📁 Secure Upload' : 'Text Input'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Field Inline Box */}
              {showAddField && (
                <div className="p-4 rounded-xl bg-white border-2 border-dashed border-[#FFBE0B] space-y-3">
                  <h4 className="text-xs font-bold text-[#2A2312]">Add Custom Question / Upload Slot</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Question prompt (e.g. Previous Immigration Refusal Letter)..."
                      value={newFieldLabel}
                      onChange={(e) => setNewFieldLabel(e.target.value)}
                      className="p-2 text-xs rounded-xl border border-[#EADFC4] bg-[#FAF7F0] text-[#2A2312]"
                    />
                    <select
                      value={newFieldType}
                      onChange={(e) => setNewFieldType(e.target.value as any)}
                      className="p-2 text-xs rounded-xl border border-[#EADFC4] bg-[#FAF7F0] text-[#2A2312]"
                    >
                      <option value="text">Single-line Text</option>
                      <option value="textarea">Multi-line Paragraph</option>
                      <option value="file">Secure File / Photo Upload</option>
                      <option value="date">Date Picker</option>
                      <option value="select">Dropdown Choice</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowAddField(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" size="sm" onClick={handleAddField}>
                      Add to Form
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CLIENT PREVIEW */}
          {activeTab === 'preview' && (
            <div className="p-6 bg-[#FAF7F0]/40 flex justify-center">
              <div className="w-full max-w-md bg-white rounded-2xl border border-[#EADFC4] shadow-md p-6 space-y-4">
                <div className="border-b border-[#EADFC4] pb-3">
                  <span className="text-[10px] font-bold text-[#6B6147] uppercase">Apex Legal & Immigration</span>
                  <h4 className="text-base font-bold text-[#2A2312] mt-0.5">{selectedTemplate.title}</h4>
                  <p className="text-xs text-[#6B6147] mt-1">{selectedTemplate.subtitle}</p>
                </div>

                <div className="space-y-3 text-xs">
                  {selectedTemplate.fields.slice(0, 4).map(f => (
                    <div key={f.id}>
                      <label className="font-semibold text-[#2A2312] block mb-1">
                        {f.label} {f.required && <span className="text-rose-500">*</span>}
                      </label>
                      {f.type === 'file' ? (
                        <div className="p-3 border-2 border-dashed border-[#EADFC4] rounded-xl text-center text-[#6B6147] hover:border-[#FFBE0B] transition-colors cursor-pointer bg-[#FAF7F0]">
                          <span className="block font-medium">Click or tap to upload file / photo</span>
                          <span className="text-[10px]">PDF, PNG, JPG accepted (up to 25MB)</span>
                        </div>
                      ) : (
                        <input
                          type="text"
                          disabled
                          placeholder={f.placeholder || 'Your response...'}
                          className="w-full p-2.5 rounded-xl border border-[#EADFC4] bg-[#FAF7F0] text-[#2A2312]"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <Button variant="primary" size="sm" className="w-full mt-4" disabled>
                  Submit & Open Secure Checklist
                </Button>
              </div>
            </div>
          )}

          {/* TAB 3: SUBMISSIONS */}
          {activeTab === 'submissions' && (
            <div className="p-6 space-y-3">
              <div className="p-3.5 rounded-xl bg-white border border-[#EADFC4] flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-[#2A2312]">Rahim Khan · Apex Logistics Ltd.</div>
                  <div className="text-[11px] text-[#6B6147]">Submitted Sept 15, 2026 · PGWP to Express Entry</div>
                </div>
                <span className="font-bold text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                  ✓ Case Created: CAS-104
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-[#EADFC4] flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-[#2A2312]">Beatriz Morales · BioVentures Lab</div>
                  <div className="text-[11px] text-[#6B6147]">Submitted Sept 28, 2026 · ICT Specialized Knowledge</div>
                </div>
                <span className="font-bold text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                  ✓ Case Created: CAS-106
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share Link Modal */}
      {showShareModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowShareModal(false)}
          title="Share Public Intake Link"
          subtitle="Clients can access this intake without logging in"
          maxWidth="md"
          footer={
            <Button variant="primary" size="sm" onClick={() => setShowShareModal(false)}>
              Done
            </Button>
          }
        >
          <div className="space-y-3 text-xs">
            <p className="text-[#6B6147]">
              Send this link to prospective clients. When they complete the form, Chasefree automatically creates their Case Dossier and sends them their personalized document checklist.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={`https://chasefree.io/intake/${selectedTemplate.shareableSlug}`}
                className="flex-1 p-2.5 rounded-xl bg-[#FAF7F0] border border-[#EADFC4] font-mono text-xs text-[#2A2312]"
              />
              <Button
                variant="primary"
                size="sm"
                icon={copiedLink ? <Check size={14} /> : <Copy size={14} />}
                onClick={handleCopyShareLink}
              >
                {copiedLink ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* QR Code Modal */}
      {showQrModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowQrModal(false)}
          title="Client Intake QR Code"
          subtitle="Print for reception desk, business cards, or client brochures"
          maxWidth="sm"
          footer={
            <Button variant="primary" size="sm" onClick={() => setShowQrModal(false)}>
              Close
            </Button>
          }
        >
          <div className="text-center py-4 space-y-3">
            <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl border-2 border-[#EADFC4] flex items-center justify-center shadow-xs">
              <QrCode size={160} className="text-[#2A2312]" />
            </div>
            <p className="text-xs text-[#6B6147]">
              Clients scan with their smartphone camera to open the instant intake form.
            </p>
          </div>
        </Modal>
      )}

      {/* Embed Code Modal */}
      {showEmbedModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowEmbedModal(false)}
          title="Embed On Your Website"
          subtitle="Responsive iFrame snippet for Squarespace, WordPress, or Webflow"
          maxWidth="lg"
          footer={
            <Button variant="primary" size="sm" onClick={() => setShowEmbedModal(false)}>
              Done
            </Button>
          }
        >
          <div className="space-y-3 text-xs">
            <p className="text-[#6B6147]">
              Paste this HTML snippet into any page on your practice website:
            </p>
            <textarea
              readOnly
              rows={4}
              value={`<iframe src="https://chasefree.io/embed/intake/${selectedTemplate.shareableSlug}" width="100%" height="700px" frameborder="0" style="border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06);"></iframe>`}
              className="w-full p-3 font-mono text-xs rounded-xl border border-[#EADFC4] bg-[#FAF7F0] text-[#2A2312]"
            />
            <Button
              variant="outline"
              size="sm"
              icon={<Copy size={13} />}
              onClick={() => {
                navigator.clipboard?.writeText?.(`<iframe src="https://chasefree.io/embed/intake/${selectedTemplate.shareableSlug}" width="100%" height="700px" frameborder="0" style="border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06);"></iframe>`);
                addToast('success', 'Embed Code Copied');
              }}
            >
              Copy HTML Snippet
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};
