import {
  CaseRecord,
  ClientProfile,
  DocumentItem,
  CaseDeadline,
  IntakeFormTemplate,
  MessageRecord,
  InvoiceRecord,
  RetainerRecord,
  AuditLogEntry
} from './types';

export const INITIAL_CLIENTS: ClientProfile[] = [
  {
    id: 'cli-1',
    name: 'Rahim Khan',
    email: 'rahim.khan@example.com',
    phone: '+1 (416) 555-0182',
    company: 'Apex Logistics Ltd.',
    tag: 'Express Entry',
    avatarInitials: 'RK',
    activeCasesCount: 1,
    portalToken: 'portal-rk-9921',
    lastActive: '12 mins ago',
    createdAt: '2026-09-14'
  },
  {
    id: 'cli-2',
    name: 'Priya Sharma',
    email: 'priya.sharma@solarkit.io',
    phone: '+1 (604) 555-0723',
    company: 'SolarKit Energy Inc.',
    tag: 'Corporate Tax',
    avatarInitials: 'PS',
    activeCasesCount: 1,
    portalToken: 'portal-ps-8832',
    lastActive: '2 days ago',
    createdAt: '2026-09-02'
  },
  {
    id: 'cli-3',
    name: 'Liam O’Connor',
    email: 'liam@oconnordesign.ca',
    phone: '+1 (514) 555-0391',
    company: 'O’Connor Industrial Design',
    tag: 'Contract Dispute',
    avatarInitials: 'LO',
    activeCasesCount: 1,
    portalToken: 'portal-lo-4411',
    lastActive: '5 hours ago',
    createdAt: '2026-09-18'
  },
  {
    id: 'cli-4',
    name: 'Beatriz Morales',
    email: 'b.morales@globaltech.org',
    phone: '+1 (403) 555-0614',
    company: 'BioVentures Lab',
    tag: 'Work Permit',
    avatarInitials: 'BM',
    activeCasesCount: 1,
    portalToken: 'portal-bm-1102',
    lastActive: '1 day ago',
    createdAt: '2026-09-22'
  },
  {
    id: 'cli-5',
    name: 'David Chen',
    email: 'dchen@chenadvisors.com',
    phone: '+1 (647) 555-0945',
    company: 'Chen & Partners CPA',
    tag: 'Year-End Audit',
    avatarInitials: 'DC',
    activeCasesCount: 0,
    portalToken: 'portal-dc-7729',
    lastActive: '1 week ago',
    createdAt: '2026-08-11'
  }
];

