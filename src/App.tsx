import React, { useState } from 'react';
import { FestProvider, useFest } from './context/FestContext';
import { CapsuleNav } from './components/common/CapsuleNav';
import { Footer } from './components/common/Footer';

// Focused, Single-Topic Module Components
import { HomeExperience } from './components/home/HomeExperience';
import { Hero } from './components/home/Hero';
import { MegaEvents } from './components/home/MegaEvents';
import { FestCampusMap } from './components/map/FestCampusMap';
import { FestSchedule } from './components/home/FestSchedule';
import { StudentPortal } from './components/student/StudentPortal';
import { VisitorPortal } from './components/visitor/VisitorPortal';
import { ClubDirectory } from './components/clubs/ClubDirectory';
import { StallMarketplace } from './components/stalls/StallMarketplace';
import { LiveScanner } from './components/scanner/LiveScanner';
import { SuperAdminDashboard } from './components/admin/SuperAdminDashboard';
import { ClubAdminPortal } from './components/clubAdmin/ClubAdminPortal';
import { StallAdminPortal } from './components/stallAdmin/StallAdminPortal';
import { BlueprintViewer } from './components/blueprint/BlueprintViewer';

const FestContent: React.FC = () => {
  const { activeSection } = useFest();
  const [cartOpen, setCartOpen] = useState(false);
  const [studentLoginOpen, setStudentLoginOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
      
      {/* Floating Capsule Nav (Exact match to reference) */}
      <CapsuleNav 
        onOpenCart={() => setCartOpen(true)} 
        onOpenStudentLogin={() => setStudentLoginOpen(true)} 
      />

      {/* Main Content Area: Spacious, uncluttered, focused on selected topic */}
      <main style={{ flex: 1 }}>
        <div className="container-fest">

          {/* 00 Home: Comprehensive Festival Experience (Thomso / Saarang Direction) */}
          {activeSection === 'home' && (
            <HomeExperience onOpenStudentLogin={() => setStudentLoginOpen(true)} />
          )}

          {/* 01 Events: Flagship Mega Nights & Attractions */}
          {activeSection === 'events' && (
            <MegaEvents />
          )}

          {/* 02 Map: Interactive Spatial Campus Radar & Venues (Thomso Inspiration) */}
          {activeSection === 'map' && (
            <FestCampusMap />
          )}

          {/* 03 Schedule: Dedicated Clean Timeline */}
          {activeSection === 'schedule' && (
            <FestSchedule />
          )}

          {/* 03 13 Clubs: Campus Clubs & Event Arenas */}
          {activeSection === 'clubs' && (
            <ClubDirectory />
          )}

          {/* 04 Stalls: Food Court & Official Fest Merch */}
          {activeSection === 'stalls' && (
            <StallMarketplace cartOpen={cartOpen} onCloseCart={() => setCartOpen(false)} />
          )}

          {/* 05 My Pass: Student Pass (₹750) & QR Access */}
          {activeSection === 'student-pass' && (
            <StudentPortal 
              loginModalOpen={studentLoginOpen} 
              onCloseLoginModal={() => setStudentLoginOpen(false)} 
            />
          )}

          {/* Visitor Pass */}
          {activeSection === 'visitor' && (
            <VisitorPortal />
          )}

          {/* 06 Scanner: Gate & Event Optical Validation */}
          {activeSection === 'scanner' && (
            <LiveScanner />
          )}

          {/* 07 Ops: Super Admin Dashboard */}
          {activeSection === 'admin' && (
            <SuperAdminDashboard />
          )}

          {/* Club Admin (Isolated RLS) */}
          {activeSection === 'club-admin' && (
            <ClubAdminPortal />
          )}

          {/* Stall Admin (Orders & Pickup) */}
          {activeSection === 'stall-admin' && (
            <StallAdminPortal />
          )}

          {/* 08 Blueprint: 35-Point Architecture Specification */}
          {activeSection === 'blueprint' && (
            <BlueprintViewer />
          )}

        </div>
      </main>

      {/* Persistent Modals: Cart Drawer & Student Login Modal */}
      {studentLoginOpen && activeSection !== 'student-pass' && (
        <StudentPortal 
          loginModalOpen={studentLoginOpen} 
          onCloseLoginModal={() => setStudentLoginOpen(false)} 
        />
      )}

      {/* Cart Drawer for Stalls */}
      {cartOpen && activeSection !== 'stalls' && (
        <StallMarketplace cartOpen={cartOpen} onCloseCart={() => setCartOpen(false)} />
      )}

      {/* Clean Minimalist Footer */}
      <Footer />

    </div>
  );
};

export function App() {
  return (
    <FestProvider>
      <FestContent />
    </FestProvider>
  );
}

export default App;
