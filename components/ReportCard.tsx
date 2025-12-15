import React from 'react';
import { AnalysisResult, RiskLevel } from '../types';
import SafetyGauge from './SafetyGauge';
import { CheckCircle2, AlertTriangle, XCircle, Globe, Server, Activity, Shield } from 'lucide-react';

interface ReportCardProps {
  data: AnalysisResult;
}

const ReportCard: React.FC<ReportCardProps> = ({ data }) => {
  
  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.SAFE:
        return (
          <div className="flex items-center gap-2 px-4 py-1.5 bg-green-100 text-green-700 rounded-full font-semibold text-sm">
            <CheckCircle2 className="w-4 h-4" /> Safe
          </div>
        );
      case RiskLevel.CAUTION:
        return (
          <div className="flex items-center gap-2 px-4 py-1.5 bg-yellow-100 text-yellow-700 rounded-full font-semibold text-sm">
            <AlertTriangle className="w-4 h-4" /> Caution
          </div>
        );
      case RiskLevel.HIGH_RISK:
        return (
          <div className="flex items-center gap-2 px-4 py-1.5 bg-red-100 text-red-700 rounded-full font-semibold text-sm">
            <XCircle className="w-4 h-4" /> High Risk
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full font-semibold text-sm">
            <AlertTriangle className="w-4 h-4" /> Unknown
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-shrink-0">
          <SafetyGauge score={data.safetyScore} riskLevel={data.riskLevel} />
        </div>
        <div className="flex-grow space-y-4 text-center md:text-left">
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
              <h1 className="text-3xl font-bold text-slate-900">{data.domain}</h1>
              {getRiskBadge(data.riskLevel)}
            </div>
            <p className="text-slate-500 font-medium">{data.category}</p>
          </div>
          <p className="text-slate-600 leading-relaxed max-w-2xl">
            {data.summary}
          </p>
          <div className="flex items-center justify-center md:justify-start gap-6 pt-2 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>{data.serverLocation || 'Global'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4" />
              <span>{data.popularity || 'Moderate Traffic'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Pros & Cons */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-full">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" /> Analysis Highlights
          </h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-green-700 mb-2 uppercase tracking-wide">Positives</h4>
              <ul className="space-y-2">
                {data.pros.map((pro, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-600 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-red-700 mb-2 uppercase tracking-wide">Concerns</h4>
              <ul className="space-y-2">
                {data.cons.length > 0 ? (
                  data.cons.map((con, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-600 text-sm">
                      <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      {con}
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500 text-sm italic">No major concerns detected.</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Security Checklist */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-full">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" /> Security Checklist
          </h3>
          <div className="space-y-4">
            {data.securityChecklist.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className={`mt-0.5 p-1 rounded-full ${item.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                  {item.status === 'Active' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800 text-sm">{item.feature}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      item.status === 'Active' 
                        ? 'bg-green-50 text-green-700' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{item.description}</p>
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