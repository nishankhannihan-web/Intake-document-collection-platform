import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Download, 
  History, 
  Building2, 
  Palette, 
  Bell, 
  Check, 
  AlertCircle,
  Database,
  Smartphone,
  EyeOff
} from 'lucide-react';
import { INITIAL_AUDIT_LOGS } from '../../mockData';
import { Button } from '../common/Button';
import { useToast } from '../common/Toast';

export const SettingsView: React.FC = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'security' | 'branding' | 'notifications' | 'privacy'>('security');

  // Branding states
  const [practiceName, setPracticeName] = useState('Apex Legal & Immigration Advisory');
  const [supportEmail, setSupportEmail] = useState('elena@apeximmigration.ca');
  const [phone, setPhone] = useState('+1 (416) 555-0199');
  const [accentColor, setAccentColor] = useState('#FFBE0B');

  // Security Toggles
  const [virusScanEnabled, setVirusScanEnabled] = useState(true);
  const [pdfWatermarkEnabled, setPdfWatermarkEnabled] = useState(true);
  const [magicLinkExpiryDays, setMagicLinkExpiryDays] = useState('14');

  const handleExportData = () => {
    addToast('success', 'GDPR/PIPEDA Export Initiated', 'Full encrypted ZIP export generated and sent to practice email.');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#EADFC4] shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-[#2A2312] flex items-center gap-2">
            <ShieldCheck size={22} className="text-[#FFBE0B]" />
            Settings & Security Center
          </h2>
          <p className="text-xs text-[#6B6147] mt-0.5">
            Client data encryption, access audit trails, practice branding, and statutory compliance controls.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Download size={14} />}
            onClick={handleExportData}
          >
            Export All Client Data (GDPR)
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EADFC4] pb-1 overflow-x-auto text-xs font-bold">
        {[
          { id: 'security', label: 'Security & Access Logs', icon: <Lock size={14} /> },
          { id: 'branding', label: 'Firm Branding & Portal Theme', icon: <Building2 size={14} /> },
          { id: 'notifications', label: 'SMS & WhatsApp Gateway', icon: <Bell size={14} /> },
          { id: 'privacy', label: 'Data Retention & Residency', icon: <Database size={14} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-2 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-[#FFBE0B] text-[#2A2312]'
                : 'border-transparent text-[#6B6147] hover:text-[#2A2312]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: SECURITY CENTER & AUDIT LOG */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Security Score Card */}
          <div className="p-5 rounded-2xl bg-white border border-[#EADFC4] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800">
                <ShieldCheck size={28} />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase">
                  SECURITY HEALTH STATUS
                </span>
                <h3 className="text-base font-bold text-[#2A2312]">
                  100% Protected · Grade A Compliance
                </h3>
                <p className="text-xs text-[#6B6147]">
                  AES-256 at rest, TLS 1.3 in transit, automated anti-virus scan, and passwordless magic tokens.
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-emerald-900 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
              ✓ MFA Enforced
            </span>
          </div>

          {/* Security Preferences Toggles */}
          <div className="bg-white p-5 rounded-2xl border border-[#EADFC4] shadow-xs space-y-4 text-xs">
            <h3 className="text-sm font-bold text-[#2A2312]">
              Practitioner & Client Security Policies
            </h3>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F0] border border-[#EADFC4] cursor-pointer">
                <div>
                  <div className="font-bold text-[#2A2312]">Automatic Malware & Virus Scanning</div>
                  <div className="text-[11px] text-[#6B6147]">Inspects every PDF, JPG, and ZIP upload before practitioner view</div>
                </div>
                <input
                  type="checkbox"
                  checked={virusScanEnabled}
                  onChange={(e) => setVirusScanEnabled(e.target.checked)}
                  className="w-4 h-4 accent-[#FFBE0B]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F0] border border-[#EADFC4] cursor-pointer">
                <div>
                  <div className="font-bold text-[#2A2312]">Confidential PDF Watermarking</div>
                  <div className="text-[11px] text-[#6B6147]">Applies subtle client name & date watermark to downloaded evidentiary documents</div>
                </div>
                <input
                  type="checkbox"
                  checked={pdfWatermarkEnabled}
                  onChange={(e) => setPdfWatermarkEnabled(e.target.checked)}
                  className="w-4 h-4 accent-[#FFBE0B]"
                />
              </label>

              <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#EADFC4] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#2A2312]">Magic Link Expiration Window</div>
                  <div className="text-[11px] text-[#6B6147]">How long before a client link requires automated SMS re-authentication</div>
                </div>
                <select
                  value={magicLinkExpiryDays}
                  onChange={(e) => setMagicLinkExpiryDays(e.target.value)}
                  className="p-1.5 rounded-lg border border-[#EADFC4] bg-white text-xs font-semibold text-[#2A2312]"
                >
                  <option value="7">7 Days</option>
                  <option value="14">14 Days (Default)</option>
                  <option value="30">30 Days</option>
                </select>
              </div>
            </div>
          </div>

          {/* Audit Log Table */}
          <div className="bg-white rounded-2xl border border-[#EADFC4] shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#EADFC4] bg-[#FAF7F0] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#2A2312]">
                  Real-Time Security Access & Audit Log
                </h3>
                <p className="text-[11px] text-[#6B6147]">
                  Cryptographic log of all document views, uploads, e-signatures, and IP addresses.
                </p>
              </div>
              <span className="text-[11px] font-mono text-[#6B6147]">
                SHA-256 Tamper-Proof
              </span>
            </div>

            <div className="divide-y divide-[#EADFC4]/60 text-xs">
              {INITIAL_AUDIT_LOGS.map(log => (
                <div key={log.id} className="p-3.5 flex items-start justify-between gap-3 hover:bg-[#FAF7F0]/40">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#2A2312]">{log.action}</span>
                      <span className="text-[11px] text-[#6B6147]">by {log.user}</span>
                    </div>
                    <p className="text-[#6B6147] text-[11px]">{log.details}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono text-[10px] text-[#6B6147] block">{log.timestamp}</span>
                    <span className="font-mono text-[10px] text-[#2A2312] font-semibold">{log.ipAddress}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BRANDING */}
      {activeTab === 'branding' && (
        <div className="bg-white p-6 rounded-2xl border border-[#EADFC4] shadow-xs space-y-4 max-w-xl text-xs">
          <h3 className="text-sm font-bold text-[#2A2312]">
            Client Portal Custom Branding
          </h3>
          <p className="text-[#6B6147]">
            Your clients see this firm identity when opening their magic link. No Chasefree branding is shown to clients.
          </p>

          <div>
            <label className="font-semibold text-[#2A2312] block mb-1">Practice / Firm Name:</label>
            <input
              type="text"
              value={practiceName}
              onChange={(e) => setPracticeName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#EADFC4] bg-[#FAF7F0] text-[#2A2312]"
            />
          </div>

          <div>
            <label className="font-semibold text-[#2A2312] block mb-1">Direct Practitioner Contact Email:</label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#EADFC4] bg-[#FAF7F0] text-[#2A2312]"
            />
          </div>

          <div>
            <label className="font-semibold text-[#2A2312] block mb-1">Support Phone / SMS Line:</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#EADFC4] bg-[#FAF7F0] text-[#2A2312]"
            />
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => addToast('success', 'Branding Saved', 'Client portal appearance updated.')}
          >
            Save Brand Settings
          </Button>
        </div>
      )}

      {/* TAB 3: NOTIFICATIONS GATEWAY */}
      {activeTab === 'notifications' && (
        <div className="bg-white p-6 rounded-2xl border border-[#EADFC4] shadow-xs space-y-4 text-xs max-w-xl">
          <h3 className="text-sm font-bold text-[#2A2312]">
            SMS & WhatsApp Dispatch Gateway
          </h3>
          <p className="text-[#6B6147]">
            Auto-reminders are relayed through high-deliverability Canadian and US shortcodes.
          </p>

          <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#EADFC4] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone size={16} className="text-[#2A2312]" />
              <span className="font-bold text-[#2A2312]">Twilio SMS Gateway:</span>
            </div>
            <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Connected
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#EADFC4] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-[#2A2312]" />
              <span className="font-bold text-[#2A2312]">WhatsApp Business API:</span>
            </div>
            <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Connected
            </span>
          </div>
        </div>
      )}

      {/* TAB 4: PRIVACY & RESIDENCY */}
      {activeTab === 'privacy' && (
        <div className="bg-white p-6 rounded-2xl border border-[#EADFC4] shadow-xs space-y-4 text-xs max-w-xl">
          <h3 className="text-sm font-bold text-[#2A2312]">
            Statutory Data Retention & Residency
          </h3>
          <p className="text-[#6B6147]">
            Client records are stored in Canadian and North American SOC-2 certified cloud regions meeting Law Society, CPA Ontario/BC, and IRCC guidelines.
          </p>

          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#EADFC4]">
              <span className="font-bold text-[#2A2312] block">Data Residency:</span>
              <span className="text-[#6B6147]">Canada Central (Montreal / Toronto Tier-4 Datacenter)</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#EADFC4]">
              <span className="font-bold text-[#2A2312] block">Mandatory Retention:</span>
              <span className="text-[#6B6147]">7 Years (conforms to IRCC and CRA audit retention statutory rules)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
