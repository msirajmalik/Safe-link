import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getApprovedSites } from '../services/storageService';
import { SiteRecord } from '../types';
import { ShieldCheck, Search, Globe, ArrowUpRight } from 'lucide-react';

const Directory: React.FC = () => {
  const [sites, setSites] = useState<SiteRecord[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setSites(getApprovedSites());
  }, []);

  const filteredSites = sites.filter(site => 
    site.domain.toLowerCase().includes(filter.toLowerCase()) || 
    site.category.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Safe Site Directory</h1>
        <p className="text-lg text-slate-500">
          Browse our index of verified, safe websites analyzed by AI and approved by our community moderators.
        </p>
      </div>

      <div className="relative max-w-md mx-auto mb-12">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          placeholder="Filter by domain or category..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {filteredSites.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
          <Globe className="w-12 h-12 mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">No safe sites found in the directory yet.</p>
          <Link to="/" className="inline-block mt-4 text-blue-600 font-medium hover:underline">
            Analyze a site to add it
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSites.map((site) => (
            <Link 
              key={site.domain} 
              to={`/p/${site.domain}`}
              className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-200 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={`https://www.google.com/s2/favicons?domain=${site.domain}&sz=64`}
                    alt=""
                    className="w-10 h-10 rounded-lg bg-slate-50 p-1"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {site.domain}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">{site.category}</p>
                  </div>
                </div>
                <div className="bg-green-50 text-green-700 p-1.5 rounded-lg">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>
              
              <p className="text-sm text-slate-600 line-clamp-2 mb-4 h-10">
                {site.summary}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                    <div className="w-full bg-slate-100 rounded-full h-1.5 w-16">
                        <div 
                            className="bg-green-500 h-1.5 rounded-full" 
                            style={{ width: `${site.safetyScore}%` }}
                        />
                    </div>
                    <span className="text-xs font-bold text-slate-700">{site.safetyScore}/100</span>
                </div>
                <span className="text-xs text-slate-400 flex items-center gap-1 group-hover:text-blue-500 transition-colors">
                    View Report <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Directory;