import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Copy, 
  ExternalLink, 
  Mail, 
  Phone, 
  FolderKanban, 
  FileCheck2, 
  Check,
  ShieldCheck,
  Send
} from 'lucide-react';
import { ClientProfile, CaseRecord, DocumentItem } from '../../types';
import { Button } from '../common/Button';
import { Drawer } from '../common/Drawer';
import { useToast } from '../common/Toast';

interface ClientsViewProps {
  clients: ClientProfile[];
  cases: CaseRecord[];
  documents: DocumentItem[];
  onSwitchToClientPortal: () => void;
  onOpenNewCase: () => void;
  onSendReminderModal: (clientName: string, caseTitle: string) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  clients,
  cases,
  documents,
  onSwitchToClientPortal,
  onOpenNewCase,
  onSendReminderModal
}) => {
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.company && c.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
    c.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyLink = (token: string, clientName: string) => {
    const magicUrl = `https://chasefree.io/portal/${token}`;
    navigator.clipboard?.writeText?.(magicUrl);
    setCopiedToken(token);
    addToast('success', 'Portal Link Copied', `Secure link for ${clientName} copied to clipboard.`);
    setTimeout(() => setCopiedToken(null), 3000);
  };

  const clientCases = selectedClient ? cases.filter(c => c.clientId === selectedClient.id) : [];
  const clientDocs = selectedClient
    ? documents.filter(d => clientCases.some(c => c.id === d.caseId))
    : [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#EADFC4] shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-[#2A2312] flex items-center gap-2">
            <Users size={22} className="text-[#FFBE0B]" />
            Client Directory & Magic Access
          </h2>
          <p className="text-xs text-[#6B6147] mt-0.5">
            Passwordless client links with end-to-end encryption. No passwords or app downloads required for clients.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={15} />}
            onClick={onOpenNewCase}
          >
            New Client Intake
          </Button>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-[#EADFC4] shadow-xs flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6147]" />
          <input
            type="text"
            placeholder="Search by client name, email, company, or practice tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-[#FAF7F0] border border-[#EADFC4] rounded-xl text-[#2A2312] focus:outline-none focus:border-[#FFBE0B]"
          />
        </div>
        <span className="text-xs text-[#6B6147] font-semibold shrink-0">
          {filteredClients.length} clients
        </span>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map(client => {
          const clientActiveCases = cases.filter(c => c.clientId === client.id);
          const isCopied = copiedToken === client.portalToken;

          return (
            <div
              key={client.id}
              className="bg-white rounded-2xl p-5 border border-[#EADFC4] hover:border-[#FFBE0B] transition-all shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Header with Avatar and Tags */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#2A2312] text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-xs">
                      {client.avatarInitials}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#2A2312] leading-tight">
                        {client.name}
                      </h3>
                      <p className="text-xs text-[#6B6147]">
                        {client.company || 'Private Individual'}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-[#2A2312] bg-[#FAF7F0] px-2 py-0.5 rounded-md border border-[#EADFC4]">
                    {client.tag}
                  </span>
                </div>

                {/* Contact info */}
                <div className="space-y-1 text-xs text-[#6B6147] mb-4">
                  <div className="flex items-center gap-2">
                    <Mail size={13} className="text-[#6B6147]" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-[#6B6147]" />
                    <span>{client.phone}</span>
                  </div>
                </div>

                {/* Active Case Pill */}
                {clientActiveCases.length > 0 ? (
                  <div className="p-2.5 rounded-xl bg-[#FAF7F0] border border-[#EADFC4]/60 text-xs mb-3">
                    <span className="text-[10px] font-bold text-[#6B6147] uppercase block">
                      Active Case:
                    </span>
                    <span className="font-bold text-[#2A2312] block truncate">
                      {clientActiveCases[0].title}
                    </span>
                    <span className="text-[11px] text-[#6B6147] mt-0.5 block">
                      {clientActiveCases[0].documentsCount.approved} of {clientActiveCases[0].documentsCount.total} docs approved
                    </span>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-[#FAF7F0] text-xs text-[#6B6147] mb-3">
                    No active case assigned
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-[#EADFC4]/60 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleCopyLink(client.portalToken, client.name)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#2A2312] hover:text-[#FFBE0B] transition-colors"
                >
                  {isCopied ? <Check size={14} className="text-emerald-600" /> : <Copy size={13} />}
                  <span>{isCopied ? 'Link Copied!' : 'Copy Magic Link'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSelectedClient(client)}
                    className="px-2.5 py-1 text-xs font-semibold text-[#2A2312] bg-[#FAF7F0] hover:bg-[#EADFC4]/40 rounded-lg border border-[#EADFC4] transition-colors"
                  >
                    Profile
                  </button>
                  {client.id === 'cli-1' && (
                    <button
                      onClick={onSwitchToClientPortal}
                      title="Preview in Client Portal"
                      className="px-2.5 py-1 text-xs font-semibold text-[#2A2312] bg-[#FFBE0B] hover:bg-[#F3B300] rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <ExternalLink size={12} />
                      <span>Portal</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Client Profile Slide-over Drawer */}
      <Drawer
        isOpen={Boolean(selectedClient)}
        onClose={() => setSelectedClient(null)}
        title={selectedClient ? selectedClient.name : 'Client Profile'}
        subtitle={selectedClient ? `${selectedClient.company || ''} · ${selectedClient.tag}` : ''}
        width="xl"
        footer={
          <div className="flex items-center justify-between w-full">
            <span className="text-xs text-[#6B6147]">
              Client Token: <code className="font-mono">{selectedClient?.portalToken}</code>
            </span>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setSelectedClient(null)}
            >
              Done
            </Button>
          </div>
        }
      >
        {selectedClient && (
          <div className="space-y-6 text-xs">
            {/* Contact details */}
            <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#EADFC4] space-y-2">
              <h4 className="font-bold text-[#2A2312] text-sm">Direct Contact Information</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[#6B6147] block">Email:</span>
                  <strong className="text-[#2A2312]">{selectedClient.email}</strong>
                </div>
                <div>
                  <span className="text-[#6B6147] block">Phone (SMS / WhatsApp):</span>
                  <strong className="text-[#2A2312]">{selectedClient.phone}</strong>
                </div>
                <div>
                  <span className="text-[#6B6147] block">Client Since:</span>
                  <span className="text-[#2A2312]">{selectedClient.createdAt}</span>
                </div>
                <div>
                  <span className="text-[#6B6147] block">Last Portal Interaction:</span>
                  <span className="text-[#2A2312]">{selectedClient.lastActive}</span>
                </div>
              </div>
            </div>

            {/* Magic Link Generator */}
            <div className="p-4 rounded-xl bg-white border border-[#EADFC4] space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-[#2A2312] flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-[#FFBE0B]" />
                  Secure Magic Link
                </h4>
                <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Passwordless Active
                </span>
              </div>
              <p className="text-[#6B6147]">
                Share this direct URL with the client. It expires in 14 days and allows encrypted uploads without account creation.
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`https://chasefree.io/portal/${selectedClient.portalToken}`}
                  className="flex-1 p-2 rounded-xl bg-[#FAF7F0] border border-[#EADFC4] text-xs font-mono text-[#2A2312]"
                />
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Copy size={13} />}
                  onClick={() => handleCopyLink(selectedClient.portalToken, selectedClient.name)}
                >
                  Copy
                </Button>
              </div>
            </div>

            {/* Client Cases */}
            <div>
              <h4 className="font-bold text-[#2A2312] text-sm mb-2">
                Associated Cases ({clientCases.length})
              </h4>
              <div className="space-y-2">
                {clientCases.map(c => (
                  <div key={c.id} className="p-3 rounded-xl bg-white border border-[#EADFC4]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[#2A2312]">{c.title}</span>
                      <span className="font-mono text-[11px] font-bold text-[#6B6147]">{c.caseNumber}</span>
                    </div>
                    <div className="text-[11px] text-[#6B6147]">
                      {c.documentsCount.approved}/{c.documentsCount.total} documents approved · Next cutoff: {c.nextDeadline.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Client Documents */}
            <div>
              <h4 className="font-bold text-[#2A2312] text-sm mb-2">
                Uploaded Files ({clientDocs.length})
              </h4>
              <div className="space-y-1.5">
                {clientDocs.map(d => (
                  <div key={d.id} className="p-2.5 rounded-lg bg-[#FAF7F0] border border-[#EADFC4]/60 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-[#2A2312]">{d.name}</div>
                      <div className="text-[10px] text-[#6B6147]">{d.fileName || 'Not uploaded yet'}</div>
                    </div>
                    <span className="text-[11px] font-semibold capitalize text-[#6B6147]">
                      {d.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
