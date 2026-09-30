import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  User, UserRole, Student, Visitor, Club, FestEvent, ClubEvent, 
  EventRegistration, EventAttendance, Stall, Product, CartItem, 
  StallOrder, ScanLog, AuditLog, ScanValidationResult, CampusVenue 
} from '../types';
import { 
  INITIAL_CLUBS, FEST_EVENTS, CLUB_EVENTS, INITIAL_STUDENTS, 
  INITIAL_STALLS, INITIAL_PRODUCTS, INITIAL_ATTENDANCE, 
  INITIAL_ORDERS, INITIAL_SCAN_LOGS, INITIAL_AUDIT_LOGS, CAMPUS_VENUES 
} from '../data/initialData';

interface FestContextType {
  // User & Roles
  currentUser: User;
  setCurrentUser: (user: User) => void;
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  selectedClubId: string;
  setSelectedClubId: (clubId: string) => void;
  selectedStallId: string;
  setSelectedStallId: (stallId: string) => void;

  // Data Collections
  clubs: Club[];
  festEvents: FestEvent[];
  clubEvents: ClubEvent[];
  venues: CampusVenue[];
  students: Student[];
  visitors: Visitor[];
  eventRegistrations: EventRegistration[];
  attendance: EventAttendance[];
  stalls: Stall[];
  products: Product[];
  orders: StallOrder[];
  scanLogs: ScanLog[];
  auditLogs: AuditLog[];

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, stallId: string, stallName: string) => void;
  updateCartQty: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartTotal: number;

  // Actions
  loginStudentByRoll: (rollNoOrEmail: string) => Student | null;
  registerVisitor: (visitorData: Omit<Visitor, 'id' | 'registrationId' | 'qrToken' | 'registeredAt' | 'paymentStatus'>) => Visitor;
  registerForClubEvent: (eventId: string) => { success: boolean; message: string; registration?: EventRegistration };
  placeStallOrder: (customerName: string, customerEmail: string) => StallOrder;
  validateAndRedeemQR: (token: string, targetEventId: string, scannerName?: string) => ScanValidationResult;
  redeemStallOrder: (token: string) => { success: boolean; message: string; order?: StallOrder };
  addClubEvent: (event: Omit<ClubEvent, 'id' | 'registeredCount'>) => void;
  runBurstStressTest: (count: number) => { totalScans: number; successfulScans: number; duplicateRejections: number; avgLatencyMs: number };
  exportCSV: (dataType: 'attendance' | 'students' | 'orders' | 'scans') => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
  audioEnabled: boolean;
  toggleAudio: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const FestContext = createContext<FestContextType | undefined>(undefined);

