// ============================================
// DUMMY CASES DATA
// ============================================

export const dummyCases = [
  {
    id: '1',
    // Basic Info
    caseNumber: 'CIV-2026-001',
    caseTitle: 'Smith v. Johnson',
    title: 'Smith v. Johnson',
    description: 'Contract dispute over property sale agreement. The plaintiff alleges breach of contract and seeks damages.',
    party: 'Plaintiff: Smith | Defendant: Johnson',
    
    // Judiciary
    judiciary: {
      cmsNo: 'CMS-2026-001',
      courtNo: 'Court-01',
    },
    
    // Case Type & Nature
    caseType: 'civil',
    caseNature: {
      trial: 'Jury Trial',
      appeal: 'N/A',
    },
    
    // Court Details
    courtDetails: {
      courtName: 'Los Angeles Superior Court',
      district: 'Los Angeles, CA',
      previousDate: '2026-01-10',
      nextDate: '2026-02-15',
    },
    
    // Additional Info
    remarks: 'High priority case requiring immediate attention',
    instituteDate: '2026-01-15',
    instituteNo: 'INST-2026-001',
    
    // Associate
    associate: {
      name: 'John Doe',
      district: 'Los Angeles',
    },
    
    // Status & Priority
    status: 'active',
    priority: 'High',
    assignedTo: 'Sarah Chen',
    location: 'Los Angeles, CA',
    court: 'Los Angeles Superior Court',
    judge: 'Hon. Robert Martinez',
    attorneys: 'Plaintiff: Sarah Chen | Defendant: Michael Torres',
    
    // Documents
    documents: {
      petitioner: ['Petition_1.pdf', 'Petition_2.pdf'],
      research: ['Research_1.pdf', 'Case_Law.pdf'],
      defendant: ['Defense_1.pdf', 'Defense_2.pdf'],
    },
    
    // Stats
    documentsCount: 12,
    hearings: 3,
    nextHearing: '2026-02-15',
    amount: '$250,000',
    clientId: 'c1',
    clientName: 'John Smith',
  },
  {
    id: '2',
    caseNumber: 'CRIM-2026-002',
    caseTitle: 'State v. Williams',
    title: 'State v. Williams',
    description: 'Criminal case regarding possession of illegal substances. The defendant is charged with felony possession.',
    party: 'State: California | Defendant: Williams',
    
    judiciary: {
      cmsNo: 'CMS-2026-002',
      courtNo: 'Court-03',
    },
    
    caseType: 'criminal',
    caseNature: {
      trial: 'Criminal Trial',
      appeal: 'N/A',
    },
    
    courtDetails: {
      courtName: 'San Francisco Superior Court',
      district: 'San Francisco, CA',
      previousDate: '2026-01-20',
      nextDate: '2026-03-01',
    },
    
    remarks: 'Urgent criminal case',
    instituteDate: '2026-02-03',
    instituteNo: 'INST-2026-002',
    
    associate: {
      name: 'Jane Smith',
      district: 'San Francisco',
    },
    
    status: 'pending',
    priority: 'Urgent',
    assignedTo: 'Michael Torres',
    location: 'San Francisco, CA',
    court: 'San Francisco Superior Court',
    judge: 'Hon. Patricia Wong',
    attorneys: 'Prosecutor: DA Office | Defense: Amanda Lee',
    
    documents: {
      petitioner: ['Petition_Criminal_1.pdf'],
      research: ['Criminal_Research.pdf'],
      defendant: ['Defense_Criminal.pdf'],
    },
    
    documentsCount: 8,
    hearings: 2,
    nextHearing: '2026-03-01',
    amount: 'N/A',
    clientId: 'c2',
    clientName: 'Mary Williams',
  },
  {
    id: '3',
    caseNumber: 'CIV-2026-003',
    caseTitle: 'Brown v. City of LA',
    title: 'Brown v. City of LA',
    description: 'Civil rights violation claim against city officials. The plaintiff alleges discrimination and unlawful arrest.',
    party: 'Plaintiff: Brown | Defendant: City of LA',
    
    judiciary: {
      cmsNo: 'CMS-2026-003',
      courtNo: 'Court-05',
    },
    
    caseType: 'civil',
    caseNature: {
      trial: 'Civil Rights Trial',
      appeal: 'N/A',
    },
    
    courtDetails: {
      courtName: 'Federal District Court',
      district: 'Los Angeles, CA',
      previousDate: '2025-12-15',
      nextDate: null,
    },
    
    remarks: 'Closed case - settlement reached',
    instituteDate: '2025-12-20',
    instituteNo: 'INST-2025-003',
    
    associate: {
      name: 'Robert Brown',
      district: 'Los Angeles',
    },
    
    status: 'closed',
    priority: 'Medium',
    assignedTo: 'Jessica Park',
    location: 'Los Angeles, CA',
    court: 'Federal District Court',
    judge: 'Hon. David Chen',
    attorneys: 'Plaintiff: Jessica Park | Defendant: City Attorney',
    
    documents: {
      petitioner: ['Civil_Rights_Petition.pdf'],
      research: ['Civil_Rights_Research.pdf'],
      defendant: ['City_Defense.pdf'],
    },
    
    documentsCount: 15,
    hearings: 5,
    nextHearing: null,
    amount: '$500,000',
    clientId: 'c3',
    clientName: 'Robert Brown',
  },
  {
    id: '4',
    caseNumber: 'FAM-2026-004',
    caseTitle: 'Estate of Davis v. Davis',
    title: 'Estate of Davis v. Davis',
    description: 'Family law dispute over inheritance distribution among siblings. Multiple parties involved in complex estate matter.',
    party: 'Estate: Davis | Defendant: Davis Family',
    
    judiciary: {
      cmsNo: 'CMS-2026-004',
      courtNo: 'Court-07',
    },
    
    caseType: 'civil',
    caseNature: {
      trial: 'Family Trial',
      appeal: 'N/A',
    },
    
    courtDetails: {
      courtName: 'San Diego Superior Court',
      district: 'San Diego, CA',
      previousDate: '2026-02-01',
      nextDate: '2026-04-20',
    },
    
    remarks: 'Complex estate matter',
    instituteDate: '2026-03-10',
    instituteNo: 'INST-2026-004',
    
    associate: {
      name: 'Sarah Davis',
      district: 'San Diego',
    },
    
    status: 'active',
    priority: 'High',
    assignedTo: 'Robert Kim',
    location: 'San Diego, CA',
    court: 'San Diego Superior Court',
    judge: 'Hon. Maria Santos',
    attorneys: 'Estate: Robert Kim | Defendant: Davis Law Firm',
    
    documents: {
      petitioner: ['Estate_Petition.pdf', 'Will_Document.pdf'],
      research: ['Family_Law_Research.pdf'],
      defendant: ['Defense_Estate.pdf'],
    },
    
    documentsCount: 18,
    hearings: 3,
    nextHearing: '2026-04-20',
    amount: '$1,200,000',
    clientId: 'c4',
    clientName: 'Sarah Davis',
  },
  {
    id: '5',
    caseNumber: 'PI-2026-005',
    caseTitle: 'Wilson v. Martinez',
    title: 'Wilson v. Martinez',
    description: 'Personal injury claim from auto accident. The plaintiff seeks compensation for medical expenses and damages.',
    party: 'Plaintiff: Wilson | Defendant: Martinez',
    
    judiciary: {
      cmsNo: 'CMS-2026-005',
      courtNo: 'Court-09',
    },
    
    caseType: 'civil',
    caseNature: {
      trial: 'Personal Injury Trial',
      appeal: 'N/A',
    },
    
    courtDetails: {
      courtName: 'Alameda County Superior Court',
      district: 'Oakland, CA',
      previousDate: '2026-03-15',
      nextDate: '2026-05-10',
    },
    
    remarks: 'Medical records requested',
    instituteDate: '2026-04-01',
    instituteNo: 'INST-2026-005',
    
    associate: {
      name: 'Michael Wilson',
      district: 'Oakland',
    },
    
    status: 'pending',
    priority: 'Medium',
    assignedTo: 'Amanda Lee',
    location: 'Oakland, CA',
    court: 'Alameda County Superior Court',
    judge: 'Hon. James Wilson',
    attorneys: 'Plaintiff: Amanda Lee | Defendant: Thomas & Associates',
    
    documents: {
      petitioner: ['PI_Petition.pdf', 'Medical_Records.pdf'],
      research: ['PI_Research.pdf'],
      defendant: ['Defense_PI.pdf'],
    },
    
    documentsCount: 10,
    hearings: 2,
    nextHearing: '2026-05-10',
    amount: '$350,000',
    clientId: 'c5',
    clientName: 'Michael Wilson',
  },
  {
    id: '6',
    caseNumber: 'FAM-2026-006',
    caseTitle: 'In re Adoption of Thompson',
    title: 'In re Adoption of Thompson',
    description: 'Adoption proceeding for minor child. The petitioners seek to finalize adoption and establish legal guardianship.',
    party: 'Petitioners: Thompson Family',
    
    judiciary: {
      cmsNo: 'CMS-2026-006',
      courtNo: 'Court-11',
    },
    
    caseType: 'civil',
    caseNature: {
      trial: 'Adoption Hearing',
      appeal: 'N/A',
    },
    
    courtDetails: {
      courtName: 'Sacramento Family Court',
      district: 'Sacramento, CA',
      previousDate: '2026-05-01',
      nextDate: '2026-06-15',
    },
    
    remarks: 'Adoption finalization pending',
    instituteDate: '2026-05-12',
    instituteNo: 'INST-2026-006',
    
    associate: {
      name: 'Jessica Thompson',
      district: 'Sacramento',
    },
    
    status: 'active',
    priority: 'Low',
    assignedTo: 'David Wilson',
    location: 'Sacramento, CA',
    court: 'Sacramento Family Court',
    judge: 'Hon. Lisa Chang',
    attorneys: 'Petitioners: David Wilson | Guardian ad Litem: Sarah Johnson',
    
    documents: {
      petitioner: ['Adoption_Petition.pdf', 'Home_Study.pdf'],
      research: ['Adoption_Research.pdf'],
      defendant: [],
    },
    
    documentsCount: 9,
    hearings: 2,
    nextHearing: '2026-06-15',
    amount: '$75,000',
    clientId: 'c6',
    clientName: 'Jessica Thompson',
  },
];

