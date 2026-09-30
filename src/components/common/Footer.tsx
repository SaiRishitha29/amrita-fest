import React from 'react';
import { useFest } from '../../context/FestContext';
import { MapPin, Phone, Mail, Sparkles, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveSection } = useFest();

  return (
    <footer style={{
      background: '#04020B',
      borderTop: '1px solid var(--line-gold-faint)',
      padding: 'clamp(50px, 8vw, 80px) 0 32px',
      position: 'relative',
      zIndex: 10,
      marginTop: '60px'
    }}>
      <div className="container-fest">
        
        {/* Main Footer Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '36px',
          marginBottom: '48px'
        }}>
          
          {/* Brand Col */}
          <div style={{ maxWidth: '320px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '1px solid var(--c-gold)',
                boxShadow: '0 0 12px var(--c-gold-glow)',
                flexShrink: 0
              }}>
                <img 
                  src="/images/parinam-logo.jpg" 
                  alt="PARINAM 2026"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div>
                <div style={{
                  fontFamily: 'var(--font-cinzel)',
                  fontSize: '16px',
                  fontWeight: 800,
                  color: 'var(--c-parchment)',
                  letterSpacing: '0.06em'
                }}>
                  PARIणाम 2026
                </div>
                <div style={{
                  fontSize: '9px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--c-gold)',
                  fontWeight: 600
                }}>
                  THE TECHNO-CULTURAL FEST
                </div>
              </div>
            </div>

            <p style={{
              fontFamily: 'Georgia, serif',
              fontSize: '13px',
              color: 'rgba(233, 222, 255, 0.72)',
              lineHeight: 1.6,
              marginBottom: '16px'
            }}>
              Amrita Vishwa Vidyapeetham, Amaravati Campus. 48 hours of technological engineering, classical & fusion arts, automotive grandeur, and celebratory campus life.
            </p>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              color: 'var(--c-gold)',
              fontWeight: 600,
              letterSpacing: '0.05em'
            }}>
              <span>✦ DATES: 11 — 12 OCTOBER 2026</span>
            </div>
          </div>

          {/* Quick Festival Exploration */}
          <div>
            <div style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '11px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--c-gold)',
              marginBottom: '16px',
              fontWeight: 700
            }}>
              Festival Exploration
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '8px', fontSize: '13px' }}>
              <li>
                <button 
                  onClick={() => { setActiveSection('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ background: 'transparent', border: 'none', color: 'var(--c-text-secondary)', cursor: 'pointer', padding: 0 }}
                >
                  Overview & Hero
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveSection('events'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ background: 'transparent', border: 'none', color: 'var(--c-text-secondary)', cursor: 'pointer', padding: 0 }}
                >
                  Mega Nights & Pronites
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveSection('map'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ background: 'transparent', border: 'none', color: 'var(--c-text-secondary)', cursor: 'pointer', padding: 0 }}
                >
                  Explore Fest Campus Radar
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveSection('clubs'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ background: 'transparent', border: 'none', color: 'var(--c-text-secondary)', cursor: 'pointer', padding: 0 }}
                >
                  The 13 Campus Clubs
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveSection('stalls'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ background: 'transparent', border: 'none', color: 'var(--c-text-secondary)', cursor: 'pointer', padding: 0 }}
                >
                  Fest Market & Food Court
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveSection('schedule'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ background: 'transparent', border: 'none', color: 'var(--c-text-secondary)', cursor: 'pointer', padding: 0 }}
                >
                  Fest Schedule & Timeline
                </button>
              </li>
            </ul>
          </div>

          {/* Credentials & Access */}
          <div>
            <div style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '11px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--c-gold)',
              marginBottom: '16px',
              fontWeight: 700
            }}>
              Pass Credentials
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '8px', fontSize: '13px' }}>
              <li>
                <button 
                  onClick={() => { setActiveSection('student-pass'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ background: 'transparent', border: 'none', color: 'var(--c-text-secondary)', cursor: 'pointer', padding: 0 }}
                >
                  Student Pass (₹750 Pre-Paid)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveSection('visitor'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ background: 'transparent', border: 'none', color: 'var(--c-text-secondary)', cursor: 'pointer', padding: 0 }}
                >
                  Visitor Pass & Accommodation
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveSection('scanner'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ background: 'transparent', border: 'none', color: 'var(--c-text-secondary)', cursor: 'pointer', padding: 0 }}
                >
                  Gate Scanner Operator Tool
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveSection('blueprint'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ background: 'transparent', border: 'none', color: 'var(--c-gold)', cursor: 'pointer', padding: 0, fontWeight: 700 }}
                >
                  ✦ Architecture Blueprint Specification
                </button>
              </li>
            </ul>
          </div>

          {/* Campus Coordinates & Contact */}
          <div>
            <div style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '11px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--c-gold)',
              marginBottom: '16px',
              fontWeight: 700
            }}>
              Campus & Secretariat
            </div>

            <div style={{ fontSize: '13px', color: 'rgba(233, 222, 255, 0.75)', display: 'grid', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <MapPin size={15} style={{ color: 'var(--c-gold)', flexShrink: 0, marginTop: '2px' }} />
                <span>Amrita Vishwa Vidyapeetham, Amaravati Campus, AP — 522503</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={15} style={{ color: '#60A5FA', flexShrink: 0 }} />
                <span>fest@am.amrita.edu</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={15} style={{ color: '#C084FC', flexShrink: 0 }} />
                <span>Helpline: +91 8645 288888</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Credits Bar */}
        <div style={{
          borderTop: '1px solid var(--line-gold-faint)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '12px',
          color: 'var(--c-text-muted)'
        }}>
          <div>
            &copy; 2026 AMRITA VISHWA VIDYAPEETHAM &bull; AMARAVATI CAMPUS. ALL RIGHTS RESERVED.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>INSPIRED BY THOMSO &bull; SAARANG AESTHETICS</span>
            <span>&bull;</span>
            <span style={{ color: 'var(--c-gold)' }}>PARIणाम 2026</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
