import React, { createContext, useContext, useState, useEffect } from 'react';
import { ClientSubmission, SubmissionStatus } from '../types/brief';

interface BriefContextType {
  submissions: ClientSubmission[];
  addSubmission: (submission: Omit<ClientSubmission, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => string;
  updateStatus: (id: string, status: SubmissionStatus, notes?: string) => void;
  deleteSubmission: (id: string) => void;
  getSubmissionById: (id: string) => ClientSubmission | undefined;
  exportSubmissionsJSON: () => void;
}

const STORAGE_KEY = 'miiles_brief_submissions_v1';

const INITIAL_DEMO_SUBMISSIONS: ClientSubmission[] = [
  {
    id: 'BRIEF-8842',
    briefId: 'branding-identidad',
    briefTitle: 'Branding & Identidad Visual',
    clientName: 'Sofia Montalvo',
    clientEmail: 'sofia@auraspa.mx',
    clientCompany: 'Aura Luxury Wellness',
    clientPhone: '+52 55 4920 1823',
    status: 'new',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    updatedAt: new Date().toISOString(),
    estimatedBudget: '$1,500 - $3,500 USD',
    notes: 'Cliente muy interesado en lanzar en octubre. Agendar videollamada para presentar moodboard.',
    answers: {
      'brand-name': 'Aura Luxury Wellness & Spa',
      'brand-stage': 'stage-new',
      'brand-personality': ['pers-luxury', 'pers-minimal', 'pers-warm'],
      'brand-palette': 'palette-mono-gold',
      'deliverables': ['del-logo', 'del-manual', 'del-social', 'del-packaging'],
      'references': 'Nos encanta la elegancia limpia de Aman Resorts y la estética editorial de Chanel Beauté.',
      'budget-investment': 'b2',
      'contact-info': 'Sofia Montalvo | sofia@auraspa.mx | +52 55 4920 1823'
    }
  },
  {
    id: 'BRIEF-7931',
    briefId: 'web-digital-product',
    briefTitle: 'Diseño Web & Digital Experience',
    clientName: 'Mateo Valenzuela',
    clientEmail: 'mateo@krypton-fintech.io',
    clientCompany: 'Krypton Protocol',
    clientPhone: '+1 786 542 9011',
    status: 'reviewing',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    updatedAt: new Date().toISOString(),
    estimatedBudget: '$2,800 - $5,500 USD',
    notes: 'Proyecto web interactivo con animaciones de scroll y modo oscuro.',
    answers: {
      'web-project-name': 'Krypton Protocol — https://krypton.io',
      'web-main-goal': 'goal-saas',
      'web-scope': ['p-home', 'p-services', 'p-portfolio', 'p-auth'],
      'web-features': ['feat-animations', 'feat-darkmode', 'feat-crm'],
      'web-timeline': 'time-standard',
      'web-budget': 'wb3',
      'web-contact': 'Mateo Valenzuela | mateo@krypton-fintech.io'
    }
  },
  {
    id: 'BRIEF-6510',
    briefId: 'growth-content',
    briefTitle: 'Estrategia & Contenido Digital',
    clientName: 'Camila Delgado',
    clientEmail: 'camila@nativabakery.com',
    clientCompany: 'Nativa Bakery & Cafe',
    status: 'approved',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(), // Yesterday
    updatedAt: new Date().toISOString(),
    estimatedBudget: '$900 - $1,800 USD / mes',
    notes: 'Presupuesto aprobado. Enviando contrato y kickoff de producción de reels.',
    answers: {
      'growth-brand': '@nativabakery | https://instagram.com/nativabakery',
      'growth-goal': 'gr-sales',
      'growth-channels': ['ch-instagram', 'ch-tiktok', 'ch-ads'],
      'growth-budget': 'gb2',
      'growth-notes': 'Queremos conectar con jóvenes profesionales de 25 a 40 años que valoran café de especialidad.',
      'growth-contact': 'Camila Delgado | camila@nativabakery.com'
    }
  }
];

const BriefContext = createContext<BriefContextType | undefined>(undefined);

export const BriefProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [submissions, setSubmissions] = useState<ClientSubmission[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading submissions from localStorage', e);
    }
    return INITIAL_DEMO_SUBMISSIONS;
  });

  // Fetch real submissions from MySQL on mount
  useEffect(() => {
    const fetchSubmissionsFromDB = async () => {
      try {
        const res = await fetch('/api/submissions.php');
        if (res.ok) {
          const json = await res.json();
          if (json.status === 'success' && Array.isArray(json.data) && json.data.length > 0) {
            setSubmissions(json.data);
          }
        }
      } catch (err) {
        // Safe offline / local fallback
      }
    };
    fetchSubmissionsFromDB();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
    } catch (e) {
      console.error('Error saving submissions to localStorage', e);
    }
  }, [submissions]);

  const addSubmission = (data: Omit<ClientSubmission, 'id' | 'createdAt' | 'updatedAt' | 'status'>): string => {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const newId = `BRIEF-${randomCode}`;
    const now = new Date().toISOString();

    const newSubmission: ClientSubmission = {
      ...data,
      id: newId,
      status: 'new',
      createdAt: now,
      updatedAt: now,
    };

    setSubmissions(prev => [newSubmission, ...prev]);

    // Enviar a HostGator MySQL backend
    try {
      fetch('/api/submissions.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSubmission),
      }).catch(err => console.log('MySQL sync error or local mode', err));
    } catch (err) {
      // safe fallback
    }

    return newId;
  };

  const updateStatus = (id: string, status: SubmissionStatus, notes?: string) => {
    setSubmissions(prev =>
      prev.map(sub =>
        sub.id === id
          ? {
              ...sub,
              status,
              notes: notes !== undefined ? notes : sub.notes,
              updatedAt: new Date().toISOString(),
            }
          : sub
      )
    );

    // Sync status update to MySQL
    try {
      fetch('/api/submissions.php', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, notes }),
      }).catch(err => console.log('MySQL update offline', err));
    } catch (err) {
      // safe fallback
    }
  };

  const deleteSubmission = (id: string) => {
    setSubmissions(prev => prev.filter(sub => sub.id !== id));

    // Delete in MySQL
    try {
      fetch(`/api/submissions.php?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      }).catch(err => console.log('MySQL delete offline', err));
    } catch (err) {
      // safe fallback
    }
  };

  const getSubmissionById = (id: string) => {
    return submissions.find(sub => sub.id === id);
  };

  const exportSubmissionsJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(submissions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `miiles-briefs-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <BriefContext.Provider
      value={{
        submissions,
        addSubmission,
        updateStatus,
        deleteSubmission,
        getSubmissionById,
        exportSubmissionsJSON,
      }}
    >
      {children}
    </BriefContext.Provider>
  );
};

export const useBriefs = () => {
  const context = useContext(BriefContext);
  if (!context) {
    throw new Error('useBriefs must be used within a BriefProvider');
  }
  return context;
};
