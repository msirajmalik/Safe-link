import React from 'react';
import { ShieldCheck, Menu, User } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
            <div className="bg-blue-600 p-2 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
              SafeSurfer
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Products</a>
            <a href="#" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Safety API</a>
            <a href="#" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Community</a>
            <a href="#" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">About</a>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden md:block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-full transition-colors">
              Log in
            </button>
            <button className="hidden md:block px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-full transition-colors shadow-sm">
              Get Extension
            </button>
            <button className="md:hidden p-2 text-slate-600">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;