export const INITIAL_CASES: CaseRecord[] = [
  {
    id: 'cas-1',
    caseNumber: 'CAS-104',
    clientId: 'cli-1',
    clientName: 'Rahim Khan',
    clientEmail: 'rahim.khan@example.com',
    title: 'Express Entry PR Renewal & Work Permit Bridge',
    caseType: 'immigration',
    status: 'collecting_docs',
    leadPractitioner: 'Elena Rostova, RCIC',
    createdAt: '2026-09-15',
    targetSubmissionDate: '2026-10-15',
    documentsCount: {
      total: 6,
      approved: 3,
      uploaded: 1,
      needsFix: 1,
      pending: 1
    },
    nextDeadline: {
      title: 'IRCC Portal Document Cut-off',
      date: '2026-10-02',
      daysLeft: 2,
      isOverdue: false
    },
    notes: 'Client is transitioning from PGWP to Express Entry Canadian Experience Class. Needs updated T4 and employment verification letter.',
    retainerStatus: 'signed',
    invoiceStatus: 'paid'
  },
  {
    id: 'cas-2',
    caseNumber: 'CAS-102',
    clientId: 'cli-2',
    clientName: 'Priya Sharma',
    clientEmail: 'priya.sharma@solarkit.io',
    title: 'FY2025 Corporate T2 Filing & R&D SR&ED Claim',
    caseType: 'tax_accounting',
    status: 'collecting_docs',
    leadPractitioner: 'Marcus Vance, CPA',
    createdAt: '2026-09-08',
    targetSubmissionDate: '2026-10-31',
    documentsCount: {
      total: 5,
      approved: 2,
      uploaded: 0,
      needsFix: 1,
      pending: 2
    },
    nextDeadline: {
      title: 'CRA Q3 Corporate Installment',
      date: '2026-09-28',
      daysLeft: -2,
      isOverdue: true
    },
    notes: 'Missing Q4 banking records and equipment amortization schedule. Automated reminder was sent via SMS yesterday.',
    retainerStatus: 'signed',
    invoiceStatus: 'pending'
  },
  {
    id: 'cas-3',
    caseNumber: 'CAS-105',
    clientId: 'cli-3',
    clientName: 'Liam O’Connor',
    clientEmail: 'liam@oconnordesign.ca',
    title: 'Software Licensing Breach & Settlement Notice',
    caseType: 'legal_contract',
    status: 'in_review',
    leadPractitioner: 'Sarah Bennett, Esq.',
    createdAt: '2026-09-20',
    targetSubmissionDate: '2026-10-08',
    documentsCount: {
      total: 4,
      approved: 3,
      uploaded: 1,
      needsFix: 0,
      pending: 0
    },
    nextDeadline: {
      title: 'Defendant Reply Window Closure',
      date: '2026-10-06',
      daysLeft: 6,
      isOverdue: false
    },
    notes: 'All 4 evidentiary agreements and email exports received. Final settlement draft ready for client confirmation.',
    retainerStatus: 'signed',
    invoiceStatus: 'paid'
  },
  {
    id: 'cas-4',
    caseNumber: 'CAS-106',
    clientId: 'cli-4',
    clientName: 'Beatriz Morales',
    clientEmail: 'b.morales@globaltech.org',
    title: 'Intra-Company Transferee Specialized Knowledge Visa',
    caseType: 'immigration',
    status: 'new_intake',
    leadPractitioner: 'Elena Rostova, RCIC',
    createdAt: '2026-09-28',
    targetSubmissionDate: '2026-11-12',
    documentsCount: {
      total: 8,
      approved: 0,
      uploaded: 0,
      needsFix: 0,
      pending: 8
    },
    nextDeadline: {
      title: 'LMIA Exemption Compliance Filing',
      date: '2026-10-14',
      daysLeft: 14,
      isOverdue: false
    },
    notes: 'Form auto-created from Immigration Intake Form. Document checklist auto-assigned from ICT Tech Template.',
    retainerStatus: 'sent',
    invoiceStatus: 'pending'
  }
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  // Case 1: Rahim Khan
  {
    id: 'doc-1',
    caseId: 'cas-1',
    name: 'Valid Passport (All Stamped Pages)',
    description: 'Color scan of photo page and all entry/exit stamps. Must have at least 6 months validity.',
    category: 'Identity',
    acceptedFormats: ['PDF', 'JPG', 'PNG'],
    maxSizeMb: 25,
    dueDate: '2026-10-02',
    status: 'approved',
    uploadedAt: '2026-09-18 14:20',
    fileName: 'Rahim_Khan_Passport_FullScan.pdf',
    fileSize: '4.8 MB',
    fileType: 'application/pdf',
    approvedAt: '2026-09-19 09:15',
    isSensitive: true
  },
  {
    id: 'doc-2',
    caseId: 'cas-1',
    name: 'Language Proficiency Test (IELTS / CELPIP)',
    description: 'Official test score report within last 24 months. Minimum CLB 7 across all four bands.',
    category: 'Eligibility',
    acceptedFormats: ['PDF', 'PNG'],
    maxSizeMb: 10,
    dueDate: '2026-10-02',
    status: 'approved',
    uploadedAt: '2026-09-19 11:04',
    fileName: 'CELPIP_General_OfficialResult_Khan.pdf',
    fileSize: '1.2 MB',
    fileType: 'application/pdf',
    approvedAt: '2026-09-19 16:30'
  },
  {
    id: 'doc-3',
    caseId: 'cas-1',
    name: 'Police Clearance Certificate (Country of Origin)',
    description: 'National clearance certificate with official apostille or certified English translation.',
    category: 'Security',
    acceptedFormats: ['PDF', 'JPG'],
    maxSizeMb: 15,
    dueDate: '2026-10-02',
    status: 'approved',
    uploadedAt: '2026-09-22 10:15',
    fileName: 'Police_Clearance_CertifiedTranslation.pdf',
    fileSize: '2.6 MB',
    fileType: 'application/pdf',
    approvedAt: '2026-09-23 11:20',
    isSensitive: true
  },
  {
    id: 'doc-4',
    caseId: 'cas-1',
    name: 'Employer Reference Letter & Job Duties',
    description: 'Signed on company letterhead: job title, NOC code, exact duties, annual salary, hours/week.',
    category: 'Work History',
    acceptedFormats: ['PDF'],
    maxSizeMb: 10,
    dueDate: '2026-10-02',
    status: 'needs_fix',
    uploadedAt: '2026-09-27 16:45',
    fileName: 'ApexLogistics_EmploymentLetter_draft.pdf',
    fileSize: '890 KB',
    fileType: 'application/pdf',
    fixReason: 'The HR letter is missing the breakdown of weekly hours and NOC code duties. IRCC requires exact job duties to match NOC 21232.',
    fixRequestedAt: '2026-09-28 10:30'
  },
  {
    id: 'doc-5',
    caseId: 'cas-1',
    name: 'Bank Proof of Settlement Funds (Last 6 Months)',
    description: 'Official bank letter with average balance and detailed statements covering past 180 consecutive days.',
    category: 'Financial',
    acceptedFormats: ['PDF'],
    maxSizeMb: 30,
    dueDate: '2026-10-02',
    status: 'uploaded',
    uploadedAt: '2026-09-30 08:15',
    fileName: 'RBC_6Month_ChequingSavings_Combined.pdf',
    fileSize: '6.4 MB',
    fileType: 'application/pdf'
  },
  {
    id: 'doc-6',
    caseId: 'cas-1',
    name: 'Educational Credential Assessment (ECA - WES Report)',
    description: 'WES Canadian equivalency report for your Bachelor of Engineering degree.',
    category: 'Education',
    acceptedFormats: ['PDF'],
    maxSizeMb: 10,
    dueDate: '2026-10-05',
    status: 'pending'
  },

  // Case 2: Priya Sharma
  {
    id: 'doc-7',
    caseId: 'cas-2',
    name: 'Corporate Bank Statements Q1-Q4',
    description: 'Official electronic PDF statements from all operating and high-interest business accounts.',
    category: 'Banking',
    acceptedFormats: ['PDF', 'CSV'],
    maxSizeMb: 25,
    dueDate: '2026-09-28',
    status: 'needs_fix',
    uploadedAt: '2026-09-25 12:00',
    fileName: 'TD_Business_Statement_OctNov.pdf',
    fileSize: '1.9 MB',
    fileType: 'application/pdf',
    fixReason: 'Statements for December and January are missing. We need all 12 fiscal months to reconcile cash flow.',
    fixRequestedAt: '2026-09-26 14:00'
  },
  {
    id: 'doc-8',
    caseId: 'cas-2',
    name: 'SR&ED Eligible Project Technical Log',
    description: 'Summary of technical uncertainties, experiments conducted, and staff hours allocated to R&D.',
    category: 'Tax Credit',
    acceptedFormats: ['PDF', 'DOCX', 'XLSX'],
    maxSizeMb: 20,
    dueDate: '2026-10-04',
    status: 'approved',
    uploadedAt: '2026-09-12 18:30',
    fileName: 'SolarKit_SRED_TechnicalSummary_v2.pdf',
    fileSize: '3.1 MB',
    fileType: 'application/pdf',
    approvedAt: '2026-09-15 10:00'
  },
  {
    id: 'doc-9',
    caseId: 'cas-2',
    name: 'Payroll Summary Report (T4 / T4A Register)',
    description: 'Year-end payroll summary showing gross wages, CPP, EI, and income tax deducted per employee.',
    category: 'Payroll',
    acceptedFormats: ['PDF', 'XLSX'],
    maxSizeMb: 15,
    dueDate: '2026-10-10',
    status: 'pending'
  },

  // Case 3: Liam O'Connor
  {
    id: 'doc-10',
    caseId: 'cas-3',
    name: 'Master Service Agreement with Defendant',
    description: 'Fully signed MSA dated June 2024 including IP ownership clauses and Exhibit B.',
    category: 'Contracts',
    acceptedFormats: ['PDF'],
    maxSizeMb: 15,
    dueDate: '2026-09-25',
    status: 'approved',
    uploadedAt: '2026-09-21 09:40',
    fileName: 'MSA_Signed_Counterpart_2024.pdf',
    fileSize: '2.4 MB',
    fileType: 'application/pdf',
    approvedAt: '2026-09-21 14:10'
  },
  {
    id: 'doc-11',
    caseId: 'cas-3',
    name: 'Audit Trail of Unauthorized Software Commits',
    description: 'Export of Git repository logs and AWS access timestamps demonstrating proprietary code extraction.',
    category: 'Evidence',
    acceptedFormats: ['PDF', 'ZIP'],
    maxSizeMb: 50,
    dueDate: '2026-09-29',
    status: 'uploaded',
    uploadedAt: '2026-09-29 17:15',
    fileName: 'Git_Access_Audit_Log_Sept2026.pdf',
    fileSize: '8.1 MB',
    fileType: 'application/pdf'
  }
];

