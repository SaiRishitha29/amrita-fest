import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { useFest } from '../../context/FestContext';
import { Stall, Product, StallOrder } from '../../types';
import { 
  ShoppingBag, Store, Plus, Minus, Trash2, 
  CreditCard, CheckCircle2, QrCode, Download, ArrowRight, Star, Sparkles, X 
} from 'lucide-react';

interface StallMarketplaceProps {
  cartOpen: boolean;
  onCloseCart: () => void;
}

export const StallMarketplace: React.FC<StallMarketplaceProps> = ({ cartOpen, onCloseCart }) => {
  const { 
    stalls, 
    products, 
    cart, 
    addToCart, 
    updateCartQty, 
    removeFromCart, 
    clearCart, 
    cartTotal, 
    placeStallOrder, 
    currentUser,
    setActiveSection,
    setSelectedStallId,
    setRole
  } = useFest();

  const [activeStallFilter, setActiveStallFilter] = useState<string>('all');
  const [lastPlacedOrder, setLastPlacedOrder] = useState<StallOrder | null>(null);
  const [orderQrUrl, setOrderQrUrl] = useState<string>('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderSuccessModal, setOrderSuccessModal] = useState(false);

  // Generate QR for newly placed order
  useEffect(() => {
    if (lastPlacedOrder?.redemptionToken) {
      QRCode.toDataURL(lastPlacedOrder.redemptionToken, {
        width: 240,
        margin: 2,
        color: { dark: '#05030F', light: '#FFFFFF' }
      }).then(url => setOrderQrUrl(url));
    }
  }, [lastPlacedOrder]);

  const filteredProducts = products.filter(p => {
    if (activeStallFilter === 'all') return true;
    return p.stallId === activeStallFilter;
  });

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsCheckingOut(true);

    // Simulate payment gateway and webhook verification
    setTimeout(() => {
      const order = placeStallOrder(currentUser.name, currentUser.email);
      setIsCheckingOut(false);
      setLastPlacedOrder(order);
      setOrderSuccessModal(true);
      onCloseCart();
    }, 1000);
  };

  const handleSwitchToStallAdmin = (stallId: string) => {
    setSelectedStallId(stallId);
    setRole('stall_admin');
    setActiveSection('stall-admin');
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
            <span className="badge-gold">FESTIVAL BAZAAR & PLAZAS</span>
            <span className="badge-parchment">FOOD, BEVERAGES & MERCH</span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 5vw, 54px)',
            fontWeight: 700,
            color: 'var(--c-parchment)',
            lineHeight: 1.05
          }}>
            THE FESTIVAL MARKET
          </h2>

          <p style={{
            fontFamily: 'Georgia, serif',
            color: 'rgba(233, 222, 255, 0.78)',
            fontSize: '15px',
            maxWidth: '660px',
            marginTop: '6px'
          }}>
            Order authentic regional bites, cold refreshments, and official Amrita Fest 2026 embroidered apparel. Redeem instantly with one-time pickup QR tokens.
          </p>
        </div>

        {/* Stall Filter Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <button
            onClick={() => setActiveStallFilter('all')}
            style={{
              background: activeStallFilter === 'all' ? 'rgba(221, 187, 99, 0.16)' : 'rgba(13, 7, 30, 0.6)',
              color: activeStallFilter === 'all' ? 'var(--c-gold)' : 'var(--c-text-secondary)',
              border: `1px solid ${activeStallFilter === 'all' ? 'var(--c-gold)' : 'var(--line-gold-faint)'}`,
              padding: '6px 16px',
              borderRadius: '100px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            ALL VENDORS ({products.length})
          </button>

          {stalls.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveStallFilter(s.id)}
              style={{
                background: activeStallFilter === s.id ? 'rgba(221, 187, 99, 0.16)' : 'rgba(13, 7, 30, 0.6)',
                color: activeStallFilter === s.id ? 'var(--c-gold)' : 'var(--c-text-secondary)',
                border: `1px solid ${activeStallFilter === s.id ? 'var(--c-gold)' : 'var(--line-gold-faint)'}`,
                padding: '6px 16px',
                borderRadius: '100px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {s.stallNumber}: {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Stall Banner */}
      {activeStallFilter !== 'all' && (
        <div style={{ maxWidth: '880px', margin: '0 auto 28px' }}>
          {(() => {
            const currentStall = stalls.find(s => s.id === activeStallFilter);
            if (!currentStall) return null;
            return (
              <div className="fest-card" style={{ padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span className="badge-gold">{currentStall.stallNumber}</span>
                    <span className="badge-parchment">{currentStall.category}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--c-gold)', fontSize: '12px', fontWeight: 700 }}>
                      <Star size={13} fill="var(--c-gold)" /> {currentStall.rating}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: '#FFF' }}>
                    {currentStall.name}
                  </h3>
                  <div style={{ fontSize: '13px', color: 'var(--c-text-muted)' }}>
                    📍 {currentStall.location} &bull; <em>{currentStall.tagline}</em>
                  </div>
                </div>

                <button
                  onClick={() => handleSwitchToStallAdmin(currentStall.id)}
                  className="btn-fest-ghost"
                  style={{ fontSize: '11px', padding: '8px 16px' }}
                >
                  <Store size={13} />
                  <span>Stall Admin Portal</span>
                </button>
              </div>
            );
          })()}
        </div>
      )}

      {/* Product Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '22px'
      }}>
        {filteredProducts.map(prod => {
          const stall = stalls.find(s => s.id === prod.stallId);
          const cartItem = cart.find(c => c.product.id === prod.id);

          return (
            <div 
              key={prod.id}
              className="fest-card"
              style={{
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ position: 'relative', height: '180px', overflow: 'hidden', background: '#090518' }}>
                <img 
                  src={prod.image} 
                  alt={prod.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} 
                />
                <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                  <span className="badge-parchment" style={{ background: 'rgba(0,0,0,0.7)', fontSize: '10px' }}>
                    {stall?.name}
                  </span>
                </div>
                <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                  <span style={{ 
                    fontSize: '10px', 
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: prod.isVeg ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)',
                    color: prod.isVeg ? '#34D399' : '#FDA4AF',
                    border: `1px solid ${prod.isVeg ? 'rgba(16, 185, 129, 0.4)' : 'rgba(244, 63, 94, 0.4)'}`
                  }}>
                    {prod.isVeg ? 'VEG' : 'NON-VEG'}
                  </span>
                </div>
              </div>

              <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '19px', fontWeight: 600, color: 'var(--c-parchment)', marginBottom: '4px' }}>
                    {prod.name}
                  </h4>
                  <p style={{ fontSize: '12px', color: 'var(--c-text-muted)', lineHeight: 1.5, marginBottom: '14px' }}>
                    {prod.description}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--line-gold-faint)', paddingTop: '12px' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'var(--c-gold)' }}>
                    ₹{prod.price}
                  </div>

                  {cartItem ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '100px', padding: '4px 10px', border: '1px solid var(--line-gold-faint)' }}>
                      <button 
                        onClick={() => updateCartQty(prod.id, -1)}
                        style={{ background: 'transparent', border: 'none', color: '#FFF', cursor: 'pointer', padding: '2px', display: 'flex' }}
                      >
                        <Minus size={13} />
                      </button>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--c-gold)' }}>
                        {cartItem.quantity}
                      </span>
                      <button 
                        onClick={() => updateCartQty(prod.id, 1)}
                        style={{ background: 'transparent', border: 'none', color: '#FFF', cursor: 'pointer', padding: '2px', display: 'flex' }}
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(prod, prod.stallId, stall?.name || 'Stall')}
                      className="btn-fest-gold"
                      style={{ padding: '6px 16px', fontSize: '11px' }}
                    >
                      <Plus size={13} />
                      <span>Add to Cart</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart Drawer / Slide-Over Modal */}
      {cartOpen && (
        <div className="modal-overlay" onClick={onCloseCart}>
          <div 
            className="modal-content" 
            onClick={e => e.stopPropagation()} 
            style={{ maxWidth: '480px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShoppingBag size={20} style={{ color: 'var(--c-gold)' }} />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: '#FFF' }}>
                  Your Festival Cart
                </h3>
              </div>
              <button 
                onClick={onCloseCart}
                style={{ background: 'transparent', border: 'none', color: 'var(--c-text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--c-text-muted)' }}>
                <ShoppingBag size={48} style={{ opacity: 0.25, margin: '0 auto 12px' }} />
                <p style={{ fontSize: '14px' }}>Your cart is empty. Add culinary bites or fest merch!</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '340px', overflowY: 'auto', marginBottom: '20px' }}>
                  {cart.map(item => (
                    <div 
                      key={item.product.id}
                      style={{
                        padding: '12px 14px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '12px',
                        border: '1px solid var(--line-gold-faint)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFF' }}>{item.product.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--c-gold)' }}>₹{item.product.price} each &bull; {item.stallName}</div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button 
                          onClick={() => updateCartQty(item.product.id, -1)}
                          style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#FFF', borderRadius: '4px', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                          <Minus size={11} />
                        </button>
                        <span style={{ fontSize: '12px', fontWeight: 700, minWidth: '16px', textAlign: 'center', color: '#FFF' }}>
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateCartQty(item.product.id, 1)}
                          style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#FFF', borderRadius: '4px', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                          <Plus size={11} />
                        </button>
                        <button 
                          onClick={() => removeFromCart(item.product.id)}
                          style={{ background: 'transparent', border: 'none', color: '#F87171', marginLeft: '6px', cursor: 'pointer' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid var(--line-gold-faint)', paddingTop: '16px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 700, color: '#FFF', marginBottom: '6px' }}>
                    <span>Total Bill:</span>
                    <span style={{ color: 'var(--c-gold)' }}>₹{cartTotal}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--c-text-muted)' }}>
                    Payment simulated via Razorpay/PhonePe &bull; Zero queue pickup token generated upon payment.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={clearCart}
                    className="btn-fest-ghost"
                    style={{ fontSize: '11px', padding: '10px' }}
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="btn-fest-gold"
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    {isCheckingOut ? (
                      <span>Processing Payment...</span>
                    ) : (
                      <>
                        <CreditCard size={14} />
                        <span>Pay ₹{cartTotal} & Generate QR</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}

      {/* Order Success & Pickup QR Modal */}
      {orderSuccessModal && lastPlacedOrder && (
        <div className="modal-overlay" onClick={() => setOrderSuccessModal(false)}>
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

            <span className="badge-gold">PAYMENT CONFIRMED</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: '#FFF', marginTop: '6px', marginBottom: '4px' }}>
              Order {lastPlacedOrder.id} Active!
            </h3>
            <div style={{ fontSize: '13px', color: 'var(--c-gold)', fontWeight: 600, marginBottom: '20px' }}>
              Pickup Counter: {lastPlacedOrder.stallName}
            </div>

            {/* Pickup QR */}
            <div style={{
              background: '#FFF',
              borderRadius: '16px',
              padding: '16px',
              display: 'inline-block',
              boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
              marginBottom: '16px'
            }}>
              {orderQrUrl ? (
                <img src={orderQrUrl} alt="Order QR" style={{ width: '180px', height: '180px', display: 'block' }} />
              ) : (
                <div style={{ width: '180px', height: '180px' }}>Loading...</div>
              )}
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#000', fontWeight: 800, marginTop: '8px' }}>
                {lastPlacedOrder.redemptionToken}
              </div>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--c-text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
              Present this QR to the vendor counter to collect your order. Single-use redemption verified atomically.
            </p>

            <button
              onClick={() => setOrderSuccessModal(false)}
              className="btn-fest-gold"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Done & Return to Market
            </button>
          </div>
        </div>
      )}

    </section>
  );
};
