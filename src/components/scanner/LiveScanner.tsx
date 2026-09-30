import React, { useState } from 'react';
import { useFest } from '../../context/FestContext';
import { ScanValidationResult } from '../../types';
import { 
  QrCode, CheckCircle2, XCircle, AlertTriangle, 
  Camera, Zap, History, Shield, Smartphone, RefreshCw 
} from 'lucide-react';

export const LiveScanner: React.FC = () => {
  const { 
    festEvents, 
    clubEvents, 
    validateAndRedeemQR, 
    redeemStallOrder, 
    students, 
    visitors, 
    orders, 
    scanLogs,
    currentRole 
  } = useFest();

  const [selectedEventId, setSelectedEventId] = useState<string>('fest-auto');
  const [manualToken, setManualToken] = useState<string>('');
  const [validationResult, setValidationResult] = useState<ScanValidationResult | null>(null);
  const [orderRedeemResult, setOrderRedeemResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isScanningAnim, setIsScanningAnim] = useState(false);

  const allEvents = [...festEvents, ...clubEvents];

  const handleScanToken = (tokenToScan: string) => {
    if (!tokenToScan.trim()) return;
    setIsScanningAnim(true);
    setOrderRedeemResult(null);

    // Simulate high-speed server roundtrip (lightweight atomic validation endpoint)
    setTimeout(() => {
      // Check if it's a stall order token
      if (tokenToScan.includes('ORD-') || tokenToScan.includes('AMR-ORD-')) {
        const res = redeemStallOrder(tokenToScan);
        setOrderRedeemResult(res);
        setValidationResult(null);
      } else {
        const res = validateAndRedeemQR(tokenToScan, selectedEventId, 'Gate Scanner Alpha-01');
        setValidationResult(res);
      }
      setIsScanningAnim(false);
    }, 200);
  };

  const sampleStudent = students[0]; // Rahul Sharma
  const sampleVisitor = visitors[0]; // Priya Patel
  const sampleOrder = orders[0];     // Order #88219

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
            <span className="badge-gold">TURNSTILE GATE VALIDATION</span>
            <span className="badge-parchment">ATOMIC QR ENGINE</span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 5vw, 54px)',
            fontWeight: 700,
            color: 'var(--c-parchment)',
            lineHeight: 1.05
          }}>
            LIVE OPTICAL SCANNER TERMINAL
          </h2>

          <p style={{
            fontFamily: 'Georgia, serif',
            color: 'rgba(233, 222, 255, 0.78)',
            fontSize: '15px',
            maxWidth: '660px',
            marginTop: '6px'
          }}>
            Server-verified opaque cryptographic token inspection. Single-use redemption per event enforced atomically at database level. Multi-event passes remain valid for other venues.
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '28px',
        maxWidth: '1060px',
        margin: '0 auto'
      }}>

        {/* Left Column: Scanner Terminal */}
        <div className="fest-card" style={{ padding: '28px' }}>
          
          {/* Target Event Selection */}
          <div style={{ marginBottom: '20px' }}>
            <label className="form-label">Gate Turnstile Target Event</label>
            <select
              value={selectedEventId}
              onChange={e => setSelectedEventId(e.target.value)}
              className="form-input"
              style={{ fontSize: '13px', background: '#090518', color: 'var(--c-gold)' }}
            >
              <optgroup label="Fest Signature Mega Events">
                {festEvents.map(fe => (
                  <option key={fe.id} value={fe.id}>{fe.title} ({fe.date})</option>
                ))}
              </optgroup>
              <optgroup label="13 Club Competitions">
                {clubEvents.map(ce => (
                  <option key={ce.id} value={ce.id}>{ce.title} ({ce.category})</option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Camera Viewfinder Mockup */}
          <div style={{
            position: 'relative',
            height: '240px',
            background: '#04020B',
            border: validationResult?.status === 'APPROVED' ? '2px solid #10B981' : 
                    validationResult?.status === 'REJECTED' ? '2px solid #F43F5E' : '1.5px solid var(--line-gold-faint)',
            borderRadius: '16px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8)'
          }}>
            {/* Viewfinder Target Reticles */}
            <div style={{ position: 'absolute', top: '16px', left: '16px', width: '24px', height: '24px', borderTop: '2px solid var(--c-gold)', borderLeft: '2px solid var(--c-gold)' }} />
            <div style={{ position: 'absolute', top: '16px', right: '16px', width: '24px', height: '24px', borderTop: '2px solid var(--c-gold)', borderRight: '2px solid var(--c-gold)' }} />
            <div style={{ position: 'absolute', bottom: '16px', left: '16px', width: '24px', height: '24px', borderBottom: '2px solid var(--c-gold)', borderLeft: '2px solid var(--c-gold)' }} />
            <div style={{ position: 'absolute', bottom: '16px', right: '16px', width: '24px', height: '24px', borderBottom: '2px solid var(--c-gold)', borderRight: '2px solid var(--c-gold)' }} />

            {/* Laser Line Scanning animation */}
            <div style={{
              position: 'absolute',
              left: '10%',
              right: '10%',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, var(--c-gold), transparent)',
              boxShadow: '0 0 16px var(--c-gold)',
              top: isScanningAnim ? '85%' : '15%',
              transition: isScanningAnim ? 'top 0.3s ease-in-out' : 'top 2s infinite alternate'
            }} />

            <Camera size={36} style={{ color: 'var(--c-gold)', opacity: 0.85, marginBottom: '8px' }} />
            <div style={{ fontSize: '14px', color: 'var(--c-parchment)', fontWeight: 700, fontFamily: 'var(--font-sans)' }}>
              Optical Scanner Active
            </div>
            <div style={{ fontSize: '11px', color: 'var(--c-text-muted)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
              Sub-50ms Latency &bull; Single-Use Atomic Lock
            </div>
          </div>

          {/* Manual Token Scan Input */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Paste or enter token (e.g. AMR-PASS-STU-001-K9X2P)"
              value={manualToken}
              onChange={e => setManualToken(e.target.value)}
              className="form-input"
              style={{ fontSize: '12px', fontFamily: 'var(--font-mono)' }}
            />
            <button
              onClick={() => handleScanToken(manualToken)}
              className="btn-fest-gold"
              style={{ padding: '8px 20px', fontSize: '12px' }}
            >
              Scan
            </button>
          </div>

          {/* Validation Feedback Display */}
          {validationResult && (
            <div style={{
              background: validationResult.status === 'APPROVED' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
              border: `1.5px solid ${validationResult.status === 'APPROVED' ? '#10B981' : '#F43F5E'}`,
              borderRadius: '14px',
              padding: '16px',
              animation: 'fadeIn 0.2s ease-out'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                {validationResult.status === 'APPROVED' ? (
                  <CheckCircle2 size={28} color="#10B981" />
                ) : (
                  <XCircle size={28} color="#F43F5E" />
                )}
                <div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: 800,
                    color: validationResult.status === 'APPROVED' ? '#34D399' : '#FDA4AF'
                  }}>
                    {validationResult.message}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--c-text-muted)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                    Code: <strong style={{ color: '#FFF' }}>{validationResult.reasonCode}</strong> &bull; Event: {validationResult.eventTitle}
                  </div>
                </div>
              </div>

              {validationResult.holderName && (
                <div style={{
                  fontSize: '11px',
                  color: 'var(--c-text-secondary)',
                  borderTop: '1px solid rgba(255,255,255,0.1)',
                  paddingTop: '8px',
                  marginTop: '8px',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>Holder: <strong style={{ color: '#FFF' }}>{validationResult.holderName}</strong> ({validationResult.holderRole})</span>
                  <span>Time: {new Date(validationResult.timestamp).toLocaleTimeString()}</span>
                </div>
              )}
            </div>
          )}

          {/* Stall Order Redemption Result */}
          {orderRedeemResult && (
            <div style={{
              background: orderRedeemResult.success ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
              border: `1.5px solid ${orderRedeemResult.success ? '#10B981' : '#F43F5E'}`,
              borderRadius: '14px',
              padding: '14px 16px',
              marginTop: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {orderRedeemResult.success ? <CheckCircle2 size={18} color="#10B981" /> : <XCircle size={18} color="#F43F5E" />}
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFF' }}>
                  {orderRedeemResult.message}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Verification Test Scenarios (Rule 2, 3, 4) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="fest-card" style={{ padding: '24px', border: '1px solid var(--line-gold-faint)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Zap size={18} style={{ color: 'var(--c-gold)' }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--c-parchment)' }}>
                Verification Test Suite
              </h3>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--c-text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
              Click any scenario to verify the atomic database redemption engine and instant duplicate rejection:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              
              {/* Scenario 1: Auto Expo 1st Scan */}
              <button
                onClick={() => {
                  setSelectedEventId('fest-auto');
                  handleScanToken(sampleStudent.qrToken);
                }}
                className="fest-card"
                style={{
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFF' }}>
                    1. Auto Expo First Scan (Rahul Sharma)
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--c-text-muted)' }}>
                    Expected: APPROVED (attendance logged atomically)
                  </div>
                </div>
                <span className="badge-gold">TEST</span>
              </button>

              {/* Scenario 2: Auto Expo DUPLICATE Scan */}
              <button
                onClick={() => {
                  setSelectedEventId('fest-auto');
                  handleScanToken(sampleStudent.qrToken);
                }}
                className="fest-card"
                style={{
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderColor: 'rgba(244, 63, 94, 0.3)'
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#FDA4AF' }}>
                    2. Auto Expo Duplicate Scan (Rahul Sharma)
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--c-text-muted)' }}>
                    Expected: REJECTED (Rule 3 & 4 duplicate blocked)
                  </div>
                </div>
                <span className="badge-violet" style={{ color: '#FDA4AF' }}>DUPLICATE</span>
              </button>

              {/* Scenario 3: DJ Night with SAME Token */}
              <button
                onClick={() => {
                  setSelectedEventId('fest-dj');
                  handleScanToken(sampleStudent.qrToken);
                }}
                className="fest-card"
                style={{
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFF' }}>
                    3. DJ Night Scan with SAME Student Token
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--c-text-muted)' }}>
                    Expected: APPROVED (Rule 2 reusable across events!)
                  </div>
                </div>
                <span className="badge-sapphire">REUSABLE</span>
              </button>

              {/* Scenario 4: Visitor Scan */}
              <button
                onClick={() => {
                  setSelectedEventId('fest-garba');
                  handleScanToken(sampleVisitor.qrToken);
                }}
                className="fest-card"
                style={{
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFF' }}>
                    4. Garba Night Scan (Priya Patel - Visitor)
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--c-text-muted)' }}>
                    Expected: APPROVED (Visitor credential validated)
                  </div>
                </div>
                <span className="badge-gold">VISITOR</span>
              </button>

              {/* Scenario 5: Tampered / Invalid Token */}
              <button
                onClick={() => {
                  setSelectedEventId('fest-dj');
                  handleScanToken('TAMPERED_FAKE_QR_9999');
                }}
                className="fest-card"
                style={{
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#FDA4AF' }}>
                    5. Tampered Malicious Token Test
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--c-text-muted)' }}>
                    Expected: REJECTED (Rule 10 cryptographic check)
                  </div>
                </div>
                <span className="badge-violet" style={{ color: '#FDA4AF' }}>SECURITY</span>
              </button>

              {/* Scenario 6: Stall Order Pickup */}
              <button
                onClick={() => {
                  handleScanToken(sampleOrder.redemptionToken);
                }}
                className="fest-card"
                style={{
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFF' }}>
                    6. Food Stall Pickup QR ({sampleOrder.id})
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--c-text-muted)' }}>
                    Expected: REDEEMED (One-time meal pickup fulfilled)
                  </div>
                </div>
                <span className="badge-parchment">STALL ORDER</span>
              </button>

            </div>
          </div>

          {/* Real-time Scan Audit Logs */}
          <div className="fest-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <History size={16} style={{ color: 'var(--c-gold)' }} />
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--c-parchment)' }}>
                Recent Security Scan Logs
              </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
              {scanLogs.slice(0, 4).map(log => (
                <div key={log.id} style={{
                  padding: '8px 12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '8px',
                  border: '1px solid var(--line-gold-faint)',
                  fontSize: '11px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ color: '#FFF', fontWeight: 600 }}>{log.eventTitle}</div>
                    <div style={{ color: 'var(--c-text-muted)' }}>{log.token.slice(0, 18)}...</div>
                  </div>
                  <span style={{
                    color: log.status === 'APPROVED' ? '#34D399' : '#FDA4AF',
                    fontWeight: 700
                  }}>
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
