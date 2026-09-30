import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { useFest } from '../../context/FestContext';
import { 
  GraduationCap, CheckCircle2, QrCode, Download, 
  Sparkles, Calendar, ShieldCheck, ArrowRight, UserCheck, AlertTriangle, X 
} from 'lucide-react';

interface StudentPortalProps {
  loginModalOpen?: boolean;
  onCloseLoginModal?: () => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({ 
  loginModalOpen = false, 
  onCloseLoginModal = () => {} 
}) => {
  const { 
    currentUser, 
    students, 
    loginStudentByRoll, 
    attendance, 
    festEvents, 
    eventRegistrations,
    setActiveSection,
    currentRole,
    setRole
  } = useFest();

  const [rollInput, setRollInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [internalModalOpen, setInternalModalOpen] = useState(loginModalOpen);
  const ticketRef = useRef<HTMLDivElement>(null);

  // Active student record
  const activeStudent = students.find(s => s.id === currentUser.id) || students[0];

  useEffect(() => {
    setInternalModalOpen(loginModalOpen);
  }, [loginModalOpen]);

  // Generate crisp QR code on token change
  useEffect(() => {
    const token = currentUser.qrToken || activeStudent.qrToken;
    QRCode.toDataURL(token, {
      width: 280,
      margin: 2,
      color: {
        dark: '#05030F',
        light: '#FFFFFF'
      }
    }).then(url => {
      setQrDataUrl(url);
    }).catch(err => {
      console.error('QR code generation error:', err);
    });
  }, [currentUser, activeStudent]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollInput.trim()) return;
    const student = loginStudentByRoll(rollInput);
    if (student) {
      setLoginError('');
      setInternalModalOpen(false);
      onCloseLoginModal();
    } else {
      setLoginError('Student record not found in registered university database. Try e.g. AM.EN.U4CSE23045');
    }
  };

  const handleSampleSelect = (roll: string) => {
    loginStudentByRoll(roll);
    setLoginError('');
    setInternalModalOpen(false);
    onCloseLoginModal();
  };

  const handleDownloadTicket = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `amrita_fest_2026_pass_${activeStudent.rollNo}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Check event redemptions for this student's token
  const token = currentUser.qrToken || activeStudent.qrToken;
  const isGarbaRedeemed = attendance.some(a => a.eventId === 'fest-garba' && a.qrToken === token);
  const isAutoRedeemed = attendance.some(a => a.eventId === 'fest-auto' && a.qrToken === token);
  const isDjRedeemed = attendance.some(a => a.eventId === 'fest-dj' && a.qrToken === token);

  return (
    <section style={{ padding: 'clamp(36px, 6vw, 70px) 0' }}>
      
      {/* Editorial Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '36px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge-gold">AMRITA STUDENT CREDENTIAL</span>
            <span className="badge-parchment">RULE 1: ₹750 PRE-PAID</span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 5vw, 54px)',
            fontWeight: 700,
            color: 'var(--c-parchment)',
            lineHeight: 1.05
          }}>
            YOUR DIGITAL FEST PASS
          </h2>

          <p style={{
            fontFamily: 'Georgia, serif',
            color: 'rgba(233, 222, 255, 0.78)',
            fontSize: '15px',
            maxWidth: '660px',
            marginTop: '6px'
          }}>
            Non-negotiable Rule: Institutional fee already collected. Never charged twice. One unified cryptographic QR token reusable across all festival attractions.
          </p>
        </div>

        <button
          onClick={() => setInternalModalOpen(true)}
          className="btn-fest-ghost"
          style={{ fontSize: '12px' }}
        >
          <UserCheck size={14} />
          <span>Switch Student Account</span>
        </button>
      </div>

      {/* Main Grid: Holographic Festival Pass + Atomic Status */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '28px',
        maxWidth: '1060px',
        margin: '0 auto'
      }}>

        {/* Left Column: Luxury Digital Festival Pass */}
        <div>
          <div 
            ref={ticketRef} 
            className="fest-card"
            style={{
              padding: '28px 24px',
              background: 'linear-gradient(135deg, rgba(18, 10, 42, 0.95) 0%, rgba(9, 5, 24, 0.95) 100%)',
              border: '1.5px solid var(--c-gold)',
              borderRadius: '24px',
              boxShadow: '0 24px 70px rgba(0, 0, 0, 0.85), 0 0 35px rgba(221, 187, 99, 0.15)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Top Gold Metallic Sheen */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'var(--c-gold-gradient)',
            }} />

            {/* Credential Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '1px solid var(--c-gold)',
                  boxShadow: '0 0 10px var(--c-gold-glow)'
                }}>
                  <img src="/images/parinam-logo.jpg" alt="PARINAM" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <div>
                  <div style={{ fontFamily: 'var(--font-cinzel)', fontSize: '13px', fontWeight: 800, color: 'var(--c-parchment)', letterSpacing: '0.05em' }}>
                    PARIणाम 2026
                  </div>
                  <div style={{ fontSize: '9px', color: 'var(--c-gold)', fontFamily: 'var(--font-sans)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    AMRITA VISHWA VIDYAPEETHAM
                  </div>
                </div>
              </div>

              <span className="badge-gold" style={{ fontSize: '10px' }}>
                ₹750 PRE-PAID
              </span>
            </div>

            {/* Student ID Profile Section */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--line-gold-faint)',
              borderRadius: '16px',
              padding: '16px 20px',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '10px', color: 'var(--c-gold)', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 }}>
                STUDENT PASS HOLDER
              </div>

              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '26px',
                fontWeight: 700,
                color: '#FFF',
                marginTop: '4px',
                lineHeight: 1.1
              }}>
                {currentUser.role === 'student' ? currentUser.name : activeStudent.name}
              </div>

              <div style={{
                fontSize: '13px',
                color: 'var(--c-text-secondary)',
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '8px'
              }}>
                <span>Roll No: <strong style={{ color: 'var(--c-gold)' }}>{currentUser.rollNo || activeStudent.rollNo}</strong></span>
                <span>{activeStudent.department}</span>
              </div>

              <div style={{
                fontSize: '11px',
                color: 'var(--c-text-muted)',
                marginTop: '6px',
                display: 'flex',
                justifyContent: 'space-between',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                paddingTop: '6px'
              }}>
                <span>VALIDITY: 11 — 12 OCTOBER 2026</span>
                <span style={{ color: '#34D399', fontWeight: 700 }}>✓ VERIFIED ENROLLED</span>
              </div>
            </div>

            {/* High-Resolution QR Container (Rule 10: Opaque Cryptographic Token) */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
              marginBottom: '20px'
            }}>
              {qrDataUrl ? (
                <img 
                  src={qrDataUrl} 
                  alt="Student Fest Pass QR" 
                  style={{ width: '190px', height: '190px', display: 'block' }} 
                />
              ) : (
                <div style={{ width: '190px', height: '190px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', fontSize: '12px' }}>
                  Generating QR Token...
                </div>
              )}
              
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: '#080A10',
                fontWeight: 800,
                marginTop: '12px',
                letterSpacing: '0.06em',
                background: '#E2E8F0',
                padding: '4px 14px',
                borderRadius: '6px'
              }}>
                {token}
              </div>

              <div style={{ fontSize: '9px', color: '#64748B', marginTop: '6px', letterSpacing: '0.05em' }}>
                OPAQUE CRYPTOGRAPHIC TOKEN &bull; ZERO PLAINTEXT PII
              </div>
            </div>

            {/* Actions: Download & Test Scanner */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleDownloadTicket}
                className="btn-fest-gold"
                style={{ flex: 1, padding: '10px 14px', fontSize: '12px', justifyContent: 'center' }}
              >
                <Download size={14} />
                <span>Save Pass to Phone</span>
              </button>
              
              <button
                onClick={() => setActiveSection('scanner')}
                className="btn-fest-ghost"
                style={{ padding: '10px 14px', fontSize: '12px' }}
                title="Test in Gate Scanner"
              >
                <QrCode size={14} />
                <span>Test Gate Scan</span>
              </button>
            </div>

            <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '10px', color: 'var(--c-text-muted)', letterSpacing: '0.1em' }}>
              AMRITA VISHWA VIDYAPEETHAM &bull; NON-TRANSFERABLE CREDENTIAL
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Event Atomic Redemption Tracker (Rules 2, 3, 4) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Universal Pass Engine Verification Box */}
          <div className="fest-card" style={{ padding: '24px', border: '1px solid var(--line-gold-faint)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <ShieldCheck size={20} style={{ color: 'var(--c-gold)' }} />
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--c-parchment)' }}>
                Multi-Event Reusable QR Engine
              </h4>
            </div>

            <p style={{ fontSize: '13px', color: 'rgba(233, 222, 255, 0.8)', lineHeight: 1.6, marginBottom: '16px' }}>
              Your student pass operates under <strong>Atomic Event State Enforcement</strong>: this single QR token grants access to all 4 flagship attractions and club arenas. Each event can be redeemed exactly once.
            </p>

            {/* Atomic Access Status Matrix */}
            <div style={{ display: 'grid', gap: '10px' }}>
              
              {/* Garba Night Status */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '12px',
                border: '1px solid var(--line-gold-faint)'
              }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#FFF' }}>Garba & Dandiya Raas Night</div>
                  <div style={{ fontSize: '11px', color: 'var(--c-text-muted)' }}>11 October &bull; Central Amphitheatre & Lawns</div>
                </div>
                {isGarbaRedeemed ? (
                  <span style={{ color: '#F59E0B', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>REDEEMED</span>
                  </span>
                ) : (
                  <span style={{ color: '#34D399', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={13} />
                    <span>VALID (NOT USED)</span>
                  </span>
                )}
              </div>

              {/* Auto Expo Status */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '12px',
                border: '1px solid var(--line-gold-faint)'
              }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#FFF' }}>Amrita Grand Auto Expo</div>
                  <div style={{ fontSize: '11px', color: 'var(--c-text-muted)' }}>12 October &bull; Academic Boulevard</div>
                </div>
                {isAutoRedeemed ? (
                  <span style={{ color: '#F59E0B', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>REDEEMED</span>
                  </span>
                ) : (
                  <span style={{ color: '#34D399', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={13} />
                    <span>VALID (NOT USED)</span>
                  </span>
                )}
              </div>

              {/* DJ Night Status */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '12px',
                border: '1px solid var(--line-gold-faint)'
              }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#FFF' }}>Star Pronite — DJ Night</div>
                  <div style={{ fontSize: '11px', color: 'var(--c-text-muted)' }}>12 October &bull; Main Stadium Arena</div>
                </div>
                {isDjRedeemed ? (
                  <span style={{ color: '#F59E0B', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>REDEEMED</span>
                  </span>
                ) : (
                  <span style={{ color: '#34D399', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={13} />
                    <span>VALID (NOT USED)</span>
                  </span>
                )}
              </div>

            </div>
          </div>

          {/* Registered Club Events Card */}
          <div className="fest-card" style={{ padding: '24px', border: '1px solid var(--line-gold-faint)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--c-parchment)' }}>
                Your Registered Club Events
              </h4>
              <span className="badge-gold">
                {eventRegistrations.filter(r => r.userId === currentUser.id).length} ENROLLED
              </span>
            </div>

            {eventRegistrations.filter(r => r.userId === currentUser.id).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--c-text-muted)', fontSize: '13px' }}>
                You have not registered for individual club tournaments yet.
                <div style={{ marginTop: '10px' }}>
                  <button
                    onClick={() => setActiveSection('clubs')}
                    className="btn-fest-ghost"
                    style={{ fontSize: '11px', padding: '6px 14px' }}
                  >
                    <span>Browse 13 Clubs</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '10px' }}>
                {eventRegistrations.filter(r => r.userId === currentUser.id).map(reg => (
                  <div key={reg.id} style={{
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '12px',
                    border: '1px solid var(--line-gold-faint)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFF' }}>{reg.eventTitle}</div>
                      <div style={{ fontSize: '11px', color: 'var(--c-gold)', fontFamily: 'var(--font-mono)' }}>Token: {reg.qrToken}</div>
                    </div>
                    <span style={{ color: '#34D399', fontSize: '12px', fontWeight: 700 }}>
                      CONFIRMED
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Switch Account Modal */}
      {internalModalOpen && (
        <div className="modal-overlay" onClick={() => { setInternalModalOpen(false); onCloseLoginModal(); }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <span className="badge-gold">AMRITA STUDENT AUTHENTICATION</span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: '#FFF', marginTop: '6px' }}>
                  Verify Student Identity
                </h3>
              </div>
              <button 
                onClick={() => { setInternalModalOpen(false); onCloseLoginModal(); }}
                style={{ background: 'transparent', border: 'none', color: 'var(--c-text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} style={{ marginBottom: '24px' }}>
              <label className="form-label">Enter Roll Number or University Email</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="e.g. AM.EN.U4CSE23045"
                  value={rollInput}
                  onChange={e => setRollInput(e.target.value)}
                  className="form-input"
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn-fest-gold" style={{ padding: '0 20px' }}>
                  Verify
                </button>
              </div>
              {loginError && (
                <div style={{ color: '#F87171', fontSize: '12px', marginTop: '8px' }}>
                  {loginError}
                </div>
              )}
            </form>

            <div style={{ borderTop: '1px solid var(--line-gold-faint)', paddingTop: '16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--c-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>
                Sample Enrolled Student Records:
              </div>
              <div style={{ display: 'grid', gap: '6px' }}>
                {students.slice(0, 4).map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSampleSelect(s.rollNo)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--line-gold-faint)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      color: 'var(--c-text-secondary)',
                      fontSize: '12px'
                    }}
                  >
                    <span><strong>{s.name}</strong> ({s.rollNo})</span>
                    <span style={{ color: 'var(--c-gold)' }}>Select →</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
