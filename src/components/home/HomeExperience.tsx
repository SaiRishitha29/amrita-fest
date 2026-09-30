import React from 'react';
import { useFest } from '../../context/FestContext';
import { Hero } from './Hero';
import { FestStory } from './FestStory';
import { MegaEvents } from './MegaEvents';
import { FestCampusMap } from '../map/FestCampusMap';
import { ClubDirectory } from '../clubs/ClubDirectory';
import { 
  ShoppingBag, Ticket, GraduationCap, ArrowRight, 
  Sparkles, Coffee, Utensils, ShieldCheck, QrCode 
} from 'lucide-react';

interface HomeExperienceProps {
  onOpenStudentLogin: () => void;
}

export const HomeExperience: React.FC<HomeExperienceProps> = ({ onOpenStudentLogin }) => {
  const { setActiveSection } = useFest();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 01. Cinematic Hero Section */}
      <Hero onOpenStudentLogin={onOpenStudentLogin} />

      {/* 02. Editorial Storytelling: THIS IS OUR FEST */}
      <FestStory />

      {/* 03. Flagship Mega Events (Garba, Railu, Auto Expo, Star DJ Pronite) */}
      <MegaEvents />

      {/* 04. Explore The Fest: Thomso-Inspired Spatial Campus Radar */}
      <FestCampusMap />

      {/* 05. The 13 Campus Clubs Showcase */}
      <ClubDirectory />

      {/* 06. Fest Market & Culinary Highlights Section */}
      <section style={{
        padding: 'clamp(40px, 6vw, 70px) 0',
        borderTop: '1px solid var(--line-gold-faint)'
      }}>
        <div style={{
          background: 'var(--c-surface)',
          borderRadius: '28px',
          border: '1px solid var(--line-gold)',
          padding: 'clamp(32px, 5vw, 56px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '32px',
          alignItems: 'center',
          boxShadow: '0 24px 70px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)'
        }}>
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <span className="badge-gold">FESTIVAL BAZAAR</span>
              <span className="badge-parchment">FOOD COURT & MERCH</span>
            </div>

            <h3 
              className="fest-title-shimmer interactive-title"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(28px, 4vw, 42px)',
                fontWeight: 700,
                color: 'var(--c-parchment)',
                lineHeight: 1.1,
                marginBottom: '12px'
              }}
            >
              EXPLORE THE FEST MARKET
            </h3>

            <p style={{
              fontFamily: 'Georgia, serif',
              fontSize: '15px',
              color: 'var(--c-text-secondary)',
              lineHeight: 1.7,
              marginBottom: '24px'
            }}>
              Over 20+ artisan food stalls, South Indian biryanis, Hyderabad street chaat, gourmet beverages, and official Amrita Fest 2026 embroidered hoodies and wristbands. Order ahead and collect instantly with token QR.
            </p>

            <button
              onClick={() => {
                setActiveSection('stalls');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="btn-fest-gold"
            >
              <ShoppingBag size={15} />
              <span>Browse Stalls & Merch</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '14px'
          }}>
            <div style={{
              background: 'var(--c-surface-hover)',
              border: '1px solid var(--line-gold-faint)',
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <Utensils size={24} style={{ color: 'var(--c-gold)', margin: '0 auto 8px' }} />
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--c-parchment)' }}>Food Court</div>
              <div style={{ fontSize: '11px', color: 'var(--c-text-muted)' }}>Southern Spice, Chaat & Grills</div>
            </div>

            <div style={{
              background: 'var(--c-surface-hover)',
              border: '1px solid var(--line-gold-faint)',
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <Coffee size={24} style={{ color: '#60A5FA', margin: '0 auto 8px' }} />
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--c-parchment)' }}>Artisan Brews</div>
              <div style={{ fontSize: '11px', color: 'var(--c-text-muted)' }}>Chai Shai, Shakes & Coolers</div>
            </div>

            <div style={{
              background: 'var(--c-surface-hover)',
              border: '1px solid var(--line-gold-faint)',
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <ShoppingBag size={24} style={{ color: '#C084FC', margin: '0 auto 8px' }} />
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--c-parchment)' }}>Official Merch</div>
              <div style={{ fontSize: '11px', color: 'var(--c-text-muted)' }}>Hoodies, Badges & Lanyards</div>
            </div>

            <div style={{
              background: 'var(--c-surface-hover)',
              border: '1px solid var(--line-gold-faint)',
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <QrCode size={24} style={{ color: '#34D399', margin: '0 auto 8px' }} />
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--c-parchment)' }}>Express Pickup</div>
              <div style={{ fontSize: '11px', color: 'var(--c-text-muted)' }}>Scan & Collect in 60s</div>
            </div>
          </div>
        </div>
      </section>

      {/* 07. Student & Visitor Pass Final Call-to-Action */}
      <section style={{
        padding: 'clamp(40px, 6vw, 70px) 0 40px',
        borderTop: '1px solid var(--line-gold-faint)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {/* Amrita Student Pass Banner */}
          <div className="fest-card" style={{ padding: '36px', border: '1.5px solid var(--c-gold)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span className="badge-gold">AMRITA AMARAVATI STUDENTS</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--c-gold)', fontWeight: 700 }}>
                ₹750 PRE-PAID
              </span>
            </div>

            <h3 
              className="interactive-title"
              style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: 'var(--c-parchment)', marginBottom: '10px' }}
            >
              Digital Holographic Fest Pass
            </h3>

            <p style={{ fontSize: '14px', color: 'var(--c-text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
              All enrolled Amrita Amaravati students have their fee included in the semester dues. Do not pay again. Simply authenticate your student roll number to claim your pass and reusable event QR token.
            </p>

            <button
              onClick={() => {
                setActiveSection('student-pass');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="btn-fest-gold"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <GraduationCap size={15} />
              <span>Claim Your Student Pass</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* External Visitor Pass Banner */}
          <div className="fest-card" style={{ padding: '36px', border: '1.5px solid rgba(59, 130, 246, 0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span className="badge-sapphire">EXTERNAL COLLEGE VISITORS</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: '#60A5FA', fontWeight: 700 }}>
                FROM ₹600
              </span>
            </div>

            <h3 
              className="interactive-title"
              style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: 'var(--c-parchment)', marginBottom: '10px' }}
            >
              Visitor Pass & Accommodation
            </h3>

            <p style={{ fontSize: '14px', color: 'var(--c-text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
              Join us from colleges across India. Single Day or Both Days passes include entry to Garba Raas, Auto Expo, and Star Pronite, with optional AC hostel accommodations.
            </p>

            <button
              onClick={() => {
                setActiveSection('visitor');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="btn-fest-sapphire"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Ticket size={15} />
              <span>Register as Visitor</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
