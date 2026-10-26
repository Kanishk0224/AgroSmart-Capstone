import React from 'react';
import { Menu, Sprout, FlaskConical, Tractor } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface TopNavbarProps {
  onOpenMobileSidebar: () => void;
  onOpenNewFarmModal?: () => void;
  onOpenNewSoilModal?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onOpenMobileSidebar,
  onOpenNewFarmModal,
  onOpenNewSoilModal,
}) => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                AgroSmart 360
              </span>
              <span className="text-slate-400">|</span>
              <span className="text-xs font-medium text-slate-500 italic">
                Grow Smarter. Save Water. Sustain the Future.
              </span>
            </div>
            <div className="sm:hidden font-bold text-slate-800 text-sm">
              AgroSmart 360
            </div>
          </div>
        </div>

        {/* Right: Quick Actions, Profile */}
        <div className="flex items-center gap-3">
          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/recommendations')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Sprout className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Recommend Crop</span>
            </button>

            <button
              onClick={() => {
                if (onOpenNewFarmModal) onOpenNewFarmModal();
                else navigate('/farms?action=new');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-semibold transition-colors"
            >
              <Tractor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Farm</span>
            </button>

            <button
              onClick={() => {
                if (onOpenNewSoilModal) onOpenNewSoilModal();
                else navigate('/soil-tests?action=new');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-semibold transition-colors"
            >
              <FlaskConical className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Soil Test</span>
            </button>
          </div>

          {/* User Avatar button */}
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 p-1 pl-2 pr-1 rounded-full bg-slate-100 hover:bg-slate-200/80 transition-colors border border-slate-200"
          >
            <span className="text-xs font-medium text-slate-700 hidden sm:inline">
              {profile?.fullName?.split(' ')[0] || 'Farmer'}
            </span>
            <div className="w-7 h-7 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
              {profile?.fullName?.charAt(0) || 'F'}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
