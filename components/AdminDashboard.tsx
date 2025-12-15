import React, { useState, useEffect } from 'react';
import { getPendingSites, getAllSites, updateStatus, deleteRecord } from '../services/storageService';
import { SiteRecord } from '../types';
import { Check, X, Trash2, ExternalLink, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
  const [sites, setSites] = useState<SiteRecord[]>([]);

  const refreshData = () => {
    if (activeTab === 'pending') {
      setSites(getPendingSites());
    } else {
      setSites(getAllSites());
    }
  };

  useEffect(() => {
    refreshData();
  }, [activeTab]);

  const handleApprove = (domain: string) => {
    updateStatus(domain, 'APPROVED');
    refreshData();
  };

  const handleReject = (domain: string) => {
    updateStatus(domain, 'REJECTED');
    refreshData();
  };
  
  const handleDelete = (domain: string) => {
    if (confirm(`Are you sure you want to delete ${domain}?`)) {
      deleteRecord(domain);
      refreshData();
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500 mt-1">Manage website approvals and moderation.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setActiveTab('pending')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'pending' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200'}`}
            >
                Pending Review
            </button>
            <button 
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'all' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200'}`}
            >
                All Sites
            </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {sites.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <ShieldAlert className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p className="text-lg">No sites found in this view.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Domain</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Category</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Risk Level</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Date Added</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sites.map((site) => (
                  <tr key={site.domain} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{site.domain}</div>
                      <Link to={`/p/${site.domain}`} className="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-1">
                        View Report <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium border border-slate-200">
                        {site.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        site.riskLevel === 'Safe' ? 'bg-green-100 text-green-800' :
                        site.riskLevel === 'Caution' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {site.riskLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(site.timestamp).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${
                            site.status === 'APPROVED' ? 'bg-blue-50 text-blue-700' :
                            site.status === 'REJECTED' ? 'bg-red-50 text-red-700' :
                            'bg-orange-50 text-orange-700'
                        }`}>
                            {site.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {site.status === 'PENDING' && (
                            <>
                                <button 
                                onClick={() => handleApprove(site.domain)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Approve"
                                >
                                <Check className="w-4 h-4" />
                                </button>
                                <button 
                                onClick={() => handleReject(site.domain)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Reject"
                                >
                                <X className="w-4 h-4" />
                                </button>
                            </>
                        )}
                        {(site.status === 'APPROVED' || site.status === 'REJECTED') && (
                            <button 
                              onClick={() => handleDelete(site.domain)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;