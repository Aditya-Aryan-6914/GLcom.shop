
import React, { useState } from 'react';
import type { UserPreferences } from '../types';
import SparklesIcon from './icons/SparklesIcon';

interface PreferencesPanelProps {
  preferences: UserPreferences;
  onPreferencesChange: (newPreferences: UserPreferences) => void;
}

const PreferencesPanel: React.FC<PreferencesPanelProps> = ({ preferences, onPreferencesChange }) => {
  const [localPrefs, setLocalPrefs] = useState<UserPreferences>(preferences);
  const [brandsInput, setBrandsInput] = useState(preferences.preferredBrands.join(', '));

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrefs = { ...localPrefs, budget: e.target.value };
    setLocalPrefs(newPrefs);
    onPreferencesChange(newPrefs);
  };

  const handleBrandsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrandsInput(e.target.value);
    const newPrefs = { ...localPrefs, preferredBrands: e.target.value.split(',').map(b => b.trim()).filter(Boolean) };
    setLocalPrefs(newPrefs);
    onPreferencesChange(newPrefs);
  };

  const handleSustainabilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrefs = { ...localPrefs, sustainabilityFocus: e.target.checked };
    setLocalPrefs(newPrefs);
    onPreferencesChange(newPrefs);
  };

  return (
    <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-2xl p-6 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-2">
        <SparklesIcon className="w-6 h-6 text-cyan-400" />
        User Preferences
      </h2>
      <div className="space-y-6 flex-grow">
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-slate-400 mb-2">Budget</label>
          <input
            type="text"
            id="budget"
            value={localPrefs.budget}
            onChange={handleBudgetChange}
            placeholder="e.g., under $500"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
          />
        </div>
        <div>
          <label htmlFor="brands" className="block text-sm font-medium text-slate-400 mb-2">Preferred Brands</label>
          <input
            type="text"
            id="brands"
            value={brandsInput}
            onChange={handleBrandsChange}
            placeholder="e.g., Sony, Apple, Samsung"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-400">Sustainability Focus</span>
          <label htmlFor="sustainability" className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="sustainability"
              checked={localPrefs.sustainabilityFocus}
              onChange={handleSustainabilityChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-cyan-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
          </label>
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-6 text-center">Your preferences help the AI find the perfect products for you.</p>
    </div>
  );
};

export default PreferencesPanel;
