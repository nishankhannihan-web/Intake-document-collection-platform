import React, { useState } from 'react';
import { 
  CreditCard, 
  Plus, 
  FileCheck2, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Send, 
  DollarSign, 
  FileSignature, 
  ShieldCheck,
  Download,
  Copy
} from 'lucide-react';
import { InvoiceRecord, RetainerRecord, CaseRecord } from '../../types';
import { INITIAL_INVOICES, INITIAL_RETAINERS } from '../../mockData';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';

interface BillingViewProps {
  cases: CaseRecord[];
  onSwitchToClientPortal: () => void;
}

export const BillingView: React.FC<BillingViewProps> = ({
  cases,
  onSwitchToClientPortal
}) => {
  const { addToast } = useToast();
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(INITIAL_INVOICES);
  const [retainers, setRetainers] = useState<RetainerRecord[]>(INITIAL_RETAINERS);
  const [activeTab, setActiveTab] = useState<'retainers' | 'invoices'>('retainers');

  // New Invoice Modal
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const [newInvClient, setNewInvClient] = useState(cases[0]?.clientName || 'Rahim Khan');
  const [newInvAmount, setNewInvAmount] = useState('1500');
  const [newInvDesc, setNewInvDesc] = useState('Legal & Consultation Retainer Deposit');

  // View E-Sign Certificate Modal
  const [selectedRetainerForCert, setSelectedRetainerForCert] = useState<RetainerRecord | null>(null);

  const totalRevenueCollected = invoices
    .filter(i => i.status === 'paid')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalOutstanding = invoices
    .filter(i => i.status !== 'paid')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handleCreateInvoice = () => {
    const inv: InvoiceRecord = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      caseId: 'cas-1',
      clientName: newInvClient,
      amount: parseFloat(newInvAmount) || 1000,
      dueDate: '2026-10-20',
      status: 'sent',
      items: [{ description: newInvDesc, amount: parseFloat(newInvAmount) || 1000 }]
    };
    setInvoices(prev => [inv, ...prev]);
    setShowNewInvoiceModal(false);
    addToast('success', 'Invoice Dispatched', `Invoice sent to ${newInvClient} with Stripe payment link.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#EADFC4] shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-[#2A2312] flex items-center gap-2">
            <CreditCard size={22} className="text-[#FFBE0B]" />
            Billing, Retainers & E-Signatures
          </h2>
          <p className="text-xs text-[#6B6147] mt-0.5">
            Handle legal retainers, certified e-sign agreements, and instant invoice payments in one streamlined workspace.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSwitchToClientPortal}
          >
            Simulate Client Sign & Pay
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={15} />}
            onClick={() => setShowNewInvoiceModal(true)}
          >
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Revenue & Billing Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#EADFC4] shadow-xs">
          <span className="text-xs font-semibold text-[#6B6147]">Collected This Month</span>
          <div className="text-3xl font-extrabold text-emerald-900 mt-1 tabular-nums">
            ${totalRevenueCollected.toLocaleString('en-US', { minimumFractionDigits: 2 })} CAD
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
            ✓ 100% processed through Stripe & e-Transfer
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EADFC4] shadow-xs">
          <span className="text-xs font-semibold text-[#6B6147]">Outstanding Invoices</span>
          <div className="text-3xl font-extrabold text-[#2A2312] mt-1 tabular-nums">
            ${totalOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2 })} CAD
          </div>
          <span className="text-[11px] text-amber-800 font-semibold mt-1 block">
            Auto-payment reminders scheduled
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#2A2312] text-white shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#FFBE0B] font-bold">
            <span>E-SIGNATURE COMPLIANCE</span>
            <ShieldCheck size={16} />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white">PIPEDA & ESIGN Certified</div>
            <p className="text-xs text-[#D5C9B3] mt-0.5">
              Every signed agreement includes cryptographic timestamp, IP audit trail, and digital seal.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EADFC4] pb-1">
        <button
          onClick={() => setActiveTab('retainers')}
          className={`pb-2 px-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'retainers'
              ? 'border-[#FFBE0B] text-[#2A2312]'
              : 'border-transparent text-[#6B6147] hover:text-[#2A2312]'
          }`}
        >
          <FileSignature size={15} />
          <span>Retainer Agreements & E-Sign ({retainers.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={`pb-2 px-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'invoices'
              ? 'border-[#FFBE0B] text-[#2A2312]'
              : 'border-transparent text-[#6B6147] hover:text-[#2A2312]'
          }`}
        >
          <DollarSign size={15} />
          <span>Invoices & Deposits ({invoices.length})</span>
        </button>
      </div>

      {/* TAB 1: RETAINER AGREEMENTS */}
      {activeTab === 'retainers' && (
        <div className="space-y-3">
          {retainers.map(ret => (
            <div
              key={ret.id}
              className="p-5 rounded-2xl bg-white border border-[#EADFC4] hover:border-[#FFBE0B] transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-xs text-[#2A2312]">
                    {ret.clientName}
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                    ret.status === 'signed'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {ret.status === 'signed' ? '✓ Digitally Signed & Certified' : 'Sent for E-Sign'}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#2A2312]">
                  {ret.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-[#6B6147] mt-1.5">
                  <span className="font-mono tabular-nums font-semibold">${ret.amount.toLocaleString()} CAD</span>
                  <span>·</span>
                  <span>Dispatched: {ret.sentDate}</span>
                  {ret.signedDate && (
                    <>
                      <span>·</span>
                      <span className="text-emerald-700 font-semibold">Signed: {ret.signedDate}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {ret.status === 'signed' ? (
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<ShieldCheck size={14} className="text-emerald-600" />}
                    onClick={() => setSelectedRetainerForCert(ret)}
                  >
                    Audit Certificate
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<Send size={13} />}
                    onClick={() => addToast('info', 'E-Sign Reminder Sent', `Sent signing reminder to ${ret.clientName}`)}
                  >
                    Resend E-Sign Link
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: INVOICES */}
      {activeTab === 'invoices' && (
        <div className="space-y-3">
          {invoices.map(inv => (
            <div
              key={inv.id}
              className="p-5 rounded-2xl bg-white border border-[#EADFC4] hover:border-[#FFBE0B] transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-[#6B6147]">
                    {inv.invoiceNumber}
                  </span>
                  <span className="font-bold text-xs text-[#2A2312]">
                    {inv.clientName}
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                    inv.status === 'paid'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : inv.status === 'sent'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}>
                    {inv.status.toUpperCase()}
                  </span>
                </div>

                <div className="text-xs text-[#6B6147]">
                  {inv.items.map(i => i.description).join(', ')}
                </div>

                <div className="flex items-center gap-3 text-xs text-[#6B6147] mt-1.5">
                  <span className="text-sm font-bold text-[#2A2312] tabular-nums">
                    ${inv.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} CAD
                  </span>
                  <span>·</span>
                  <span>Due: {inv.dueDate}</span>
                  {inv.paymentMethod && <span>· {inv.paymentMethod}</span>}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText?.(`https://chasefree.io/pay/${inv.invoiceNumber}`);
                    addToast('success', 'Stripe Pay Link Copied', `Payment link for ${inv.invoiceNumber} copied.`);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-[#2A2312] bg-[#FAF7F0] hover:bg-[#EADFC4]/40 rounded-xl border border-[#EADFC4] flex items-center gap-1.5 transition-colors"
                >
                  <Copy size={13} />
                  <span>Copy Pay Link</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Invoice Modal */}
      {showNewInvoiceModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowNewInvoiceModal(false)}
          title="Create Client Invoice"
          subtitle="Generate instant invoice with secure credit card and e-Transfer link"
          maxWidth="md"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setShowNewInvoiceModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleCreateInvoice}>
                Create & Dispatch
              </Button>
            </>
          }
        >
          <div className="space-y-3.5 text-xs">
            <div>
              <label className="font-semibold text-[#2A2312] block mb-1">
                Select Client:
              </label>
              <select
                value={newInvClient}
                onChange={(e) => setNewInvClient(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#EADFC4] bg-[#FAF7F0] text-[#2A2312]"
              >
                {cases.map(c => (
                  <option key={c.id} value={c.clientName}>
                    {c.clientName} ({c.title})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-[#2A2312] block mb-1">
                Description of Services / Retainer:
              </label>
              <input
                type="text"
                value={newInvDesc}
                onChange={(e) => setNewInvDesc(e.target.value)}
                placeholder="e.g. Express Entry PR Legal Retainer (Phase 1)"
                className="w-full p-2.5 rounded-xl border border-[#EADFC4] bg-[#FAF7F0] text-[#2A2312]"
              />
            </div>

            <div>
              <label className="font-semibold text-[#2A2312] block mb-1">
                Amount (CAD):
              </label>
              <input
                type="number"
                value={newInvAmount}
                onChange={(e) => setNewInvAmount(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#EADFC4] bg-[#FAF7F0] text-[#2A2312]"
              />
            </div>
          </div>
        </Modal>
      )}

      {/* E-Sign Certificate Modal */}
      {selectedRetainerForCert && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedRetainerForCert(null)}
          title="Audit Certificate & Signature Verification"
          subtitle={`Cryptographically sealed document for ${selectedRetainerForCert.clientName}`}
          maxWidth="lg"
          footer={
            <Button variant="primary" size="sm" onClick={() => setSelectedRetainerForCert(null)}>
              Done
            </Button>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#EADFC4] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#6B6147] uppercase">Document Title</span>
                <div className="font-bold text-[#2A2312] text-sm">{selectedRetainerForCert.title}</div>
                <div className="text-[11px] text-[#6B6147]">Signee: {selectedRetainerForCert.signeeName}</div>
              </div>
              <span className="font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded text-xs">
                ✓ SHA-256 Verified
              </span>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-[#2A2312] block">Event History & Timestamps:</span>
              {selectedRetainerForCert.auditTrail.map((ev, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-white border border-[#EADFC4] flex items-center justify-between text-[11px]">
                  <div>
                    <span className="font-semibold text-[#2A2312]">{ev.action}</span>
                    <span className="text-[#6B6147] block font-mono">IP: {ev.ipAddress}</span>
                  </div>
                  <span className="font-mono text-[#6B6147]">{ev.timestamp}</span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-[11px]">
              🔒 <strong>Legal validity notice:</strong> This digital signature conforms to the Canadian Uniform Electronic Commerce Act (UECA) and US ESIGN Act.
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