export const INITIAL_DEADLINES: CaseDeadline[] = [
  {
    id: 'dl-1',
    caseId: 'cas-1',
    title: 'IRCC Portal Document Submission Window',
    date: '2026-10-02',
    type: 'filing_deadline',
    description: 'Deadline to upload revised job letter and settlement funds statement to IRCC online portal.',
    autoRemindDaysBefore: [7, 3, 1],
    clientNotified: true,
    isOverdue: false
  },
  {
    id: 'dl-2',
    caseId: 'cas-2',
    title: 'CRA Q3 Corporate Tax Installment Payment',
    date: '2026-09-28',
    type: 'client_deadline',
    description: 'Estimated $4,200 quarterly remittal due to Canada Revenue Agency to avoid interest penalty.',
    autoRemindDaysBefore: [7, 3, 1],
    clientNotified: true,
    isOverdue: true
  },
  {
    id: 'dl-3',
    caseId: 'cas-3',
    title: 'Pre-Trial Discovery Conferral Conference',
    date: '2026-10-06',
    type: 'hearing_date',
    description: 'Virtual meeting with opposing legal counsel regarding document exchange stipulations.',
    autoRemindDaysBefore: [5, 2],
    clientNotified: true,
    isOverdue: false
  },
  {
    id: 'dl-4',
    caseId: 'cas-1',
    title: 'Biometrics Expiration & Medical Exam Validity',
    date: '2026-10-25',
    type: 'renewal_expiry',
    description: 'Past medical exam result expires on this date. Must file before this cutoff.',
    autoRemindDaysBefore: [14, 7],
    clientNotified: false,
    isOverdue: false
  },
  {
    id: 'dl-5',
    caseId: 'cas-4',
    title: 'Employer LMIA Exemption Fee Payment Cutoff',
    date: '2026-10-14',
    type: 'filing_deadline',
    description: 'Canadian employer must pay $230 compliance fee and submit offer of employment.',
    autoRemindDaysBefore: [7, 3],
    clientNotified: false,
    isOverdue: false
  }
];

