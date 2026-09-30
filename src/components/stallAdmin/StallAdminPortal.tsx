import React, { useState } from 'react';
import { useFest } from '../../context/FestContext';
import { Store, CheckCircle2, QrCode, ShoppingBag, Clock, AlertCircle } from 'lucide-react';

export const StallAdminPortal: React.FC = () => {
  const { 
    stalls, 
    orders, 
    products, 
    selectedStallId, 
    setSelectedStallId, 
    redeemStallOrder 
  } = useFest();

  const [scanToken, setScanToken] = useState('');
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const currentStall = stalls.find(s => s.id === selectedStallId) || stalls[0];
  const stallOrders = orders.filter(o => o.stallId === currentStall.id);
  const stallProducts = products.filter(p => p.stallId === currentStall.id);

  const handleRedeem = (tokenToRedeem: string) => {
    if (!tokenToRedeem.trim()) return;
    const res = redeemStallOrder(tokenToRedeem);
    setFeedback(res);
    setScanToken('');
  };

  return (
    <section style={{ padding: '24px 0 60px' }}>
      
      {/* Header Banner */}
      <div className="clean-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: '#12141F',
              border: '1px solid var(--c-border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              🏪
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge-gold">{currentStall.stallNumber}</span>
                <span className="badge-parchment">STALL VENDOR DECK</span>
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFF', marginTop: '2px' }}>
                {currentStall.name}
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: 'var(--c-text-muted)', fontFamily: 'var(--font-mono)' }}>Switch Stall:</span>
            <select
              value={selectedStallId}
              onChange={e => setSelectedStallId(e.target.value)}
              className="form-input"
              style={{ width: 'auto', background: '#0D0F17', color: 'var(--c-lime)', fontSize: '12px', fontFamily: 'var(--font-mono)' }}
            >
              {stalls.map(s => (
                <option key={s.id} value={s.id}>
                  {s.stallNumber}: {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid: Order Redemption Scanner + Orders Queue */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* Scanner Terminal */}
        <div className="clean-card" style={{ padding: '24px' }}>
          <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#FFF', marginBottom: '6px' }}>
            Pickup Redemption Terminal
          </h4>
          <p style={{ fontSize: '13px', color: 'var(--c-text-muted)', marginBottom: '18px' }}>
            Scan the customer's one-time pickup QR code to atomically fulfill and dispense items.
          </p>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
            <input
              type="text"
              placeholder="Scan or paste order token (e.g. AMR-ORD-...)"
              value={scanToken}
              onChange={e => setScanToken(e.target.value)}
              className="form-input"
              style={{ fontSize: '12px', fontFamily: 'var(--font-mono)' }}
            />
            <button
              onClick={() => handleRedeem(scanToken)}
              className="btn-lime"
              style={{ padding: '8px 18px', fontSize: '12px' }}
            >
              Fulfill
            </button>
          </div>

          {feedback && (
            <div style={{
              background: feedback.success ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
              border: `1px solid ${feedback.success ? '#10B981' : '#F43F5E'}`,
              borderRadius: '12px',
              padding: '14px',
              marginBottom: '16px',
              color: feedback.success ? '#34D399' : '#FDA4AF',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-mono)'
            }}>
              {feedback.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Quick Click Pending Orders */}
          <div>
            <div style={{ fontSize: '11px', color: 'var(--c-text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '8px' }}>
              // PENDING PICKUPS FOR THIS STALL:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {stallOrders.filter(o => !o.isRedeemed).length === 0 ? (
                <div style={{ fontSize: '12px', color: 'var(--c-text-muted)', fontStyle: 'italic' }}>
                  No pending pickup orders. All items dispensed!
                </div>
              ) : (
                stallOrders.filter(o => !o.isRedeemed).map(o => (
                  <div 
                    key={o.id}
                    className="clean-card"
                    style={{
                      padding: '10px 12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: '#FFF', fontSize: '12px' }}>
                        {o.id} • {o.customerName}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--c-text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {o.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRedeem(o.redemptionToken)}
                      className="btn-lime"
                      style={{ padding: '6px 12px', fontSize: '11px' }}
                    >
                      Redeem
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Live Orders Feed */}
        <div className="clean-card" style={{ padding: '24px' }}>
          <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#FFF', marginBottom: '16px' }}>
            All Stall Orders ({stallOrders.length})
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '420px', overflowY: 'auto' }}>
            {stallOrders.map(o => (
              <div 
                key={o.id}
                className="clean-card"
                style={{ padding: '12px 14px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--c-lime)', fontWeight: 800, fontSize: '12px' }}>
                    {o.id}
                  </span>
                  {o.isRedeemed ? (
                    <span style={{ color: '#34D399', fontSize: '10px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>FULFILLED</span>
                  ) : (
                    <span className="badge-subtle" style={{ fontSize: '10px' }}>PENDING PICKUP</span>
                  )}
                </div>
                <div style={{ fontSize: '13px', color: '#FFF', fontWeight: 700 }}>{o.customerName}</div>
                <div style={{ fontSize: '11px', color: 'var(--c-text-muted)', margin: '2px 0 6px', fontFamily: 'var(--font-mono)' }}>
                  {o.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', borderTop: '1px solid var(--c-border-subtle)', paddingTop: '6px', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ color: '#FFF', fontWeight: 700 }}>Total: ₹{o.totalAmount}</span>
                  <span style={{ color: 'var(--c-text-muted)' }}>{new Date(o.createdAt).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </section>
  );
};
