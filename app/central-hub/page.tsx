'use client'
import React, { useState, useEffect } from 'react';
import { AlertCircle, Lock, CheckCircle, Clock, Menu, X, ArrowRight, ChevronRight, RefreshCw, Plus, Search, Filter, Download } from 'lucide-react';
interface  Companies {
    id: number;
    name: string;
    arr: number;
    cash: number;
    burn: number;
    runway: number;
    status: string;
    industry: string;
    stage: string;
}[]
const MuseDataRoadmap = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dataConnected, setDataConnected] = useState(false);
  const [assumptionsReviewed, setAssumptionsReviewed] = useState(false);
  const [evidenceGenerated, setEvidenceGenerated] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<null | Companies>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Companies database
  const [companies, setCompanies] = useState([
    { 
      id: 1, 
      name: 'TechFlow Inc', 
      arr: 5100000, 
      cash: 4200000, 
      burn: 280000, 
      runway: 14,
      status: 'active',
      industry: 'SaaS',
      stage: 'Series A'
    },
    { 
      id: 2, 
      name: 'DataCore Systems', 
      arr: 3800000, 
      cash: 2100000, 
      burn: 195000, 
      runway: 11,
      status: 'active',
      industry: 'Enterprise',
      stage: 'Seed'
    },
    { 
      id: 3, 
      name: 'CloudNine Platform', 
      arr: 7200000, 
      cash: 8500000, 
      burn: 420000, 
      runway: 20,
      status: 'active',
      industry: 'Cloud Infrastructure',
      stage: 'Series B'
    },
    { 
      id: 4, 
      name: 'AI Insights Co', 
      arr: 4500000, 
      cash: 3100000, 
      burn: 310000, 
      runway: 10,
      status: 'active',
      industry: 'AI/ML',
      stage: 'Series A'
    }
  ]);

  // Live data states
  const [currentTime, setCurrentTime] = useState(new Date());

  // Form states for new company
  const [newCompany, setNewCompany] = useState({
    name: '',
    arr: '',
    cash: '',
    burn: '',
    industry: '',
    stage: ''
  });

  // Simulate live data updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCurrency = (value: any) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setCurrentView('landing');
    setDataConnected(false);
    setAssumptionsReviewed(false);
    setEvidenceGenerated(false);
    setActiveTab('overview');
    setSelectedCompany(null);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentView('command-center');
    setSelectedCompany(companies[0]); // Default to first company
  };

  const handleAddCompany = () => {
    if (newCompany.name && newCompany.arr && newCompany.cash && newCompany.burn) {
      const company = {
        id: companies.length + 1,
        name: newCompany.name,
        arr: parseFloat(newCompany.arr),
        cash: parseFloat(newCompany.cash),
        burn: parseFloat(newCompany.burn),
        runway: Math.floor(parseFloat(newCompany.cash) / parseFloat(newCompany.burn)),
        status: 'active',
        industry: newCompany.industry || 'Not specified',
        stage: newCompany.stage || 'Not specified'
      };
      setCompanies([...companies, company]);
      setNewCompany({ name: '', arr: '', cash: '', burn: '', industry: '', stage: '' });
      setShowAddCompany(false);
    }
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const LandingPage = () => (
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
           
           
            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="py-20" style={{ background: 'linear-gradient(to bottom right, #2c5f7a, #1e3a4a, #5a8ca5)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block px-4 py-1 rounded-full text-sm font-semibold mb-6 text-white" style={{ backgroundColor: '#5a8ca5' }}>
              Global Focus
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Institutional-Grade Finance Infrastructure for VC-Backed Software Companies
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Generate reports for any company in your portfolio with one click.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={handleLogin} className="px-8 py-4 rounded-lg text-lg font-semibold flex items-center justify-center gap-2 text-white hover:opacity-90" style={{ backgroundColor: '#2c5f7a' }}>
                Access Dashboard <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const CommandCenter = () => (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-full px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              
              <div className="hidden md:flex items-center gap-6">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`px-3 py-2 rounded-lg transition font-medium ${
                    activeTab === 'overview' ? 'text-white' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  style={activeTab === 'overview' ? { backgroundColor: '#2c5f7a' } : {}}
                >
                  Overview
                </button>
                <button 
                  onClick={() => setActiveTab('companies')}
                  className={`px-3 py-2 rounded-lg transition font-medium ${
                    activeTab === 'companies' ? 'text-white' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  style={activeTab === 'companies' ? { backgroundColor: '#2c5f7a' } : {}}
                >
                  Companies
                </button>
                <button 
                  onClick={() => setActiveTab('reports')}
                  className={`px-3 py-2 rounded-lg transition font-medium ${
                    activeTab === 'reports' ? 'text-white' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  style={activeTab === 'reports' ? { backgroundColor: '#2c5f7a' } : {}}
                >
                  Generate Reports
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 hidden md:block">
                {currentTime.toLocaleTimeString()}
              </div>
              <button 
                onClick={handleSignOut}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-full px-6 py-6">
        {activeTab === 'overview' && selectedCompany && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2" style={{ color: '#1e3a4a' }}>{selectedCompany.name}</h2>
                <p className="text-gray-600">{selectedCompany.industry} • {selectedCompany.stage}</p>
              </div>
              <button 
                onClick={() => setActiveTab('companies')}
                className="px-4 py-2 rounded-lg text-white hover:opacity-90"
                style={{ backgroundColor: '#2c5f7a' }}
              >
                Switch Company
              </button>
            </div>

            {/* Live Metrics Dashboard */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold" style={{ color: '#1e3a4a' }}>Live Financial Metrics</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Real-time data</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition" style={{ borderColor: '#2c5f7a' }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#2c5f7a20' }}>
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#2c5f7a' }}></div>
                    </div>
                    <span className="text-sm font-medium text-green-600">+5.2%</span>
                  </div>
                  <h3 className="text-sm text-gray-600 mb-1">Cash Position</h3>
                  <p className="text-2xl font-bold" style={{ color: '#1e3a4a' }}>{formatCurrency(selectedCompany.cash)}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition" style={{ borderColor: '#3d6d84' }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#3d6d8420' }}>
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#3d6d84' }}></div>
                    </div>
                    <span className="text-sm font-medium text-green-600">Healthy</span>
                  </div>
                  <h3 className="text-sm text-gray-600 mb-1">Runway</h3>
                  <p className="text-2xl font-bold" style={{ color: '#1e3a4a' }}>{selectedCompany.runway} months</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition" style={{ borderColor: '#5a8ca5' }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#5a8ca520' }}>
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#5a8ca5' }}></div>
                    </div>
                    <span className="text-sm font-medium text-green-600">+18%</span>
                  </div>
                  <h3 className="text-sm text-gray-600 mb-1">Annual ARR</h3>
                  <p className="text-2xl font-bold" style={{ color: '#1e3a4a' }}>{formatCurrency(selectedCompany.arr)}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition" style={{ borderColor: '#1e3a4a' }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#1e3a4a20' }}>
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#1e3a4a' }}></div>
                    </div>
                    <span className="text-sm font-medium text-red-600">-3%</span>
                  </div>
                  <h3 className="text-sm text-gray-600 mb-1">Monthly Burn</h3>
                  <p className="text-2xl font-bold" style={{ color: '#1e3a4a' }}>{formatCurrency(selectedCompany.burn)}</p>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'companies' && (
          <>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold" style={{ color: '#1e3a4a' }}>Portfolio Companies</h2>
                <button 
                  onClick={() => setShowAddCompany(true)}
                  className="px-4 py-2 rounded-lg text-white hover:opacity-90 flex items-center gap-2"
                  style={{ backgroundColor: '#2c5f7a' }}
                >
                  <Plus className="w-4 h-4" />
                  Add Company
                </button>
              </div>

              {/* Search and Filter */}
              <div className="mb-6 flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Companies Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCompanies.map((company) => (
                  <div 
                    key={company.id}
                    className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition cursor-pointer"
                    style={{ borderColor: selectedCompany?.id === company.id ? '#2c5f7a' : '#e5e7eb' }}
                    onClick={() => {
                      setSelectedCompany(company);
                      setActiveTab('overview');
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold" style={{ color: '#1e3a4a' }}>{company.name}</h3>
                      <span className="px-2 py-1 rounded text-xs font-medium text-white" style={{ backgroundColor: '#5a8ca5' }}>
                        {company.status}
                      </span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">{company.industry}</p>
                      <p className="text-sm text-gray-600">{company.stage}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500">ARR</p>
                        <p className="font-semibold" style={{ color: '#2c5f7a' }}>{formatCurrency(company.arr)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Runway</p>
                        <p className="font-semibold" style={{ color: '#2c5f7a' }}>{company.runway}mo</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Company Modal */}
            {showAddCompany && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
                  <h3 className="text-2xl font-bold mb-6" style={{ color: '#1e3a4a' }}>Add New Company</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={newCompany.name}
                      onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Annual ARR ($)"
                      value={newCompany.arr}
                      onChange={(e) => setNewCompany({...newCompany, arr: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Cash Position ($)"
                      value={newCompany.cash}
                      onChange={(e) => setNewCompany({...newCompany, cash: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Monthly Burn ($)"
                      value={newCompany.burn}
                      onChange={(e) => setNewCompany({...newCompany, burn: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Industry"
                      value={newCompany.industry}
                      onChange={(e) => setNewCompany({...newCompany, industry: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <select
                      value={newCompany.stage}
                      onChange={(e) => setNewCompany({...newCompany, stage: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Select Stage</option>
                      <option value="Pre-Seed">Pre-Seed</option>
                      <option value="Seed">Seed</option>
                      <option value="Series A">Series A</option>
                      <option value="Series B">Series B</option>
                      <option value="Series C+">Series C+</option>
                    </select>
                  </div>
                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => setShowAddCompany(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddCompany}
                      className="flex-1 px-4 py-2 rounded-lg text-white hover:opacity-90"
                      style={{ backgroundColor: '#2c5f7a' }}
                    >
                      Add Company
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'reports' && (
          <div>
            <h2 className="text-3xl font-bold mb-6" style={{ color: '#1e3a4a' }}>Generate Reports</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {companies.map((company) => (
                <div key={company.id} className="bg-white rounded-xl shadow-sm border p-6" style={{ borderColor: '#2c5f7a' }}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1" style={{ color: '#1e3a4a' }}>{company.name}</h3>
                      <p className="text-sm text-gray-600">{company.industry}</p>
                    </div>
                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#2c5f7a20' }}>
                      <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#2c5f7a' }}></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-6 py-4 border-y border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">ARR</p>
                      <p className="font-semibold text-sm">{formatCurrency(company.arr)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Cash</p>
                      <p className="font-semibold text-sm">{formatCurrency(company.cash)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Runway</p>
                      <p className="font-semibold text-sm">{company.runway}mo</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button className="w-full px-4 py-3 rounded-lg text-white hover:opacity-90 flex items-center justify-between" style={{ backgroundColor: '#2c5f7a' }}>
                      <span>Evidence Pack</span>
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="w-full px-4 py-3 rounded-lg text-white hover:opacity-90 flex items-center justify-between" style={{ backgroundColor: '#3d6d84' }}>
                      <span>Board Pack</span>
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="w-full px-4 py-3 rounded-lg text-white hover:opacity-90 flex items-center justify-between" style={{ backgroundColor: '#5a8ca5' }}>
                      <span>QoE Sprint Report</span>
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="w-full px-4 py-3 rounded-lg text-white hover:opacity-90 flex items-center justify-between" style={{ backgroundColor: '#1e3a4a' }}>
                      <span>Cash Forecast</span>
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (!isAuthenticated) return <LandingPage />;
  return <CommandCenter />;
};

export default MuseDataRoadmap;
