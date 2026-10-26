import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sprout,
  Droplets,
  FlaskConical,
  RefreshCw,
  TrendingUp,
  FileText,
  CloudSun,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Leaf,
  Layers,
  BarChart3,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  const handleGetStarted = () => {
    if (profile) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const features = [
    {
      title: 'Intelligent Crop Recommendations',
      description:
        'Multi-factor decision support comparing soil chemistry, water requirements, seasonal calendars, and rotation synergy to recommend optimal cultivars.',
      icon: Sprout,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      action: '/recommendations',
    },
    {
      title: 'Soil Health Monitoring',
      description:
        'Log laboratory soil assays with pH, macronutrient levels (N, P, K), organic carbon, and moisture metrics. Track historical fertility improvements.',
      icon: FlaskConical,
      color: 'bg-teal-50 text-teal-800 border-teal-200',
      action: '/soil-tests',
    },
    {
      title: 'Smart Water Management',
      description:
        'Calculate volumetric irrigation demands using USDA-SCS effective rainfall models, micro-drip efficiency ratings, and aquifer conservation practices.',
      icon: Droplets,
      color: 'bg-sky-50 text-sky-800 border-sky-200',
      action: '/water-budget',
    },
    {
      title: 'Crop Rotation Planning',
      description:
        'Break soil-borne pathogen cycles, alternate botanical families, and maximize biological nitrogen fixation credits across consecutive planting seasons.',
      icon: RefreshCw,
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      action: '/crop-rotation',
    },
    {
      title: 'Farm Profitability Analysis',
      description:
        'Model input costs (seed, fertilizer, irrigation, labor), project farmgate revenues, and calculate break-even thresholds and return on investment.',
      icon: TrendingUp,
      color: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      action: '/profitability',
    },
    {
      title: 'Weather Advisory & Telemetry',
      description:
        'Hyper-local precipitation probabilities, thermal stress indexes, spray window timing, and micro-climate advisories tailored to your parcels.',
      icon: CloudSun,
      color: 'bg-cyan-50 text-cyan-800 border-cyan-200',
      action: '/weather-advisory',
    },
    {
      title: 'Farming Plans & Milestones',
      description:
        'Organize seasonal cultivation blueprints, track sowing and harvest timelines, and link water budgets directly to your acreage.',
      icon: Calendar,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      action: '/farming-plans',
    },
    {
      title: 'Verified Crop Catalog',
      description:
        'Standardized agronomic benchmarks verified against ICAR & FAO compendiums with physiological thresholds and nutrient envelopes.',
      icon: Leaf,
      color: 'bg-green-50 text-green-800 border-green-200',
      action: '/crops',
    },
    {
      title: 'Reports & Audit Records',
      description:
        'Export RFC-4180 compliant CSV spreadsheets and print-ready dossiers for agricultural lending, compliance, and multi-season records.',
      icon: FileText,
      color: 'bg-slate-50 text-slate-800 border-slate-200',
      action: '/reports',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-800 flex items-center justify-center text-white shadow-md shadow-emerald-900/10">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">AgroSmart 360</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const el = document.getElementById('features');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg transition-colors hidden sm:block"
            >
              Explore Features
            </button>

            {profile ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-800 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={handleGetStarted}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-emerald-50/50 via-white to-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-900 text-xs font-semibold mb-6">
            <Leaf className="w-3.5 h-3.5 text-emerald-700" />
            <span>Grow Smarter. Save Water. Sustain Every Season.</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Grow Smarter.{' '}
            <span className="text-emerald-800 underline decoration-emerald-400 decoration-wavy decoration-2">
              Sustain Every Season.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Manage your farms, understand soil conditions, compare suitable crops, and plan
            water-efficient cultivation from one integrated platform.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleGetStarted}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-900/15 flex items-center justify-center gap-2 transition-all hover:gap-3"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('features');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-5 py-3 text-emerald-800 hover:bg-emerald-50 rounded-xl text-sm font-semibold transition-colors"
            >
              Explore Features
            </button>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section id="features" className="py-16 sm:py-24 bg-slate-50/60 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-800 mb-2">
              Integrated Capabilities
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              End-to-End Sustainable Farm Management
            </h3>
            <p className="mt-3 text-sm text-slate-600">
              Built for agriculturalists seeking higher yields while safeguarding natural soil
              and water capital.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div
                      className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${feature.color}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900 mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <button
                      onClick={handleGetStarted}
                      className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 transition-colors"
                    >
                      <span>Access Module</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-slate-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-700" />
            <span className="font-bold text-slate-800">AgroSmart 360</span>
            <span>— Sustainable Agricultural Intelligence</span>
          </div>
          <div>
            <span>Grow Smarter. Save Water. Sustain the Future.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
