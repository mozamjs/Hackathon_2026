export const CATEGORIES = [
  { id: 'all', label: 'All Categories', icon: 'LayoutGrid' },
  { id: 'road', label: 'Road & Potholes', icon: 'Car', color: 'amber' },
  { id: 'garbage', label: 'Garbage & Sanitation', icon: 'Trash2', color: 'emerald' },
  { id: 'water', label: 'Water & Sewage', icon: 'Droplets', color: 'cyan' },
  { id: 'electricity', label: 'Electricity & Lighting', icon: 'Zap', color: 'yellow' },
  { id: 'other', label: 'Other Civic Issues', icon: 'HelpCircle', color: 'purple' },
];

export const STATUSES = [
  { id: 'all', label: 'All Statuses' },
  { id: 'pending', label: 'Pending Review', color: 'amber' },
  { id: 'in-progress', label: 'In Progress', color: 'blue' },
  { id: 'resolved', label: 'Resolved', color: 'emerald' },
];

export const DEMO_USERS = [
  {
    role: 'officer',
    name: 'Officer Tariq Baloch',
    email: 'officer@civicfix.demo',
    password: 'Officer123!',
    tag: 'Municipal Officer',
    desc: 'Triage, update statuses, & generate AI briefings'
  },
  {
    role: 'citizen',
    name: 'Ahmed Khan',
    email: 'ahmed@civicfix.demo',
    password: 'Citizen123!',
    tag: 'Active Citizen',
    desc: 'Submit complaints, upvote, & leave feedback'
  },
  {
    role: 'citizen',
    name: 'Fatima Ali',
    email: 'fatima@civicfix.demo',
    password: 'Citizen123!',
    tag: 'Community Lead',
    desc: 'Submit complaints & monitor local area'
  },
];