// ============================================
// DUMMY CLIENTS DATA
// ============================================

export const dummyClients = [
  {
    id: 'c1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    company: 'Smith Enterprises',
    cases: 3,
    status: 'active',
    joined: '2025-01-15',
    address: '123 Main St, Los Angeles, CA 90001',
  },
  {
    id: 'c2',
    name: 'Mary Williams',
    email: 'mary.williams@email.com',
    phone: '+1 (555) 234-5678',
    company: 'Williams Group',
    cases: 2,
    status: 'active',
    joined: '2025-03-20',
    address: '456 Oak Ave, San Francisco, CA 94102',
  },
  {
    id: 'c3',
    name: 'Robert Brown',
    email: 'robert.brown@email.com',
    phone: '+1 (555) 345-6789',
    company: 'Brown & Associates',
    cases: 4,
    status: 'active',
    joined: '2024-11-10',
    address: '789 Pine St, Los Angeles, CA 90002',
  },
  {
    id: 'c4',
    name: 'Sarah Davis',
    email: 'sarah.davis@email.com',
    phone: '+1 (555) 456-7890',
    company: 'Davis Family Trust',
    cases: 1,
    status: 'active',
    joined: '2026-01-05',
    address: '321 Elm St, San Diego, CA 92101',
  },
  {
    id: 'c5',
    name: 'Michael Wilson',
    email: 'michael.wilson@email.com',
    phone: '+1 (555) 567-8901',
    company: 'Wilson Law Group',
    cases: 2,
    status: 'pending',
    joined: '2025-08-12',
    address: '654 Maple Dr, Oakland, CA 94601',
  },
  {
    id: 'c6',
    name: 'Jessica Thompson',
    email: 'jessica.thompson@email.com',
    phone: '+1 (555) 678-9012',
    company: 'Thompson Family',
    cases: 1,
    status: 'active',
    joined: '2026-02-28',
    address: '987 Cedar Ln, Sacramento, CA 95801',
  },
];

