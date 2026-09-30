import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Sparkles } from 'lucide-react';

export const FestSchedule: React.FC = () => {
  const [activeDay, setActiveDay] = useState<'day1' | 'day2'>('day1');

  const scheduleDay1 = [
    { time: '09:00 AM', title: 'Campus Security & Gate Turnstiles Open', venue: 'Security Checkpoints 1–8', badge: 'Turnstiles' },
    { time: '10:00 AM', title: 'RAILU 24H Flagship Mobility Hackathon Kickoff', venue: 'Innovation & Incubation Hub', badge: 'Tech' },
    { time: '11:00 AM', title: 'ACM ByteCraft — Algorithmic Duel', venue: 'Computing Labs 4 & 5', badge: 'Competitive' },
    { time: '01:00 PM', title: 'Fest Market & Food Court Plazas Open', venue: 'Food Court Plazas A & B', badge: 'Bazaar' },
    { time: '02:00 PM', title: 'Nukkad Natak — Street Theatre Championship', venue: 'Central Quadrangle Fountain', badge: 'Cultural' },
    { time: '03:30 PM', title: 'Battle of the Bands — Crescendo Prelims', venue: 'Open Air Amphitheatre', badge: 'Music' },
    { time: '07:00 PM', title: 'Garba & Dandiya Raas Night with Live Dhol', venue: 'Central Amphitheatre & Lawns', badge: 'Mega Night' },
  ];

  const scheduleDay2 = [
    { time: '10:00 AM', title: 'Amrita Grand Auto Expo & Superbike Showcase', venue: 'Academic Boulevard & East Oval', badge: 'Exhibition' },
    { time: '11:00 AM', title: 'Footloose — Western Group Dance Championship', venue: 'Main University Auditorium', badge: 'Dance' },
    { time: '01:00 PM', title: 'RoboWars — 15kg Combat Steel Arena Battles', venue: 'Reinforced Steel Arena', badge: 'Robotics' },
    { time: '02:30 PM', title: 'PixelCraft UI/UX Design Blitz & Nexus Esports', venue: 'Design Wing & LAN Gaming Arena', badge: 'Tech & Gaming' },
    { time: '05:30 PM', title: 'Vogue Runway — Arcadian Elegance Fashion Show', venue: 'Main Stage Runway', badge: 'Fashion' },
    { time: '07:30 PM', title: 'Star Pronite — DJ Night & Pyrotechnic Symphony', venue: 'Main Festival Stadium Arena', badge: 'Grand Pronite' },
  ];

  const currentList = activeDay === 'day1' ? scheduleDay1 : scheduleDay2;

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
            <span className="badge-gold">SYNCHRONIZED TIMELINE</span>
            <span className="badge-parchment">48 HOURS OF CELEBRATION</span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 5vw, 54px)',
            fontWeight: 700,
            color: 'var(--c-parchment)',
            lineHeight: 1.05
          }}>
            OFFICIAL FESTIVAL SCHEDULE
          </h2>

          <p style={{
            fontFamily: 'Georgia, serif',
            color: 'rgba(233, 222, 255, 0.78)',
            fontSize: '15px',
            maxWidth: '640px',
            marginTop: '6px'
          }}>
            Real-time itinerary across 8 campus venues. Gate verification turnstiles open 30 minutes prior to scheduled session kickoffs.
          </p>
        </div>

        {/* Day Selector Pill Tabs */}
        <div style={{
          display: 'inline-flex',
          background: 'rgba(13, 7, 30, 0.7)',
          border: '1px solid var(--line-gold-faint)',
          borderRadius: '100px',
          padding: '4px',
          gap: '4px'
        }}>
          <button
            onClick={() => setActiveDay('day1')}
            style={{
              background: activeDay === 'day1' ? 'var(--c-gold-gradient)' : 'transparent',
              color: activeDay === 'day1' ? '#1A1002' : 'var(--c-text-secondary)',
              border: 'none',
              borderRadius: '100px',
              padding: '8px 22px',
              fontSize: '12px',
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Calendar size={13} />
            <span>DAY 1 // 11 OCTOBER</span>
          </button>

          <button
            onClick={() => setActiveDay('day2')}
            style={{
              background: activeDay === 'day2' ? 'var(--c-gold-gradient)' : 'transparent',
              color: activeDay === 'day2' ? '#1A1002' : 'var(--c-text-secondary)',
              border: 'none',
              borderRadius: '100px',
              padding: '8px 22px',
              fontSize: '12px',
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Calendar size={13} />
            <span>DAY 2 // 12 OCTOBER</span>
          </button>
        </div>
      </div>

      {/* Timeline Items */}
      <div style={{ maxWidth: '920px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {currentList.map((item, idx) => (
          <div 
            key={idx}
            className="fest-card"
            style={{
              padding: '18px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '14px',
              borderLeft: '4px solid var(--c-gold)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--c-gold)',
                minWidth: '95px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Clock size={15} />
                <span>{item.time}</span>
              </div>

              <div>
                <h4 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '20px',
                  fontWeight: 600,
                  color: 'var(--c-parchment)'
                }}>
                  {item.title}
                </h4>
                <div style={{
                  fontSize: '13px',
                  color: 'var(--c-text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '4px'
                }}>
                  <MapPin size={13} style={{ color: '#60A5FA' }} />
                  <span>{item.venue}</span>
                </div>
              </div>
            </div>

            <span className={item.badge.includes('Mega') || item.badge.includes('Pronite') ? 'badge-gold' : 'badge-parchment'}>
              {item.badge}
            </span>
          </div>
        ))}
      </div>

    </section>
  );
};
