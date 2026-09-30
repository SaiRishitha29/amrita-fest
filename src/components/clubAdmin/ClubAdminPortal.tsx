import React, { useState } from 'react';
import { useFest } from '../../context/FestContext';
import { 
  Shield, Calendar, Users, Plus, CheckCircle2, 
  QrCode, Download, Clock, MapPin, Trophy, AlertCircle 
} from 'lucide-react';

export const ClubAdminPortal: React.FC = () => {
  const { 
    clubs, 
    clubEvents, 
    selectedClubId, 
    setSelectedClubId, 
    eventRegistrations, 
    attendance, 
    addClubEvent,
    validateAndRedeemQR,
    currentUser 
  } = useFest();

  const [activeTab, setActiveTab] = useState<'events' | 'attendees' | 'scanner' | 'create'>('events');
  const [newEvent, setNewEvent] = useState({
    title: '',
    category: '',
    date: '11 Oct 2026',
    time: '2:00 PM – 4:00 PM',
    venue: 'Academic Hall',
    description: '',
    fee: 0,
    prizePool: '₹20,000',
    maxCapacity: 50,
    coordinatorName: '',
    coordinatorPhone: '',
    rules: ['Valid college ID card mandatory', 'Discipline code enforced'],
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
  });
  const [createSuccess, setCreateSuccess] = useState(false);
  const [scannerTokenInput, setScannerTokenInput] = useState('');
  const [scanResult, setScanResult] = useState<any>(null);

  // ISOLATION ENFORCEMENT: Club Admin can ONLY see records for selectedClubId
  const currentClub = clubs.find(c => c.id === selectedClubId) || clubs[0];
  const isolatedEvents = clubEvents.filter(e => e.clubId === currentClub.id);
  const isolatedRegistrations = eventRegistrations.filter(r => r.clubId === currentClub.id);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.category) return;
    
    addClubEvent({
      ...newEvent,
      clubId: currentClub.id,
      coordinatorName: newEvent.coordinatorName || currentClub.leadName,
      coordinatorPhone: newEvent.coordinatorPhone || currentClub.leadContact,
    });

    setCreateSuccess(true);
    setTimeout(() => {
      setCreateSuccess(false);
      setActiveTab('events');
    }, 1200);
  };

  const handleClubScan = (token: string, eventId: string) => {
    if (!token.trim()) return;
    const res = validateAndRedeemQR(token, eventId, `${currentClub.shortCode} Official Scanner`);
    setScanResult(res);
  };

  return (
    <section style={{ padding: '24px 0 60px' }}>
      
      {/* Club Admin Banner with Isolation Badge */}
      <div className="clean-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              background: '#12141F',
              border: '1px solid var(--c-border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '26px'
            }}>
              {currentClub.logo}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge-gold">ISOLATED CLUB ADMIN</span>
                <span className="badge-parchment">RLS: {currentClub.id}</span>
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFF', marginTop: '4px' }}>
                {currentClub.name} ({currentClub.shortCode})
              </h2>
            </div>
          </div>

          {/* Switch Club Context (for Testing) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: 'var(--c-text-muted)', fontFamily: 'var(--font-mono)' }}>Switch Club Admin Context:</span>
            <select
              value={selectedClubId}
              onChange={e => setSelectedClubId(e.target.value)}
              className="form-input"
              style={{ width: 'auto', background: '#0D0F17', color: 'var(--c-lime)', fontSize: '12px', fontFamily: 'var(--font-mono)' }}
            >
              {clubs.map(c => (
                <option key={c.id} value={c.id}>
                  {c.shortCode} — {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Security Rule Explanation */}
        <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--c-border-subtle)', fontSize: '11px', color: 'var(--c-text-muted)', fontFamily: 'var(--font-mono)' }}>
          <strong>ROW-LEVEL SECURITY POLICY:</strong> <code>request.user.role == CLUB_ADMIN AND request.user.club_id == resource.club_id</code>.
          Access strictly scoped to <strong>{currentClub.name}</strong> event operations.
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', borderBottom: '1px solid var(--c-border-subtle)', paddingBottom: '12px', marginBottom: '24px' }}>
        {[
          { id: 'events', label: `My Club Events (${isolatedEvents.length})`, icon: <Calendar size={13} /> },
          { id: 'attendees', label: `Event Registrations (${isolatedRegistrations.length})`, icon: <Users size={13} /> },
          { id: 'scanner', label: 'Club QR Scanner', icon: <QrCode size={13} /> },
          { id: 'create', label: 'Create New Event', icon: <Plus size={13} /> },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            style={{
              background: activeTab === t.id ? 'var(--c-lime)' : 'rgba(255,255,255,0.04)',
              color: activeTab === t.id ? '#0A0D02' : 'var(--c-text-muted)',
              border: activeTab === t.id ? 'none' : '1px solid var(--c-border-subtle)',
              padding: '6px 16px',
              borderRadius: '100px',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab: Events */}
      {activeTab === 'events' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {isolatedEvents.map(evt => {
            const regs = eventRegistrations.filter(r => r.eventId === evt.id);
            return (
              <div key={evt.id} className="clean-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span className="badge-subtle">{evt.category}</span>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--c-lime)', fontFamily: 'var(--font-mono)' }}>
                    Prize: {evt.prizePool}
                  </span>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFF' }}>
                  {evt.title}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--c-text-muted)', margin: '6px 0 14px', lineHeight: 1.5 }}>
                  {evt.description}
                </p>

                <div style={{ fontSize: '11px', color: 'var(--c-text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '16px', fontFamily: 'var(--font-mono)' }}>
                  <span>📍 Venue: {evt.venue}</span>
                  <span>🗓 Date: {evt.date} • {evt.time}</span>
                  <span>👥 Enrolled: {regs.length} / {evt.maxCapacity}</span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setActiveTab('scanner')}
                    className="btn-lime"
                    style={{ flex: 1, padding: '8px 12px', fontSize: '11px', justifyContent: 'center' }}
                  >
                    <QrCode size={13} />
                    <span>Launch Event Check-In</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: Registrations */}
      {activeTab === 'attendees' && (
        <div className="clean-card" style={{ padding: '22px' }}>
          <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#FFF', marginBottom: '16px' }}>
            Registered Attendees for {currentClub.name}
          </h4>

          {isolatedRegistrations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--c-text-muted)', fontSize: '13px' }}>
              No participants have registered for {currentClub.shortCode} events yet.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left', fontFamily: 'var(--font-mono)' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--c-border-subtle)', color: 'var(--c-text-muted)', textTransform: 'uppercase', fontSize: '10px' }}>
                    <th style={{ padding: '10px' }}>Reg ID</th>
                    <th style={{ padding: '10px' }}>Event</th>
                    <th style={{ padding: '10px' }}>Student Name</th>
                    <th style={{ padding: '10px' }}>Roll / College</th>
                    <th style={{ padding: '10px' }}>Fee Status</th>
                    <th style={{ padding: '10px' }}>Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {isolatedRegistrations.map(r => (
                    <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '12px 10px', color: 'var(--c-lime)' }}>{r.id}</td>
                      <td style={{ padding: '12px 10px', color: '#FFF', fontWeight: 700 }}>{r.eventTitle}</td>
                      <td style={{ padding: '12px 10px', color: 'var(--c-text-secondary)' }}>{r.userName}</td>
                      <td style={{ padding: '12px 10px', color: 'var(--c-text-muted)' }}>{r.rollNo || 'External'}</td>
                      <td style={{ padding: '12px 10px' }}>
                        <span className="badge-subtle" style={{ fontSize: '10px' }}>{r.paymentStatus}</span>
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        {r.isRedeemed ? (
                          <span style={{ color: '#34D399', fontSize: '10px', fontWeight: 700 }}>CHECKED IN</span>
                        ) : (
                          <span style={{ color: 'var(--c-text-muted)', fontSize: '10px' }}>NOT CHECKED IN</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab: Club Scanner */}
      {activeTab === 'scanner' && (
        <div className="clean-card" style={{ padding: '24px', maxWidth: '620px', margin: '0 auto' }}>
          <h4 style={{ fontSize: '20px', fontWeight: 800, color: '#FFF', marginBottom: '6px' }}>
            {currentClub.shortCode} Event Entrance Scanner
          </h4>
          <p style={{ fontSize: '13px', color: 'var(--c-text-muted)', marginBottom: '18px' }}>
            Validate attendee registrations for competitions hosted by <strong>{currentClub.name}</strong>.
          </p>

          <div style={{ marginBottom: '14px' }}>
            <label className="form-label">Select Club Competition</label>
            <select className="form-input" id="club-scan-target" style={{ background: '#0D0F17', color: 'var(--c-lime)', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
              {isolatedEvents.map(e => (
                <option key={e.id} value={e.id}>{e.title}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <input
              type="text"
              placeholder="Scan or paste event token (e.g. AMR-EVT-REG-001-A9Q)"
              value={scannerTokenInput}
              onChange={e => setScannerTokenInput(e.target.value)}
              className="form-input"
              style={{ fontSize: '12px', fontFamily: 'var(--font-mono)' }}
            />
            <button
              onClick={() => {
                const sel = (document.getElementById('club-scan-target') as HTMLSelectElement)?.value || isolatedEvents[0]?.id;
                handleClubScan(scannerTokenInput, sel);
              }}
              className="btn-lime"
              style={{ padding: '8px 18px', fontSize: '12px' }}
            >
              Scan
            </button>
          </div>

          {/* Quick Click Sample Token Button */}
          {isolatedRegistrations.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', color: 'var(--c-text-muted)', fontFamily: 'var(--font-mono)' }}>Quick Test with registered token: </span>
              <button
                onClick={() => setScannerTokenInput(isolatedRegistrations[0].qrToken)}
                className="badge-lime"
                style={{ cursor: 'pointer', border: '1px solid var(--c-lime)', fontSize: '10px' }}
              >
                Use {isolatedRegistrations[0].userName}'s Token
              </button>
            </div>
          )}

          {scanResult && (
            <div style={{
              background: scanResult.status === 'APPROVED' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
              border: `1px solid ${scanResult.status === 'APPROVED' ? '#10B981' : '#F43F5E'}`,
              borderRadius: '12px',
              padding: '14px',
              marginTop: '14px'
            }}>
              <div style={{ fontWeight: 800, color: scanResult.status === 'APPROVED' ? '#34D399' : '#FDA4AF' }}>
                {scanResult.message}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--c-text-muted)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                Reason: {scanResult.reasonCode} • Timestamp: {new Date(scanResult.timestamp).toLocaleTimeString()}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Create New Event */}
      {activeTab === 'create' && (
        <div className="clean-card" style={{ padding: '24px', maxWidth: '620px', margin: '0 auto' }}>
          <h4 style={{ fontSize: '20px', fontWeight: 800, color: '#FFF', marginBottom: '16px' }}>
            Publish New Event for {currentClub.name}
          </h4>

          {createSuccess && (
            <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid #10B981', color: '#34D399', padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
              Event created successfully! Saved into database.
            </div>
          )}

          <form onSubmit={handleCreateEvent} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label className="form-label">Event Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Autonomous Drone Racing"
                value={newEvent.title}
                onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                className="form-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="form-label">Category *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Drone Racing, Battle, Hackathon"
                  value={newEvent.category}
                  onChange={e => setNewEvent({ ...newEvent, category: e.target.value })}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Prize Pool</label>
                <input
                  type="text"
                  placeholder="e.g. ₹30,000"
                  value={newEvent.prizePool}
                  onChange={e => setNewEvent({ ...newEvent, prizePool: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="form-label">Date & Time</label>
                <input
                  type="text"
                  value={newEvent.date}
                  onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Venue</label>
                <input
                  type="text"
                  value={newEvent.venue}
                  onChange={e => setNewEvent({ ...newEvent, venue: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div>
              <label className="form-label">Description</label>
              <textarea
                rows={3}
                placeholder="Details, format, rounds..."
                value={newEvent.description}
                onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                className="form-input"
              />
            </div>

            <button type="submit" className="btn-lime" style={{ padding: '12px', fontSize: '13px', marginTop: '6px', justifyContent: 'center' }}>
              <Plus size={15} />
              <span>Publish Event to Portal</span>
            </button>
          </form>
        </div>
      )}

    </section>
  );
};
