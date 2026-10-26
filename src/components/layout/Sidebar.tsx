import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Tractor,
  Sprout,
  Droplets,
  FlaskConical,
  RefreshCw,
  TrendingUp,
  CloudSun,
  FileText,
  BookmarkPlus,
  User,
  Settings,
  Leaf,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpenMobile,
  onCloseMobile,
}) => {
  const { profile, logout } = useAuth();
  const location = useLocation();

  const navItems: NavItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Farms', path: '/farms', icon: Tractor },
    { name: 'Crop Intelligence', path: '/recommendations', icon: Sprout },
    { name: 'Water Management', path: '/water-budget', icon: Droplets },
    { name: 'Soil Health', path: '/soil-tests', icon: FlaskConical },
    { name: 'Crop Rotation', path: '/crop-rotation', icon: RefreshCw },
    { name: 'Cultivation ROI', path: '/profitability', icon: TrendingUp },
    { name: 'Crop Catalog', path: '/crops', icon: Leaf },
    { name: 'Farming Plans', path: '/farming-plans', icon: BookmarkPlus },
    { name: 'Weather Advisory', path: '/weather-advisory', icon: CloudSun },
    { name: 'Reports & Audits', path: '/reports', icon: FileText },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-emerald-950 text-white select-none">
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3 border-b border-emerald-900/80">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-900/40 text-emerald-950 font-black">
          <Leaf className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="font-bold text-lg tracking-tight text-white">AgroSmart 360</h1>
          </div>
          <p className="text-[11px] text-emerald-300 font-medium">Sustainable Agriculture</p>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin scrollbar-thumb-emerald-800">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider uppercase text-emerald-400/80">
          Farm Operations
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path ||
            (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive: active }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active || isActive
                    ? 'bg-emerald-800 text-white shadow-xs font-semibold'
                    : 'text-emerald-100 hover:bg-emerald-900/60 hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>{item.name}</span>
              </div>
              {item.name === 'Dashboard' && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* User Footer */}
      <div className="p-3.5 border-t border-emerald-900/80 bg-emerald-950/90">
        <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-900/40 hover:bg-emerald-900/70 transition-colors">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
              {profile?.fullName?.charAt(0) || 'F'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate text-white">
                {profile?.fullName || 'Farmer Account'}
              </p>
              <p className="text-[10px] text-emerald-300 truncate">
                {profile?.email || 'farmer@agrosmart360.org'}
              </p>
            </div>
          </div>

          <button
            onClick={() => logout()}
            title="Sign Out"
            className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-emerald-900/80 sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-emerald-950 z-50">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
