import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  FileText, 
  User, 
  ExternalLink,
  CheckCheck
} from 'lucide-react';
import { MessageRecord, CaseRecord } from '../../types';
import { INITIAL_MESSAGES } from '../../mockData';
import { Button } from '../common/Button';
import { useToast } from '../common/Toast';

interface MessagesViewProps {
  cases: CaseRecord[];
  onSwitchToClientPortal: () => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  cases,
  onSwitchToClientPortal
}) => {
  const { addToast } = useToast();
  const [selectedCaseId, setSelectedCaseId] = useState<string>(cases[0]?.id || 'cas-1');
  const [messages, setMessages] = useState<MessageRecord[]>(INITIAL_MESSAGES);
  const [inputMessage, setInputMessage] = useState('');

  const activeCase = cases.find(c => c.id === selectedCaseId) || cases[0];
  const caseMessages = messages.filter(m => m.caseId === selectedCaseId);

  const cannedReplies = [
    'Document approved, thank you!',
    'The photo is slightly blurry. Could you please re-upload with clear lighting?',
    'I have updated your deadline by 7 days. Please check your checklist.',
    'Your settlement funds statement has been reviewed and verified.'
  ];

  const handleSendMessage = (textToSend?: string) => {
    const content = textToSend || inputMessage;
    if (!content.trim()) return;

    const newMsg: MessageRecord = {
      id: `msg-${Date.now()}`,
      caseId: selectedCaseId,
      sender: 'practitioner',
      senderName: 'Elena Rostova, RCIC',
      content: content.trim(),
      timestamp: 'Just now',
      isRead: true
    };

    setMessages(prev => [...prev, newMsg]);
    setInputMessage('');
    addToast('success', 'Message Sent', `Sent to ${activeCase?.clientName} via Portal & SMS.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#EADFC4] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#2A2312] flex items-center gap-2">
            <MessageSquare size={22} className="text-[#FFBE0B]" />
            Client Communication Threads
          </h2>
          <p className="text-xs text-[#6B6147] mt-0.5">
            Direct, encrypted messaging per case. Clients receive instant SMS alerts with magic-link access.
          </p>
        </div>

        <button
          onClick={onSwitchToClientPortal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#FFF3CC] text-[#2A2312] hover:bg-[#FFE58A] border border-[#FFE58A] transition-colors"
        >
          <ExternalLink size={13} />
          <span>View Portal Chat</span>
        </button>
      </div>

      {/* Main Chat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 h-[620px] bg-white rounded-2xl border border-[#EADFC4] shadow-xs overflow-hidden">
        {/* Cases List Sidebar (4 cols) */}
        <div className="md:col-span-4 border-r border-[#EADFC4] flex flex-col bg-[#FAF7F0]/40">
          <div className="p-3.5 border-b border-[#EADFC4]">
            <span className="text-xs font-bold text-[#6B6147] uppercase tracking-wider">
              Active Client Conversations
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#EADFC4]/60">
            {cases.map(c => {
              const isSelected = c.id === selectedCaseId;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`w-full p-3.5 text-left transition-colors flex items-start gap-3 ${
                    isSelected ? 'bg-white border-l-4 border-l-[#FFBE0B]' : 'hover:bg-white/80'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-[#2A2312] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {c.clientName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#2A2312] truncate">
                        {c.clientName}
                      </span>
                      <span className="text-[10px] text-[#6B6147] font-mono">
                        {c.caseNumber}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#6B6147] truncate mt-0.5">
                      {c.title}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Thread (8 cols) */}
        <div className="md:col-span-8 flex flex-col h-full bg-white">
          {/* Thread Header */}
          <div className="p-4 border-b border-[#EADFC4] bg-[#FAF7F0]/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FFBE0B] text-[#2A2312] font-black text-xs flex items-center justify-center">
                {activeCase?.clientName[0]}
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#2A2312]">
                  {activeCase?.clientName}
                </h3>
                <p className="text-[11px] text-[#6B6147]">
                  {activeCase?.title} · {activeCase?.clientEmail}
                </p>
              </div>
            </div>

            <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
              SMS/WhatsApp Relay Active
            </span>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#FAF7F0]/20">
            {caseMessages.map(msg => {
              const isPractitioner = msg.sender === 'practitioner';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isPractitioner ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-2 mb-1 text-[10px] text-[#6B6147]">
                    <span className="font-semibold text-[#2A2312]">{msg.senderName}</span>
                    <span>·</span>
                    <span className="font-mono">{msg.timestamp}</span>
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl max-w-md text-xs leading-relaxed ${
                      isPractitioner
                        ? 'bg-[#2A2312] text-white rounded-tr-xs'
                        : 'bg-white text-[#2A2312] border border-[#EADFC4] rounded-tl-xs shadow-xs'
                    }`}
                  >
                    <p>{msg.content}</p>

                    {msg.attachmentName && (
                      <div className={`mt-2.5 p-2 rounded-xl flex items-center gap-2 text-[11px] ${
                        isPractitioner ? 'bg-white/10' : 'bg-[#FAF7F0] border border-[#EADFC4]'
                      }`}>
                        <FileText size={15} className="shrink-0" />
                        <span className="font-semibold truncate">{msg.attachmentName}</span>
                        <span className="text-[10px] opacity-80">({msg.attachmentSize})</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Canned Quick Replies */}
          <div className="px-4 py-2 bg-[#FAF7F0] border-t border-[#EADFC4] flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="font-bold text-[#6B6147] shrink-0">Quick replies:</span>
            {cannedReplies.map((r, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(r)}
                className="px-2.5 py-1 rounded-lg bg-white border border-[#EADFC4] text-[#2A2312] hover:bg-[#FFBE0B] hover:border-[#FFBE0B] whitespace-nowrap transition-colors"
              >
                {r}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-[#EADFC4] bg-white flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type client message (dispatches via portal & SMS)..."
              className="flex-1 p-2.5 text-xs rounded-xl border border-[#EADFC4] bg-[#FAF7F0] text-[#2A2312] focus:outline-none focus:border-[#FFBE0B]"
            />
            <Button
              variant="primary"
              size="sm"
              icon={<Send size={13} />}
              onClick={() => handleSendMessage()}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
