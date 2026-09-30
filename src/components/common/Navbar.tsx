import React, { useState } from 'react';
import { useFest } from '../../context/FestContext';
import { 
  Sparkles, Calendar, Users, ShoppingBag, QrCode, 
  ShieldCheck, FileCode, Volume2, VolumeX, Menu, X, Ticket
} from 'lucide-react';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenStudentLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart, onOpenStudentLogin }) => {
  const { 
    activeSection, 
    setActiveSection, 
    cart, 
    audioEnabled, 
    toggleAudio,
    currentRole 
  } = useFest();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { id: 'home', label: 'Overview', icon: <Sparkles size={15} /> },
    { id: 'events', label: 'Mega Nights', icon: <Calendar size={15} /> },
    { id: 'clubs', label: '13 Clubs', icon: <Users size={15} /> },
    { id: 'stalls', label: 'Stalls & Food', icon: <ShoppingBag size={15} /> },
    { id: 'railu', label: 'RAILU Hack', icon: <FileCode size={15} /> },
    { id: 'student-pass', label: 'Student Pass', icon: <Ticket size={15} /> },
    { id: 'visitor', label: 'Visitor Pass', icon: <Ticket size={15} /> },
    { id: 'scanner', label: 'Live Scanner', icon: <QrCode size={15} /> },
    { id: 'admin', label: 'Super Admin', icon: <ShieldCheck size={15} /> },
    { id: 'blueprint', label: 'Blueprint', icon: <FileCode size={15} /> },
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="navbar-blur" style={{ position: 'sticky', top: 0, zIndex: 120 }}>
      <div className="container-fest" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        
        {/* Brand / Logo */}
        <div 
          onClick={() => handleNavClick('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #F5DE9C 0%, #DDBB63 50%, #A3802D 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(221, 187, 99, 0.4)',
            color: '#120702',
            fontWeight: 900,
            fontSize: '18px',
            fontFamily: 'var(--font-display)'
          }}>
            ✦
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', letterSpacing: '0.06em', color: '#FFF' }}>
              AMRITA AMARAVATI FEST <span style={{ color: 'var(--c-gold)', fontSize: '13px' }}>'26</span>
            </div>
            <div style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--c-gold)' }}>
              Amrita Vishwa Vidyapeetham • Oct 11–12
            </div>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <nav style={{ display: 'none', gap: '4px', alignItems: 'center' }} className="desktop-nav">
          <style>{`
            @media (min-width: 1080px) {
              .desktop-nav { display: flex !important; }
              .mobile-toggle { display: none !important; }
            }
          `}</style>
          {navLinks.map(link => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                style={{
                  background: isActive ? 'rgba(221, 187, 99, 0.15)' : 'transparent',
                  color: isActive ? 'var(--c-gold-bright)' : 'var(--c-text-secondary)',
                  border: isActive ? '1px solid var(--line-gold)' : '1px solid transparent',
                  padding: '7px 12px',
                  borderRadius: '100px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                  fontFamily: 'var(--font-heading)'
                }}
              >
                {link.icon}
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Actions: Audio, Cart, Student Quick Login & Mobile Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          
          {/* Audio Vibe Ambient Toggle */}
          <button
            onClick={toggleAudio}
            title={audioEnabled ? 'Mute ambient fest sound' : 'Enable ambient fest audio'}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: audioEnabled ? 'rgba(221, 187, 99, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${audioEnabled ? 'var(--c-gold)' : 'rgba(255, 255, 255, 0.1)'}`,
              color: audioEnabled ? 'var(--c-gold)' : 'var(--c-text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {audioEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
          </button>

          {/* Cart Trigger */}
          <button
            onClick={onOpenCart}
            title="Open Stall Cart"
            style={{
              position: 'relative',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'var(--c-text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <ShoppingBag size={18} />
            {cartItemCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'linear-gradient(135deg, #F43F5E, #E11D48)',
                color: '#FFF',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                fontSize: '10px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(244, 63, 94, 0.5)'
              }}>
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Student Pass Button */}
          <button
            onClick={onOpenStudentLogin}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '12px' }}
          >
            <Ticket size={14} />
            <span>Student Pass</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#FFF',
              padding: '6px',
              cursor: 'pointer'
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          background: 'rgba(8, 4, 22, 0.98)',
          borderBottom: '1px solid var(--line-gold)',
          padding: '16px 20px 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px'
        }}>
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              style={{
                background: activeSection === link.id ? 'rgba(221, 187, 99, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                color: activeSection === link.id ? 'var(--c-gold)' : 'var(--c-text-primary)',
                border: activeSection === link.id ? '1px solid var(--line-gold)' : '1px solid rgba(255, 255, 255, 0.08)',
                padding: '10px 14px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textAlign: 'left'
              }}
            >
              {link.icon}
              <span>{link.label}</span>
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
