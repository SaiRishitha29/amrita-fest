import React, { useState } from 'react';
import { useFest } from '../../context/FestContext';
import { Sparkles, Calendar, Users, ShoppingBag, QrCode, ShieldCheck, Ticket, X } from 'lucide-react';

export const VinylNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { activeSection, setActiveSection } = useFest();

  const menuItems = [
    { id: 'home', label: 'Home', icon: <Sparkles size={16} /> },
    { id: 'events', label: 'Mega Events', icon: <Calendar size={16} /> },
    { id: 'clubs', label: '13 Clubs', icon: <Users size={16} /> },
    { id: 'stalls', label: 'Food Stalls', icon: <ShoppingBag size={16} /> },
    { id: 'student-pass', label: 'Student Pass', icon: <Ticket size={16} /> },
    { id: 'scanner', label: 'Live Scanner', icon: <QrCode size={16} /> },
    { id: 'admin', label: 'Super Admin', icon: <ShieldCheck size={16} /> },
  ];

  const handleSelect = (id: string) => {
    setActiveSection(id);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Vinyl Disc Floating Platter */}
      <div 
        className="vinyl-disc-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Interactive Fest Dial (Thomso Style)"
      >
        <div className="vinyl-grooves"></div>
        <div style={{
          width: '26px',
          height: '26px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #F5DE9C, #DDBB63)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#120A02',
          fontWeight: 900,
          fontSize: '13px',
          zIndex: 2,
          boxShadow: '0 0 10px rgba(221, 187, 99, 0.8)'
        }}>
          {isOpen ? <X size={16} /> : '✦'}
        </div>
      </div>

      {/* Radial / Arc Menu Drawer overlay */}
      {isOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(3, 1, 10, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 99,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-start',
            padding: '24px 24px 105px 24px'
          }}
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="glass-panel"
            style={{
              padding: '20px',
              maxWidth: '340px',
              width: '100%',
              border: '1.5px solid var(--line-gold)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(221, 187, 99, 0.25)',
              animation: 'modalPop 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <span className="badge-gold">Radial Fest Navigator</span>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', marginTop: '4px' }}>
                  Explore Amrita Fest
                </h4>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--c-text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  style={{
                    background: activeSection === item.id ? 'rgba(221, 187, 99, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    color: activeSection === item.id ? 'var(--c-gold-bright)' : 'var(--c-text-primary)',
                    border: activeSection === item.id ? '1px solid var(--c-gold)' : '1px solid rgba(255, 255, 255, 0.08)',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 600,
                    textAlign: 'left',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ color: 'var(--c-gold)' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--line-gold-faint)', fontSize: '11px', color: 'var(--c-text-muted)' }}>
              11–12 October 2026 • Amrita Amaravati Campus
            </div>
          </div>
        </div>
      )}
    </>
  );
};
