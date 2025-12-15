import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ReportCard from './components/ReportCard';
import AdminDashboard from './components/AdminDashboard';
import Directory from './components/Directory';
import { analyzeUrl } from './services/geminiService';
import { saveAnalysis, getRecord } from './services/storageService';
import { AnalysisResult } from './types';
import { Search, ArrowRight, Activity, Globe, Lock } from 'lucide-react';

// --- Page Components ---

const HomePage: React.FC = () => {
  const [url, setUrl] = useState('');
  const navigate = useNavigate();

  const handleAnalyze = () => {
    if (!url.trim()) return;
    let cleanUrl = url.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
    navigate(`/p/${encodeURIComponent(cleanUrl)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAnalyze();
  };

  return (
    <div className="py-32 transition-all duration-700 ease-in-out">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
          Is that link <span className="text-blue-600">safe?</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto">
          Analyze any website instantly with AI. Detect phishing, malware risks, and check reputation scores before you click.
        </p>

        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-32 py-4 md:py-5 bg-white border border-slate-200 rounded-2xl text-lg text-slate-900 shadow-lg shadow-slate-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-400"
            placeholder="example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleAnalyze}
            disabled={!url}
            className="absolute right-2 top-2 bottom-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl px-6 flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Analyze</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-4 animate-fade-in">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm text-sm font-medium text-slate-600">
            <Activity className="w-4 h-4 text-blue-500" />
            <span>Real-time Reputation</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm text-sm font-medium text-slate-600">
            <Lock className="w-4 h-4 text-green-500" />
            <span>SSL Verification</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm text-sm font-medium text-slate-600">
            <Globe className="w-4 h-4 text-purple-500" />
            <span>Global Threat Data</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportPage: React.FC = () => {
  const { domain } = useParams<{ domain: string }>();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!domain) return;
      
      setLoading(true);
      setError(null);
      
      // Check local storage first (optional cache) - for now we always re-analyze or check if approved record exists
      // But user wants fresh analysis. We will assume we analyze fresh, then save to DB.
      // Alternatively, if it exists in DB, we could show that, but usually security checks should be fresh.
      // Let's analyze fresh, and update the DB record.
      
      try {
        const cleanDomain = decodeURIComponent(domain);
        const data = await analyzeUrl(`https://${cleanDomain}`);
        
        // Save to Admin/Directory system
        saveAnalysis(data);
        
        setResult(data);
      } catch (err) {
        setError("Unable to analyze this URL. Please verify the address and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [domain]);

  if (loading) {
    return (
      <div className="py-32 text-center">
        <div className="inline-block w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6" />
        <h2 className="text-2xl font-bold text-slate-900">Analyzing {domain}...</h2>
        <p className="text-slate-500 mt-2">Running security scans and reputation checks.</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="py-20 text-center max-w-lg mx-auto px-4">
        <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
           <h3 className="text-red-700 font-bold text-lg mb-2">Analysis Failed</h3>
           <p className="text-red-600 mb-6">{error}</p>
           <a href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-red-200 text-red-700 font-medium rounded-xl hover:bg-red-50 transition-colors">
             Try Another URL
           </a>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4">
       <ReportCard data={result} />
    </div>
  );
};

// --- Main App Layout ---

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#f8fafc]">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/p/:domain" element={<ReportPage />} />
            <Route path="/directory" element={<Directory />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;