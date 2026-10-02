export type CaseStatus = 'new_intake' | 'collecting_docs' | 'in_review' | 'filed_submitted' | 'completed';

export type CaseType = 'immigration' | 'tax_accounting' | 'legal_contract';

export type DocStatus = 'pending' | 'uploaded' | 'needs_fix' | 'approved' | 'overdue';

export type DeadlineType = 'client_deadline' | 'filing_deadline' | 'hearing_date' | 'renewal_expiry';

export interface DocumentItem {
  id: string;
  caseId: string;
  name: string;
  description: string;
  category: string;
  acceptedFormats: string[];
  maxSizeMb: number;
  dueDate: string;
  status: DocStatus;
  uploadedAt?: string;
  fileName?: string;
  fileSize?: string;
  fileType?: string;
  fixReason?: string;
  fixRequestedAt?: string;
  approvedAt?: string;
  isSensitive?: boolean;
}

export interface CaseDeadline {
  id: string;
  caseId: string;
  title: string;
  date: string;
  type: DeadlineType;
  description?: string;
  isOverdue?: boolean;
  autoRemindDaysBefore: number[];
  clientNotified: boolean;
}

export interface ClientProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  tag: string;
  avatarInitials: string;
  activeCasesCount: number;
  portalToken: string;
  lastActive: string;
  createdAt: string;
}

export interface CaseRecord {
  id: string;
  caseNumber: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  title: string;
  caseType: CaseType;
  status: CaseStatus;
  leadPractitioner: string;
  createdAt: string;
  targetSubmissionDate: string;
  documentsCount: {
    total: number;
    approved: number;
    pending: number;
    needsFix: number;
    uploaded: number;
  };
  nextDeadline: {
    title: string;
    date: string;
    daysLeft: number;
    isOverdue: boolean;
  };
  notes: string;
  retainerStatus: 'signed' | 'sent' | 'draft' | 'none';
  invoiceStatus: 'paid' | 'pending' | 'partial' | 'none';
}

export interface IntakeFormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'date' | 'select' | 'textarea' | 'file';
  placeholder?: string;
  options?: string[];
  required: boolean;
  helpText?: string;
  condition?: {
    fieldId: string;
    operator: 'equals' | 'isNotEmpty';
    value: string;
  };
}

export interface IntakeFormTemplate {
  id: string;
  title: string;
  subtitle: string;
  category: CaseType;
  fields: IntakeFormField[];
  autoCreateCase: boolean;
  assignedChecklistTemplateId: string;
  estimatedTimeToComplete: string;
  submissionCount: number;
  shareableSlug: string;
}

export interface MessageRecord {
  id: string;
  caseId: string;
  sender: 'practitioner' | 'client' | 'system';
  senderName: string;
  content: string;
  timestamp: string;
  attachmentName?: string;
  attachmentSize?: string;
  isRead: boolean;
}

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  caseId: string;
  clientName: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'sent' | 'draft' | 'overdue';
  items: { description: string; amount: number }[];
  paidAt?: string;
  paymentMethod?: string;
}

export interface RetainerRecord {
  id: string;
  caseId: string;
  clientName: string;
  title: string;
  amount: number;
  status: 'draft' | 'sent' | 'viewed' | 'signed';
  sentDate: string;
  signedDate?: string;
  signeeName?: string;
  signatureImage?: string;
  auditTrail: {
    action: string;
    timestamp: string;
    ipAddress: string;
  }[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  ipAddress: string;
  status: 'success' | 'warning' | 'security_event';
}

export type ViewMode =
  | 'today'
  | 'cases'
  | 'document_requests'
  | 'deadlines'
  | 'clients'
  | 'intake_forms'
  | 'messages'
  | 'billing'
  | 'templates'
  | 'settings';
