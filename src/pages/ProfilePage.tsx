import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Mail,
  Phone,
  Calendar,
  Save,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';

export const ProfilePage: React.FC = () => {
  const { profile, user, refreshProfile, logout } = useAuth();

  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(profile?.phoneNumber || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !user) return;
    setSaving(true);
    setMessage(null);
    try {
      await authService.updateUserProfile(user.uid, {
        fullName,
        phoneNumber,
      });
      await refreshProfile();
      setMessage('Profile updated successfully.');
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setMessage('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900">Farmer Account &amp; Identity</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your agricultural profile and verified credentials
        </p>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-emerald-800 text-white flex items-center justify-center text-3xl font-extrabold shadow-md shadow-emerald-900/15 shrink-0">
          {profile?.fullName?.charAt(0) || 'F'}
        </div>

        <div className="text-center sm:text-left flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h3 className="text-xl font-bold text-slate-900 truncate">
              {profile?.fullName || 'Registered Farmer'}
            </h3>
            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 w-fit mx-auto sm:mx-0">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ROLE: {profile?.role || 'FARMER'}</span>
            </span>
          </div>

          <p className="text-xs text-slate-500 mt-1 flex items-center justify-center sm:justify-start gap-1">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span>{profile?.email}</span>
          </p>

          <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-center sm:justify-start gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              Member since: {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Active'}
            </span>
          </p>
        </div>

        <button
          onClick={() => logout()}
          className="px-4 py-2 text-xs font-semibold rounded-xl text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
        >
          Sign Out
        </button>
      </div>

      {/* Edit Details Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <h4 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
          Update Profile Information
        </h4>

        <form onSubmit={handleUpdate} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={profile?.email || ''}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-100 text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