export const INTAKE_TEMPLATES: IntakeFormTemplate[] = [
  {
    id: 'tpl-1',
    title: 'Canadian Express Entry & PR Intake',
    subtitle: 'Collects applicant biographic data, work history, NOC code, language score, and dependent details.',
    category: 'immigration',
    autoCreateCase: true,
    assignedChecklistTemplateId: 'chk-immigration-express',
    estimatedTimeToComplete: '7-10 mins',
    submissionCount: 28,
    shareableSlug: 'express-entry-intake',
    fields: [
      { id: 'f1', label: 'Full Legal Name (as shown in passport)', type: 'text', placeholder: 'e.g. Rahim Khan', required: true },
      { id: 'f2', label: 'Primary Email Address', type: 'email', placeholder: 'rahim@example.com', required: true },
      { id: 'f3', label: 'Mobile / WhatsApp Number', type: 'phone', placeholder: '+1 (416) 000-0000', required: true },
      { id: 'f4', label: 'Current Canadian Status', type: 'select', options: ['Post-Graduation Work Permit (PGWP)', 'Closed Employer Work Permit', 'Visitor / Tourist', 'Outside Canada (FSW)'], required: true },
      { id: 'f5', label: 'Do you have accompanying spouse or dependent children?', type: 'select', options: ['No, single applicant', 'Yes, spouse only', 'Yes, spouse and children'], required: true },
      { id: 'f6', label: 'Upload Current Work Permit or Visa', type: 'file', required: true, helpText: 'Clear PDF or photo of current permit document' },
      { id: 'f7', label: 'Brief description of Canadian work experience', type: 'textarea', placeholder: 'Company name, title, start date, and main duties...', required: false }
    ]
  },
  {
    id: 'tpl-2',
    title: 'Corporate Year-End Accounting & T2 Intake',
    subtitle: 'Streamlines financial year-end intake for incorporated small businesses, contractors, and agencies.',
    category: 'tax_accounting',
    autoCreateCase: true,
    assignedChecklistTemplateId: 'chk-corp-tax',
    estimatedTimeToComplete: '5-8 mins',
    submissionCount: 42,
    shareableSlug: 'corp-tax-onboarding',
    fields: [
      { id: 'f20', label: 'Incorporated Business Name', type: 'text', placeholder: 'e.g. SolarKit Energy Inc.', required: true },
      { id: 'f21', label: 'Business Number (BN9)', type: 'text', placeholder: 'e.g. 123456789 RC0001', required: true },
      { id: 'f22', label: 'Primary Bookkeeper / Director Email', type: 'email', placeholder: 'director@company.com', required: true },
      { id: 'f23', label: 'Fiscal Year-End Date', type: 'date', required: true },
      { id: 'f24', label: 'Accounting Software Used', type: 'select', options: ['QuickBooks Online', 'Xero', 'Wave Accounting', 'Excel / Paper Receipts', 'Other'], required: true },
      { id: 'f25', label: 'Did the company engage in Scientific Research (SR&ED)?', type: 'select', options: ['Yes, we spent on technical R&D', 'No R&D activities', 'Unsure, would like review'], required: true },
      { id: 'f26', label: 'Upload Trial Balance or General Ledger Export', type: 'file', required: false }
    ]
  },
  {
    id: 'tpl-3',
    title: 'Commercial Dispute & Retainer Intake',
    subtitle: 'Secure intake questionnaire for business litigation, contract disputes, and partnership dissolutions.',
    category: 'legal_contract',
    autoCreateCase: true,
    assignedChecklistTemplateId: 'chk-commercial-litigation',
    estimatedTimeToComplete: '8-12 mins',
    submissionCount: 19,
    shareableSlug: 'legal-dispute-intake',
    fields: [
      { id: 'f30', label: 'Client / Entity Name', type: 'text', placeholder: 'e.g. O’Connor Industrial Design', required: true },
      { id: 'f31', label: 'Opposing Party / Company Name', type: 'text', placeholder: 'e.g. Nexa Systems Corp.', required: true },
      { id: 'f32', label: 'Type of Dispute', type: 'select', options: ['Breach of Contract', 'Intellectual Property Theft', 'Shareholder / Partnership', 'Unpaid Invoices / Debt Recovery'], required: true },
      { id: 'f33', label: 'Estimated Claim Amount (CAD)', type: 'text', placeholder: '$75,000', required: true },
      { id: 'f34', label: 'Upload Contested Agreement or Contract', type: 'file', required: true },
      { id: 'f35', label: 'Summary of Events and Key Dates', type: 'textarea', placeholder: 'Provide chronological summary of the dispute...', required: true }
    ]
  }
];

