import React from 'react';
import { AnalysisResult, RiskLevel } from '../types';
import SafetyGauge from './SafetyGauge';
import { CheckCircle2, AlertTriangle, XCircle, Globe, Server, Activity, Shield, ExternalLink, Lock } from 'lucide-react';

interface ReportCardProps {
  data: AnalysisResult;
}

const ReportCard: React.FC<ReportCardProps> = ({ data }) => {
  
  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.SAFE:
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-lg border border-green-100 font-semibold text-sm">
            <CheckCircle2 className="w-4 h-4" /> Safe
          </div>
        );
      case RiskLevel.CAUTION:
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-100 font-semibold text-sm">
            <AlertTriangle className="w-4 h-4" /> Caution
          </div>
        );
      case RiskLevel.HIGH_RISK:
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-50 text-red-700 rounded-lg border border-red-100 font-semibold text-sm">
            <XCircle className="w-4 h-4" /> High Risk
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 text-gray-700 rounded-lg border border-gray-100 font-semibold text-sm">
            <AlertTriangle className="w-4 h-4" /> Unknown
          </div>
        );
    }
  };

  const getStatusColor = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.SAFE: return 'bg-green-500';
      case RiskLevel.CAUTION: return 'bg-yellow-500';
      case RiskLevel.HIGH_RISK: return 'bg-red-500';
      default: return 'bg-slate-300';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in-up pb-12">
      
      {/* Main Analysis Card */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200/60 mb-8">
        {/* Status Top Bar */}
        <div className={`h-2 w-full ${getStatusColor(data.riskLevel)}`} />
        
        <div className="p-6 md:p-8 lg:p-10">
          <div className="flex flex-col lg:flex-row gap-10">
            
            {/* Left Column: Preview & Actions */}
            <div className="w-full lg:w-5/12 flex flex-col gap-6">
              {/* Site Screenshot */}
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-md border border-slate-100 bg-slate-50 group">
                <img
                  src={`https://image.thum.io/get/width/800/crop/600/https://${data.domain}`}
                  alt={`${data.domain} preview`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://placehold.co/600x400/f1f5f9/94a3b8?text=${data.domain}`;
                  }}
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl pointer-events-none" />
              </div>

              {/* Action Button */}
              <a
                href={`https://${data.domain}`}
                target="_blank"
                rel="noreferrer"
                className={`flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-lg transition-all transform active:scale-[0.98] ${
                  data.riskLevel === RiskLevel.HIGH_RISK
                    ? 'bg-slate-100 text-slate-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200'
                }`}
                onClick={(e) => {
                   if (data.riskLevel === RiskLevel.HIGH_RISK && !confirm("This site is marked as High Risk. Are you sure you want to proceed?")) {
                     e.preventDefault();
                   }
                }}
              >
                <span>Visit Website</span>
                <ExternalLink className="w-5 h-5" />
              </a>
              
              {data.riskLevel === RiskLevel.HIGH_RISK && (
                <p className="text-xs text-center text-red-500 font-medium bg-red-50 py-2 rounded-lg">
                  Proceed with caution. This site has been flagged.
                </p>
              )}
            </div>

            {/* Right Column: Info & Score */}
            <div className="w-full lg:w-7/12 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div>
                   <div className="flex items-center gap-3 mb-3">
                      <img 
                        src={`https://www.google.com/s2/favicons?domain=${data.domain}&sz=64`}
                        alt="favicon"
                        className="w-8 h-8 rounded-lg"
                      />
                      <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{data.domain}</h1>
                   </div>
                   <div className="flex flex-wrap items-center gap-3">
                      {getRiskBadge(data.riskLevel)}
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium border border-slate-200">
                        {data.category}
                      </span>
                   </div>
                </div>
                <div className="hidden sm:block transform scale-90 origin-top-right">
                   <SafetyGauge score={data.safetyScore} riskLevel={data.riskLevel} />
                </div>
              </div>

              <div className="prose prose-slate max-w-none mb-8">
                <p className="text-slate-600 text-lg leading-relaxed">
                  {data.summary}
                </p>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-2 gap-4 mt-auto">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 mb-1 text-sm font-medium">
                    <Globe className="w-4 h-4" /> Server Location
                  </div>
                  <div className="text-slate-900 font-semibold truncate">
                    {data.serverLocation || 'Unknown'}
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 mb-1 text-sm font-medium">
                    <Server className="w-4 h-4" /> Popularity
                  </div>
                  <div className="text-slate-900 font-semibold truncate">
                    {data.popularity || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Pros & Cons */}
        <div className="bg-white rounded-3xl shadow-lg border border-slate-200/60 p-6 md:p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-600" /> 
            Safety Highlights
          </h3>
          <div className="space-y-8">
            <div>
              <h4 className="flex items-center gap-2 text-sm font-bold text-green-700 mb-3 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-green-500" /> Positive Signals
              </h4>
              <ul className="space-y-3">
                {data.pros.map((pro, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-600 bg-green-50/50 p-3 rounded-xl border border-green-100/50">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-medium">{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="flex items-center gap-2 text-sm font-bold text-red-700 mb-3 uppercase tracking-wider">
                 <span className="w-2 h-2 rounded-full bg-red-500" /> Risk Factors
              </h4>
              <ul className="space-y-3">
                {data.cons.length > 0 ? (
                  data.cons.map((con, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-600 bg-red-50/50 p-3 rounded-xl border border-red-100/50">
                      <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm font-medium">{con}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500 text-sm italic p-3 bg-slate-50 rounded-xl text-center">
                    No major concerns detected.
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Security Checklist */}
        <div className="bg-white rounded-3xl shadow-lg border border-slate-200/60 p-6 md:p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" /> 
            Security Audit
          </h3>
          <div className="space-y-4">
            {data.securityChecklist.map((item, idx) => (
              <div key={idx} className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all border border-slate-100 hover:border-slate-200">
                <div className={`mt-1 p-2 rounded-xl transition-colors ${
                  item.status === 'Active' ? 'bg-green-100 text-green-600 group-hover:bg-green-200' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                }`}>
                  {item.status === 'Active' ? <Lock className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800">{item.feature}</span>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full ${
                      item.status === 'Active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 leading-snug">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;