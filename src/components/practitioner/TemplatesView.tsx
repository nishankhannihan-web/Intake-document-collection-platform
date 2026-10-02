import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  FileCheck2, 
  CalendarClock, 
  Copy, 
  Check, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../common/Button';
import { useToast } from '../common/Toast';

export const TemplatesView: React.FC = () => {
  const { addToast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const templates = [
    {
      id: 'tpl-imm-1',
      title: 'Canadian Express Entry (Federal Skilled Worker & CEC)',
      category: 'Immigration Consulting',
      description: 'Complete dossier collection for PR candidates under Canadian Experience Class or FSW.',
      spawns: {
        documents: 6,
        deadlines: 2,
        reminderDays: '7, 3, 1 days before cutoff'
      },
      documentItems: [
        'Valid Passport (All Stamped Pages)',
        'Language Test (IELTS / CELPIP Report)',
        'Police Clearance Certificate',
        'Employer Reference Letter (NOC Duties & Hours)',
        'Proof of Settlement Funds (6-Month Statement)',
        'Educational Credential Assessment (ECA WES)'
      ],
      popular: true
    },
    {
      id: 'tpl-tax-1',
      title: 'Corporate T2 Year-End Tax Filing & Bookkeeping Reconciliation',
      category: 'Accounting & CPA',
      description: 'Streamlined annual corporate tax pack for incorporated small businesses and consulting firms.',
      spawns: {
        documents: 5,
        deadlines: 3,
        reminderDays: '14, 7, 2 days before CRA cutoff'
      },
      documentItems: [
        'Corporate Bank Statements (All 12 Months)',
        'Credit Card Year-End Statements',
        'Payroll Register / T4 Summary',
        'Asset Purchase / Equipment Amortization Invoices',
        'Shareholder Loan & Dividend Draws Register'
      ],
      popular: true
    },
    {
      id: 'tpl-law-1',
      title: 'Commercial Dispute & Breach of Contract Onboarding',
      category: 'Legal Practice',
      description: 'Initial evidentiary intake for commercial litigation, demand letters, and settlement.',
      spawns: {
        documents: 4,
        deadlines: 2,
        reminderDays: '5, 2 days before reply window'
      },
      documentItems: [
        'Signed Master Service Agreement / Contract',
        'Chronological Written Timeline of Breach',
        'Relevant Email & Communication Exports',
        'Unpaid Invoices & Proof of Financial Damages'
      ],
      popular: false
    },
    {
      id: 'tpl-imm-2',
      title: 'Spousal Sponsorship & Family Class PR',
      category: 'Immigration Consulting',
      description: 'Evidence of genuine relationship, marriage certificate, financial undertaking, and joint leases.',
      spawns: {
        documents: 8,
        deadlines: 1,
        reminderDays: '7, 3 days before cutoff'
      },
      documentItems: [
        'Marriage Certificate / Statutory Declaration',
        'Joint Tenancy Lease or Mortgage Deed',
        'Photographic Timeline (20-30 labeled photos)',
        'Sponsor Notice of Assessment (Last 3 Years)'
      ],
      popular: false
    }
  ];

  const handleApplyTemplate = (tplTitle: string, id: string) => {
    setCopiedId(id);
    addToast('success', 'Template Applied', `Created new case draft with "${tplTitle}" checklist bundle.`);
    setTimeout(() => setCopiedId(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#EADFC4] shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-[#2A2312] flex items-center gap-2">
            <Layers size={22} className="text-[#FFBE0B]" />
            Checklist & Deadline Template Bundles
          </h2>
          <p className="text-xs text-[#6B6147] mt-0.5">
            1-click blueprints that auto-generate document requests, client explanations, and statutory filing cutoffs.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus size={15} />}
          onClick={() => addToast('info', 'Custom Template Builder', 'Opening custom template creator...')}
        >
          Create New Bundle
        </Button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {templates.map(tpl => {
          const isApplied = copiedId === tpl.id;
          return (
            <div
              key={tpl.id}
              className="bg-white rounded-2xl p-6 border border-[#EADFC4] hover:border-[#FFBE0B] transition-all shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold text-[#6B6147] uppercase tracking-wider bg-[#FAF7F0] px-2 py-0.5 rounded border border-[#EADFC4]">
                    {tpl.category}
                  </span>
                  {tpl.popular && (
                    <span className="text-[11px] font-bold text-[#2A2312] bg-[#FFF3CC] border border-[#FFE58A] px-2 py-0.5 rounded">
                      High Turnaround
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-[#2A2312]">
                  {tpl.title}
                </h3>
                <p className="text-xs text-[#6B6147] mt-1 leading-relaxed">
                  {tpl.description}
                </p>

                {/* Auto-Creation Highlights */}
                <div className="mt-4 p-3 rounded-xl bg-[#FAF7F0] border border-[#EADFC4]/60 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B6147] flex items-center gap-1.5">
                      <FileCheck2 size={13} className="text-[#FFBE0B]" />
                      Auto-generated Document Requests:
                    </span>
                    <strong className="text-[#2A2312] tabular-nums">{tpl.spawns.documents} items</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B6147] flex items-center gap-1.5">
                      <CalendarClock size={13} className="text-blue-600" />
                      Auto-generated Statutory Deadlines:
                    </span>
                    <strong className="text-[#2A2312] tabular-nums">{tpl.spawns.deadlines} milestones</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B6147]">
                      Chase Cadence:
                    </span>
                    <span className="text-[#2A2312] font-semibold">{tpl.spawns.reminderDays}</span>
                  </div>
                </div>

                {/* Document Items List Preview */}
                <div className="mt-4">
                  <span className="text-[11px] font-bold text-[#6B6147] uppercase block mb-1.5">
                    Pre-Configured Document Requests:
                  </span>
                  <ul className="space-y-1 text-xs text-[#2A2312]">
                    {tpl.documentItems.map((item, idx) => (
                      <li key={idx}>
                        <span className="truncate">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="mt-6 pt-4 border-t border-[#EADFC4]/60 flex items-center justify-between">
                <span className="text-[11px] text-[#6B6147]">Zero client setup required</span>
                <Button
                  variant={isApplied ? 'outline' : 'primary'}
                  size="sm"
                  icon={isApplied ? <Check size={14} className="text-emerald-600" /> : <ArrowRight size={14} />}
                  iconPosition="right"
                  onClick={() => handleApplyTemplate(tpl.title, tpl.id)}
                >
                  {isApplied ? 'Template Applied' : 'Use Template'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
