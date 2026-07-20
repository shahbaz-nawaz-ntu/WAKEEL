import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Case from '../models/Case.js';
import Client from '../models/Client.js';
import Event from '../models/Event.js';
import Reference from '../models/Reference.js';
import connectDB from '../config/database.js';

dotenv.config();

// Sample Users
const users = [
  {
    name: 'John Doe',
    email: 'john@jurisflow.com',
    password: 'password123',
    role: 'admin',
  },
  {
    name: 'Jane Smith',
    email: 'jane@jurisflow.com',
    password: 'password123',
    role: 'attorney',
  },
  {
    name: 'Bob Johnson',
    email: 'bob@jurisflow.com',
    password: 'password123',
    role: 'attorney',
  },
];

// Sample Clients
const clients = [
  {
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    phone: '(555) 123-4567',
    company: 'Wilson Enterprises',
    address: '123 Main St, New York, NY 10001',
    status: 'active',
  },
  {
    name: 'Michael Brown',
    email: 'michael@example.com',
    phone: '(555) 234-5678',
    company: 'Brown & Associates',
    address: '456 Oak Ave, Los Angeles, CA 90001',
    status: 'active',
  },
  {
    name: 'Emily Davis',
    email: 'emily@example.com',
    phone: '(555) 345-6789',
    company: 'Davis Law Group',
    address: '789 Pine St, Chicago, IL 60601',
    status: 'pending',
  },
];

// Sample Cases
const cases = [
  {
    caseTitle: 'Smith v. Johnson',
    description: 'Contract dispute over property sale agreement. The plaintiff alleges breach of contract and seeks damages.',
    party: 'Plaintiff: Smith | Defendant: Johnson',
    status: 'active',
    priority: 'High',
    caseType: 'civil',
    amount: '$250,000',
    hearings: 3,
    documentsCount: 6,
    court: 'Federal Court',
    nextHearing: '2026-03-20',
  },
  {
    caseTitle: 'State v. Williams',
    description: 'Criminal case regarding possession of illegal substances. The defendant is charged with felony possession with intent to distribute.',
    party: 'State: California | Defendant: Williams',
    status: 'pending',
    priority: 'Urgent',
    caseType: 'criminal',
    amount: 'N/A',
    hearings: 2,
    documentsCount: 3,
    court: 'State Court',
    nextHearing: '2026-04-15',
  },
  {
    caseTitle: 'Brown v. City of LA',
    description: 'Civil rights violation claim against city officials. The plaintiff alleges discrimination and unlawful arrest.',
    party: 'Plaintiff: Brown | Defendant: City of LA',
    status: 'active',
    priority: 'High',
    caseType: 'civil',
    amount: '$500,000',
    hearings: 5,
    documentsCount: 8,
    court: 'Federal Court',
    nextHearing: '2026-02-28',
  },
];

// Sample Events
const events = [
  {
    title: 'Smith v. Johnson - Hearing',
    date: '2026-03-20',
    time: '10:00',
    type: 'hearing',
    location: 'Federal Court, Room 301',
    description: 'Initial hearing for Smith v. Johnson case',
  },
  {
    title: 'State v. Williams - Motion Hearing',
    date: '2026-04-15',
    time: '14:30',
    type: 'hearing',
    location: 'State Court, Room 205',
    description: 'Motion to dismiss hearing',
  },
  {
    title: 'Brown v. City of LA - Pre-trial Conference',
    date: '2026-02-28',
    time: '09:30',
    type: 'conference',
    location: 'Federal Court, Conference Room A',
    description: 'Pre-trial conference for civil rights case',
  },
];

// Sample References
const references = [
  {
    title: 'Doe v. Roe - Landmark Precedent',
    caseNumber: 'CIV-2020-001',
    caseType: 'Civil',
    description: 'Important precedent regarding civil rights violations',
    referenceCategory: 'precedent',
    court: 'Supreme Court',
    date: '2020-01-15',
    judge: 'Hon. John Roberts',
    citation: '123 U.S. 456 (2020)',
    tags: ['civil rights', 'precedent', 'landmark'],
  },
  {
    title: 'State v. Smith - Criminal Precedent',
    caseNumber: 'CRIM-2019-002',
    caseType: 'Criminal',
    description: 'Criminal case regarding evidence admissibility',
    referenceCategory: 'case_law',
    court: 'State Supreme Court',
    date: '2019-06-20',
    judge: 'Hon. Jane Doe',
    citation: '456 State. 789 (2019)',
    tags: ['criminal', 'evidence', 'procedure'],
  },
];

// ============================================
// SEED FUNCTION
// ============================================
const seed = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Client.deleteMany({});
    await Case.deleteMany({});
    await Event.deleteMany({});
    await Reference.deleteMany({});

    console.log('🗑️ Existing data cleared');

    // Create users
    const createdUsers = await User.create(users);
    console.log(`👤 Created ${createdUsers.length} users`);

    const adminUser = createdUsers[0];

    // Create clients with user reference
    const clientsWithUser = clients.map(client => ({
      ...client,
      createdBy: adminUser._id,
    }));
    const createdClients = await Client.create(clientsWithUser);
    console.log(`📋 Created ${createdClients.length} clients`);

    // Create cases with user reference
    const casesWithUser = cases.map((caseItem, index) => ({
      ...caseItem,
      createdBy: adminUser._id,
      clientId: createdClients[index % createdClients.length]._id,
    }));
    const createdCases = await Case.create(casesWithUser);
    console.log(`📁 Created ${createdCases.length} cases`);

    // Create events with user and case reference
    const eventsWithRefs = events.map((event, index) => ({
      ...event,
      createdBy: adminUser._id,
      caseRef: createdCases[index % createdCases.length]._id,
      caseId: createdCases[index % createdCases.length].caseNumber,
    }));
    const createdEvents = await Event.create(eventsWithRefs);
    console.log(`📅 Created ${createdEvents.length} events`);

    // Create references with user reference
    const referencesWithUser = references.map(ref => ({
      ...ref,
      createdBy: adminUser._id,
    }));
    const createdReferences = await Reference.create(referencesWithUser);
    console.log(`📚 Created ${createdReferences.length} references`);

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// ============================================
// RUN SEED
// ============================================
seed();