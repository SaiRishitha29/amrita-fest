import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { useFest } from '../../context/FestContext';
import { Visitor } from '../../types';
import { 
  Ticket, Building2, CheckCircle2, ShieldCheck, 
  CreditCard, Download, QrCode, ArrowRight, Sparkles, X 
} from 'lucide-react';

export const VisitorPortal: React.FC = () => {
  const { registerVisitor, currentUser, setActiveSection } = useFest();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    passTier: 'both' as 'day1' | 'day2' | 'both',
    accommodation: false,
  });

  const [registeredVisitor, setRegisteredVisitor] = useState<Visitor | null>(null);
  const [visitorQrUrl, setVisitorQrUrl] = useState<string>('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccessModal, setPaymentSuccessModal] = useState(false);

  // Pricing rules
  const tierPrices = {
    day1: 500,
    day2: 600,
    both: 900,
  };
  const accommodationPrice = formData.passTier === 'both' ? 800 : 450;
  const passAmount = tierPrices[formData.passTier];
  const totalAmount = passAmount + (formData.accommodation ? accommodationPrice : 0);

  // If user is currently a registered visitor, generate their QR
  useEffect(() => {
    if (registeredVisitor?.qrToken) {
      QRCode.toDataURL(registeredVisitor.qrToken, {
        width: 260,
        margin: 2,
        color: { dark: '#05030F', light: '#FFFFFF' }
      }).then(url => setVisitorQrUrl(url));
    }
  }, [registeredVisitor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.college) {
      alert('Please fill all required visitor fields.');
      return;
    }

    setIsProcessingPayment(true);

    // Simulate payment gateway handshake & server-side webhook verification
    setTimeout(() => {
      const newVisitor = registerVisitor({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        college: formData.college,
        passTier: formData.passTier,
        accommodation: formData.accommodation,
        totalPaid: totalAmount,
      });

      setIsProcessingPayment(false);
      setRegisteredVisitor(newVisitor);
      setPaymentSuccessModal(true);
    }, 1000);
  };

  const handleDownloadTicket = () => {
    if (!visitorQrUrl) return;
    const a = document.createElement('a');
    a.href = visitorQrUrl;
    a.download = `amrita_visitor_pass_${registeredVisitor?.registrationId}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

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
            <span className="badge-sapphire">EXTERNAL DELEGATES</span>
            <span className="badge-gold">ACCOMMODATION AVAILABLE</span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 5vw, 54px)',
            fontWeight: 700,
            color: 'var(--c-parchment)',
            lineHeight: 1.05
          }}>
            VISITOR PASS & ACCOMMODATION
          </h2>

          <p style={{
            fontFamily: 'Georgia, serif',
            color: 'rgba(233, 222, 255, 0.78)',
            fontSize: '15px',
            maxWidth: '660px',
            marginTop: '6px'
          }}>
            Welcoming participants and guests from universities across India. Choose your festival pass tier, reserve secure on-campus hostel stay, and receive your digital credential.
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

        {/* Left Column: Registration Form */}
        <div className="fest-card" style={{ padding: '32px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: 'var(--c-parchment)', marginBottom: '20px' }}>
            Participant Details
          </h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label className="form-label">Full Legal Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Siddharth Verma"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="form-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="siddharth@gmail.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">WhatsApp / Phone *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div>
              <label className="form-label">College / University Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. IIT Madras, BITS Pilani, NIT Trichy"
                value={formData.college}
                onChange={e => setFormData({ ...formData, college: e.target.value })}
                className="form-input"
              />
            </div>

            {/* Pass Tier Selection */}
            <div>
              <label className="form-label">Select Festival Pass Tier *</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {[
                  { tier: 'day1', label: 'Day 1 Only', date: '11 Oct', price: 500, highlight: 'Garba + Hack' },
                  { tier: 'day2', label: 'Day 2 Only', date: '12 Oct', price: 600, highlight: 'DJ + Auto Expo' },
                  { tier: 'both', label: 'All 2 Days', date: 'Full Fest', price: 900, highlight: 'Best Value' },
                ].map(p => {
                  const isSelected = formData.passTier === p.tier;
                  return (
                    <div
                      key={p.tier}
                      onClick={() => setFormData({ ...formData, passTier: p.tier as any })}
                      style={{
                        padding: '12px 10px',
                        borderRadius: '12px',
                        border: `1.5px solid ${isSelected ? 'var(--c-gold)' : 'var(--line-gold-faint)'}`,
                        background: isSelected ? 'rgba(221, 187, 99, 0.14)' : 'rgba(255, 255, 255, 0.03)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ fontSize: '11px', color: 'var(--c-gold)', fontWeight: 700 }}>{p.highlight}</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFF', margin: '3px 0' }}>{p.label}</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800, color: isSelected ? 'var(--c-gold)' : 'var(--c-parchment)' }}>
                        ₹{p.price}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Campus Accommodation Option */}
            <div style={{
              background: 'rgba(59, 130, 246, 0.08)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '14px',
              padding: '16px'
            }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.accommodation}
                  onChange={e => setFormData({ ...formData, accommodation: e.target.checked })}
                  style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: 'var(--c-gold)' }}
                />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFF' }}>
                    Include On-Campus AC Hostel Accommodation (+₹{accommodationPrice})
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--c-text-muted)', lineHeight: 1.4, marginTop: '2px' }}>
                    Separate AC dormitory for boys/girls with 24/7 security, breakfast included, and Wi-Fi coverage. (Capacity enforced server-side).
                  </div>
                </div>
              </label>
            </div>

            {/* Total Summary */}
            <div style={{
              borderTop: '1px solid var(--line-gold-faint)',
              paddingTop: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--c-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Total Payable:</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, color: '#FFF' }}>
                  ₹{totalAmount}
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessingPayment}
                className="btn-fest-gold"
                style={{ padding: '12px 28px' }}
              >
                {isProcessingPayment ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <CreditCard size={15} />
                    <span>Pay ₹{totalAmount} & Register</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Right Column: Pass Overview & Rules */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="fest-card" style={{ padding: '28px', border: '1px solid var(--line-gold-faint)' }}>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--c-parchment)', marginBottom: '14px' }}>
              What's Included in Your Pass
            </h4>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '10px' }}>
              {[
                'Full access to all 4 flagship mega attractions on selected days',
                'Entry turnstile validation via single reusable cryptographic QR',
                'Spectator access to 40+ club tournaments, RoboWars & fashion runway',
                'Access to festival food bazaar and official merch kiosks',
                'On-campus safety, medical support, and cloakroom facilities'
              ].map((item, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: 'rgba(233, 222, 255, 0.8)' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--c-gold)', flexShrink: 0, marginTop: '2px' }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="fest-card" style={{ padding: '24px', background: 'rgba(13, 7, 30, 0.5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <ShieldCheck size={18} style={{ color: '#34D399' }} />
              <h5 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: '#FFF' }}>
                Secure Payment & Server Verification
              </h5>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--c-text-muted)', lineHeight: 1.6 }}>
              Payments are verified via cryptographic webhooks with database-level idempotency to prevent duplicate charges or orphaned passes.
            </p>
          </div>

        </div>

      </div>

      {/* Success Modal */}
      {paymentSuccessModal && registeredVisitor && (
        <div className="modal-overlay" onClick={() => setPaymentSuccessModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px', textAlign: 'center' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.2)',
              border: '2px solid #10B981',
              color: '#34D399',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <CheckCircle2 size={32} />
            </div>

            <span className="badge-gold">REGISTRATION COMPLETE</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: '#FFF', marginTop: '6px', marginBottom: '4px' }}>
              Welcome, {registeredVisitor.name}!
            </h3>
            <div style={{ fontSize: '13px', color: 'var(--c-gold)', fontWeight: 600, marginBottom: '20px' }}>
              Pass ID: {registeredVisitor.registrationId} &bull; ₹{registeredVisitor.totalPaid} Paid
            </div>

            {/* QR Container */}
            <div style={{
              background: '#FFF',
              borderRadius: '16px',
              padding: '16px',
              display: 'inline-block',
              boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
              marginBottom: '16px'
            }}>
              {visitorQrUrl ? (
                <img src={visitorQrUrl} alt="Visitor Pass QR" style={{ width: '180px', height: '180px', display: 'block' }} />
              ) : (
                <div style={{ width: '180px', height: '180px' }}>Generating...</div>
              )}
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#000', fontWeight: 800, marginTop: '8px' }}>
                {registeredVisitor.qrToken}
              </div>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--c-text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
              Save this QR credential to your device. Present it at the campus entry gates for turnstile optical validation.
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleDownloadTicket}
                className="btn-fest-gold"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <Download size={14} />
                <span>Download Pass</span>
              </button>
              <button
                onClick={() => setPaymentSuccessModal(false)}
                className="btn-fest-ghost"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
