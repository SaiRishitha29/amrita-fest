import React from 'react';
import { useFest } from '../../context/FestContext';
import { UserRole } from '../../types';
import { Shield, GraduationCap, Ticket, Store, QrCode, Crown, Check } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { 
    currentRole, 
    setRole, 
    currentUser, 
    clubs, 
    selectedClubId, 
    setSelectedClubId,
    stalls,
    selectedStallId,
    setSelectedStallId,
    setActiveSection
  } = useFest();

  const roles: { role: UserRole; label: string; icon: React.ReactNode }[] = [
    { role: 'student', label: 'Amrita Student', icon: <GraduationCap size={14} /> },
    { role: 'visitor', label: 'Visitor / Outsider', icon: <Ticket size={14} /> },
    { role: 'club_admin', label: 'Club Admin', icon: <Shield size={14} /> },
    { role: 'stall_admin', label: 'Stall Admin', icon: <Store size={14} /> },
    { role: 'scanner', label: 'Gate Scanner', icon: <QrCode size={14} /> },
    { role: 'super_admin', label: 'Super Admin', icon: <Crown size={14} /> },
  ];

  const handleRoleChange = (role: UserRole) => {
    setRole(role);
    if (role === 'club_admin') {
      setActiveSection('club-admin');
    } else if (role === 'stall_admin') {
      setActiveSection('stall-admin');
    } else if (role === 'scanner') {
      setActiveSection('scanner');
    } else if (role === 'super_admin') {
      setActiveSection('admin');
    } else if (role === 'student') {
      setActiveSection('student-pass');
    } else if (role === 'visitor') {
      setActiveSection('visitor');
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '8px 14px', margin: '10px 0 20px', border: '1px solid var(--line-gold-strong)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--c-gold)', fontWeight: 700 }}>
            Active Simulation Role:
          </span>
          <div className="role-pill-container" style={{ flexWrap: 'wrap' }}>
            {roles.map(r => (
              <button
                key={r.role}
                onClick={() => handleRoleChange(r.role)}
                className={`role-pill-btn ${currentRole === r.role ? 'active' : ''}`}
                title={`Switch to ${r.label} view`}
              >
                {r.icon}
                <span>{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Context Selector based on Role */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {currentRole === 'club_admin' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: 'var(--c-text-muted)' }}>Assigned Club:</span>
              <select
                value={selectedClubId}
                onChange={(e) => {
                  setSelectedClubId(e.target.value);
                  const club = clubs.find(c => c.id === e.target.value);
                  if (club) {
                    setRole('club_admin');
                  }
                }}
                className="form-input"
                style={{ padding: '4px 10px', fontSize: '12px', width: 'auto', background: '#120A2B', color: 'var(--c-gold)' }}
              >
                {clubs.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.shortCode} — {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {currentRole === 'stall_admin' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: 'var(--c-text-muted)' }}>Assigned Stall:</span>
              <select
                value={selectedStallId}
                onChange={(e) => {
                  setSelectedStallId(e.target.value);
                  setRole('stall_admin');
                }}
                className="form-input"
                style={{ padding: '4px 10px', fontSize: '12px', width: 'auto', background: '#120A2B', color: 'var(--c-gold)' }}
              >
                {stalls.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.stallNumber}: {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div style={{ fontSize: '12px', color: 'var(--c-text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
            <span>Logged in as: <strong>{currentUser.name}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
