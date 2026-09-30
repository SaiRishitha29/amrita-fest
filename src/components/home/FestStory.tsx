import React from 'react';
import { useFest } from '../../context/FestContext';
import { ArrowRight, Sparkles, Trophy, Calendar, MapPin, Users, Flame } from 'lucide-react';

export const FestStory: React.FC = () => {
  const { setActiveSection } = useFest();

  const stats = [
    { label: 'Festival Dates', val: '11–12 October 2026', sub: 'Two Days of Celebration' },
    { label: 'Festival Venue', val: 'Amaravati Campus', sub: 'Andhra Pradesh, India' },
    { label: 'Student Footfall', val: '3,500+ Attendees', sub: 'Engineered & Managed' },
    { label: 'Club Arenas', val: '13 Campus Societies', sub: 'Technical & Cultural' },
    { label: 'Flagship Nights', val: '4 Mega Attractions', sub: 'Garba, Hackathon, Auto, Pronite' },
    { label: 'Prize Pool', val: '₹3,50,000+', sub: 'Competitive Tournaments' },
  ];

  const pillars = [
    {
      num: '01',
      title: 'Cultural Rhythms & Traditions',
      tagline: 'Garba Raas, Battle of the Bands & Street Theatre',
      desc: 'Under illuminated open-air amphitheatre lanterns, students celebrate traditional Dandiya beats, clash in rock band riffs, and voice fiery social narratives through Nukkad Natak.',
      image: '/images/garba.jpg',
      badge: 'Tradition & Expression'
    },
    {
      num: '02',
      title: 'Technological Engineering',
      tagline: 'RAILU 24H Hackathon & RoboWars Steel Arena',
      desc: 'North & South India premier smart mobility challenge in partnership with RAILU society, alongside high-torque 15kg combat robots clashing inside reinforced polycarbonate battlegrounds.',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
      badge: 'Code & Combat'
    },
    {
      num: '03',
      title: 'Automotive Grandeur',
      tagline: 'Exotic Supercars, Superbikes & EV Racecars',
      desc: 'Academic Boulevard transforms into an exotic automotive playground featuring over 60 high-performance supercars, custom superbikes, vintage classics, and student EV formula racecars.',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      badge: 'Speed & Design'
    },
    {
      num: '04',
      title: 'Star Pronite Finale',
      tagline: 'The Grand EDM Laser Symphony & Concert',
      desc: 'The festival culminates at the Main Stadium Arena with a monumental EDM concert featuring celebrity headline performers, Bollywood fusion artists, laser showers, and pyrotechnic skies.',
      image: '/images/dj.jpg',
      badge: 'Grand Pronite'
    }
  ];

  return (
    <section id="fest-about-section" style={{
      padding: 'clamp(50px, 8vw, 90px) 0',
      borderTop: '1px solid var(--line-gold-faint)',
      position: 'relative'
    }}>
      
      {/* Editorial Header */}
      <div style={{ maxWidth: '960px', margin: '0 auto 48px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px'
        }}>
          <span className="badge-gold">ABOUT AMRITA FEST 2026</span>
          <span className="badge-parchment">PARIणाम ODYSSEY</span>
        </div>

        <h2 
          className="fest-title-shimmer interactive-title"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 5.5vw, 64px)',
            fontWeight: 600,
            color: 'var(--c-parchment)',
            lineHeight: 1.05,
            marginBottom: '16px'
          }}
        >
          THIS IS OUR FEST.
        </h2>

        <p style={{
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(16px, 2vw, 19px)',
          color: 'var(--c-text-secondary)',
          lineHeight: 1.6,
          maxWidth: '780px',
          margin: '0 auto 24px'
        }}>
          A celebration of music, culture, technology, competition, and campus community. For two days every October, students, coders, artists, and innovators gather at Amrita Vishwa Vidyapeetham, Amaravati to redefine student potential.
        </p>
      </div>

      {/* Thomso-Style 6-Part Stat Matrix */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '14px',
        marginBottom: '64px'
      }}>
        {stats.map((s, idx) => (
          <div key={idx} className="editorial-stat-tile">
            <div className="editorial-stat-label">{s.label}</div>
            <div className="editorial-stat-val">{s.val}</div>
            <div style={{
              fontSize: '11px',
              color: 'var(--c-text-muted)',
              marginTop: '4px',
              fontFamily: 'var(--font-sans)'
            }}>
              {s.sub}
            </div>
          </div>
        ))}
      </div>

      {/* 4 Storytelling Editorial Pillars */}
      <div style={{ display: 'grid', gap: '48px', maxWidth: '1140px', margin: '0 auto' }}>
        {pillars.map((pillar, idx) => {
          const isEven = idx % 2 === 1;
          return (
            <div 
              key={pillar.num}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 'clamp(24px, 4vw, 48px)',
                alignItems: 'center',
                padding: 'clamp(24px, 4vw, 36px)',
                background: 'rgba(13, 7, 30, 0.55)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid var(--line-gold-faint)',
                borderRadius: '24px',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
              }}
            >
              {/* Image side */}
              <div style={{
                order: isEven ? 2 : 1,
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
                height: '280px',
                border: '1px solid var(--line-gold-faint)',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6)'
              }}>
                <img 
                  src={pillar.image} 
                  alt={pillar.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.6s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(5, 3, 15, 0.1) 0%, rgba(5, 3, 15, 0.8) 100%)'
                }} />
                <div style={{ position: 'absolute', bottom: '16px', left: '16px' }}>
                  <span className="badge-gold">{pillar.badge}</span>
                </div>
              </div>

              {/* Text Side */}
              <div style={{ order: isEven ? 1 : 2 }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(32px, 4vw, 44px)',
                  fontStyle: 'italic',
                  color: 'var(--c-gold)',
                  opacity: 0.65,
                  lineHeight: 1
                }}>
                  {pillar.num}
                </div>

                <h3 
                  className="interactive-title"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(24px, 3.2vw, 36px)',
                    fontWeight: 600,
                    color: 'var(--c-parchment)',
                    margin: '8px 0 6px',
                    lineHeight: 1.15
                  }}
                >
                  {pillar.title}
                </h3>

                <div style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--c-gold-bright)',
                  marginBottom: '14px'
                }}>
                  {pillar.tagline}
                </div>

                <p style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '15px',
                  color: 'var(--c-text-secondary)',
                  lineHeight: 1.7,
                  marginBottom: '20px'
                }}>
                  {pillar.desc}
                </p>

                <button
                  onClick={() => {
                    if (pillar.num === '01' || pillar.num === '04' || pillar.num === '03') {
                      setActiveSection('events');
                    } else {
                      setActiveSection('clubs');
                    }
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="btn-fest-ghost"
                  style={{ padding: '8px 18px', fontSize: '12px' }}
                >
                  <span>Explore Arena Details</span>
                  <ArrowRight size={13} />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};
