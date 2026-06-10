export interface WorkOrder {
  id: number;
  status: 'New' | 'Dispatched' | 'Awaiting Approval' | 'In Progress' | 'Completed';
  severity: 'Emergency' | 'High' | 'Medium' | 'Low';
  property: string;
  tenant: string;
  reported: string;
  description: string;
  unit: string;
  vendor?: string;
  estCost?: number;
  nte?: number;
  ownerApproval?: 'Not Required' | 'Required' | 'Pending' | 'Bypassed (Emergency)' | 'Approved';
}

export interface ActivityItem {
  id: number;
  type: 'NEW' | 'EMERGENCY' | 'APPROVAL' | 'COMPLETE';
  message: string;
  timestamp: string;
  workOrderId?: number;
  link?: string;
}

export interface KPICard {
  title: string;
  value: number;
  icon: string;
}

export interface ConversationMessage {
  sender: 'tenant' | 'ai' | 'vendor';
  text: string;
  timestamp?: string;
}

export interface ThinkingBox {
  title: string;
  items: { label: string; value: string }[];
}

export const workOrders: WorkOrder[] = [
  {
    id: 1025,
    status: 'New',
    severity: 'Low',
    property: '456 Oak Ave',
    tenant: 'A. Tenant',
    reported: '2h ago',
    description: 'Kitchen sink is clogged and draining slowly',
    unit: 'Unit 2B',
    vendor: "Mike's Handyman",
    estCost: 120,
    nte: 300,
    ownerApproval: 'Not Required',
  },
  {
    id: 1022,
    status: 'Dispatched',
    severity: 'Emergency',
    property: '123 Main St',
    tenant: 'B. Tenant',
    reported: '1d ago',
    description: 'Gas smell reported in kitchen',
    unit: 'Unit 1A',
    vendor: 'Emergency Gas Co.',
    ownerApproval: 'Bypassed (Emergency)',
  },
  {
    id: 1023,
    status: 'Awaiting Approval',
    severity: 'High',
    property: '789 Pine Ln',
    tenant: 'C. Tenant',
    reported: '2d ago',
    description: 'HVAC unit needs full replacement',
    unit: 'Unit C',
    vendor: 'All Seasons HVAC',
    estCost: 4500,
    nte: 1500,
    ownerApproval: 'Pending',
  },
  {
    id: 1024,
    status: 'In Progress',
    severity: 'Medium',
    property: '456 Oak Ave',
    tenant: 'A. Tenant',
    reported: '3d ago',
    description: 'Bathroom tile repair in progress',
    unit: 'Unit 2B',
    vendor: "Pro Tile Services",
    estCost: 280,
    nte: 500,
    ownerApproval: 'Not Required',
  },
  {
    id: 1021,
    status: 'Completed',
    severity: 'Low',
    property: '123 Main St',
    tenant: 'B. Tenant',
    reported: '5d ago',
    description: 'Dryer repair completed',
    unit: 'Unit 1A',
    vendor: "Appliance Pro",
    estCost: 85,
    ownerApproval: 'Not Required',
  },
];

export const kpiCards: KPICard[] = [
  { title: 'New Requests', value: 2, icon: 'inbox' },
  { title: 'In Progress', value: 5, icon: 'loader' },
  { title: 'Awaiting Approval', value: 1, icon: 'clock' },
  { title: 'Completed (7 days)', value: 18, icon: 'check-circle' },
];

export const activityItems: ActivityItem[] = [
  {
    id: 1,
    type: 'NEW',
    message: 'New work order #1025 (Clogged Sink) received from tenant at 456 Oak Ave.',
    timestamp: '2h ago',
    workOrderId: 1025,
  },
  {
    id: 2,
    type: 'EMERGENCY',
    message: 'AI dispatched Emergency Gas Co. for gas smell at 123 Main St.',
    timestamp: '1d ago',
    workOrderId: 1022,
  },
  {
    id: 3,
    type: 'APPROVAL',
    message: 'HVAC replacement at 789 Pine Ln requires owner approval.',
    timestamp: '2d ago',
    workOrderId: 1023,
  },
  {
    id: 4,
    type: 'COMPLETE',
    message: 'Work order #1021 (Dryer Repair) marked as complete.',
    timestamp: '5d ago',
    workOrderId: 1021,
  },
];

export const propertyImages: Record<string, string> = {
  '456 Oak Ave': '/images/property-oak.jpg',
  '123 Main St': '/images/property-main.jpg',
  '789 Pine Ln': '/images/property-pine.jpg',
};

export const conversationData: Record<number, { messages: ConversationMessage[]; thinkingBoxes: { afterIndex: number; box: ThinkingBox }[] }> = {
  1025: {
    messages: [
      { sender: 'tenant', text: 'My kitchen sink is clogged.' },
      { sender: 'ai', text: 'Thanks for letting me know. Is there standing water?' },
      { sender: 'tenant', text: "No, it's just draining very slowly." },
      { sender: 'ai', text: 'Before I send a pro, have you tried a plunger?' },
      { sender: 'tenant', text: "Yes, it didn't work." },
      { sender: 'ai', text: "Okay, I'm dispatching a handyman to take a look." },
    ],
    thinkingBoxes: [
      {
        afterIndex: 2,
        box: {
          title: 'AI Analysis',
          items: [
            { label: 'Severity', value: 'Low' },
            { label: 'Responsibility', value: 'Owner' },
            { label: 'Action', value: 'Begin Troubleshooting' },
          ],
        },
      },
      {
        afterIndex: 4,
        box: {
          title: 'AI Analysis',
          items: [
            { label: 'Troubleshooting', value: 'Failed' },
            { label: 'Action', value: 'Dispatch Vendor' },
          ],
        },
      },
    ],
  },
  1022: {
    messages: [
      { sender: 'tenant', text: 'I smell gas in my kitchen!' },
      { sender: 'ai', text: 'Leave the unit immediately and call 911 from outside. I am dispatching the gas company right now.' },
    ],
    thinkingBoxes: [
      {
        afterIndex: 0,
        box: {
          title: 'EMERGENCY TRIAGE',
          items: [
            { label: 'Trigger', value: '"gas smell"' },
            { label: 'Severity', value: 'Emergency' },
            { label: 'Action', value: 'Evacuate & Dispatch' },
          ],
        },
      },
    ],
  },
  1023: {
    messages: [
      { sender: 'vendor', text: 'The HVAC unit needs full replacement. Compressor is shot and freon leaking.' },
      { sender: 'vendor', text: 'Estimate: $4,500' },
      { sender: 'ai', text: 'Approval is required for this repair. The request has been sent to the property owner.' },
    ],
    thinkingBoxes: [
      {
        afterIndex: 1,
        box: {
          title: 'AI Analysis',
          items: [
            { label: 'Estimate', value: '$4,500' },
            { label: 'NTE Limit', value: '$1,500' },
            { label: 'Action', value: 'Escalate for owner approval' },
          ],
        },
      },
    ],
  },
};
