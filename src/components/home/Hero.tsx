import React, { useState, useEffect } from 'react';
import { useFest } from '../../context/FestContext';
import { ArrowRight, Ticket, Sparkles, MapPin, Calendar, Flame } from 'lucide-react';

interface HeroProps {
  onOpenStudentLogin: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenStudentLogin }) => {
  const { setActiveSection } = useFest();

  // Dynamic countdown to 11 October 2026
  const [timeLeft, setTimeLeft] = useState({
    days: 11,
    hours: 14,
    minutes: 32,
    seconds: 45
  });

  useEffect(() => {
    const targetDate = new Date('2026-10-11T09:00:00+05:30').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section style={{
      position: 'relative',
      padding: 'clamp(40px, 8vw, 80px) 0 clamp(60px, 10vw, 100px)',
      overflow: 'hidden'
    }}>
      
      {/* Ambient Radial Lights behind Hero */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'clamp(320px, 80vw, 900px)',
        height: '500px',
        background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.22) 0%, rgba(59, 130, 246, 0.15) 45%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '1100px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        
        {/* Eyebrow Festival Ribbon */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          padding: '6px 18px',
          borderRadius: '100px',
          background: 'rgba(221, 187, 99, 0.08)',
          border: '1px solid var(--line-gold)',
          backdropFilter: 'blur(12px)',
          marginBottom: '28px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
        }}>
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: 'var(--c-gold)',
            boxShadow: '0 0 10px var(--c-gold)'
          }} />
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: 'var(--c-gold-bright)'
          }}>
            AMRITA VISHWA VIDYAPEETHAM • AMARAVATI CAMPUS
          </span>
        </div>

        {/* Master Brand Art & Title Presentation */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px'
        }}>
          
          {/* Official PARIणाम 2026 Artwork Banner Display */}
          <div style={{
            position: 'relative',
            maxWidth: '480px',
            width: '90%',
            marginBottom: '16px',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(59, 130, 246, 0.25)',
            border: '1px solid rgba(221, 187, 99, 0.3)'
          }}>
            <img 
              src="/images/parinam-logo.jpg" 
              alt="PARINAM 2026 - The Techno-Cultural Fest Amrita Amaravati" 
              style={{
                width: '100%',
                height: 'auto',
                display: 'block'
              }}
            />
          </div>

          {/* Large Editorial Subtitle with Shimmer & Entrance Reveal */}
          <h1 
            className="animate-title-reveal interactive-title"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(38px, 6.5vw, 76px)',
              fontWeight: 700,
              color: 'var(--c-parchment)',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              maxWidth: '920px',
              margin: '0 auto 18px'
            }}
          >
            AMRITA AMARAVATI FEST <span className="fest-title-shimmer">2026</span>
          </h1>

          {/* Editorial Tagline */}
          <p style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 'clamp(18px, 2.4vw, 24px)',
            color: 'var(--c-text-secondary)',
            lineHeight: 1.4,
            maxWidth: '720px',
            margin: '0 auto 28px'
          }}>
            An Arcadian Odyssey of Music, Culture, Technology, and Campus Celebration.
          </p>
        </div>

        {/* Essential Festival Metadata Badges (Thomso Style) */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '40px'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(13, 7, 30, 0.65)',
            border: '1px solid var(--line-gold)',
            borderRadius: '100px',
            padding: '8px 18px',
            fontSize: '13px',
            color: 'var(--c-parchment)',
            backdropFilter: 'blur(10px)'
          }}>
            <Calendar size={15} style={{ color: 'var(--c-gold)' }} />
            <span style={{ fontWeight: 600 }}>11 — 12 OCTOBER 2026</span>
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(13, 7, 30, 0.65)',
            border: '1px solid var(--line-gold)',
            borderRadius: '100px',
            padding: '8px 18px',
            fontSize: '13px',
            color: 'var(--c-parchment)',
            backdropFilter: 'blur(10px)'
          }}>
            <MapPin size={15} style={{ color: '#60A5FA' }} />
            <span style={{ fontWeight: 600 }}>Amaravati, Andhra Pradesh</span>
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(13, 7, 30, 0.65)',
            border: '1px solid var(--line-gold)',
            borderRadius: '100px',
            padding: '8px 18px',
            fontSize: '13px',
            color: 'var(--c-parchment)',
            backdropFilter: 'blur(10px)'
          }}>
            <Sparkles size={15} style={{ color: '#C084FC' }} />
            <span style={{ fontWeight: 600 }}>13 Clubs • 4 Flagship Mega Nights</span>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '14px',
          marginBottom: '54px'
        }}>
          <button
            onClick={() => setActiveSection('student-pass')}
            className="btn-fest-gold"
          >
            <Ticket size={16} />
            <span>GET FEST PASS (₹750 PRE-PAID)</span>
            <ArrowRight size={14} />
          </button>

          <button
            onClick={() => {
              const exploreEl = document.getElementById('fest-explore-map-section');
              if (exploreEl) {
                exploreEl.scrollIntoView({ behavior: 'smooth' });
              } else {
                setActiveSection('map');
              }
            }}
            className="btn-fest-ghost"
          >
            <MapPin size={15} />
            <span>EXPLORE THE FEST</span>
          </button>

          <button
            onClick={() => {
              const megaEl = document.getElementById('fest-mega-events-section');
              if (megaEl) {
                megaEl.scrollIntoView({ behavior: 'smooth' });
              } else {
                setActiveSection('events');
              }
            }}
            className="btn-fest-ghost"
          >
            <Flame size={15} style={{ color: 'var(--c-gold)' }} />
            <span>VIEW MEGA EVENTS</span>
          </button>
        </div>

        {/* Thomso-Style Artistic Festival Countdown */}
        <div style={{
          maxWidth: '680px',
          margin: '0 auto',
          background: 'var(--c-surface)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid var(--line-gold)',
          borderRadius: '20px',
          padding: '24px 32px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{
            fontSize: '11px',
            fontFamily: 'var(--font-sans)',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: 'var(--c-gold)',
            marginBottom: '16px',
            fontWeight: 700
          }}>
            ✦ COUNTDOWN TO THE FESTIVAL GATES OPENING ✦
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(32px, 5vw, 48px)',
                fontWeight: 600,
                color: 'var(--c-parchment)',
                lineHeight: 1.0
              }}>
                {String(timeLeft.days).padStart(2, '0')}
              </div>
              <div style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '10px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--c-text-muted)',
                marginTop: '4px'
              }}>
                DAYS
              </div>
            </div>

            <div style={{ textAlign: 'center', borderLeft: '1px solid var(--line-gold-faint)' }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(32px, 5vw, 48px)',
                fontWeight: 600,
                color: 'var(--c-parchment)',
                lineHeight: 1.0
              }}>
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <div style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '10px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--c-text-muted)',
                marginTop: '4px'
              }}>
                HOURS
              </div>
            </div>

            <div style={{ textAlign: 'center', borderLeft: '1px solid var(--line-gold-faint)' }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(32px, 5vw, 48px)',
                fontWeight: 600,
                color: 'var(--c-parchment)',
                lineHeight: 1.0
              }}>
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <div style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '10px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--c-text-muted)',
                marginTop: '4px'
              }}>
                MINUTES
              </div>
            </div>

            <div style={{ textAlign: 'center', borderLeft: '1px solid var(--line-gold-faint)' }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(32px, 5vw, 48px)',
                fontWeight: 600,
                color: 'var(--c-gold)',
                lineHeight: 1.0
              }}>
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <div style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '10px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--c-gold)',
                marginTop: '4px'
              }}>
                SECONDS
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
