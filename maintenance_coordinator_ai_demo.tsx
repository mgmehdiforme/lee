import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  Wrench, 
  Settings, 
  LogOut, 
  Bell, 
  Search, 
  Bot, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MessageSquare,
  Zap,
  ArrowRight,
  ChevronRight,
  Building,
  ShieldAlert,
  BrainCircuit,
  Loader2,
  Wand2,
  Star,
  Mail,
  Phone,
  ToggleRight
} from 'lucide-react';

// --- MOCK DATA ---
const KPI_DATA = [
  { label: 'Active Work Orders', value: '24', trend: '-2', type: 'neutral', icon: ClipboardList },
  { label: 'AI Deflection Rate', value: '42%', trend: '+5%', type: 'positive', icon: BrainCircuit },
  { label: 'Avg Resolution Time', value: '1.4 Days', trend: '-0.3', type: 'positive', icon: Clock },
  { label: 'Emergencies', value: '1', trend: '0', type: 'negative', icon: AlertTriangle },
];

const MOCK_WORK_ORDERS = [
  { 
    id: '1025', 
    title: 'Water leaking heavily from ceiling', 
    status: 'Escalated', 
    priority: 'Emergency', 
    category: 'Plumbing', 
    address: '789 Pine Blvd, Unit 2B', 
    tenant: 'Jessica Davis', 
    aiAction: 'Classified as Emergency Life/Safety. Paged on-call PM.', 
    date: 'Today, 10:42 AM',
    cost: 'Pending'
  },
  { 
    id: '1023', 
    title: 'AC not cooling - 85 degrees inside', 
    status: 'Dispatched', 
    priority: 'High', 
    category: 'HVAC', 
    address: '456 Oak Ave', 
    tenant: 'Michael Chen', 
    aiAction: 'Troubleshot thermostat. Auto-dispatched preferred vendor.', 
    date: 'Yesterday, 3:15 PM',
    cost: '$85.00 (Diag)'
  },
  { 
    id: '1022', 
    title: 'Clogged drain in master bathroom', 
    status: 'Resolved', 
    priority: 'Low', 
    category: 'Plumbing', 
    address: '123 Maple St, Unit 4', 
    tenant: 'Sarah Jenkins', 
    aiAction: 'Identified as tenant responsibility. Sent DIY guide.', 
    date: 'Oct 24, 2023',
    cost: '$0.00 (Deflected)'
  },
  { 
    id: '1021', 
    title: 'Dishwasher not starting', 
    status: 'Awaiting Approval', 
    priority: 'Medium', 
    category: 'Appliance', 
    address: '101 Elm St, Unit 12', 
    tenant: 'David Miller', 
    aiAction: 'Gathered make/model. Quote exceeds threshold, awaiting owner approval.', 
    date: 'Oct 23, 2023',
    cost: '$450.00 (Est)'
  }
];

const MOCK_PROPERTIES = [
  { id: 'P-101', name: 'Pineview Apartments', address: '789 Pine Blvd', type: 'Multi-Family', units: 24, occupancy: '95%', aiCoverage: 'Active', health: 'Good' },
  { id: 'P-102', name: 'Oakridge Home', address: '456 Oak Ave', type: 'Single-Family', units: 1, occupancy: '100%', aiCoverage: 'Active', health: 'Good' },
  { id: 'P-103', name: 'Maple Street Townhomes', address: '123 Maple St', type: 'Multi-Family', units: 8, occupancy: '100%', aiCoverage: 'Active', health: 'Attention' },
  { id: 'P-104', name: 'Elmwood Complex', address: '101 Elm St', type: 'Multi-Family', units: 12, occupancy: '83%', aiCoverage: 'Learning', health: 'Good' }
];

const MOCK_TENANTS = [
  { id: 'T-882', name: 'Jessica Davis', property: '789 Pine Blvd, Unit 2B', status: 'Active', leaseEnd: '2024-08-31', risk: 'Low Risk', lastContact: 'Today' },
  { id: 'T-883', name: 'Michael Chen', property: '456 Oak Ave', status: 'Active', leaseEnd: '2024-11-15', risk: 'Low Risk', lastContact: 'Yesterday' },
  { id: 'T-884', name: 'Sarah Jenkins', property: '123 Maple St, Unit 4', status: 'Active', leaseEnd: '2024-03-01', risk: 'Medium Risk', lastContact: 'Oct 24, 2023' },
  { id: 'T-885', name: 'David Miller', property: '101 Elm St, Unit 12', status: 'Notice Given', leaseEnd: '2023-11-30', risk: 'High Risk', lastContact: 'Oct 23, 2023' }
];

