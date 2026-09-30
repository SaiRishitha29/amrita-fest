import React, { useState } from 'react';
import { useFest } from '../../context/FestContext';
import { Club, ClubEvent } from '../../types';
import { 
  Users, Trophy, Calendar, MapPin, Phone, 
  ArrowRight, CheckCircle2, Shield, QrCode, Search, Sparkles, X 
} from 'lucide-react';

export const ClubDirectory: React.FC = () => {
  const { 
    clubs, 
    clubEvents, 
    registerForClubEvent, 
    setSelectedClubId, 
    setRole, 
    setActiveSection,
    eventRegistrations,
    currentUser
  } = useFest();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeClub, setActiveClub] = useState<Club | null>(null);
  const [regFeedback, setRegFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const categories = ['All', 'Tech', 'Cultural', 'Arts', 'Media', 'Design', 'Gaming', 'Social', 'Literary'];

  const filteredClubs = clubs.filter(club => {
    const matchesCat = selectedCategory === 'All' || club.category === selectedCategory;
    const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          club.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          club.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleRegister = (eventId: string) => {
    const res = registerForClubEvent(eventId);
    setRegFeedback(res);
  };

  const handleSwitchToClubAdmin = (club: Club) => {
    setSelectedClubId(club.id);
    setRole('club_admin');
    setActiveSection('club-admin');
  };

  return (
    <section id="fest-13-clubs-section" style={{ padding: 'clamp(40px, 6vw, 80px) 0' }}>
      
      {/* Editorial Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge-gold">STUDENT BODIES & SOCIETIES</span>
            <span className="badge-parchment">13 OFFICIAL ARENAS</span>
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
            THE 13 CAMPUS CLUBS
          </h2>

          <p style={{
            fontFamily: 'Georgia, serif',
            color: 'var(--c-text-secondary)',
            fontSize: '15px',
            maxWidth: '660px',
            marginTop: '6px'
          }}>
            Explore competitions, hackathons, musical battles, and creative masterclasses hosted by Amrita's 13 student societies.
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '260px' }}>
          <Search size={14} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--c-text-muted)' }} />
          <input
            type="text"
            placeholder="Search clubs & societies..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="form-input"
            style={{
              paddingLeft: '36px',
              paddingTop: '8px',
              paddingBottom: '8px',
              fontSize: '12px',
              borderRadius: '100px'
            }}
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              background: selectedCategory === cat ? 'rgba(221, 187, 99, 0.16)' : 'rgba(13, 7, 30, 0.6)',
              color: selectedCategory === cat ? 'var(--c-gold)' : 'var(--c-text-secondary)',
              border: `1px solid ${selectedCategory === cat ? 'var(--c-gold)' : 'var(--line-gold-faint)'}`,
              padding: '6px 16px',
              borderRadius: '100px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 13 Clubs Editorial Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '24px'
      }}>
        {filteredClubs.map((club, index) => {
          const eventsForClub = clubEvents.filter(e => e.clubId === club.id);
          const formattedIndex = String(index + 1).padStart(2, '0');

          return (
            <div 
              key={club.id}
              onClick={() => setActiveClub(club)}
              className="fest-card"
              style={{
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              {/* Club Banner Header */}
              <div style={{
                position: 'relative',
                height: '140px',
                overflow: 'hidden',
                background: '#090518'
              }}>
                <img 
                  src={club.bannerImage} 
                  alt={club.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.65 }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(5,3,15,0.2) 0%, rgba(5,3,15,0.95) 100%)'
                }} />

                {/* Editorial Index Number & Category */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '22px',
                    fontStyle: 'italic',
                    color: 'var(--c-gold)',
                    fontWeight: 700
                  }}>
                    {formattedIndex}
                  </span>
                  <span className="badge-parchment">{club.category}</span>
                </div>

                {/* Short Code Badge */}
                <div style={{ position: 'absolute', top: '12px', right: '16px' }}>
                  <span className="badge-gold">{club.shortCode}</span>
                </div>

                {/* Club Title */}
                <div style={{ position: 'absolute', bottom: '12px', left: '16px', right: '16px' }}>
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#FFF',
                    lineHeight: 1.15
                  }}>
                    {club.name}
                  </h3>
                </div>
              </div>

              {/* Club Info Body */}
              <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{
                    fontFamily: 'Georgia, serif',
                    fontStyle: 'italic',
                    fontSize: '13px',
                    color: 'var(--c-gold)',
                    marginBottom: '10px'
                  }}>
                    "{club.tagline}"
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
                    {club.description}
                  </p>
                </div>

                {/* Footer with Lead & Event count */}
                <div style={{
                  borderTop: '1px solid var(--line-gold-faint)',
                  paddingTop: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '12px'
                }}>
                  <div style={{ color: 'var(--c-text-muted)' }}>
                    <span>Lead: </span>
                    <strong style={{ color: '#FFF' }}>{club.leadName}</strong>
                  </div>

                  <div style={{
                    color: 'var(--c-gold)',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span>{eventsForClub.length} Events</span>
                    <ArrowRight size={13} />
                  </div>
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* Dedicated Club Detailed Page / Drawer Modal (Requirement 18) */}
      {activeClub && (
        <div className="modal-overlay" onClick={() => { setActiveClub(null); setRegFeedback(null); }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '780px' }}>
            
            {/* Club Hero Banner */}
            <div style={{
              position: 'relative',
              height: '220px',
              borderRadius: '16px',
              overflow: 'hidden',
              marginBottom: '24px'
            }}>
              <img 
                src={activeClub.bannerImage} 
                alt={activeClub.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, transparent 20%, rgba(9, 5, 24, 0.95) 100%)'
              }} />

              <button
                onClick={() => { setActiveClub(null); setRegFeedback(null); }}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
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

              <div style={{ position: 'absolute', bottom: '16px', left: '20px', right: '20px' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                  <span className="badge-gold">{activeClub.shortCode}</span>
                  <span className="badge-parchment">{activeClub.category} Society</span>
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '28px',
                  color: 'var(--c-parchment)',
                  lineHeight: 1.1
                }}>
                  {activeClub.name}
                </h3>
              </div>
            </div>

            {/* Club Tagline & About */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                fontFamily: 'Georgia, serif',
                fontStyle: 'italic',
                fontSize: '16px',
                color: 'var(--c-gold)',
                marginBottom: '12px'
              }}>
                "{activeClub.tagline}"
              </div>
              <p style={{
                fontSize: '14px',
                color: 'rgba(233, 222, 255, 0.85)',
                lineHeight: 1.7
              }}>
                {activeClub.description}
              </p>
            </div>

            {/* Club Lead & Contact Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
              padding: '14px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              border: '1px solid var(--line-gold-faint)',
              marginBottom: '28px'
            }}>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--c-gold)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Conveners & Lead</div>
                <div style={{ fontSize: '13px', color: '#FFF', fontWeight: 600 }}>{activeClub.leadName}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--c-gold)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Official Contact</div>
                <div style={{ fontSize: '13px', color: '#FFF' }}>{activeClub.leadContact}</div>
              </div>
              <div>
                <button
                  onClick={() => handleSwitchToClubAdmin(activeClub)}
                  className="btn-fest-ghost"
                  style={{ padding: '6px 12px', fontSize: '11px', width: '100%', justifyContent: 'center' }}
                >
                  <Shield size={12} />
                  <span>Club Admin Portal</span>
                </button>
              </div>
            </div>

            {/* Registration Feedback Notification */}
            {regFeedback && (
              <div style={{
                padding: '12px 16px',
                borderRadius: '10px',
                marginBottom: '20px',
                background: regFeedback.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                border: `1px solid ${regFeedback.success ? '#10B981' : '#EF4444'}`,
                color: regFeedback.success ? '#34D399' : '#F87171',
                fontSize: '13px',
                fontWeight: 600
              }}>
                {regFeedback.message}
              </div>
            )}

            {/* Hosted Club Competitions */}
            <div>
              <h4 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '22px',
                color: 'var(--c-parchment)',
                marginBottom: '16px'
              }}>
                Hosted Competitions & Tournaments
              </h4>

              <div style={{ display: 'grid', gap: '14px' }}>
                {clubEvents.filter(e => e.clubId === activeClub.id).map(evt => {
                  const isRegistered = eventRegistrations.some(r => r.eventId === evt.id && r.userId === currentUser.id);

                  return (
                    <div 
                      key={evt.id}
                      style={{
                        background: 'rgba(13, 7, 30, 0.65)',
                        border: '1px solid var(--line-gold-faint)',
                        borderRadius: '14px',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                        <div>
                          <span className="badge-gold">{evt.category}</span>
                          <h5 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: '#FFF', marginTop: '4px' }}>
                            {evt.title}
                          </h5>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '14px', color: 'var(--c-gold)', fontWeight: 800 }}>
                            Pool: {evt.prizePool}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--c-text-muted)' }}>
                            Fee: {evt.fee === 0 ? 'FREE' : `₹${evt.fee}`}
                          </div>
                        </div>
                      </div>

                      <p style={{ fontSize: '13px', color: 'rgba(233, 222, 255, 0.8)', lineHeight: 1.5 }}>
                        {evt.description}
                      </p>

                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                        paddingTop: '10px',
                        fontSize: '12px',
                        color: 'var(--c-text-muted)'
                      }}>
                        <div style={{ display: 'flex', gap: '14px' }}>
                          <span>{evt.date} &bull; {evt.time}</span>
                          <span>Venue: {evt.venue}</span>
                        </div>

                        <div>
                          {isRegistered ? (
                            <span style={{ color: '#34D399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <CheckCircle2 size={13} />
                              <span>Registered</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => handleRegister(evt.id)}
                              className="btn-fest-gold"
                              style={{ padding: '6px 16px', fontSize: '11px' }}
                            >
                              <span>Register Now</span>
                              <ArrowRight size={12} />
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