// ============================================
// DUMMY EVENTS DATA
// ============================================

export const dummyEvents = [
  {
    id: 'e1',
    title: 'Hearing: Smith v. Johnson',
    date: '2026-02-15',
    time: '10:00 AM',
    type: 'hearing',
    caseId: '1',
    location: 'Los Angeles Superior Court',
    description: 'Initial hearing for contract dispute',
  },
  {
    id: 'e2',
    title: 'Meeting: State v. Williams',
    date: '2026-03-01',
    time: '2:00 PM',
    type: 'meeting',
    caseId: '2',
    location: 'San Francisco DA Office',
    description: 'Pre-trial meeting with prosecutor',
  },
  {
    id: 'e3',
    title: 'Hearing: Estate of Davis',
    date: '2026-04-20',
    time: '9:30 AM',
    type: 'hearing',
    caseId: '4',
    location: 'San Diego Superior Court',
    description: 'Estate distribution hearing',
  },
  {
    id: 'e4',
    title: 'Deposition: Wilson v. Martinez',
    date: '2026-05-10',
    time: '11:00 AM',
    type: 'deposition',
    caseId: '5',
    location: 'Oakland Law Firm',
    description: 'Plaintiff deposition',
  },
  {
    id: 'e5',
    title: 'Adoption Finalization',
    date: '2026-06-15',
    time: '1:00 PM',
    type: 'hearing',
    caseId: '6',
    location: 'Sacramento Family Court',
    description: 'Final adoption hearing',
  },
  {
    id: 'e6',
    title: 'Status Conference: Smith v. Johnson',
    date: '2026-03-05',
    time: '10:30 AM',
    type: 'conference',
    caseId: '1',
    location: 'Virtual',
    description: 'Case status review',
  },
];

