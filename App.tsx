import React, { useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ReportCard from './components/ReportCard';
import { analyzeUrl } from './services/geminiService';
import { AnalysisResult } from './types';
import { Search, ArrowRight, Activity, Globe, Lock } from 'lucide-react';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!url.trim()) return;
    
    // Basic validation
    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http')) {
      cleanUrl = 'https://' + cleanUrl;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeUrl(cleanUrl);
      setResult(data);
    } catch (err: any) {
      setError("Unable to analyze this URL. Please verify the address and try again.");
    } finally {
      setLoading(false);
    }
  }, [url]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className={`transition-all duration-700 ease-in-out ${result ? 'py-12' : 'py-32'}`}>
          <div className="max-w-4xl mx-auto px-4 text-center">
            {!result && (
              <>
                <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
                  Is that link <span className="text-blue-600">safe?</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto">
                  Analyze any website instantly with AI. Detect phishing, malware risks, and check reputation scores before you click.
                </p>
              </>
            )}

            <div className={`relative max-w-2xl mx-auto transform transition-all duration-500 ${loading ? 'scale-95 opacity-90' : 'scale-100'}`}>
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-32 py-4 md:py-5 bg-white border border-slate-200 rounded-2xl text-lg shadow-lg shadow-slate-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-400"
                placeholder="example.com or https://..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={handleAnalyze}
                disabled={loading || !url}
                className="absolute right-2 top-2 bottom-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl px-6 flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Analyze</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Feature Pills (Only show on Home) */}
            {!result && !loading && (
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
            )}
            
            {error && (
               <div className="mt-8 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 max-w-lg mx-auto">
                 {error}
               </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="px-4 pb-20">
            <ReportCard data={result} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;