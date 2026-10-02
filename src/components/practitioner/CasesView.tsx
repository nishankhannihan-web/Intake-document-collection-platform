import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  LayoutGrid, 
  List, 
  CalendarClock, 
  FileCheck2, 
  AlertCircle,
  Clock,
  Filter,
  ArrowRight
} from 'lucide-react';
import { CaseRecord, CaseStatus, CaseType } from '../../types';
import { CaseStatusBadge } from '../common/Badge';
import { ProgressRing } from '../common/ProgressRing';
import { Button } from '../common/Button';

interface CasesViewProps {
  cases: CaseRecord[];
  onSelectCase: (caseId: string) => void;
  onOpenNewCase: () => void;
  onMoveCaseStatus: (caseId: string, newStatus: CaseStatus) => void;
}

export const CasesView: React.FC<CasesViewProps> = ({
  cases,
  onSelectCase,
  onOpenNewCase,
  onMoveCaseStatus
}) => {
  const [viewLayout, setViewLayout] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const columns: { id: CaseStatus; title: string; subtitle: string }[] = [
    { id: 'new_intake', title: 'New Intake', subtitle: 'Awaiting initial review' },
    { id: 'collecting_docs', title: 'Collecting Docs', subtitle: 'Auto-chasing client checklist' },
    { id: 'in_review', title: 'In Review', subtitle: 'Practitioner assessing file' },
    { id: 'filed_submitted', title: 'Filed / Submitted', subtitle: 'Lodged with IRCC / CRA / Court' },
    { id: 'completed', title: 'Closed / Done', subtitle: 'Decision reached or archived' }
  ];

  const filteredCases = cases.filter(c => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || c.caseType === selectedType;
    const matchesStatus = selectedStatus === 'all' || c.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#EADFC4] shadow-xs">
        {/* Search & Filters */}
        <div className="flex items-center gap-2.5 flex-1 flex-wrap">
          <div className="relative min-w-[220px] flex-1 sm:flex-initial">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6147]" />
            <input
              type="text"
              placeholder="Filter by client or case ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF7F0] border border-[#EADFC4] rounded-xl text-[#2A2312] focus:outline-none focus:border-[#FFBE0B] transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Filter size={14} className="text-[#6B6147]" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              aria-label="Filter by case domain"
              className="text-xs bg-[#FAF7F0] border border-[#EADFC4] rounded-xl px-2.5 py-1.5 text-[#2A2312] focus:outline-none focus:border-[#FFBE0B]"
            >
              <option value="all">All Domains</option>
              <option value="immigration">Immigration</option>
              <option value="tax_accounting">Tax & Accounting</option>
              <option value="legal_contract">Legal & Contract</option>
            </select>
          </div>
        </div>

        {/* View mode toggle + New Case Button */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center bg-[#FAF7F0] p-1 rounded-xl border border-[#EADFC4]">
            <button
              onClick={() => setViewLayout('kanban')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewLayout === 'kanban'
                  ? 'bg-white text-[#2A2312] shadow-xs font-bold'
                  : 'text-[#6B6147] hover:text-[#2A2312]'
              }`}
              title="Kanban Pipeline"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewLayout('list')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewLayout === 'list'
                  ? 'bg-white text-[#2A2312] shadow-xs font-bold'
                  : 'text-[#6B6147] hover:text-[#2A2312]'
              }`}
              title="Table List View"
            >
              <List size={15} />
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={15} />}
            onClick={onOpenNewCase}
          >
            New Case
          </Button>
        </div>
      </div>

      {/* Kanban Pipeline View */}
      {viewLayout === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start overflow-x-auto pb-4">
          {columns.map(col => {
            const colCases = filteredCases.filter(c => c.status === col.id);
            return (
              <div
                key={col.id}
                className="bg-[#FAF7F0]/60 rounded-2xl border border-[#EADFC4] p-3 flex flex-col min-h-[500px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#EADFC4]/60">
                  <div>
                    <h3 className="text-xs font-bold text-[#2A2312]">
                      {col.title}
                    </h3>
                    <p className="text-[10px] text-[#6B6147] truncate">
                      {col.subtitle}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#2A2312] bg-white px-2 py-0.5 rounded-md border border-[#EADFC4] tabular-nums">
                    {colCases.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-3 flex-1">
                  {colCases.map(c => {
                    const progressPercent = c.documentsCount.total > 0
                      ? Math.round((c.documentsCount.approved / c.documentsCount.total) * 100)
                      : 0;

                    return (
                      <div
                        key={c.id}
                        onClick={() => onSelectCase(c.id)}
                        className="bg-white rounded-xl p-3.5 border border-[#EADFC4] hover:border-[#FFBE0B] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                      >
                        <div>
                          {/* Case Number & Domain */}
                          <div className="flex items-center justify-between gap-1 mb-1.5">
                            <span className="text-[11px] font-mono font-bold text-[#6B6147]">
                              {c.caseNumber}
                            </span>
                            <span className="text-[10px] font-semibold text-[#2A2312] bg-[#FAF7F0] px-1.5 py-0.5 rounded border border-[#EADFC4]">
                              {c.caseType === 'immigration' ? 'Immigration' : c.caseType === 'tax_accounting' ? 'Tax/CPA' : 'Legal'}
                            </span>
                          </div>

                          {/* Client Name & Title */}
                          <h4 className="text-sm font-bold text-[#2A2312] group-hover:text-[#2A2312] line-clamp-1">
                            {c.clientName}
                          </h4>
                          <p className="text-xs text-[#6B6147] line-clamp-2 mt-0.5">
                            {c.title}
                          </p>
                        </div>

                        {/* Progress Ring & Next Deadline */}
                        <div className="mt-3.5 pt-3 border-t border-[#EADFC4]/60 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <ProgressRing
                              progress={progressPercent}
                              size={36}
                              strokeWidth={3.5}
                              showLabel={true}
                            />
                            <div className="text-[10px] text-[#6B6147] leading-tight">
                              <span className="font-bold text-[#2A2312]">{c.documentsCount.approved}/{c.documentsCount.total}</span> docs
                              {c.documentsCount.needsFix > 0 && (
                                <div className="text-amber-700 font-semibold">{c.documentsCount.needsFix} needs fix</div>
                              )}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-[10px] font-bold text-[#2A2312] truncate max-w-[90px]">
                              {c.nextDeadline.title}
                            </div>
                            <div className={`text-[10px] tabular-nums font-medium ${c.nextDeadline.isOverdue ? 'text-rose-600 font-bold' : 'text-[#6B6147]'}`}>
                              {c.nextDeadline.isOverdue ? 'Overdue!' : c.nextDeadline.date}
                            </div>
                          </div>
                        </div>

                        {/* Quick pipeline step advance */}
                        <div className="mt-2 pt-2 border-t border-[#FAF7F0] flex items-center justify-between text-[10px] text-[#6B6147]">
                          <span>Lead: {c.leadPractitioner.split(',')[0]}</span>
                          <span className="text-[#2A2312] font-semibold group-hover:underline flex items-center gap-0.5">
                            Details <ArrowRight size={10} />
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {colCases.length === 0 && (
                    <div className="py-8 text-center text-xs text-[#6B6147]/80 border-2 border-dashed border-[#EADFC4]/60 rounded-xl">
                      No cases in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewLayout === 'list' && (
        <div className="bg-white rounded-2xl border border-[#EADFC4] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#EADFC4] bg-[#FAF7F0] text-[#6B6147] font-semibold">
                  <th className="py-3 px-4">Case & Client</th>
                  <th className="py-3 px-4">Domain</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Checklist Progress</th>
                  <th className="py-3 px-4">Next Deadline</th>
                  <th className="py-3 px-4">Billing</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EADFC4]/60">
                {filteredCases.map(c => {
                  const progressPercent = c.documentsCount.total > 0
                    ? Math.round((c.documentsCount.approved / c.documentsCount.total) * 100)
                    : 0;

                  return (
                    <tr
                      key={c.id}
                      onClick={() => onSelectCase(c.id)}
                      className="hover:bg-[#FAF7F0]/60 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-sm text-[#2A2312]">{c.clientName}</div>
                        <div className="text-xs text-[#6B6147] line-clamp-1">{c.caseNumber} · {c.title}</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#2A2312]">
                        {c.caseType === 'immigration' ? 'Immigration' : c.caseType === 'tax_accounting' ? 'Tax/CPA' : 'Legal'}
                      </td>
                      <td className="py-3.5 px-4">
                        <CaseStatusBadge status={c.status} />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <ProgressRing
                            progress={progressPercent}
                            size={28}
                            strokeWidth={3}
                            showLabel={false}
                          />
                          <span className="font-bold tabular-nums text-[#2A2312]">
                            {c.documentsCount.approved} / {c.documentsCount.total}
                          </span>
                          {c.documentsCount.needsFix > 0 && (
                            <span className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                              {c.documentsCount.needsFix} fix
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-[#2A2312] truncate max-w-[140px]">{c.nextDeadline.title}</div>
                        <div className={`text-[11px] tabular-nums ${c.nextDeadline.isOverdue ? 'text-rose-600 font-bold' : 'text-[#6B6147]'}`}>
                          {c.nextDeadline.date}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded text-[11px] ${
                          c.invoiceStatus === 'paid' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {c.invoiceStatus === 'paid' ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectCase(c.id);
                          }}
                          className="px-3 py-1 bg-[#FAF7F0] hover:bg-[#FFBE0B] text-[#2A2312] font-semibold rounded-lg border border-[#EADFC4] transition-colors"
                        >
                          Open Dossier
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