export const INITIAL_MESSAGES: MessageRecord[] = [
  {
    id: 'msg-1',
    caseId: 'cas-1',
    sender: 'practitioner',
    senderName: 'Elena Rostova, RCIC',
    content: 'Hi Rahim, welcome to Chasefree! I reviewed your first batch of documents. Your passport and CELPIP test results are approved and look great.',
    timestamp: '2026-09-19 16:35',
    isRead: true
  },
  {
    id: 'msg-2',
    caseId: 'cas-1',
    sender: 'client',
    senderName: 'Rahim Khan',
    content: 'Thank you Elena! I just uploaded my updated RBC bank statements covering the past 6 months.',
    timestamp: '2026-09-30 08:20',
    attachmentName: 'RBC_6Month_ChequingSavings_Combined.pdf',
    attachmentSize: '6.4 MB',
    isRead: true
  },
  {
    id: 'msg-3',
    caseId: 'cas-1',
    sender: 'practitioner',
    senderName: 'Elena Rostova, RCIC',
    content: 'Got the bank statements! Regarding the employer letter from Apex Logistics: it was missing the breakdown of weekly hours and NOC duties. I flagged it with a note in your checklist. Could you ask HR to add that single paragraph?',
    timestamp: '2026-09-30 09:10',
    isRead: false
  }
];

