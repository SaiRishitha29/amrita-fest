import React, { useState } from 'react';
import { useFest } from '../../context/FestContext';
import { CampusVenue } from '../../types';
import { 
  MapPin, Compass, Sparkles, Navigation, Layers, 
  Clock, Users, ArrowUpRight, Search, CheckCircle2, ArrowRight 
} from 'lucide-react';

export const FestCampusMap: React.FC = () => {
  const { venues, setActiveSection } = useFest();
  const [selectedVenue, setSelectedVenue] = useState<CampusVenue>(venues[0]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  const categories = ['All', 'Mega Nights', 'Tech & Innovation', 'Cultural & Arts', 'Food & Marketplace', 'Sports & Arena'];

  const filteredVenues = venues.filter(v => {
    const matchesCat = activeCategory === 'All' || v.category === activeCategory;
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.hostedEvents.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const getPinColor = (category: string) => {
    switch (category) {
      case 'Mega Nights': return '#DDBB63'; // Gold
      case 'Tech & Innovation': return '#3B82F6'; // Sapphire
      case 'Cultural & Arts': return '#8B5CF6'; // Violet
      case 'Food & Marketplace': return '#10B981'; // Emerald
      case 'Sports & Arena': return '#EC4899'; // Rose
      default: return '#DDBB63';
    }
  };

  return (
    <section id="fest-explore-map-section" style={{ padding: 'clamp(40px, 6vw, 80px) 0' }}>
      
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
            <span className="badge-gold">SPATIAL FESTIVAL WORLD</span>
            <span className="badge-parchment">THOMSO MAP INSPIRATION</span>
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
            EXPLORE THE FESTIVAL GROUNDS
          </h2>

          <p style={{
            fontFamily: 'Georgia, serif',
            color: 'var(--c-text-secondary)',
            fontSize: '15px',
            maxWidth: '660px',
            marginTop: '6px'
          }}>
            Locate every competition, 24H hackathon sprint, Dandiya lawn, and culinary stall across the Amrita Amaravati campus.
          </p>
        </div>

        {/* View Toggle & Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative', width: '220px' }}>
            <Search size={14} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--c-text-muted)' }} />
            <input
              type="text"
              placeholder="Filter venues or events..."
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

          <div style={{
            display: 'inline-flex',
            background: 'var(--c-surface)',
            border: '1px solid var(--line-gold-faint)',
            borderRadius: '100px',
            padding: '3px'
          }}>
            <button
              onClick={() => setViewMode('map')}
              style={{
                background: viewMode === 'map' ? 'var(--c-gold-gradient)' : 'transparent',
                color: viewMode === 'map' ? '#1A1002' : 'var(--c-text-secondary)',
                border: 'none',
                borderRadius: '100px',
                padding: '6px 14px',
                fontFamily: 'var(--font-sans)',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Compass size={13} />
              <span>RADAR</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                background: viewMode === 'list' ? 'var(--c-gold-gradient)' : 'transparent',
                color: viewMode === 'list' ? '#1A1002' : 'var(--c-text-secondary)',
                border: 'none',
                borderRadius: '100px',
                padding: '6px 14px',
                fontFamily: 'var(--font-sans)',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Layers size={13} />
              <span>LIST</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              background: activeCategory === cat ? 'rgba(221, 187, 99, 0.16)' : 'rgba(13, 7, 30, 0.6)',
              color: activeCategory === cat ? 'var(--c-gold)' : 'var(--c-text-secondary)',
              border: `1px solid ${activeCategory === cat ? 'var(--c-gold)' : 'var(--line-gold-faint)'}`,
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

      {viewMode === 'map' ? (
        /* Interactive Spatial Campus Radar */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.8fr) minmax(300px, 1fr)',
          gap: '24px',
          alignItems: 'stretch'
        }}>
          <style>{`
            @media (max-width: 900px) {
              #fest-explore-map-section .radar-grid {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>

          {/* Interactive Map Visual Stage */}
          <div style={{
            position: 'relative',
            borderRadius: '24px',
            overflow: 'hidden',
            minHeight: '480px',
            background: '#070414',
            border: '1px solid var(--line-gold)',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8), inset 0 0 60px rgba(139, 92, 246, 0.12)'
          }}>
            {/* Grid & Concentric Radar Rings */}
            <div style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.18,
              backgroundImage: 'radial-gradient(circle, rgba(221, 187, 99, 0.4) 1px, transparent 1px)',
              backgroundSize: '36px 36px',
              pointerEvents: 'none'
            }} />

            {/* Radar Center Crosshairs */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              border: '1px dashed rgba(221, 187, 99, 0.25)',
              pointerEvents: 'none'
            }} />
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              pointerEvents: 'none'
            }} />

            {/* Campus Landmarks Overlay */}
            <div style={{ position: 'absolute', top: '16px', left: '20px', zIndex: 10 }}>
              <div style={{
                fontFamily: 'var(--font-cinzel)',
                fontSize: '13px',
                fontWeight: 800,
                letterSpacing: '0.15em',
                color: 'var(--c-gold)'
              }}>
                AMRITA AMARAVATI CAMPUS RADAR
              </div>
              <div style={{ fontSize: '10px', color: 'var(--c-text-muted)', fontFamily: 'var(--font-mono)' }}>
                COORDINATES READY // 16.5062° N, 80.5189° E
              </div>
            </div>

            {/* Interactive Pins */}
            {filteredVenues.map(venue => {
              const isSelected = selectedVenue.id === venue.id;
              const pinColor = getPinColor(venue.category);

              return (
                <div
                  key={venue.id}
                  onClick={() => setSelectedVenue(venue)}
                  style={{
                    position: 'absolute',
                    left: `${venue.coords.x}%`,
                    top: `${venue.coords.y}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: isSelected ? 30 : 20,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {/* Pin Dot & Pulse Glow */}
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isSelected && (
                      <span style={{
                        position: 'absolute',
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        border: `2px solid ${pinColor}`,
                        animation: 'pulseGlow 2s infinite',
                        pointerEvents: 'none'
                      }} />
                    )}

                    <div style={{
                      width: isSelected ? '26px' : '18px',
                      height: isSelected ? '26px' : '18px',
                      borderRadius: '50%',
                      background: pinColor,
                      boxShadow: `0 0 16px ${pinColor}`,
                      border: '2px solid #FFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease'
                    }}>
                      <span style={{ fontSize: '9px', fontWeight: 900, color: '#000' }}>✦</span>
                    </div>
                  </div>

                  {/* Pin Floating Label */}
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginTop: '6px',
                    whiteSpace: 'nowrap',
                    background: isSelected ? 'rgba(5, 3, 15, 0.95)' : 'rgba(5, 3, 15, 0.75)',
                    border: `1px solid ${isSelected ? pinColor : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '6px',
                    padding: '3px 8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: isSelected ? '#FFF' : 'var(--c-text-secondary)',
                    pointerEvents: 'none',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.7)'
                  }}>
                    {venue.name.split('—')[0].split('&')[0].trim()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Venue Deep Detail Panel */}
          <div className="fest-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{
                position: 'relative',
                height: '180px',
                borderRadius: '14px',
                overflow: 'hidden',
                marginBottom: '18px'
              }}>
                <img 
                  src={selectedVenue.image} 
                  alt={selectedVenue.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, transparent 40%, rgba(5, 3, 15, 0.9) 100%)'
                }} />
                <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                  <span className="badge-gold">{selectedVenue.code}</span>
                </div>
                <div style={{ position: 'absolute', bottom: '12px', left: '14px', right: '14px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--c-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
                    {selectedVenue.category}
                  </span>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: '#FFF', lineHeight: 1.15 }}>
                    {selectedVenue.name}
                  </h4>
                </div>
              </div>

              <p style={{ fontSize: '13px', color: 'rgba(233, 222, 255, 0.8)', lineHeight: 1.6, marginBottom: '18px' }}>
                {selectedVenue.description}
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid var(--line-gold-faint)',
                marginBottom: '18px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--c-text-muted)' }}>
                  <Users size={14} style={{ color: 'var(--c-gold)' }} />
                  <span>Capacity: <strong style={{ color: '#FFF' }}>{selectedVenue.capacity}</strong></span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--c-gold)', fontWeight: 700, marginBottom: '8px' }}>
                  Scheduled Competitions & Features:
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '6px' }}>
                  {selectedVenue.hostedEvents.map((evt, i) => (
                    <li key={i} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '12px',
                      color: 'var(--c-parchment)'
                    }}>
                      <CheckCircle2 size={13} style={{ color: 'var(--c-gold)' }} />
                      <span>{evt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--line-gold-faint)', paddingTop: '16px', marginTop: '16px' }}>
              <button
                onClick={() => {
                  if (selectedVenue.category === 'Mega Nights') setActiveSection('events');
                  else if (selectedVenue.category === 'Food & Marketplace') setActiveSection('stalls');
                  else setActiveSection('clubs');
                }}
                className="btn-fest-gold"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <span>Explore Events Here</span>
                <ArrowRight size={14} />
              </button>
            </div>

          </div>

        </div>
      ) : (
        /* List View */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {filteredVenues.map(venue => (
            <div 
              key={venue.id} 
              className="fest-card"
              style={{ overflow: 'hidden', padding: '20px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <span className="badge-gold">{venue.code}</span>
                <span className="badge-parchment">{venue.category}</span>
              </div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: '#FFF', marginBottom: '8px' }}>
                {venue.name}
              </h4>
              <p style={{ fontSize: '13px', color: 'rgba(233, 222, 255, 0.75)', lineHeight: 1.6, marginBottom: '14px' }}>
                {venue.description}
              </p>
              <div style={{ fontSize: '12px', color: 'var(--c-gold)', fontWeight: 600 }}>
                Hosted: {venue.hostedEvents.join(' • ')}
              </div>
            </div>
          ))}
        </div>
      )}

    </section>
  );
};