const MOCK_VENDORS = [
  { id: 'V-01', name: 'Frosty HVAC Solutions', trade: 'HVAC', rating: 4.9, aiDispatch: true, sla: '98%', rate: '$85/hr' },
  { id: 'V-02', name: 'Emergency Plumbers Inc', trade: 'Plumbing', rating: 4.7, aiDispatch: true, sla: '95%', rate: '$120/hr' },
  { id: 'V-03', name: 'Appliance Pros', trade: 'Appliance Repair', rating: 4.2, aiDispatch: false, sla: '82%', rate: '$75/hr' },
  { id: 'V-04', name: 'Citywide Electric', trade: 'Electrical', rating: 4.8, aiDispatch: true, sla: '99%', rate: '$95/hr' }
];

const WO_DETAILS = {
  '1022': {
    logs: [
      { sender: 'tenant', text: "Hey, my bathroom sink is completely clogged and water won't go down.", time: '10:00 AM' },
      { sender: 'ai', text: "I can help with that. Are you experiencing clogs in any other sinks or tubs, or just the master bathroom sink?", time: '10:01 AM' },
      { sender: 'tenant', text: "Just the master bathroom.", time: '10:05 AM' },
      { sender: 'ai', text: "Understood. According to Section 4 of your lease agreement, isolated drain clogs are generally a tenant responsibility. However, I have a quick 2-minute video that shows how to easily clear this using a simple zip-it tool or baking soda/vinegar. Would you like me to send that to you?", time: '10:05 AM' },
      { sender: 'tenant', text: "Oh, okay. Yeah send the video please.", time: '10:10 AM' },
      { sender: 'ai', text: "I've sent the link to your phone. I will check back tomorrow to see if this resolved the issue. If it requires a professional plumber, please note there may be a dispatch fee.", time: '10:10 AM' },
      { sender: 'tenant', text: "The baking soda trick worked. Thanks.", time: 'Next Day, 9:00 AM' },
      { sender: 'ai', text: "Excellent! I will go ahead and close this request. Have a great day!", time: 'Next Day, 9:01 AM' }
    ],
    analysis: {
      category: 'Plumbing > Clogged Drain',
      severity: 'Low / Routine',
      habitability: 'No Impact',
      responsibility: 'Tenant (Lease Sec 4.2)',
      resolution: 'AI Deflected - Resolved by Tenant'
    }
  },
  '1023': {
    logs: [
      { sender: 'tenant', text: "The AC is broken. It's 85 degrees in the house and we have a newborn.", time: '3:15 PM' },
      { sender: 'ai', text: "I'm sorry to hear that. To help me dispatch the right person, is the thermostat screen blank, or does it have power?", time: '3:16 PM' },
      { sender: 'tenant', text: "It has power, it's set to 70 but blowing warm air.", time: '3:18 PM' },
      { sender: 'ai', text: "Have you changed the air filter recently? A dirty filter can cause the coils to freeze.", time: '3:18 PM' },
      { sender: 'tenant', text: "Yes, I changed it last week.", time: '3:20 PM' },
      { sender: 'ai', text: "Thank you. Because temperatures are high and you have an infant, I am classifying this as a High Priority issue. I have automatically dispatched 'Frosty HVAC Solutions' to your property. You will receive a scheduling text from them shortly.", time: '3:21 PM' }
    ],
    analysis: {
      category: 'HVAC > No Cooling',
      severity: 'High (Vulnerable Tenant / Weather)',
      habitability: 'At Risk (Temp > 80°F)',
      responsibility: 'Owner',
      resolution: 'Auto-Dispatched: Frosty HVAC (Pre-approved vendor)'
    }
  },
  '1025': {
    logs: [
      { sender: 'tenant', text: "HELP! Water is pouring through the kitchen ceiling from the bathroom upstairs!!", time: '10:42 AM' },
      { sender: 'ai', text: "This sounds like an emergency. First, for your safety, please stay away from any electrical fixtures near the water. Do you know how to shut off the main water valve to the apartment?", time: '10:42 AM' },
      { sender: 'tenant', text: "No, I don't know where it is, there is so much water.", time: '10:43 AM' },
      { sender: 'ai', text: "I am escalating this immediately. I have notified the on-call Property Manager, Sarah, and dispatched Emergency Plumbers Inc. The water shutoff is located in the utility closet next to the front door, red handle. Turn it to the right if you can safely reach it.", time: '10:43 AM' }
    ],
    analysis: {
      category: 'Plumbing > Active Leak',
      severity: 'EMERGENCY (Life/Safety/Property Damage)',
      habitability: 'Compromised',
      responsibility: 'Owner (Immediate action req)',
      resolution: 'Human Escalation & Emergency Dispatch'
    }
  }
};