export const INITIAL_INVOICES: InvoiceRecord[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2026-089',
    caseId: 'cas-1',
    clientName: 'Rahim Khan',
    amount: 1250.00,
    dueDate: '2026-09-25',
    status: 'paid',
    paidAt: '2026-09-24 15:40',
    paymentMethod: 'Credit Card (Stripe · Visa *4242)',
    items: [
      { description: 'Initial Retainer - Express Entry PR Representation', amount: 1000.00 },
      { description: 'IRCC Document Review & Assessment Fee', amount: 250.00 }
    ]
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2026-094',
    caseId: 'cas-2',
    clientName: 'Priya Sharma',
    amount: 2200.00,
    dueDate: '2026-10-10',
    status: 'sent',
    items: [
      { description: 'FY2025 Corporate T2 Preparation & Filing', amount: 1500.00 },
      { description: 'SR&ED Scientific Research Tax Credit Schedule', amount: 700.00 }
    ]
  },
  {
    id: 'inv-3',
    invoiceNumber: 'INV-2026-096',
    caseId: 'cas-3',
    clientName: 'Liam O’Connor',
    amount: 3500.00,
    dueDate: '2026-10-01',
    status: 'paid',
    paidAt: '2026-09-28 11:15',
    paymentMethod: 'Interac e-Transfer',
    items: [
      { description: 'Litigation Retainer & Demand Letter Drafting', amount: 3500.00 }
    ]
  },
  {
    id: 'inv-4',
    invoiceNumber: 'INV-2026-101',
    caseId: 'cas-4',
    clientName: 'Beatriz Morales',
    amount: 1400.00,
    dueDate: '2026-10-15',
    status: 'draft',
    items: [
      { description: 'Intra-Company Transferee Work Permit Consultation', amount: 1400.00 }
    ]
  }
];

