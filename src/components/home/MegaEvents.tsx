import React, { useState } from 'react';
import { useFest } from '../../context/FestContext';
import { FestEvent } from '../../types';
import { 
  Calendar, MapPin, Clock, ExternalLink, Ticket, 
  ArrowRight, Sparkles, CheckCircle2, X, Music, Car, Terminal, Users 
} from 'lucide-react';

export const MegaEvents: React.FC = () => {
  const { festEvents, setActiveSection } = useFest();
  const [selectedEvent, setSelectedEvent] = useState<FestEvent | null>(null);
  const [railuModalOpen, setRailuModalOpen] = useState(false);
  const [activeDayFilter, setActiveDayFilter] = useState<'All' | '11 Oct' | '12 Oct'>('All');

  const handleEventAction = (event: FestEvent) => {
    if (event.isExternal) {
      setRailuModalOpen(true);
    } else {
      setSelectedEvent(event);
    }
  };

  const filteredEvents = festEvents.filter(e => {
    if (activeDayFilter === 'All') return true;
    if (activeDayFilter === '11 Oct') return e.date.includes('11 October');
    if (activeDayFilter === '12 Oct') return e.date.includes('12 October');
    return true;
  });

  return (
    <section id="fest-mega-events-section" style={{ padding: 'clamp(40px, 6vw, 80px) 0' }}>
      
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
            <span className="badge-gold">FLAGSHIP ATTRACTIONS</span>
            <span className="badge-parchment">4 MEGA NIGHTS</span>
          </div>

          <h2 
            className="fest-title-shimmer interactive-title"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 5vw, 54px)',
              fontWeight: 700,
              color: 'var(--c-parchment)',
              lineHeight: 1.05
            }}
          >
            THE MEGA NIGHTS & ATTRACTIONS
          </h2>

          <p style={{
            fontFamily: 'Georgia, serif',
            color: 'var(--c-text-secondary)',
            fontSize: '15px',
            maxWidth: '680px',
            marginTop: '6px'
          }}>
            Included with the Amrita Student Pass (₹750 pre-paid) and external Visitor Passes. Verified at security arena turnstiles via atomic reusable QR tokens.
          </p>
        </div>

        {/* Day Filter Controls */}
        <div style={{
          display: 'inline-flex',
          background: 'var(--c-surface)',
          border: '1px solid var(--line-gold-faint)',
          borderRadius: '100px',
          padding: '4px',
          gap: '4px'
        }}>
          {(['All', '11 Oct', '12 Oct'] as const).map(day => (
            <button
              key={day}
              onClick={() => setActiveDayFilter(day)}
              style={{
                background: activeDayFilter === day ? 'var(--c-gold-gradient)' : 'transparent',
                color: activeDayFilter === day ? '#1A1002' : 'var(--c-text-secondary)',
                border: 'none',
                borderRadius: '100px',
                padding: '8px 18px',
                fontSize: '12px',
                fontFamily: 'var(--font-sans)',
                fontWeight: 700,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {day === 'All' ? 'ALL 4 MEGA NIGHTS' : `DAY // ${day.toUpperCase()}`}
            </button>
          ))}
        </div>
      </div>

      {/* Editorial Featured Grid for 4 Major Events */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px'
      }}>
        {filteredEvents.map(event => {
          const isDJ = event.id === 'fest-dj';
          const isGarba = event.id === 'fest-garba';
          const isAuto = event.id === 'fest-auto';
          const isRailu = event.id === 'fest-railu';

          return (
            <div 
              key={event.id}
              onClick={() => handleEventAction(event)}
              className="fest-card"
              style={{
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              {/* Event Poster Visual */}
              <div style={{
                position: 'relative',
                height: '240px',
                overflow: 'hidden',
                background: '#090518'
              }}>
                <img 
                  src={event.image} 
                  alt={event.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                />

                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(5, 3, 15, 0.1) 0%, rgba(5, 3, 15, 0.6) 50%, rgba(5, 3, 15, 0.95) 100%)',
                }} />

                {/* Date Badge Top Left */}
                <div style={{ position: 'absolute', top: '14px', left: '14px', zIndex: 2 }}>
                  <span className="badge-gold" style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.6)' }}>
                    {event.date}
                  </span>
                </div>

                {/* Badge Top Right */}
                <div style={{ position: 'absolute', top: '14px', right: '14px', zIndex: 2 }}>
                  <span className={isRailu ? 'badge-sapphire' : isDJ ? 'badge-violet' : 'badge-parchment'} style={{ backdropFilter: 'blur(8px)' }}>
                    {event.badge}
                  </span>
                </div>

                {/* Title anchored over lower gradient */}
                <div style={{ position: 'absolute', bottom: '14px', left: '16px', right: '16px', zIndex: 2 }}>
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '22px',
                    fontWeight: 700,
                    color: 'var(--c-parchment)',
                    lineHeight: 1.15
                  }}>
                    {event.title}
                  </h3>
                </div>
              </div>

              {/* Event Body Info */}
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    fontSize: '12px',
                    color: 'var(--c-text-muted)',
                    marginBottom: '14px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={13} style={{ color: 'var(--c-gold)' }} />
                      <span>{event.time}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={13} style={{ color: '#60A5FA' }} />
                      <span>{event.venue}</span>
                    </div>
                  </div>

                  <p style={{
                    fontSize: '13px',
                    color: 'rgba(233, 222, 255, 0.78)',
                    lineHeight: 1.6,
                    marginBottom: '16px',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {event.description}
                  </p>
                </div>

                {/* Card Action Footer */}
                <div style={{
                  borderTop: '1px solid var(--line-gold-faint)',
                  paddingTop: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ fontSize: '11px', color: 'var(--c-gold)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {event.accessRule}
                  </span>

                  <div style={{
                    color: 'var(--c-parchment)',
                    fontSize: '12px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span>{event.isExternal ? 'Handoff' : 'Details'}</span>
                    <ArrowRight size={13} />
                  </div>
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* Flagship Event Details Modal */}
      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            
            {/* Modal Image Banner */}
            <div style={{
              position: 'relative',
              height: '240px',
              borderRadius: '14px',
              overflow: 'hidden',
              marginBottom: '20px'
            }}>
              <img 
                src={selectedEvent.image} 
                alt={selectedEvent.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, transparent 40%, rgba(9, 5, 24, 0.95) 100%)'
              }} />
              <button
                onClick={() => setSelectedEvent(null)}
                style={{
                  position: 'absolute',
                  top: '14px',
                  right: '14px',
                  background: 'rgba(0,0,0,0.6)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFF',
                  cursor: 'pointer'
                }}
              >
                <X size={16} />
              </button>

              <div style={{ position: 'absolute', bottom: '16px', left: '16px' }}>
                <span className="badge-gold">{selectedEvent.badge}</span>
              </div>
            </div>

            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '28px',
              color: 'var(--c-parchment)',
              marginBottom: '6px'
            }}>
              {selectedEvent.title}
            </h3>

            <div style={{
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              color: 'var(--c-gold)',
              fontSize: '14px',
              marginBottom: '18px'
            }}>
              {selectedEvent.tagline}
            </div>

            {/* Time / Venue Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '10px',
              padding: '14px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              border: '1px solid var(--line-gold-faint)',
              marginBottom: '20px'
            }}>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--c-gold)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Date</div>
                <div style={{ fontSize: '13px', color: '#FFF', fontWeight: 600 }}>{selectedEvent.date}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--c-gold)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Time</div>
                <div style={{ fontSize: '13px', color: '#FFF', fontWeight: 600 }}>{selectedEvent.time}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--c-gold)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Venue</div>
                <div style={{ fontSize: '13px', color: '#FFF', fontWeight: 600 }}>{selectedEvent.venue}</div>
              </div>
            </div>

            <p style={{
              fontSize: '14px',
              color: 'rgba(233, 222, 255, 0.85)',
              lineHeight: 1.7,
              marginBottom: '24px'
            }}>
              {selectedEvent.description}
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  setSelectedEvent(null);
                  setActiveSection('student-pass');
                }}
                className="btn-fest-gold"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <Ticket size={14} />
                <span>Access with Student Pass (₹750)</span>
              </button>

              <button
                onClick={() => {
                  setSelectedEvent(null);
                  setActiveSection('scanner');
                }}
                className="btn-fest-ghost"
              >
                <span>Verify Gate Scanner</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Dedicated RAILU HACKATHON Handoff Modal (Requirement 19) */}
      {railuModalOpen && (
        <div className="modal-overlay" onClick={() => setRailuModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '560px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span className="badge-sapphire">FLAGSHIP TECHNICAL CHALLENGE</span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: '#FFF', marginTop: '6px' }}>
                  RAILU 24-Hour Smart Mobility Hackathon
                </h3>
              </div>
              <button 
                onClick={() => setRailuModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--c-text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '14px', color: 'rgba(233, 222, 255, 0.82)', lineHeight: 1.6, marginBottom: '20px' }}>
              In accordance with Requirement 19, the RAILU Hackathon is hosted on its dedicated portal for registration, team formation, problem statements, and mentor evaluations.
            </p>

            <div style={{
              background: 'rgba(59, 130, 246, 0.08)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <div style={{ fontSize: '11px', color: '#93C5FD', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                Handoff Destination:
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#FFF' }}>
                https://railuhackathon.am.amrita.edu
              </div>
              <div style={{ fontSize: '11px', color: 'var(--c-text-muted)', marginTop: '4px' }}>
                Configurable via Super Admin Settings &bull; Architecture ready for API synchronization.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <a
                href="https://railuhackathon.am.amrita.edu"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-fest-sapphire"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <ExternalLink size={14} />
                <span>EXPLORE RAILU PORTAL</span>
              </a>

              <button
                onClick={() => setRailuModalOpen(false)}
                className="btn-fest-ghost"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
