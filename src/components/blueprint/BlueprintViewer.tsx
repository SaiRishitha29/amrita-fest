import React, { useState } from 'react';
import { 
  FileCode, Layers, ShieldCheck, Database, GitBranch, 
  Cpu, Activity, CheckCircle2, ChevronRight, Download 
} from 'lucide-react';

export const BlueprintViewer: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<string>('exec');

  const sections = [
    { id: 'exec', title: '1. Executive Architecture', icon: <Layers size={15} /> },
    { id: 'roles', title: '4. User & Admin Roles', icon: <ShieldCheck size={15} /> },
    { id: 'clubs', title: '5. 13-Club Admin Model', icon: <Cpu size={15} /> },
    { id: 'qr', title: '7 & 26. QR Atomic Engine', icon: <Activity size={15} /> },
    { id: 'db', title: '12. Database Schema (18 Tables)', icon: <Database size={15} /> },
    { id: 'git', title: '19. GitHub Organization Strategy', icon: <GitBranch size={15} /> },
    { id: 'scale', title: '14. Scalability (~3,500 Users)', icon: <Activity size={15} /> },
    { id: 'steps', title: '30. Implementation Roadmap', icon: <CheckCircle2 size={15} /> },
  ];

  return (
    <section style={{ padding: '30px 0 60px' }}>
      
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span className="badge-gold" style={{ marginBottom: '8px' }}>Official System Specification</span>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 4vw, 42px)', color: '#FFF' }}>
          Amrita Amaravati Fest Blueprint
        </h2>
        <p style={{ color: 'var(--c-text-secondary)', maxWidth: '640px', margin: '8px auto 0', fontSize: '15px' }}>
          Interactive technical blueprint defining the entire product architecture, database schema, atomic redemption engine, and GitHub governance.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr',
        gap: '24px',
        maxWidth: '1100px',
        margin: '0 auto'
      }}>
        
        {/* Left Section Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedSection(s.id)}
              style={{
                background: selectedSection === s.id ? 'linear-gradient(135deg, rgba(221,187,99,0.2), rgba(163,128,45,0.2))' : 'rgba(255,255,255,0.03)',
                color: selectedSection === s.id ? 'var(--c-gold-bright)' : 'var(--c-text-secondary)',
                border: selectedSection === s.id ? '1px solid var(--c-gold)' : '1px solid rgba(255,255,255,0.06)',
                padding: '12px 14px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 600,
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {s.icon}
                <span>{s.title}</span>
              </div>
              <ChevronRight size={14} style={{ opacity: selectedSection === s.id ? 1 : 0.3 }} />
            </button>
          ))}
        </div>

        {/* Right Section Content Detail */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          
          {selectedSection === 'exec' && (
            <div>
              <span className="badge-gold">Layered Architecture</span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: '#FFF', margin: '8px 0 16px' }}>
                Executive Architecture Stack
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--c-text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
                The platform is architected as an enterprise fest management engine rather than a passive information brochure, engineered for 3,500+ burst visitors with stateless horizontal scaling.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                <div className="glass-card" style={{ padding: '14px' }}>
                  <div style={{ color: 'var(--c-gold)', fontWeight: 700 }}>Frontend Layer</div>
                  <div style={{ color: '#FFF', marginTop: '2px' }}>Next.js / Vite + TypeScript + Vanilla CSS Design Tokens</div>
                </div>
                <div className="glass-card" style={{ padding: '14px' }}>
                  <div style={{ color: 'var(--c-gold)', fontWeight: 700 }}>Database & Persistence</div>
                  <div style={{ color: '#FFF', marginTop: '2px' }}>PostgreSQL via Supabase with Connection Pooling</div>
                </div>
                <div className="glass-card" style={{ padding: '14px' }}>
                  <div style={{ color: 'var(--c-gold)', fontWeight: 700 }}>Authentication & Identity</div>
                  <div style={{ color: '#FFF', marginTop: '2px' }}>Amrita Student Institutional SSO & Roll Verification</div>
                </div>
                <div className="glass-card" style={{ padding: '14px' }}>
                  <div style={{ color: 'var(--c-gold)', fontWeight: 700 }}>Access & Redemptions</div>
                  <div style={{ color: '#FFF', marginTop: '2px' }}>Server-generated Opaque QR Tokens + Atomic DB Locks</div>
                </div>
              </div>
            </div>
          )}

          {selectedSection === 'roles' && (
            <div>
              <span className="badge-purple">RBAC Matrix</span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: '#FFF', margin: '8px 0 16px' }}>
                User & Admin Authorization Roles
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                <div className="glass-card" style={{ padding: '12px 14px' }}>
                  <strong style={{ color: 'var(--c-gold)' }}>Super Admin / Major Admin:</strong> Full platform control, users, 13 clubs, stalls, payments, scans, reports, configuration.
                </div>
                <div className="glass-card" style={{ padding: '12px 14px' }}>
                  <strong style={{ color: '#C084FC' }}>Club Admin (13 Clubs):</strong> Strict row-level isolation. Only their club, their events, their registrations, their scanners and reports.
                </div>
                <div className="glass-card" style={{ padding: '12px 14px' }}>
                  <strong style={{ color: '#38BDF8' }}>Stall Admin:</strong> Only assigned stall products, orders, payments/status and one-time pickup scanner.
                </div>
                <div className="glass-card" style={{ padding: '12px 14px' }}>
                  <strong style={{ color: '#34D399' }}>Student (~3,500):</strong> Own profile, verified pre-paid ₹750 fest pass, multi-event QR, personal registrations.
                </div>
                <div className="glass-card" style={{ padding: '12px 14px' }}>
                  <strong style={{ color: '#F43F5E' }}>Visitor / Outsider:</strong> External registration, tier pricing, campus hostel accommodation allocation, visitor QR.
                </div>
              </div>
            </div>
          )}

          {selectedSection === 'clubs' && (
            <div>
              <span className="badge-gold">Row-Level Governance</span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: '#FFF', margin: '8px 0 16px' }}>
                13-Club Administration Architecture
              </h3>

              <div className="glass-panel" style={{ padding: '16px', background: 'rgba(221,187,99,0.06)', marginBottom: '16px' }}>
                <code style={{ color: 'var(--c-gold)', fontSize: '13px' }}>
                  POLICY RULE: request.user.role == 'CLUB_ADMIN' AND request.user.club_id == resource.club_id
                </code>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--c-text-secondary)', lineHeight: 1.6 }}>
                Create 13 club records in the centralized database. <strong>Do NOT create 13 separate codebases or databases.</strong> 
                Each club possesses an immutable <code>club_id</code>, club metadata, assigned admin user IDs, hosted competitions, capacity, scanner permissions, and isolated telemetry.
              </p>
            </div>
          )}

          {selectedSection === 'qr' && (
            <div>
              <span className="badge-cyan">Atomic Execution</span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: '#FFF', margin: '8px 0 16px' }}>
                QR Token & Atomic Redemption Engine
              </h3>

              <div className="glass-panel" style={{ padding: '16px', marginBottom: '16px' }}>
                <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#38BDF8', lineHeight: 1.7 }}>
                  SCAN → AUTHENTICATE SCANNER → READ TOKEN → LOOK UP TOKEN → CHECK PURPOSE/EVENT → CHECK ELIGIBILITY → ATOMIC REDEMPTION → RETURN RESULT → WRITE AUDIT LOG
                </div>
              </div>

              <div style={{ fontSize: '13px', color: 'var(--c-text-secondary)', lineHeight: 1.6 }}>
                A single student QR is <strong>never globally invalidated</strong> after the first scan. 
                Instead, the backend checks for existing rows in <code>event_attendance</code> under the composite key <code>(event_id, qr_token)</code>. 
                This allows a single pass to cleanly unlock Garba Night, Auto Expo, and DJ Night once each while completely rejecting duplicates.
              </div>
            </div>
          )}

          {selectedSection === 'db' && (
            <div>
              <span className="badge-gold">PostgreSQL Relational Core</span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: '#FFF', margin: '8px 0 16px' }}>
                Database Schema (18 Core Tables)
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', fontSize: '12px' }}>
                {['users', 'students', 'visitors', 'clubs', 'club_admins', 'fest_events', 'club_events', 'registrations', 'event_registrations', 'payments', 'qr_tokens', 'event_attendance', 'stalls', 'products', 'orders', 'order_items', 'scan_logs', 'audit_logs'].map(t => (
                  <div key={t} className="glass-card" style={{ padding: '8px 12px', fontFamily: 'monospace', color: 'var(--c-gold-bright)' }}>
                    📦 {t}
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedSection === 'git' && (
            <div>
              <span className="badge-purple">GitHub Workflow</span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: '#FFF', margin: '8px 0 16px' }}>
                GitHub Organization & Branch Protection
              </h3>

              <p style={{ fontSize: '13px', color: 'var(--c-text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
                Centrally controlled repository under official fest GitHub Organization. 
                <strong>main</strong> is a protected production branch (zero direct pushes). 
                Feature contributions follow the branching convention: <code>feature/auth</code>, <code>feature/student-pass</code>, <code>feature/qr-scanner</code>, <code>feature/stall-marketplace</code>.
              </p>

              <div className="glass-card" style={{ padding: '14px', fontSize: '12px', fontFamily: 'monospace', color: 'var(--c-gold)' }}>
                Issue → Feature Branch → Local Test → PR Open → CI Checks (Lint/Typecheck) → 2-Person Code Review → Merge to Protected Main
              </div>
            </div>
          )}

          {selectedSection === 'scale' && (
            <div>
              <span className="badge-cyan">High Concurrency</span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: '#FFF', margin: '8px 0 16px' }}>
                Scalability & Peak-Load Mitigation (~3,500 Users)
              </h3>

              <ul style={{ fontSize: '13px', color: 'var(--c-text-secondary)', lineHeight: 1.7, paddingLeft: '18px' }}>
                <li>Do NOT query full students table on every request.</li>
                <li>Do NOT repeatedly generate QR bitmaps if stable opaque token can be reused.</li>
                <li>Keep QR validation endpoint lightweight with zero heavy join queries.</li>
                <li>Never trust client-side payment success: verify server signatures & webhooks.</li>
                <li>Connection pooling with PgBouncer to prevent database thread starvation.</li>
              </ul>
            </div>
          )}

          {selectedSection === 'steps' && (
            <div>
              <span className="badge-green">18 Implementation Steps</span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: '#FFF', margin: '8px 0 16px' }}>
                Step-by-Step Delivery Sequence
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                {[
                  'Step 1: Freeze requirements (13 clubs, pricing, RAILU integration)',
                  'Step 2: Create GitHub Organization & Branch Protections',
                  'Step 3: Setup environments (Local, Preview, Staging, Production)',
                  'Step 4: Seed PostgreSQL database & initial 13 clubs',
                  'Step 5: Student institutional authentication & RBAC',
                  'Step 6: Public festival portal & mega night showcases',
                  'Step 7: Student fest-pass QR credential & download engine',
                  'Step 8: Atomic QR redemption engine & dual-scan rejection',
                  'Step 9: 13 Club isolated portals & event registrations',
                  'Step 10: Payment gateway webhook & idempotency keys',
                  'Step 11: Stall marketplace, live cart & pickup redemption',
                  'Step 12: Visitor registration & hostel accommodation logic',
                  'Step 13: Super Admin operations dashboard & CSV exporters',
                  'Step 14: Security hardening, RLS & rate limits',
                  'Step 15: Concurrency load testing against burst traffic',
                  'Step 16: Dress rehearsal simulation with real mobile scanners',
                  'Step 17: Production freeze & backup verification',
                  'Step 18: Live fest operations & monitoring room',
                ].map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFF' }}>
                    <CheckCircle2 size={14} color="#10B981" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </section>
  );
};
