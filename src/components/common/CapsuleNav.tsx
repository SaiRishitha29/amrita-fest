import React, { useState, useEffect } from 'react';
import { useFest } from '../../context/FestContext';
import { 
  ShoppingBag, Ticket, Shield, Store, QrCode, Crown, 
  GraduationCap, ChevronDown, Menu, X, Sparkles, MapPin, 
  Calendar, Users, Sun, Moon 
} from 'lucide-react';
import { UserRole } from '../../types';

interface CapsuleNavProps {
  onOpenCart: () => void;
  onOpenStudentLogin: () => void;
}

export const CapsuleNav: React.FC<CapsuleNavProps> = ({ onOpenCart, onOpenStudentLogin }) => {
  const { 
    activeSection, 
    setActiveSection, 
    cart, 
    currentRole, 
    setRole, 
    currentUser,
    theme,
    toggleTheme
  } = useFest();

  const [scrolled, setScrolled] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [passModalOpen, setPassModalOpen] = useState(false);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Overview' },
    { id: 'about-scroll', label: 'About' },
    { id: 'events', label: 'Mega Nights' },
    { id: 'map', label: 'Explore Fest' },
    { id: 'clubs', label: '13 Clubs' },
    { id: 'stalls', label: 'Fest Market' },
    { id: 'schedule', label: 'Timeline' },
  ];

  const handleNavClick = (id: string) => {
    if (id === 'about-scroll') {
      if (activeSection !== 'home') {
        setActiveSection('home');
        setTimeout(() => {
          document.getElementById('fest-about-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document.getElementById('fest-about-section')?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      setActiveSection(id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const roles: { role: UserRole; label: string; icon: React.ReactNode; desc: string }[] = [
    { role: 'student', label: 'Student Portal (Rahul)', icon: <GraduationCap size={13} />, desc: '₹750 pre-paid pass & reusable QR' },
    { role: 'visitor', label: 'Visitor Pass (Priya)', icon: <Ticket size={13} />, desc: 'External registration & accommodation' },
    { role: 'club_admin', label: 'Club Admin (ACM Lead)', icon: <Shield size={13} />, desc: 'Scoped to ACM events & reports' },
    { role: 'stall_admin', label: 'Stall Admin (Food Lead)', icon: <Store size={13} />, desc: 'Scoped to Southern Spice orders' },
    { role: 'scanner', label: 'Gate Scanner Officer', icon: <QrCode size={13} />, desc: 'Optical atomic QR redemption' },
    { role: 'super_admin', label: 'Super Admin (Convener)', icon: <Crown size={13} />, desc: 'Global operations & audit logs' },
  ];

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 150,
        transition: 'all 0.3s ease',
        background: theme === 'light'
          ? (scrolled ? 'rgba(248, 250, 252, 0.96)' : 'rgba(248, 250, 252, 0.88)')
          : (scrolled ? 'rgba(6, 9, 19, 0.94)' : 'rgba(6, 9, 19, 0.78)'),
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${scrolled ? 'var(--line-gold)' : 'var(--line-gold-faint)'}`,
        boxShadow: scrolled 
          ? (theme === 'light' ? '0 10px 30px rgba(45, 25, 70, 0.08)' : '0 12px 36px rgba(0, 0, 0, 0.7)') 
          : 'none'
      }}>
        <div className="container-fest" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: scrolled ? '64px' : '74px',
          transition: 'height 0.3s ease'
        }}>
          
          {/* Brand Lockup with Official PARIणाम 2026 Artwork */}
          <div 
            onClick={() => handleNavClick('home')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          >
            <div style={{
              width: scrolled ? '38px' : '44px',
              height: scrolled ? '38px' : '44px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '1.5px solid var(--c-gold)',
              boxShadow: '0 0 16px var(--c-gold-glow)',
              transition: 'all 0.3s ease',
              background: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <img 
                src="/images/parinam-logo.jpg" 
                alt="PARINAM 2026 Logo"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div>
              <div style={{
                fontFamily: 'var(--font-cinzel)',
                fontWeight: 800,
                fontSize: scrolled ? '15px' : '17px',
                letterSpacing: '0.08em',
                color: 'var(--c-parchment)',
                lineHeight: 1.1,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>PARIणाम</span>
                <span style={{ color: 'var(--c-gold)', fontSize: '13px' }}>2026</span>
              </div>
              <div style={{
                fontSize: '9px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--c-gold)',
                fontFamily: 'var(--font-sans)',
                fontWeight: 600
              }}>
                AMRITA VISHWA VIDYAPEETHAM • AMARAVATI
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav style={{ display: 'none', gap: '4px', alignItems: 'center' }} className="desktop-festival-nav">
            <style>{`
              @media (min-width: 1040px) {
                .desktop-festival-nav { display: flex !important; }
                .mobile-menu-btn { display: none !important; }
              }
            `}</style>
            
            {navLinks.map(link => {
              const isActive = (link.id === 'about-scroll' && activeSection === 'home') ? false : activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  style={{
                    background: isActive ? 'rgba(221, 187, 99, 0.15)' : 'transparent',
                    color: isActive ? 'var(--c-gold-bright)' : 'var(--c-text-secondary)',
                    border: isActive ? '1px solid var(--line-gold)' : '1px solid transparent',
                    padding: '8px 14px',
                    borderRadius: '100px',
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: 'var(--font-sans)',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={e => {
                    if (!isActive) e.currentTarget.style.color = 'var(--c-text-secondary)';
                  }}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            
            {/* Get Pass Primary Button */}
            <button
              onClick={() => setPassModalOpen(true)}
              className="btn-fest-gold hide-mobile"
              style={{ padding: '8px 18px', fontSize: '11px' }}
            >
              <Ticket size={13} />
              <span>GET PASS</span>
            </button>

            {/* My Pass (Student Portal Quick Access) */}
            <button
              onClick={() => handleNavClick('student-pass')}
              className="btn-fest-ghost hide-mobile"
              style={{
                padding: '8px 14px',
                fontSize: '11px',
                borderColor: activeSection === 'student-pass' ? 'var(--c-gold)' : 'var(--line-gold-faint)',
                background: activeSection === 'student-pass' ? 'rgba(221, 187, 99, 0.15)' : undefined
              }}
            >
              <GraduationCap size={13} />
              <span>MY PASS</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              style={{
                position: 'relative',
                background: cartItemCount > 0 ? 'rgba(221, 187, 99, 0.18)' : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${cartItemCount > 0 ? 'var(--c-gold)' : 'var(--line-gold-faint)'}`,
                color: cartItemCount > 0 ? 'var(--c-gold)' : 'var(--c-text-secondary)',
                borderRadius: '100px',
                padding: '7px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: 600,
                transition: 'all 0.2s ease'
              }}
            >
              <ShoppingBag size={14} />
              <span className="hide-mobile">CART</span>
              {cartItemCount > 0 && (
                <span style={{
                  background: 'var(--c-gold)',
                  color: '#120A02',
                  fontSize: '10px',
                  fontWeight: 800,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Theme Mode Switcher (Dark / Light Ivory Edition) */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Royal Ivory Light Edition' : 'Switch to Nocturnal Midnight Void'}
              style={{
                background: theme === 'light' ? 'rgba(158, 116, 24, 0.12)' : 'rgba(255, 255, 255, 0.06)',
                border: `1px solid ${theme === 'light' ? 'var(--c-gold)' : 'var(--line-gold-faint)'}`,
                color: theme === 'light' ? 'var(--c-gold-bright)' : 'var(--c-gold)',
                borderRadius: '100px',
                padding: '7px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                fontWeight: 700,
                fontFamily: 'var(--font-sans)',
                transition: 'all 0.25s ease'
              }}
            >
              {theme === 'dark' ? (
                <>
                  <Sun size={13} className="animate-twinkle" />
                  <span className="hide-mobile">LITE</span>
                </>
              ) : (
                <>
                  <Moon size={13} />
                  <span className="hide-mobile">DARK</span>
                </>
              )}
            </button>

            {/* Role Switcher Pill */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--line-gold-faint)',
                  borderRadius: '100px',
                  padding: '7px 12px',
                  color: 'var(--c-text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-sans)',
                  textTransform: 'uppercase'
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--c-gold)' }} />
                <span className="hide-mobile">Role:</span>
                <span style={{ color: '#FFF', fontWeight: 700 }}>
                  {currentRole.replace('_', ' ')}
                </span>
                <ChevronDown size={12} />
              </button>

              {roleDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '115%',
                  right: 0,
                  background: 'var(--c-surface-elevated)',
                  border: '1px solid var(--line-gold)',
                  borderRadius: '14px',
                  padding: '8px',
                  minWidth: '240px',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 25px var(--c-gold-faint)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  zIndex: 200
                }}>
                  <div style={{
                    fontSize: '10px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--c-gold)',
                    padding: '6px 10px',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 700
                  }}>
                    Simulate Portal Role:
                  </div>

                  {roles.map(r => (
                    <button
                      key={r.role}
                      onClick={() => {
                        setRole(r.role);
                        setRoleDropdownOpen(false);
                        if (r.role === 'club_admin') setActiveSection('club-admin');
                        else if (r.role === 'stall_admin') setActiveSection('stall-admin');
                        else if (r.role === 'scanner') setActiveSection('scanner');
                        else if (r.role === 'super_admin') setActiveSection('admin');
                        else if (r.role === 'student') setActiveSection('student-pass');
                        else if (r.role === 'visitor') setActiveSection('visitor');
                      }}
                      style={{
                        background: currentRole === r.role ? 'rgba(221, 187, 99, 0.18)' : 'transparent',
                        color: currentRole === r.role ? 'var(--c-gold)' : 'var(--c-text-secondary)',
                        border: currentRole === r.role ? '1px solid var(--line-gold)' : '1px solid transparent',
                        borderRadius: '10px',
                        padding: '8px 10px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '12px',
                        fontWeight: 600,
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span style={{ color: 'var(--c-gold)' }}>{r.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: '#FFF', fontSize: '12px' }}>{r.label}</div>
                        <div style={{ fontSize: '10px', color: 'var(--c-text-muted)' }}>{r.desc}</div>
                      </div>
                    </button>
                  ))}
                  
                  <div style={{ borderTop: '1px solid var(--line-gold-faint)', margin: '4px 0', paddingTop: '4px' }}>
                    <button
                      onClick={() => {
                        setActiveSection('blueprint');
                        setRoleDropdownOpen(false);
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--c-text-muted)',
                        padding: '6px 10px',
                        fontSize: '11px',
                        width: '100%',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      ✦ View 35-Point Architecture Blueprint
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-btn"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--line-gold-faint)',
                color: 'var(--c-parchment)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

          </div>
        </div>
      </header>

      {/* Designed Mobile Festival Drawer */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: theme === 'light' ? 'rgba(248, 250, 252, 0.98)' : 'rgba(6, 9, 19, 0.98)',
          backdropFilter: 'blur(24px)',
          zIndex: 140,
          padding: '80px 24px 32px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '11px',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'var(--c-gold)',
              marginBottom: '12px'
            }}>
              Festival Exploration
            </div>

            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                style={{
                  background: activeSection === link.id ? 'rgba(221, 187, 99, 0.15)' : 'transparent',
                  color: activeSection === link.id ? 'var(--c-gold)' : 'var(--c-parchment)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  fontSize: '18px',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span>{link.label}</span>
                <span style={{ fontSize: '12px', opacity: 0.5 }}>→</span>
              </button>
            ))}

            <div style={{ borderTop: '1px solid var(--line-gold-faint)', margin: '16px 0', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => { setPassModalOpen(true); setMobileMenuOpen(false); }}
                className="btn-fest-gold"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Ticket size={14} />
                <span>Get Fest Pass</span>
              </button>

              <button
                onClick={() => { handleNavClick('student-pass'); }}
                className="btn-fest-ghost"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <GraduationCap size={14} />
                <span>Student Pass Login (₹750)</span>
              </button>

              <button
                onClick={() => { handleNavClick('scanner'); }}
                className="btn-fest-ghost"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <QrCode size={14} />
                <span>Gate Scanner Tool</span>
              </button>

              <button
                onClick={toggleTheme}
                className="btn-fest-ghost"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  background: theme === 'light' ? 'rgba(158, 116, 24, 0.12)' : 'rgba(255, 255, 255, 0.08)',
                  borderColor: 'var(--c-gold)',
                  color: 'var(--c-gold)'
                }}
              >
                {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                <span>Switch to {theme === 'dark' ? 'Royal Ivory Light Mode' : 'Midnight Dark Mode'}</span>
              </button>
            </div>
          </div>

          <div style={{
            fontSize: '11px',
            color: 'var(--c-text-muted)',
            textAlign: 'center',
            borderTop: '1px solid var(--line-gold-faint)',
            paddingTop: '16px'
          }}>
            AMRITA VISHWA VIDYAPEETHAM • AMARAVATI CAMPUS
            <div style={{ color: 'var(--c-gold)', marginTop: '4px' }}>PARIणाम 2026 • 11–12 OCTOBER 2026</div>
          </div>
        </div>
      )}

      {/* Get Pass Selection Modal */}
      {passModalOpen && (
        <div className="modal-overlay" onClick={() => setPassModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <span className="badge-gold">FESTIVAL ACCESS CREDENTIALS</span>
                <h3 style={{ fontSize: '24px', color: 'var(--c-parchment)', marginTop: '6px' }}>Choose Your Fest Pass</h3>
              </div>
              <button 
                onClick={() => setPassModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--c-text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
              {/* Amrita Student Card */}
              <div 
                onClick={() => {
                  setPassModalOpen(false);
                  setActiveSection('student-pass');
                }}
                style={{
                  background: 'rgba(221, 187, 99, 0.08)',
                  border: '1.5px solid var(--c-gold)',
                  borderRadius: '16px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <GraduationCap size={20} style={{ color: 'var(--c-gold)' }} />
                    <h4 style={{ fontSize: '18px', color: 'var(--c-parchment)' }}>Amrita Amaravati Students</h4>
                  </div>
                  <span className="badge-gold">ALREADY PAID ₹750</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--c-text-secondary)', lineHeight: 1.5 }}>
                  Non-negotiable Rule: Students already paid ₹750 in semester fees. Do not pay again! Simply log in with your roll number to access your Digital Pass & reusable QR.
                </p>
                <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--c-gold)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Log in & Claim Holographic Digital Pass →</span>
                </div>
              </div>

              {/* External Visitor Card */}
              <div 
                onClick={() => {
                  setPassModalOpen(false);
                  setActiveSection('visitor');
                }}
                style={{
                  background: 'rgba(59, 130, 246, 0.08)',
                  border: '1.5px solid rgba(59, 130, 246, 0.4)',
                  borderRadius: '16px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Ticket size={20} style={{ color: 'var(--c-sapphire)' }} />
                    <h4 style={{ fontSize: '18px', color: 'var(--c-parchment)' }}>External College Visitors</h4>
                  </div>
                  <span className="badge-sapphire">FROM ₹600</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--c-text-secondary)', lineHeight: 1.5 }}>
                  College students & guests from across India. Single Day or Both Days pass options with optional on-campus AC hostel accommodation.
                </p>
                <div style={{ marginTop: '12px', fontSize: '12px', color: '#60A5FA', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Register for Visitor Pass & Accommodation →</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