export const FestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation active section
  const [activeSection, setActiveSection] = useState<string>('home');
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);

  // Theme Mode (Dark by default, persisted in localStorage)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('amrita_fest_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('amrita_fest_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Active Role & User
  const [currentRole, setRoleState] = useState<UserRole>('student');
  const [selectedClubId, setSelectedClubId] = useState<string>('club-acm');
  const [selectedStallId, setSelectedStallId] = useState<string>('stall-south');

  // Default initial logged in user (Rahul Sharma)
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'stu-001',
    name: 'Rahul Sharma',
    email: 'rahul.s@am.students.amrita.edu',
    role: 'student',
    rollNo: 'AM.EN.U4CSE23045',
    college: 'Amrita Vishwa Vidyapeetham, Amaravati',
    festPassPaid: true,
    qrToken: 'AMR-PASS-STU-001-K9X2P',
  });

  // Database collections (persisted in localStorage or default seed)
  const [clubs, setClubs] = useState<Club[]>(() => {
    const saved = localStorage.getItem('amrita_clubs');
    return saved ? JSON.parse(saved) : INITIAL_CLUBS;
  });

  const [festEvents] = useState<FestEvent[]>(FEST_EVENTS);
  
  const [clubEvents, setClubEvents] = useState<ClubEvent[]>(() => {
    const saved = localStorage.getItem('amrita_club_events');
    return saved ? JSON.parse(saved) : CLUB_EVENTS;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('amrita_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [visitors, setVisitors] = useState<Visitor[]>(() => {
    const saved = localStorage.getItem('amrita_visitors');
    return saved ? JSON.parse(saved) : [
      {
        id: 'vis-101',
        registrationId: 'AMR-VIS-2026-9901',
        name: 'Priya Patel',
        email: 'priya.p@vitap.ac.in',
        phone: '+91 91234 56789',
        college: 'VIT AP University',
        passTier: 'both',
        accommodation: true,
        totalPaid: 1800,
        paymentStatus: 'PAID',
        qrToken: 'AMR-PASS-VIS-101-W8L2K',
        registeredAt: '2026-10-09T14:30:00Z',
      }
    ];
  });

  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>(() => {
    const saved = localStorage.getItem('amrita_event_registrations');
    return saved ? JSON.parse(saved) : [
      {
        id: 'reg-001',
        eventId: 'ev-bytecraft',
        eventTitle: 'ByteCraft — Algorithmic Duel',
        clubId: 'club-acm',
        userId: 'stu-001',
        userName: 'Rahul Sharma',
        userEmail: 'rahul.s@am.students.amrita.edu',
        rollNo: 'AM.EN.U4CSE23045',
        amount: 0,
        paymentStatus: 'CONFIRMED',
        qrToken: 'AMR-EVT-REG-001-A9Q',
        isRedeemed: false,
        registeredAt: '2026-10-10T12:00:00Z',
      }
    ];
  });

  const [attendance, setAttendance] = useState<EventAttendance[]>(() => {
    const saved = localStorage.getItem('amrita_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [stalls] = useState<Stall[]>(INITIAL_STALLS);
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);

  const [orders, setOrders] = useState<StallOrder[]>(() => {
    const saved = localStorage.getItem('amrita_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [scanLogs, setScanLogs] = useState<ScanLog[]>(() => {
    const saved = localStorage.getItem('amrita_scan_logs');
    return saved ? JSON.parse(saved) : INITIAL_SCAN_LOGS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('amrita_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('amrita_clubs', JSON.stringify(clubs));
    localStorage.setItem('amrita_club_events', JSON.stringify(clubEvents));
    localStorage.setItem('amrita_students', JSON.stringify(students));
    localStorage.setItem('amrita_visitors', JSON.stringify(visitors));
    localStorage.setItem('amrita_event_registrations', JSON.stringify(eventRegistrations));
    localStorage.setItem('amrita_attendance', JSON.stringify(attendance));
    localStorage.setItem('amrita_orders', JSON.stringify(orders));
    localStorage.setItem('amrita_scan_logs', JSON.stringify(scanLogs));
    localStorage.setItem('amrita_audit_logs', JSON.stringify(auditLogs));
  }, [clubs, clubEvents, students, visitors, eventRegistrations, attendance, orders, scanLogs, auditLogs]);

  // Role Switcher helper
  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole === 'student') {
      setCurrentUser({
        id: 'stu-001',
        name: 'Rahul Sharma',
        email: 'rahul.s@am.students.amrita.edu',
        role: 'student',
        rollNo: 'AM.EN.U4CSE23045',
        college: 'Amrita Vishwa Vidyapeetham, Amaravati',
        festPassPaid: true,
        qrToken: 'AMR-PASS-STU-001-K9X2P',
      });
    } else if (newRole === 'visitor') {
      setCurrentUser({
        id: 'vis-101',
        name: 'Priya Patel',
        email: 'priya.p@vitap.ac.in',
        role: 'visitor',
        college: 'VIT AP University',
        qrToken: 'AMR-PASS-VIS-101-W8L2K',
      });
    } else if (newRole === 'club_admin') {
      const activeClub = clubs.find(c => c.id === selectedClubId) || clubs[0];
      setCurrentUser({
        id: 'usr-admin-club',
        name: activeClub.leadName,
        email: activeClub.leadContact.split('|')[0].trim(),
        role: 'club_admin',
        clubId: activeClub.id,
      });
    } else if (newRole === 'stall_admin') {
      const activeStall = stalls.find(s => s.id === selectedStallId) || stalls[0];
      setCurrentUser({
        id: 'usr-admin-stall',
        name: `${activeStall.name} Lead`,
        email: 'stall@fest.amrita.edu',
        role: 'stall_admin',
        stallId: activeStall.id,
      });
    } else if (newRole === 'scanner') {
      setCurrentUser({
        id: 'usr-scanner-01',
        name: 'Campus Gate Scanner Officer',
        email: 'gates@fest.amrita.edu',
        role: 'scanner',
      });
    } else if (newRole === 'super_admin') {
      setCurrentUser({
        id: 'usr-super-admin',
        name: 'Dr. S. Raghunath (Chief Convener)',
        email: 'fest.convener@am.amrita.edu',
        role: 'super_admin',
      });
    }
  };

  // Student Login lookup
  const loginStudentByRoll = (rollNoOrEmail: string): Student | null => {
    const query = rollNoOrEmail.trim().toLowerCase();
    const found = students.find(
      s => s.rollNo.toLowerCase() === query || s.email.toLowerCase() === query || s.name.toLowerCase().includes(query)
    );
    if (found) {
      setCurrentUser({
        id: found.id,
        name: found.name,
        email: found.email,
        role: 'student',
        rollNo: found.rollNo,
        college: 'Amrita Vishwa Vidyapeetham, Amaravati',
        festPassPaid: found.festPassPaid,
        qrToken: found.qrToken,
      });
      setRoleState('student');
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (e) {
        // ignore
      }
      return found;
    }
    return null;
  };

  // Visitor Registration
  const registerVisitor = (visitorData: Omit<Visitor, 'id' | 'registrationId' | 'qrToken' | 'registeredAt' | 'paymentStatus'>): Visitor => {
    const count = visitors.length + 1;
    const randomHash = Math.random().toString(36).substring(2, 7).toUpperCase();
    const newVisitor: Visitor = {
      ...visitorData,
      id: `vis-${100 + count}`,
      registrationId: `AMR-VIS-2026-${1000 + count}`,
      qrToken: `AMR-PASS-VIS-${100 + count}-${randomHash}`,
      paymentStatus: 'PAID',
      registeredAt: new Date().toISOString(),
    };

    setVisitors(prev => [newVisitor, ...prev]);

    // Also set current user to this newly registered visitor
    setCurrentUser({
      id: newVisitor.id,
      name: newVisitor.name,
      email: newVisitor.email,
      role: 'visitor',
      college: newVisitor.college,
      qrToken: newVisitor.qrToken,
    });
    setRoleState('visitor');

    // Add audit log
    const audit: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'VISITOR_REGISTERED',
      actor: newVisitor.name,
      role: 'visitor',
      details: `Registered for pass: ${newVisitor.passTier} tier, Accommodation: ${newVisitor.accommodation ? 'YES' : 'NO'}, Total: ₹${newVisitor.totalPaid}`,
    };
    setAuditLogs(prev => [audit, ...prev]);

    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (e) {
      // ignore
    }

    return newVisitor;
  };

  // Register for Club Event
  const registerForClubEvent = (eventId: string) => {
    const event = clubEvents.find(e => e.id === eventId);
    if (!event) return { success: false, message: 'Event not found' };

    // Check if already registered
    const existing = eventRegistrations.find(r => r.eventId === eventId && r.userId === currentUser.id);
    if (existing) {
      return { success: false, message: 'You have already registered for this event!' };
    }

    // Check capacity
    if (event.registeredCount >= event.maxCapacity) {
      return { success: false, message: 'Event capacity reached!' };
    }

    const randomHash = Math.random().toString(36).substring(2, 6).toUpperCase();
    const newReg: EventRegistration = {
      id: `reg-${Date.now()}`,
      eventId: event.id,
      eventTitle: event.title,
      clubId: event.clubId,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      rollNo: currentUser.rollNo,
      amount: event.fee,
      paymentStatus: 'CONFIRMED',
      qrToken: `AMR-EVT-${event.id.replace('ev-', '').toUpperCase()}-${currentUser.id}-${randomHash}`,
      isRedeemed: false,
      registeredAt: new Date().toISOString(),
    };

    setEventRegistrations(prev => [newReg, ...prev]);
    setClubEvents(prev => prev.map(e => e.id === eventId ? { ...e, registeredCount: e.registeredCount + 1 } : e));

    try {
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
    } catch (e) {}

    return { success: true, message: `Successfully registered for ${event.title}!`, registration: newReg };
  };

  // Cart operations
  const addToCart = (product: Product, stallId: string, stallName: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1, stallId, stallName }];
    });
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  // Place stall order
  const placeStallOrder = (customerName: string, customerEmail: string): StallOrder => {
    if (cart.length === 0) throw new Error('Cart is empty');
    
    // For simplicity, take the stall of the primary items in cart
    const primaryStallId = cart[0].stallId;
    const primaryStallName = cart[0].stallName;
    const randomHash = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderNum = Math.floor(10000 + Math.random() * 90000);

    const newOrder: StallOrder = {
      id: `ORD-${orderNum}`,
      stallId: primaryStallId,
      stallName: primaryStallName,
      customerName,
      customerEmail,
      items: cart.map(c => ({
        productId: c.product.id,
        productName: c.product.name,
        price: c.product.price,
        quantity: c.quantity,
      })),
      totalAmount: cartTotal,
      paymentStatus: 'PAID',
      redemptionToken: `AMR-ORD-${primaryStallId.replace('stall-', '').toUpperCase()}-${orderNum}-${randomHash}`,
      isRedeemed: false,
      createdAt: new Date().toISOString(),
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();

    try {
      confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}

    return newOrder;
  };

  // Stall redemption
  const redeemStallOrder = (token: string) => {
    const trimmed = token.trim();
    const order = orders.find(o => o.redemptionToken.toLowerCase() === trimmed.toLowerCase() || o.id.toLowerCase() === trimmed.toLowerCase());
    if (!order) {
      return { success: false, message: 'Invalid order redemption token or order ID not found.' };
    }
    if (order.isRedeemed) {
      return { success: false, message: `Order ${order.id} was ALREADY fulfilled on ${new Date(order.redeemedAt || '').toLocaleTimeString()}!` };
    }

    const updatedOrders = orders.map(o => o.id === order.id ? { ...o, isRedeemed: true, redeemedAt: new Date().toISOString() } : o);
    setOrders(updatedOrders);

    // Audit log
    const audit: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'ORDER_REDEEMED',
      actor: currentUser.name,
      role: 'stall_admin',
      details: `Order ${order.id} (₹${order.totalAmount}) for ${order.stallName} fulfilled.`,
    };
    setAuditLogs(prev => [audit, ...prev]);

    return { success: true, message: `Order ${order.id} successfully redeemed and marked fulfilled!`, order: { ...order, isRedeemed: true } };
  };

  // ATOMIC QR VALIDATION ENGINE (Section 7, 26 of Blueprint)
  const validateAndRedeemQR = (
    token: string, 
    targetEventId: string, 
    scannerName: string = 'Campus Entry Scanner'
  ): ScanValidationResult => {
    const trimmedToken = token.trim();
    const now = new Date().toISOString();

    // 1. Identify target event title
    const allEvents = [...festEvents, ...clubEvents];
    const event = allEvents.find(e => e.id === targetEventId) || festEvents[0];
    const eventTitle = event.title;

    // 2. Validate token format & lookup pass holder
    let holderName = 'Unknown Attendee';
    let holderRole: UserRole = 'student';
    let userId = 'unknown';

    const matchedStudent = students.find(s => s.qrToken === trimmedToken);
    const matchedVisitor = visitors.find(v => v.qrToken === trimmedToken);
    const matchedClubReg = eventRegistrations.find(r => r.qrToken === trimmedToken);

    if (matchedStudent) {
      holderName = matchedStudent.name;
      holderRole = 'student';
      userId = matchedStudent.id;
    } else if (matchedVisitor) {
      holderName = matchedVisitor.name;
      holderRole = 'visitor';
      userId = matchedVisitor.id;
    } else if (matchedClubReg) {
      holderName = matchedClubReg.userName;
      holderRole = 'student';
      userId = matchedClubReg.userId;
    } else {
      // Check if token matches standard prefix or is completely invalid
      if (!trimmedToken.startsWith('AMR-')) {
        const failLog: ScanLog = {
          id: `log-${Date.now()}`,
          timestamp: now,
          token: trimmedToken,
          eventId: targetEventId,
          eventTitle,
          scannerName,
          scannerRole: currentRole,
          status: 'REJECTED',
          reasonCode: 'INVALID_TOKEN',
          message: 'Tampered or non-existent QR token rejected by server.',
        };
        setScanLogs(prev => [failLog, ...prev]);

        return {
          status: 'REJECTED',
          reasonCode: 'INVALID_TOKEN',
          message: 'REJECTED: Tampered or unregistered QR token! Access denied.',
          eventTitle,
          timestamp: now,
        };
      }
      holderName = 'Unregistered Pass Token';
    }

    // 3. ATOMIC CHECK: Check if [targetEventId, token] already exists in attendance table
    const existingScan = attendance.find(a => a.eventId === targetEventId && a.qrToken === trimmedToken);

    if (existingScan) {
      // DUPLICATE SCAN REJECTION! (Atomic enforcement rule)
      const duplicateLog: ScanLog = {
        id: `log-${Date.now()}`,
        timestamp: now,
        token: trimmedToken,
        eventId: targetEventId,
        eventTitle,
        scannerName,
        scannerRole: currentRole,
        status: 'REJECTED',
        reasonCode: 'ALREADY_REDEEMED',
        message: `Already redeemed for ${eventTitle} at ${new Date(existingScan.scannedAt).toLocaleTimeString()}. Duplicate scan rejected.`,
      };
      setScanLogs(prev => [duplicateLog, ...prev]);

      return {
        status: 'REJECTED',
        reasonCode: 'ALREADY_REDEEMED',
        message: `REJECTED: Pass ALREADY REDEEMED for "${eventTitle}"!`,
        eventTitle,
        holderName,
        holderRole,
        token: trimmedToken,
        timestamp: now,
        previousScannedAt: existingScan.scannedAt,
      };
    }

    // 4. ATOMIC APPROVAL: Create attendance record
    const newAttendance: EventAttendance = {
      id: `att-${Date.now()}`,
      eventId: targetEventId,
      eventTitle,
      qrToken: trimmedToken,
      userId,
      userName: holderName,
      userRole: holderRole,
      scannerId: currentUser.id,
      scannerName,
      scannedAt: now,
    };

    setAttendance(prev => [newAttendance, ...prev]);

    // Record success in Scan Logs
    const successLog: ScanLog = {
      id: `log-${Date.now()}`,
      timestamp: now,
      token: trimmedToken,
      eventId: targetEventId,
      eventTitle,
      scannerName,
      scannerRole: currentRole,
      status: 'APPROVED',
      reasonCode: 'SUCCESS',
      message: `APPROVED: Access granted for ${holderName} to ${eventTitle}.`,
    };
    setScanLogs(prev => [successLog, ...prev]);

    return {
      status: 'APPROVED',
      reasonCode: 'SUCCESS',
      message: `APPROVED: Entry granted to ${eventTitle}!`,
      eventTitle,
      holderName,
      holderRole,
      token: trimmedToken,
      timestamp: now,
    };
  };

  // Club Admin add event
  const addClubEvent = (eventData: Omit<ClubEvent, 'id' | 'registeredCount'>) => {
    const newEvent: ClubEvent = {
      ...eventData,
      id: `ev-${Date.now()}`,
      registeredCount: 0,
    };
    setClubEvents(prev => [...prev, newEvent]);

    const audit: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'CLUB_EVENT_CREATED',
      actor: currentUser.name,
      role: 'club_admin',
      details: `Created new club event: ${newEvent.title} for ${newEvent.clubId}`,
    };
    setAuditLogs(prev => [audit, ...prev]);
  };

  // Peak-load stress test simulator (Simulates Section 14 & 29)
  const runBurstStressTest = (count: number = 50) => {
    const startTime = performance.now();
    let successCount = 0;
    let duplicateCount = 0;
    const testEvent = festEvents[1]; // Auto Expo

    for (let i = 0; i < count; i++) {
      // Pick random student or repeated student to trigger both approvals and duplicate rejections
      const student = students[i % students.length];
      const res = validateAndRedeemQR(student.qrToken, testEvent.id, 'StressTest Worker Pool');
      if (res.status === 'APPROVED') {
        successCount++;
      } else {
        duplicateCount++;
      }
    }
    const elapsed = performance.now() - startTime;
    const avgLatency = +(elapsed / count).toFixed(2);

    const audit: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'BURST_LOAD_TEST',
      actor: currentUser.name,
      role: 'super_admin',
      details: `Simulated ${count} burst scans. Approved: ${successCount}, Rejected Duplicates: ${duplicateCount}. Avg latency: ${avgLatency}ms`,
    };
    setAuditLogs(prev => [audit, ...prev]);

    return {
      totalScans: count,
      successfulScans: successCount,
      duplicateRejections: duplicateCount,
      avgLatencyMs: avgLatency,
    };
  };

  // CSV Exporter for Admin
  const exportCSV = (dataType: 'attendance' | 'students' | 'orders' | 'scans') => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    let filename = `amrita_fest_${dataType}_${Date.now()}.csv`;

    if (dataType === 'attendance') {
      csvContent += 'Attendance ID,Event ID,Event Title,User Name,User Role,QR Token,Scanned At,Scanner\n';
      attendance.forEach(a => {
        csvContent += `"${a.id}","${a.eventId}","${a.eventTitle}","${a.userName}","${a.userRole}","${a.qrToken}","${a.scannedAt}","${a.scannerName}"\n`;
      });
    } else if (dataType === 'students') {
      csvContent += 'Roll No,Name,Email,Department,Year,Fest Pass Paid,QR Token\n';
      students.forEach(s => {
        csvContent += `"${s.rollNo}","${s.name}","${s.email}","${s.department}","${s.year}","${s.festPassPaid}","${s.qrToken}"\n`;
      });
    } else if (dataType === 'orders') {
      csvContent += 'Order ID,Stall Name,Customer,Email,Total (INR),Status,Fulfilled,Token,Created At\n';
      orders.forEach(o => {
        csvContent += `"${o.id}","${o.stallName}","${o.customerName}","${o.customerEmail}","${o.totalAmount}","${o.paymentStatus}","${o.isRedeemed}","${o.redemptionToken}","${o.createdAt}"\n`;
      });
    } else if (dataType === 'scans') {
      csvContent += 'Log ID,Timestamp,Status,Reason Code,Event,Token,Scanner,Message\n';
      scanLogs.forEach(l => {
        csvContent += `"${l.id}","${l.timestamp}","${l.status}","${l.reasonCode}","${l.eventTitle}","${l.token}","${l.scannerName}","${l.message.replace(/"/g, '""')}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleAudio = () => setAudioEnabled(!audioEnabled);

  return (
    <FestContext.Provider value={{
      currentUser,
      setCurrentUser,
      currentRole,
      setRole,
      selectedClubId,
      setSelectedClubId,
      selectedStallId,
      setSelectedStallId,
      clubs,
      festEvents,
      clubEvents,
      venues: CAMPUS_VENUES,
      students,
      visitors,
      eventRegistrations,
      attendance,
      stalls,
      products,
      orders,
      scanLogs,
      auditLogs,
      cart,
      addToCart,
      updateCartQty,
      removeFromCart,
      clearCart,
      cartTotal,
      loginStudentByRoll,
      registerVisitor,
      registerForClubEvent,
      placeStallOrder,
      validateAndRedeemQR,
      redeemStallOrder,
      addClubEvent,
      runBurstStressTest,
      exportCSV,
      activeSection,
      setActiveSection,
      audioEnabled,
      toggleAudio,
      theme,
      toggleTheme,
    }}>
      {children}
    </FestContext.Provider>
  );
};

export const useFest = () => {
  const context = useContext(FestContext);
  if (!context) {
    throw new Error('useFest must be used within a FestProvider');
  }
  return context;
};
