import React from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileUp, 
  AlertTriangle,
  Calendar,
  FileCheck
} from 'lucide-react';
import { DocStatus, CaseStatus, DeadlineType } from '../../types';

interface DocStatusBadgeProps {
  status: DocStatus;
  size?: 'sm' | 'md';
}

export const DocStatusBadge: React.FC<DocStatusBadgeProps> = ({ status, size = 'md' }) => {
  const isSm = size === 'sm';
  const iconSize = isSm ? 13 : 15;

  switch (status) {
    case 'approved':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium text-emerald-800 bg-emerald-50/90 border border-emerald-200/80 rounded-md ${isSm ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'}`}>
          <CheckCircle2 size={iconSize} className="text-emerald-600 shrink-0" />
          <span>Approved</span>
        </span>
      );
    case 'needs_fix':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium text-amber-900 bg-amber-50 border border-amber-200 rounded-md ${isSm ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'}`}>
          <AlertCircle size={iconSize} className="text-amber-600 shrink-0" />
          <span>Needs fix</span>
        </span>
      );
    case 'uploaded':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium text-[#2A2312] bg-[#FFF3CC] border border-[#FFE58A] rounded-md ${isSm ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'}`}>
          <FileUp size={iconSize} className="text-[#2A2312] shrink-0" />
          <span>Uploaded (Review)</span>
        </span>
      );
    case 'overdue':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium text-rose-900 bg-rose-50 border border-rose-200 rounded-md ${isSm ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'}`}>
          <AlertTriangle size={iconSize} className="text-rose-600 shrink-0" />
          <span>Overdue</span>
        </span>
      );
    case 'pending':
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium text-[#6B6147] bg-[#FAF7F0] border border-[#EADFC4] rounded-md ${isSm ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'}`}>
          <Clock size={iconSize} className="text-[#6B6147] shrink-0" />
          <span>Waiting for client</span>
        </span>
      );
  }
};

interface CaseStatusBadgeProps {
  status: CaseStatus;
}

export const CaseStatusBadge: React.FC<CaseStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'new_intake':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-900 border border-blue-200">
          <Clock size={13} className="text-blue-600" />
          <span>New Intake</span>
        </span>
      );
    case 'collecting_docs':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-[#FFF3CC] text-[#2A2312] border border-[#FFE58A]">
          <FileUp size={13} className="text-[#2A2312]" />
          <span>Collecting Docs</span>
        </span>
      );
    case 'in_review':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200">
          <FileCheck size={13} className="text-amber-600" />
          <span>In Review</span>
        </span>
      );
    case 'filed_submitted':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-900 border border-indigo-200">
          <Calendar size={13} className="text-indigo-600" />
          <span>Filed / Submitted</span>
        </span>
      );
    case 'completed':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-900 border border-emerald-200">
          <CheckCircle2 size={13} className="text-emerald-600" />
          <span>Completed</span>
        </span>
      );
  }
};

interface DeadlineTypeBadgeProps {
  type: DeadlineType;
  short?: boolean;
}

export const DeadlineTypeBadge: React.FC<DeadlineTypeBadgeProps> = ({ type, short = false }) => {
  const baseClasses = "inline-flex items-center justify-center gap-1 font-medium rounded border whitespace-nowrap shrink-0 text-center";
  const sizeClasses = short 
    ? "h-5 w-[84px] px-1.5 py-0 text-[11px] leading-none" 
    : "text-xs px-2 py-0.5";

  switch (type) {
    case 'filing_deadline':
      return (
        <span className={`${baseClasses} ${sizeClasses} text-purple-900 bg-purple-50 border-purple-200`}>
          <span>🏛️ {short ? 'Filing' : 'Filing Cut-off'}</span>
        </span>
      );
    case 'client_deadline':
      return (
        <span className={`${baseClasses} ${sizeClasses} text-amber-900 bg-amber-50 border-amber-200`}>
          <span>⏳ {short ? 'Client Due' : 'Client Due'}</span>
        </span>
      );
    case 'hearing_date':
      return (
        <span className={`${baseClasses} ${sizeClasses} text-blue-900 bg-blue-50 border-blue-200`}>
          <span>⚖️ {short ? 'Hearing' : 'Hearing / Conferral'}</span>
        </span>
      );
    case 'renewal_expiry':
      return (
        <span className={`${baseClasses} ${sizeClasses} text-rose-900 bg-rose-50 border-rose-200`}>
          <span>⚠️ {short ? 'Permit' : 'Permit Expiry'}</span>
        </span>
      );
  }
};