export const INITIAL_RETAINERS: RetainerRecord[] = [
  {
    id: 'ret-1',
    caseId: 'cas-1',
    clientName: 'Rahim Khan',
    title: 'RCIC Immigration Services Legal Retainer Agreement',
    amount: 2500.00,
    status: 'signed',
    sentDate: '2026-09-15',
    signedDate: '2026-09-16 11:42',
    signeeName: 'Rahim Khan',
    auditTrail: [
      { action: 'Agreement Created & Sent via Magic Link', timestamp: '2026-09-15 10:14', ipAddress: '198.51.100.22' },
      { action: 'Viewed in Client Portal (Mobile iOS)', timestamp: '2026-09-16 11:35', ipAddress: '142.250.80.45' },
      { action: 'Digitally Signed & Certified with SHA-256 Stamp', timestamp: '2026-09-16 11:42', ipAddress: '142.250.80.45' }
    ]
  },
  {
    id: 'ret-2',
    caseId: 'cas-2',
    clientName: 'Priya Sharma',
    title: 'CPA Engagement Letter for Corporate Tax & Financial Reporting',
    amount: 3200.00,
    status: 'signed',
    sentDate: '2026-09-08',
    signedDate: '2026-09-09 14:10',
    signeeName: 'Priya Sharma, CEO',
    auditTrail: [
      { action: 'Engagement Sent', timestamp: '2026-09-08 16:00', ipAddress: '198.51.100.22' },
      { action: 'Signed via Touchscreen', timestamp: '2026-09-09 14:10', ipAddress: '70.28.112.9' }
    ]
  },
  {
    id: 'ret-3',
    caseId: 'cas-4',
    clientName: 'Beatriz Morales',
    title: 'Legal Representation Agreement - ICT Visa Onboarding',
    amount: 2800.00,
    status: 'sent',
    sentDate: '2026-09-28',
    auditTrail: [
      { action: 'Drafted from Template', timestamp: '2026-09-28 14:00', ipAddress: '198.51.100.22' },
      { action: 'E-Sign Link Delivered via SMS & Email', timestamp: '2026-09-28 14:05', ipAddress: '198.51.100.22' }
    ]
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-1',
    timestamp: '2026-09-30 09:10',
    user: 'Elena Rostova (RCIC)',
    action: 'Requested Document Fix',
    details: 'Flagged Employer Reference Letter for CAS-104 (Rahim Khan) with reason note',
    ipAddress: '198.51.100.22',
    status: 'warning'
  },
  {
    id: 'log-2',
    timestamp: '2026-09-30 08:15',
    user: 'Rahim Khan (Client)',
    action: 'Document Uploaded',
    details: 'Uploaded RBC_6Month_ChequingSavings_Combined.pdf (6.4 MB) via Secure Magic Link',
    ipAddress: '142.250.80.45',
    status: 'success'
  },
  {
    id: 'log-3',
    timestamp: '2026-09-29 18:00',
    user: 'System Automated Daemon',
    action: 'Automated Reminder Dispatched',
    details: 'Sent 48h deadline reminder via WhatsApp & Email to Priya Sharma (CAS-102)',
    ipAddress: '10.0.4.12',
    status: 'success'
  },
  {
    id: 'log-4',
    timestamp: '2026-09-28 15:10',
    user: 'System Security Center',
    action: 'Virus Scan Verified',
    details: 'Clean checksum on upload doc-5: ClamAV & SHA-256 verified without flags',
    ipAddress: '10.0.8.99',
    status: 'success'
  },
  {
    id: 'log-5',
    timestamp: '2026-09-28 11:15',
    user: 'Liam O’Connor (Client)',
    action: 'Invoice Settled',
    details: 'Paid INV-2026-096 ($3,500.00 CAD) via Interac e-Transfer verification',
    ipAddress: '24.114.33.12',
    status: 'success'
  }
];