// --- GEMINI API INTEGRATION ---
const apiKey = "";

async function callGeminiAPI(prompt, retries = 5) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  let delay = 1000;
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      return result.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
    } catch (error) {
      if (i === retries - 1) {
        console.error("Gemini API failed after retries", error);
        return "Error generating content. Please try again.";
      }
      await new Promise(res => setTimeout(res, delay));
      delay *= 2;
    }
  }
}

// --- COMPONENTS ---

const Badge = ({ children, type }) => {
  const styles = {
    Emergency: 'bg-red-100 text-red-800 border-red-200',
    High: 'bg-orange-100 text-orange-800 border-orange-200',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Low: 'bg-green-100 text-green-800 border-green-200',
    Escalated: 'bg-red-50 text-red-700 border-red-200',
    Dispatched: 'bg-blue-50 text-blue-700 border-blue-200',
    Resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Awaiting Approval': 'bg-purple-50 text-purple-700 border-purple-200',
    default: 'bg-gray-100 text-gray-800 border-gray-200'
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[type] || styles.default}`}>
      {children}
    </span>
  );
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [activeWO, setActiveWO] = useState(null);

  // --- GEMINI LLM STATES ---
  const [isHumanOverride, setIsHumanOverride] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [isVendorBriefing, setIsVendorBriefing] = useState(false);
  const [vendorBrief, setVendorBrief] = useState('');

  const navigateTo = (page, woId = null) => {
    setCurrentPage(page);
    if (woId) {
      setActiveWO(woId);
      // Reset LLM states for new WO
      setIsHumanOverride(false);
      setChatInput('');
      setAiSummary('');
      setVendorBrief('');
    }
  };

  const handleDraftReply = async () => {
    setIsDrafting(true);
    const logs = WO_DETAILS[activeWO]?.logs || [];
    const prompt = `You are a helpful property manager stepping in to chat with a tenant. Read the following conversation history and draft a polite, concise, professional reply to the tenant to help resolve their issue or provide an update. Do not include placeholders like [Your Name] or subject lines. Just write the message body directly.
    
    History: ${JSON.stringify(logs)}`;
    
    const draft = await callGeminiAPI(prompt);
    setChatInput(draft.trim());
    setIsDrafting(false);
  };

  const handleSummarize = async () => {
    setIsSummarizing(true);
    const logs = WO_DETAILS[activeWO]?.logs || [];
    const prompt = `Summarize the following maintenance request interaction log in exactly one concise sentence for a busy property manager: ${JSON.stringify(logs)}`;
    const summary = await callGeminiAPI(prompt);
    setAiSummary(summary.trim());
    setIsSummarizing(false);
  };
  
  const handleVendorBrief = async () => {
     setIsVendorBriefing(true);
     const wo = MOCK_WORK_ORDERS.find(w => w.id === activeWO);
     const logs = WO_DETAILS[activeWO]?.logs || [];
     const prompt = `Based on the following work order details and interaction log, write a 2-3 sentence technical brief to send to a vendor (plumber, HVAC tech, etc.) to prepare them for the job.
     
     Title: ${wo?.title}
     Address: ${wo?.address}
     History: ${JSON.stringify(logs)}`;
     
     const brief = await callGeminiAPI(prompt);
     setVendorBrief(brief.trim());
     setIsVendorBriefing(false);
  };

  // --- VIEWS ---

  if (currentPage === 'login') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="h-14 w-14 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Bot className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            MaintainAI
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Autonomous Property Maintenance System
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); navigateTo('dashboard'); }}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email address</label>
                <div className="mt-1">
                  <input type="email" defaultValue="demo@maintainai.com" className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1">
                  <input type="password" defaultValue="••••••••" className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                  <label className="ml-2 block text-sm text-gray-900">Remember me</label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Forgot password?</a>
                </div>
              </div>
              <div>
                <button type="submit" className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                  Sign in to Demo
                </button>
              </div>
            </form>
            <div className="mt-6 border-t border-gray-200 pt-6">
              <p className="text-xs text-center text-gray-500">Investor Preview Environment. Data is simulated.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <div className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
          <Bot className="h-6 w-6 text-indigo-400 mr-2" />
          <span className="font-bold text-lg tracking-wide">MaintainAI</span>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-3 space-y-1">
            <button onClick={() => navigateTo('dashboard')} className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${currentPage === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
              <LayoutDashboard className="mr-3 h-5 w-5" /> Dashboard
            </button>
            <button onClick={() => navigateTo('work-orders')} className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${currentPage.includes('work-order') ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
              <ClipboardList className="mr-3 h-5 w-5" /> Work Orders
              <span className="ml-auto bg-indigo-500 text-white py-0.5 px-2 rounded-full text-xs">12</span>
            </button>
            <button onClick={() => navigateTo('properties')} className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${currentPage === 'properties' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
              <Building className="mr-3 h-5 w-5" /> Properties
            </button>
            <button onClick={() => navigateTo('tenants')} className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${currentPage === 'tenants' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
              <Users className="mr-3 h-5 w-5" /> Tenants
            </button>
            <button onClick={() => navigateTo('vendors')} className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${currentPage === 'vendors' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
              <Wrench className="mr-3 h-5 w-5" /> Vendors
            </button>
          </nav>
        </div>
        <div className="p-4 border-t border-slate-800">
          <button onClick={() => navigateTo('settings')} className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${currentPage === 'settings' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
            <Settings className="mr-3 h-5 w-5" /> Settings
          </button>
          <button onClick={() => navigateTo('login')} className="w-full flex items-center px-3 py-2 mt-1 text-sm font-medium rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">
            <LogOut className="mr-3 h-5 w-5" /> Sign out
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 z-10 shadow-sm">
          <div className="flex items-center flex-1">
            <div className="relative w-full max-w-md hidden sm:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors" placeholder="Search work orders, tenants, properties..." />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              <Zap className="h-4 w-4 mr-1.5" /> Demo Mode
            </div>
            <button className="relative p-2 text-gray-400 hover:text-gray-500">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              JD
            </div>
          </div>
        </header>

        {/* DYNAMIC VIEW CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          
          {/* --- DASHBOARD VIEW --- */}
          {currentPage === 'dashboard' && (
            <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">AI Maintenance Dashboard</h1>
                <p className="text-gray-500 mt-1">Overview of autonomous operations and system health.</p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {KPI_DATA.map((kpi, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-slate-500">{kpi.label}</p>
                        <p className="text-3xl font-bold text-slate-900 mt-1">{kpi.value}</p>
                      </div>
                      <div className={`p-2 rounded-lg ${kpi.label === 'Emergencies' ? 'bg-red-50' : 'bg-indigo-50'}`}>
                        <kpi.icon className={`h-5 w-5 ${kpi.label === 'Emergencies' ? 'text-red-600' : 'text-indigo-600'}`} />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <span className={`font-medium ${kpi.type === 'positive' ? 'text-emerald-600' : kpi.type === 'negative' ? 'text-red-600' : 'text-slate-600'}`}>
                        {kpi.trend}
                      </span>
                      <span className="text-slate-500 ml-2">vs last month</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent AI Activity Feed */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm lg:col-span-2 overflow-hidden flex flex-col">
                  <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
                    <h2 className="text-lg font-semibold text-slate-900 flex items-center">
                      <Bot className="h-5 w-5 mr-2 text-indigo-500" />
                      Live AI Decisions
                    </h2>
                    <button onClick={() => navigateTo('work-orders')} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View all</button>
                  </div>
                  <div className="divide-y divide-slate-100 flex-1">
                    {MOCK_WORK_ORDERS.map((wo) => (
                      <div key={wo.id} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigateTo('work-order-detail', wo.id)}>
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-semibold text-slate-900 text-sm flex items-center">
                            #{wo.id} - {wo.title}
                          </span>
                          <Badge type={wo.status}>{wo.status}</Badge>
                        </div>
                        <p className="text-sm text-slate-500 mb-2">{wo.address} • {wo.tenant}</p>
                        <div className="bg-indigo-50/50 rounded-lg p-3 border border-indigo-100/50">
                          <p className="text-sm text-indigo-900 flex items-start">
                            <Zap className="h-4 w-4 mr-2 text-indigo-500 flex-shrink-0 mt-0.5" />
                            <span className="font-medium">AI Action: </span> <span className="ml-1 opacity-90">{wo.aiAction}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Automation Impact */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
                  <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900">Automation Impact</h2>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-center space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-slate-600 font-medium">Tenant Inquiries Handled</span>
                        <span className="text-slate-900 font-bold">100%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-indigo-500 h-2 rounded-full w-full"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-slate-600 font-medium">Auto-Deflected (No vendor)</span>
                        <span className="text-slate-900 font-bold">42%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full w-[42%]"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-slate-600 font-medium">Auto-Dispatched</span>
                        <span className="text-slate-900 font-bold">38%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full w-[38%]"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-slate-600 font-medium">Required Human Approval</span>
                        <span className="text-slate-900 font-bold">20%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-amber-500 h-2 rounded-full w-[20%]"></div>
                      </div>
                    </div>
                    <div className="mt-4 bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <p className="text-xs text-slate-500 text-center uppercase tracking-wider font-semibold mb-1">Estimated Savings This Month</p>
                      <p className="text-2xl text-center font-bold text-emerald-600">$4,250</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- WORK ORDERS LIST VIEW --- */}
          {currentPage === 'work-orders' && (
            <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Work Orders</h1>
                  <p className="text-gray-500 mt-1">Manage and review all maintenance requests.</p>
                </div>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm">
                  Create Work Order
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ID / Title</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Property</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {MOCK_WORK_ORDERS.map((wo) => (
                        <tr key={wo.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigateTo('work-order-detail', wo.id)}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="ml-0">
                                <div className="text-sm font-medium text-slate-900">#{wo.id} - {wo.title}</div>
                                <div className="text-sm text-slate-500">{wo.category} • {wo.date}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-900">{wo.address}</div>
                            <div className="text-sm text-slate-500">{wo.tenant}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge type={wo.priority}>{wo.priority}</Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge type={wo.status}>{wo.status}</Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <span className="text-indigo-600 hover:text-indigo-900 flex justify-end items-center">
                              Review <ChevronRight className="h-4 w-4 ml-1" />
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* --- WORK ORDER DETAIL VIEW --- */}
          {currentPage === 'work-order-detail' && activeWO && (
            <div className="max-w-6xl mx-auto animate-in fade-in duration-300 flex flex-col h-[calc(100vh-8rem)]">
              {/* Top Navigation */}
              <button 
                onClick={() => navigateTo('work-orders')}
                className="flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-4 w-fit transition-colors"
              >
                <ArrowRight className="h-4 w-4 mr-1 rotate-180" /> Back to Work Orders
              </button>

              {/* Header */}
              <div className="bg-white rounded-t-xl border border-slate-200 shadow-sm p-6 flex-shrink-0 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        #{MOCK_WORK_ORDERS.find(w => w.id === activeWO).id} - {MOCK_WORK_ORDERS.find(w => w.id === activeWO).title}
                      </h1>
                      <Badge type={MOCK_WORK_ORDERS.find(w => w.id === activeWO).priority}>
                        {MOCK_WORK_ORDERS.find(w => w.id === activeWO).priority}
                      </Badge>
                      <Badge type={MOCK_WORK_ORDERS.find(w => w.id === activeWO).status}>
                        {MOCK_WORK_ORDERS.find(w => w.id === activeWO).status}
                      </Badge>
                    </div>
                    <p className="text-slate-500 text-sm flex items-center">
                      <Building className="h-4 w-4 mr-1.5" /> {MOCK_WORK_ORDERS.find(w => w.id === activeWO).address} 
                      <span className="mx-2">•</span> 
                      <Users className="h-4 w-4 mr-1.5" /> {MOCK_WORK_ORDERS.find(w => w.id === activeWO).tenant}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Estimated Cost</p>
                    <p className="text-xl font-bold text-slate-900">{MOCK_WORK_ORDERS.find(w => w.id === activeWO).cost}</p>
                  </div>
                </div>
              </div>

              {/* Split Content Area */}
              <div className="flex-1 flex flex-col lg:flex-row min-h-0 bg-white border-x border-b border-slate-200 rounded-b-xl shadow-sm overflow-hidden">
                
                {/* Left: Chat Log */}
                <div className="w-full lg:w-3/5 border-r border-slate-200 flex flex-col bg-slate-50/30">
                  <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center shadow-sm z-10">
                    <h3 className="font-semibold text-slate-900 flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2 text-slate-400" />
                      Interaction Log
                    </h3>
                    <button 
                      onClick={handleSummarize}
                      disabled={isSummarizing}
                      className="text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg flex items-center transition-colors disabled:opacity-50"
                    >
                      {isSummarizing ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : "✨ "}
                      Summarize Context
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {aiSummary && (
                      <div className="mb-4 bg-indigo-50 border border-indigo-100 rounded-lg p-4 text-sm text-indigo-900 flex items-start animate-in fade-in zoom-in duration-300">
                        <Wand2 className="h-5 w-5 mr-3 text-indigo-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold mb-1 text-indigo-800">✨ AI Summary</p>
                          <p className="opacity-90 leading-relaxed">{aiSummary}</p>
                        </div>
                      </div>
                    )}
                    {WO_DETAILS[activeWO]?.logs.map((log, idx) => (
                      <div key={idx} className={`flex ${log.sender === 'ai' ? 'justify-start' : 'justify-end'}`}>
                        {log.sender === 'ai' && (
                          <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 mr-3 mt-1 shadow-sm">
                            <Bot className="h-4 w-4 text-white" />
                          </div>
                        )}
                        <div className={`max-w-[80%] ${log.sender === 'ai' ? 'order-2' : 'order-1'}`}>
                          <div className="flex items-baseline mb-1">
                            <span className={`text-xs font-semibold ${log.sender === 'ai' ? 'text-indigo-600' : 'text-slate-600'} ml-1`}>
                              {log.sender === 'ai' ? 'MaintainAI' : 'Tenant'}
                            </span>
                            <span className="text-[10px] text-slate-400 ml-2">{log.time}</span>
                          </div>
                          <div className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                            log.sender === 'ai' 
                              ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm' 
                              : 'bg-indigo-600 text-white rounded-tr-sm'
                          }`}>
                            {log.text}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-white border-t border-slate-200">
                    {!isHumanOverride ? (
                      <div className="bg-slate-100 text-slate-500 text-sm p-3 rounded-lg text-center flex items-center justify-center">
                        <LockIcon className="h-4 w-4 mr-2" /> Chat is managed by AI. Human override available.
                      </div>
                    ) : (
                      <div className="space-y-3 animate-in slide-in-from-bottom-2 duration-300">
                        <textarea 
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                          placeholder="Type your message to the tenant..."
                          rows="3"
                        ></textarea>
                        <div className="flex justify-between items-center">
                          <button 
                            onClick={handleDraftReply}
                            disabled={isDrafting}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center disabled:opacity-50 transition-colors"
                          >
                            {isDrafting ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : "✨ "}
                            Auto-Draft Reply
                          </button>
                          <div className="space-x-2">
                            <button onClick={() => setIsHumanOverride(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                            <button onClick={() => { setChatInput(''); setIsHumanOverride(false); }} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors">Send</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: AI Analysis & Engine Output */}
                <div className="w-full lg:w-2/5 flex flex-col bg-white">
                  <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center shadow-sm z-10">
                    <h3 className="font-semibold text-slate-900 flex items-center">
                      <BrainCircuit className="h-5 w-5 mr-2 text-indigo-500" />
                      AI Logic & Analysis
                    </h3>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                      
                      {/* Analysis Block */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Triage Engine Output</h4>
                        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-4">
                          {Object.entries(WO_DETAILS[activeWO]?.analysis || {}).map(([key, value]) => (
                            <div key={key}>
                              <p className="text-xs text-slate-500 capitalize">{key}</p>
                              <p className={`text-sm font-medium mt-0.5 ${
                                key === 'resolution' ? 'text-indigo-700' : 
                                value.includes('EMERGENCY') ? 'text-red-600' : 'text-slate-900'
                              }`}>{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Decision Trace */}
                      <div>
                         <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Decision Trace</h4>
                         <div className="relative pl-4 border-l-2 border-indigo-100 space-y-4">
                            <div className="relative">
                              <span className="absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 border-indigo-500 bg-white"></span>
                              <p className="text-sm font-medium text-slate-800">Intake Complete</p>
                              <p className="text-xs text-slate-500">Collected issue details and media.</p>
                            </div>
                            <div className="relative">
                              <span className="absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 border-indigo-500 bg-white"></span>
                              <p className="text-sm font-medium text-slate-800">Lease Rules Checked</p>
                              <p className="text-xs text-slate-500">Cross-referenced sec 4.2 of specific tenant lease.</p>
                            </div>
                            <div className="relative">
                              <span className="absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 border-indigo-500 bg-white"></span>
                              <p className="text-sm font-medium text-slate-800">Action Executed</p>
                              <p className="text-xs text-indigo-600 font-medium mt-0.5">{WO_DETAILS[activeWO]?.analysis.resolution}</p>
                            </div>
                         </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="pt-4 border-t border-slate-100">
                        {vendorBrief && (
                          <div className="mb-4 bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-800 animate-in fade-in zoom-in duration-300">
                            <p className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-2 flex items-center">
                              <Wand2 className="h-3 w-3 mr-1" /> Generated Brief
                            </p>
                            <p className="leading-relaxed">{vendorBrief}</p>
                          </div>
                        )}
                        <button 
                          onClick={() => setIsHumanOverride(true)}
                          className="w-full bg-white border border-slate-300 text-slate-700 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors mb-2 shadow-sm"
                        >
                          Take Over Chat
                        </button>
                        <button 
                          onClick={handleVendorBrief}
                          disabled={isVendorBriefing}
                          className="w-full bg-indigo-50 text-indigo-700 border border-indigo-100 py-2 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors mb-2 flex items-center justify-center disabled:opacity-50"
                        >
                          {isVendorBriefing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : "✨ "}
                          Generate Vendor Brief
                        </button>
                        <button className="w-full bg-white text-slate-600 border border-slate-200 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                          View Technical Logs
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- PROPERTIES VIEW --- */}
          {currentPage === 'properties' && (
            <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Properties</h1>
                  <p className="text-gray-500 mt-1">Manage your portfolio and AI coverage status.</p>
                </div>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm">
                  Add Property
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Property Name</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Details</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Occupancy</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Coverage</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {MOCK_PROPERTIES.map((prop) => (
                      <tr key={prop.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-slate-900">{prop.name}</div>
                          <div className="text-sm text-slate-500">{prop.address}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-900">{prop.type}</div>
                          <div className="text-sm text-slate-500">{prop.units} Units</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${prop.occupancy === '100%' ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {prop.occupancy}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {prop.aiCoverage === 'Active' ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-1.5" />
                            ) : (
                              <Bot className="h-4 w-4 text-amber-500 mr-1.5" />
                            )}
                            <span className="text-sm text-slate-700">{prop.aiCoverage}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-indigo-600 hover:text-indigo-900">Manage</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --- TENANTS VIEW --- */}
          {currentPage === 'tenants' && (
            <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Tenants</h1>
                  <p className="text-gray-500 mt-1">Tenant directory and communication history.</p>
                </div>
                <button className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 shadow-sm">
                  Export Roster
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tenant Name</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Property / Unit</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Last AI Contact</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {MOCK_TENANTS.map((tenant) => (
                      <tr key={tenant.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs mr-3">
                              {tenant.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="text-sm font-medium text-slate-900">{tenant.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-900">{tenant.property}</div>
                          <div className="text-xs text-slate-500">Lease Ends: {tenant.leaseEnd}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge type={tenant.status === 'Active' ? 'Low' : 'High'}>{tenant.status}</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {tenant.lastContact}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50"><Mail className="h-4 w-4" /></button>
                            <button className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50"><Phone className="h-4 w-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --- VENDORS VIEW --- */}
          {currentPage === 'vendors' && (
            <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Vendor Network</h1>
                  <p className="text-gray-500 mt-1">Manage contractors and AI dispatch eligibility.</p>
                </div>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm">
                  Invite Vendor
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Vendor Info</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Trade & Rate</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Dispatch Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Performance</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Settings</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {MOCK_VENDORS.map((vendor) => (
                      <tr key={vendor.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-slate-900">{vendor.name}</div>
                          <div className="text-xs text-slate-500 flex items-center mt-0.5">
                            {vendor.rating} <Star className="h-3 w-3 text-amber-400 ml-1 fill-current" />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge type="default">{vendor.trade}</Badge>
                          <div className="text-sm text-slate-500 mt-1">{vendor.rate}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {vendor.aiDispatch ? (
                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                               <Bot className="h-3 w-3 mr-1" /> Eligible
                             </span>
                          ) : (
                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                               Manual Only
                             </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          SLA Met: <span className="font-semibold">{vendor.sla}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                           <button className="text-indigo-600 hover:text-indigo-900"><Settings className="h-4 w-4 ml-auto" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --- SETTINGS VIEW --- */}
          {currentPage === 'settings' && (
            <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Settings</h1>
                <p className="text-gray-500 mt-1">Configure AI autonomy, rules, and escalation paths.</p>
              </div>

              {/* Autonomy Level */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                    <BrainCircuit className="h-5 w-5 mr-2 text-indigo-600" /> AI Autonomy Level
                  </h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between p-4 border border-indigo-100 bg-indigo-50/30 rounded-lg">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">Full Autonomous Triage & Dispatch</h4>
                      <p className="text-xs text-slate-500 mt-1">AI will diagnose issues, enforce lease terms, and dispatch vendors without human approval up to your defined cost limits.</p>
                    </div>
                    <ToggleRight className="h-8 w-8 text-indigo-600" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Max Auto-Approval Limit ($)</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-slate-500 sm:text-sm">$</span>
                        </div>
                        <input type="text" defaultValue="350.00" className="block w-full pl-7 pr-12 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                      </div>
                      <p className="text-xs text-slate-500 mt-1.5">Estimates above this require your manual approval.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Emergency SLA Timeout (Mins)</label>
                      <input type="number" defaultValue="15" className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                      <p className="text-xs text-slate-500 mt-1.5">If unassigned vendor doesn't respond, escalate to PM.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vendor Logic */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                    <Wrench className="h-5 w-5 mr-2 text-slate-600" /> Vendor Selection Logic
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-slate-900">Prefer Highest Rated</h4>
                        <p className="text-xs text-slate-500">AI dispatches the top-rated eligible vendor first.</p>
                      </div>
                      <input type="radio" name="vendor_logic" defaultChecked className="h-4 w-4 text-indigo-600 border-slate-300" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-slate-900">Prefer Lowest Hourly Rate</h4>
                        <p className="text-xs text-slate-500">AI dispatches the cheapest eligible vendor first.</p>
                      </div>
                      <input type="radio" name="vendor_logic" className="h-4 w-4 text-indigo-600 border-slate-300" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-slate-900">Round Robin (Fair Distribution)</h4>
                        <p className="text-xs text-slate-500">Evenly distribute work orders among eligible vendors.</p>
                      </div>
                      <input type="radio" name="vendor_logic" className="h-4 w-4 text-indigo-600 border-slate-300" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Escalation Paths */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-red-500" /> Emergency Escalation Paths
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Primary On-Call Contact</label>
                    <input type="text" defaultValue="Sarah Jenkins (Property Manager)" className="block w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600 sm:text-sm" disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Escalation Methods (Select multiple)</label>
                    <div className="flex space-x-4 mt-2">
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="h-4 w-4 text-indigo-600 border-slate-300 rounded" />
                        <span className="ml-2 text-sm text-slate-700">SMS Notification</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="h-4 w-4 text-indigo-600 border-slate-300 rounded" />
                        <span className="ml-2 text-sm text-slate-700">Automated Phone Call</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="h-4 w-4 text-indigo-600 border-slate-300 rounded" />
                        <span className="ml-2 text-sm text-slate-700">Email Alerts</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm">
                    Save Configuration
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

// Helper icon component since Lucide Lock wasn't imported at top to save space
function LockIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  );
}