// ============================================
// DUMMY REFERENCE CASES DATA
// ============================================

export const dummyReferenceCases = [
  {
    id: 'ref1',
    title: 'Doe v. Roe - Landmark Property Case',
    caseNumber: 'REF-2025-001',
    description: 'Landmark property dispute case establishing important precedents for boundary disputes and property rights.',
    party: 'Plaintiff: Doe | Defendant: Roe',
    status: 'reference',
    date: '2025-06-15',
    caseType: 'Property Law',
    priority: 'High',
    assignedTo: 'Sarah Chen',
    location: 'New York, NY',
    court: 'New York Supreme Court',
    judge: 'Hon. Robert Martinez',
    attorneys: 'Plaintiff: Sarah Chen | Defendant: Michael Torres',
    documents: 15,
    hearings: 4,
    amount: '$2,500,000',
    referenceNotes: 'Important precedent for property line disputes',
    referenceCategory: 'Property Law',
    year: 2025,
    citation: 'Doe v. Roe, 2025 NY Sup. Ct. 123',
    tags: ['property', 'boundary', 'landmark'],
  },
  {
    id: 'ref2',
    title: 'State v. Thompson - Criminal Procedure',
    caseNumber: 'REF-2025-002',
    description: 'Criminal procedure case establishing important precedents for search and seizure.',
    party: 'State: New York | Defendant: Thompson',
    status: 'reference',
    date: '2025-08-20',
    caseType: 'Criminal Law',
    priority: 'Medium',
    assignedTo: 'Michael Torres',
    location: 'New York, NY',
    court: 'New York Criminal Court',
    judge: 'Hon. Patricia Wong',
    attorneys: 'Prosecutor: DA Office | Defense: Amanda Lee',
    documents: 10,
    hearings: 3,
    amount: 'N/A',
    referenceNotes: 'Key reference for criminal procedure arguments',
    referenceCategory: 'Criminal Law',
    year: 2025,
    citation: 'State v. Thompson, 2025 NY Crim. Ct. 456',
    tags: ['criminal', 'procedure', 'search-seizure'],
  },
  {
    id: 'ref3',
    title: 'Johnson v. Smith - Employment Discrimination',
    caseNumber: 'REF-2024-003',
    description: 'Employment discrimination case establishing precedents for workplace harassment claims.',
    party: 'Plaintiff: Johnson | Defendant: Smith Corp',
    status: 'reference',
    date: '2024-11-10',
    caseType: 'Employment Law',
    priority: 'High',
    assignedTo: 'Jessica Park',
    location: 'Los Angeles, CA',
    court: 'Federal District Court',
    judge: 'Hon. David Chen',
    attorneys: 'Plaintiff: Jessica Park | Defendant: Corporate Counsel',
    documents: 20,
    hearings: 5,
    amount: '$750,000',
    referenceNotes: 'Landmark employment discrimination case',
    referenceCategory: 'Employment Law',
    year: 2024,
    citation: 'Johnson v. Smith, 2024 Fed. Dist. Ct. 789',
    tags: ['employment', 'discrimination', 'harassment'],
  },
];